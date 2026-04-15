# Backend High Concurrency Build Plan

## Summary

This document refines the build backend plan into a **single-host mode** that can run on an **Amazon EC2 Mac M4 instance** and safely handle **50 concurrent in-flight build tasks**.

The key change is to stop treating concurrency as only a Celery worker count. The system must become **resource-aware**:

- FastAPI accepts build requests and persists them immediately
- a lightweight scheduler decides when a task is allowed to enter the execution queue
- only tasks that pass CPU, memory, disk, and platform-slot checks are dispatched
- tasks above the host limit wait until earlier builds finish

This is the correct shape for one-host scaling. It is also the shortest path to later multi-host scheduling.

## Hard Constraint

`mac-m4.metal` is not large enough for **50 fully active native builds at the same time**. A base M4 host has limited CPU and memory, and iOS / Android / Electron builds are all heavy local processes.

Therefore this plan uses the following definition:

- **50 concurrent tasks in the system**: accepted, tracked, and progressing through the build pipeline on one host
- **resource-gated active builds**: only a smaller number actually compile at once

If the business requirement is strictly **50 fully active builds in parallel**, this plan is not enough. That would require either:

- a larger Mac host class such as a future M4 Pro / M4 Max variant, if available and validated
- or multiple macOS build hosts

## Current Backend Gaps

The current implementation is still optimized for low concurrency:

- one `build_app` Celery task handles multiple platforms inside one long-running task
- Celery uses a global concurrency model and is not resource-aware
- SQLite and local `BUILDS_DIR` still shape the runtime around one coarse execution path
- Flutter workspaces are copied from scratch for each build
- Electron runs `npm install` during task preparation
- there is no host CPU / memory feedback loop before dispatching work
- tasks go directly into execution instead of waiting for admission

## Single-Host Target

### Target outcomes

On one EC2 Mac M4 host, the backend should support:

- up to **50 in-flight `BuildTask` records** on one machine
- deterministic waiting when the host is saturated
- no overload spiral caused by CPU or memory exhaustion
- predictable queue latency under mixed Android / iOS / macOS workloads
- safe recovery after worker restart

### Non-goals

This stage does not solve:

- real horizontal scaling across multiple Mac hosts
- durable shared artifact storage across hosts
- perfect Windows build isolation

## Operating Model

The backend should move from **direct submission -> direct execution** to a four-stage flow:

1. **Submit**
   FastAPI validates the request and creates `BuildRequest` plus one or more `BuildTask` rows.
2. **Admit**
   A scheduler decides whether a task may enter the execution queue.
3. **Execute**
   A platform worker runs the build on local disk with warmed caches.
4. **Finalize**
   Artifacts, logs, metrics, and final status are stored.

The critical change is that **admission happens before queue dispatch**, not after.

## Data Model

The current `BuildJob` model is too coarse for resource-aware scheduling. Replace it with two levels.

### `BuildRequest`

One user submission.

Fields:

- `id`
- `user_id`
- `h5_url`
- `requested_platforms`
- `priority`
- `status`
- `created_at`
- `finished_at`

### `BuildTask`

One platform-specific execution unit.

Fields:

- `id`
- `request_id`
- `platform`
- `status`
- `priority`
- `queue_name`
- `attempt`
- `resource_profile`
- `admission_token`
- `wait_started_at`
- `queued_at`
- `started_at`
- `finished_at`
- `artifact_path`
- `log_path`
- `failure_code`
- `failure_message`

### `HostResourceSample`

One periodic snapshot of the single host.

Fields:

- `id`
- `host_name`
- `sampled_at`
- `cpu_percent`
- `load_1m`
- `memory_used_bytes`
- `memory_available_bytes`
- `swap_used_bytes`
- `disk_free_bytes`
- `active_task_count`
- `waiting_task_count`

## State Machine

Each `BuildTask` should move through these states:

- `submitted`
- `waiting_capacity`
- `queued`
- `running`
- `uploading`
- `done`
- `failed`
- `cancelled`

State meaning:

- `submitted`: request accepted but not yet counted against runnable queue capacity
- `waiting_capacity`: waiting for CPU / memory / disk / platform slots
- `queued`: admitted and dispatched to Celery
- `running`: worker started build subprocess
- `uploading`: artifact and log finalization
- terminal states: `done`, `failed`, `cancelled`

This state split is required for the rule:

- **too many tasks must wait for earlier ones to finish before joining the execution queue**

## Admission Control

### Why admission must exist

Celery queue depth alone is not enough on a single Mac host. Without admission control:

- iOS builds can starve Android builds
- memory spikes can force swap and stall the whole machine
- one sudden burst of requests can create a long tail of slow failures

The scheduler must dispatch only when the host still has safe headroom.

### Queue caps

Use two limits:

- `MAX_INFLIGHT_TASKS = 50`
- `MAX_ACTIVE_TASKS = dynamic`

Definitions:

- `MAX_INFLIGHT_TASKS`: maximum tasks tracked by the host at one time
- `MAX_ACTIVE_TASKS`: tasks actually allowed to compile right now

Recommended single-host behavior:

- if `running + queued + waiting_capacity < 50`, new tasks enter `waiting_capacity`
- if the host already has `50` in-flight tasks, new tasks stay in `submitted`
- the scheduler promotes `submitted -> waiting_capacity` only after earlier tasks finish

This makes the queue boundary explicit and avoids pushing too much work into Redis or Celery before the host is ready.

### Resource thresholds

Start with conservative dispatch thresholds on one EC2 Mac M4 host:

- `CPU_DISPATCH_HIGH_WATERMARK = 75%`
- `CPU_RESUME_WATERMARK = 60%`
- `MEMORY_DISPATCH_HIGH_WATERMARK = 80%`
- `MEMORY_RESUME_WATERMARK = 70%`
- `SWAP_HIGH_WATERMARK = 2 GiB`
- `MIN_DISK_FREE = 80 GiB`

Scheduler behavior:

- do not dispatch new tasks when CPU or memory are above the dispatch high watermark
- pause dispatch immediately if swap exceeds threshold
- resume dispatch only after metrics stay below the resume watermark for 3 consecutive samples

### Platform resource profiles

Each `BuildTask` must declare a resource profile before admission.

Initial reservation table:

| Platform | CPU slots | Memory reserve | Disk reserve | Notes |
| --- | --- | --- | --- | --- |
| `android` | 1.0 | 2 GiB | 6 GiB | Flutter APK build |
| `ios` | 2.0 | 4 GiB | 8 GiB | Xcode + Flutter iOS build |
| `macos` | 1.5 | 3 GiB | 6 GiB | Electron DMG build |
| `windows` | 1.5 | 3 GiB | 6 GiB | Electron cross-build, best effort |

These numbers are intentionally conservative. They should be adjusted only after benchmark data is collected on the exact host image.

### Platform slot caps

Use explicit per-platform caps in addition to resource profiles:

- `MAX_ANDROID_ACTIVE = 4`
- `MAX_IOS_ACTIVE = 3`
- `MAX_MACOS_ACTIVE = 3`
- `MAX_WINDOWS_ACTIVE = 2`

Use a mixed workload ceiling:

- `MAX_ACTIVE_CPU_SLOTS = 7.0`
- `MAX_ACTIVE_MEMORY_RESERVED = 16 GiB`

This gives the OS, Redis, PostgreSQL, FastAPI, and caches enough headroom on a 24 GiB machine.

### Admission algorithm

Every 2 seconds, the scheduler should:

1. sample host CPU, memory, swap, and disk
2. refresh active task reservations from the database
3. calculate remaining CPU slots and memory budget
4. sort waiting tasks by priority, then FIFO
5. admit the first task whose:
   - platform cap is not exceeded
   - reserved CPU fits
   - reserved memory fits
   - disk headroom fits
   - host watermark is still healthy
6. stop dispatching when the next task no longer fits

This is a **best-fit with priority + FIFO tie-break** policy. It is simple, explainable, and sufficient for a single host.

## Queue Layout

Keep Celery, but make it a thin execution layer.

Recommended queues:

- `build.admission`
- `build.android`
- `build.ios`
- `build.macos`
- `build.windows`
- `build.finalize`
- `build.cleanup`

Responsibilities:

- `build.admission`: lightweight scheduler decisions only
- `build.<platform>`: actual compile execution
- `build.finalize`: artifact registration, state updates, cleanup enqueue
- `build.cleanup`: deferred workspace cleanup and log compaction

Do not enqueue a task directly into `build.<platform>` from the API handler.

## Process Layout On One Host

Run these processes on the same EC2 Mac M4 instance:

- FastAPI
- Redis
- PostgreSQL
- one scheduler process
- one host monitor process
- platform workers

Suggested initial worker layout:

- Android worker: `--concurrency=4`
- iOS worker: `--concurrency=3`
- macOS worker: `--concurrency=2`
- Windows worker: `--concurrency=1`
- scheduler worker: `--concurrency=1`

Important:

- worker concurrency is only the **upper bound**
- actual dispatch must still be controlled by the scheduler
- the scheduler is the source of truth for safe active concurrency

## Build Preparation Optimizations

Single-host scale depends more on cutting per-build overhead than on raising Celery concurrency.

### Flutter

Replace per-build cold setup with warmed templates:

- keep a prewarmed Flutter wrapper template on local disk
- run `flutter pub get` during image/bootstrap time, not per build
- preserve shared Flutter and CocoaPods caches
- create per-build workspaces with `rsync` or hardlink-friendly copy instead of full cold copy

### Electron

The current `npm install` inside `_prepare_electron` must be removed from the hot path.

Required change:

- preinstall `node_modules` once during deployment
- keep Electron dependencies in a reusable template directory
- copy only app-specific metadata and icons during each build

### Workspace strategy

Use three local filesystem areas:

- `templates/`: immutable warmed source templates
- `workspaces/`: active build work directories
- `artifacts/`: final build outputs and structured logs

Use local NVMe / attached disk for `workspaces/` and `artifacts/`.

## Monitoring And Guardrails

### Host metrics

Collect every 2 seconds:

- CPU percent
- 1-minute load average
- memory used
- memory available
- swap used
- disk free
- running builds by platform
- waiting builds by platform

Implementation options:

- `psutil` for CPU, memory, and process counts
- `shutil.disk_usage` for disk
- periodic persistence into `HostResourceSample`
- optional Prometheus `/metrics` endpoint

### Build metrics

Track at minimum:

- queue wait time
- build duration by platform
- success rate by platform
- failure rate by platform
- admission pauses caused by CPU
- admission pauses caused by memory
- tasks left in `submitted`
- tasks left in `waiting_capacity`

### Alert thresholds

Trigger warnings when:

- CPU stays above `85%` for 60 seconds
- memory stays above `85%` for 60 seconds
- swap stays above `2 GiB` for 30 seconds
- disk free drops below `100 GiB`
- average queue wait exceeds `15 minutes`

Trigger hard admission stop when:

- CPU exceeds `90%`
- memory exceeds `90%`
- swap exceeds `4 GiB`
- disk free drops below `50 GiB`

While in hard-stop mode:

- do not dispatch new tasks
- keep active tasks running
- resume only after 3 healthy samples

## API And UX Behavior

The API should expose the waiting state clearly.

### Submission response

Return:

- `request_id`
- `task_ids`
- `status`
- `queue_state`
- `estimated_wait_seconds`

Possible `queue_state` values:

- `submitted`
- `waiting_capacity`
- `queued`
- `running`

### User-facing rule

When the host is full:

- the request is accepted
- the task is visible immediately in history
- the task remains in `submitted` or `waiting_capacity`
- it joins the execution queue only after earlier builds complete

This matches the requirement that overload must wait instead of blindly entering the queue.

## Recovery

The scheduler must recover from process restarts.

Required rules:

- tasks in `queued` without a live Celery delivery after timeout are returned to `waiting_capacity`
- tasks in `running` are reconciled against worker heartbeats
- stale workspaces older than a threshold are cleaned asynchronously
- admission tokens are lease-based and expire automatically

## Backend Implementation Mapping

Recommended backend changes by module:

- `backend/app/api/build.py`
  - stop calling platform execution directly from submit
  - create `BuildRequest` and `BuildTask`
  - return queue state and estimated wait

- `backend/app/tasks/build_task.py`
  - shrink this into one-platform execution only
  - remove multi-platform loop from one Celery task
  - move preparation and finalization into smaller functions

- `backend/app/services/resource_guard.py`
  - compute host headroom
  - evaluate watermark rules
  - own platform resource profiles

- `backend/app/services/host_monitor.py`
  - collect CPU / memory / swap / disk metrics
  - persist `HostResourceSample`

- `backend/app/services/build_scheduler.py`
  - manage `submitted -> waiting_capacity -> queued`
  - apply priority + FIFO admission

- `backend/app/models/`
  - add `build_request.py`
  - add `build_task.py`
  - add `host_resource_sample.py`

## Delivery Order

### Phase 1: make the hot path schedulable

1. split one submission into platform-specific `BuildTask` records
2. keep PostgreSQL as the required source of truth
3. add `submitted`, `waiting_capacity`, and `queued` states
4. change Celery tasks to one-platform execution only

### Phase 2: add single-host admission control

1. add `host_monitor`
2. add `resource_guard`
3. add scheduler loop and platform slot caps
4. stop direct API-to-execution dispatch

### Phase 3: remove avoidable build overhead

1. remove hot-path `npm install`
2. prewarm Flutter and Electron templates
3. reuse caches and workspace templates
4. add structured logs and queue wait metrics

### Phase 4: harden operations

1. add Prometheus or CloudWatch export
2. add stale task reconciliation
3. add alerting and hard-stop admission rules
4. benchmark on the exact EC2 Mac M4 image and tune resource profiles

## Acceptance Criteria

This plan is complete only when all of the following are true on one EC2 Mac M4 host:

- the backend can keep **50 in-flight tasks** visible and progressing
- the host never dispatches beyond configured CPU / memory / disk headroom
- tasks above host capacity wait before joining the execution queue
- queue wait time and build duration are observable
- the system recovers cleanly after worker restart
- Electron and Flutter dependency installation are removed from the per-build hot path

## Final Recommendation

For one EC2 Mac M4 host, the correct target is:

- **50 concurrent in-flight build tasks**
- **resource-gated active builds**
- **strict CPU / memory admission control**
- **explicit waiting before queue entry when the host is saturated**

This is the highest-confidence single-host plan. It is realistic, implementable against the current backend, and avoids promising a level of physical parallelism that the host cannot actually sustain.
