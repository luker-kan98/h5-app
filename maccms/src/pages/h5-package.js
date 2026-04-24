import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Base from "@/layouts/BaseLayout";
import Footer from "@/layouts/partials/Footer";
import {
  downloadBuildArtifact,
  fetchBuildHistory,
  fetchBuildStatus,
  getApiErrorMessage,
  submitBuild,
} from "@/lib/h5-package-client.mjs";

const BUILD_POLL_INTERVAL_MS = 3000;
const ANDROID_PACKAGE_RE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
const TERMINAL_PLATFORM_STATUSES = new Set(["done", "failed", "cancelled"]);

const PLATFORMS = [
  {
    key: "android",
    label: "安卓",
    statusLabel: "Android",
    icon: "/images/h5-package/android-icon.png",
  },
  {
    key: "ios",
    label: "iOS (未签名)",
    statusLabel: "iOS (未签名)",
    icon: "/images/h5-package/ios-icon.png",
  },
  {
    key: "macos",
    label: "macOS",
    statusLabel: "macOS",
    icon: "/images/h5-package/macos-icon.png",
  },
  {
    key: "windows",
    label: "Windows",
    statusLabel: "Windows",
    icon: "/images/h5-package/windows-icon.png",
  },
];

const FEATURES = [
  {
    image: "/images/h5-package/android-card.png",
    title: "安卓端 打包",
    desc: "快速生成安卓原生APP，完美适配全机型，无需安卓原生编程，网站 / H5 网页直接打包，助力快速布局安卓移动端！",
  },
  {
    image: "/images/h5-package/ios-card.png",
    title: "iOS端 打包",
    desc: "一键生成苹果 iOS 应用，无需苹果原生编程，同时支持安卓 & iOS 双端打包，快速迭代兼容，协助上架 App Store！",
  },
  {
    image: "/images/h5-package/macos-card.png",
    title: "macOS端 打包",
    desc: "网站 / H5 直接打包苹果电脑桌面应用，无需懂 macOS 开发，自主操作自助配置，草根站长也能快速做桌面应用！",
  },
  {
    image: "/images/h5-package/windows-card.png",
    title: "Windows端 打包",
    desc: "网页 / H5 一键打包 Windows 桌面应用，无需原生编程，快速生成适配 Windows 系统的桌面 APP，玩转多端布局！",
  },
];

const QUEUE_STATUS_LABELS = {
  submitted: "已提交",
  waiting_capacity: "等待资源",
  queued: "排队中",
  running: "打包中",
  done: "已完成",
  failed: "已结束",
};

const REVEAL_COLLAPSED = "max-h-0 opacity-0 pointer-events-none";
const REVEAL_EXPANDED = "max-h-[400px] opacity-100";
const TRANSITION = "transition-all duration-500 ease-out overflow-hidden";

const platformByKey = (key) => PLATFORMS.find((platform) => platform.key === key);

const isTerminalBuild = (job) => {
  const statuses = Object.values(job?.platforms ?? {}).map(
    (platform) => platform?.status,
  );
  return statuses.length > 0 && statuses.every((status) => TERMINAL_PLATFORM_STATUSES.has(status));
};

const formatQueueStatus = (status) => QUEUE_STATUS_LABELS[status] ?? status ?? "未知状态";

const formatPlatformList = (platforms = []) =>
  platforms
    .map((platform) => platformByKey(platform)?.label ?? platform)
    .join(" / ");

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const formatWaitTime = (seconds) => {
  if (!seconds || seconds <= 0) {
    return "";
  }

  if (seconds < 60) {
    return `${seconds} 秒`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (remainder === 0) {
    return `${minutes} 分钟`;
  }
  return `${minutes} 分 ${remainder} 秒`;
};

export default function H5Package() {
  const [view, setView] = useState("idle");

  const [url, setUrl] = useState("");
  const [appName, setAppName] = useState("");
  const [selected, setSelected] = useState(["android"]);
  const [pkg, setPkg] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [currentTaskId, setCurrentTaskId] = useState("");
  const [currentJob, setCurrentJob] = useState(null);
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [downloadKey, setDownloadKey] = useState("");

  const expanded = view !== "idle";
  const isAndroidSelected = selected.includes("android");
  const canSubmit =
    !submitLoading &&
    Boolean(url.trim()) &&
    Boolean(appName.trim()) &&
    selected.length > 0 &&
    Boolean(iconFile) &&
    (!isAndroidSelected || Boolean(pkg.trim()));

  useEffect(() => {
    if (view !== "task" || !currentTaskId) {
      return undefined;
    }

    let active = true;
    let timerId;

    const pollStatus = async (silent = false) => {
      if (!silent) {
        setTaskLoading(true);
      }

      try {
        const data = await fetchBuildStatus({ taskId: currentTaskId });
        if (!active) {
          return;
        }

        setCurrentJob(data);
        setTaskError("");

        if (!isTerminalBuild(data)) {
          timerId = window.setTimeout(
            () => pollStatus(true),
            BUILD_POLL_INTERVAL_MS,
          );
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setTaskError(getApiErrorMessage(error, "获取打包状态失败"));
      } finally {
        if (active && !silent) {
          setTaskLoading(false);
        }
      }
    };

    pollStatus();

    return () => {
      active = false;
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, [view, currentTaskId]);

  const onFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setIconFile(file);
    setFormError("");
  };

  const togglePlatform = (key) => {
    setSelected((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key],
    );
  };

  async function handleOpenHistory() {
    setView("history");
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const data = await fetchBuildHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      setHistoryError(getApiErrorMessage(error, "获取历史记录失败"));
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleSubmit() {
    if (view === "idle") {
      setView("idle-expanded");
      return;
    }

    setFormError("");

    const trimmedUrl = url.trim();
    const trimmedName = appName.trim();
    const trimmedPkg = pkg.trim();

    if (!trimmedUrl) {
      setFormError("H5 网址不能为空");
      return;
    }
    if (!trimmedName) {
      setFormError("App 名称不能为空");
      return;
    }
    if (!selected.length) {
      setFormError("请至少选择一个目标平台");
      return;
    }
    if (!iconFile) {
      setFormError("请上传 App 图标");
      return;
    }
    if (isAndroidSelected && !trimmedPkg) {
      setFormError("请选择安卓平台时请填写 Android 包名");
      return;
    }
    if (trimmedPkg && !ANDROID_PACKAGE_RE.test(trimmedPkg)) {
      setFormError("Android 包名格式应类似 com.example.app");
      return;
    }

    const iconError = await validateIcon(iconFile);
    if (iconError) {
      setFormError(iconError);
      return;
    }

    setSubmitLoading(true);

    try {
      const data = await submitBuild({
        payload: {
          h5_url: trimmedUrl,
          app_name: trimmedName,
          icon_file: iconFile,
          platforms: selected,
          android_package_name: isAndroidSelected ? trimmedPkg : undefined,
        },
      });

      setCurrentTaskId(data.request_id || data.task_id);
      setCurrentJob(null);
      setTaskError("");
      setView("task");
    } catch (error) {
      setFormError(getApiErrorMessage(error, "提交打包任务失败"));
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleOpenTask(taskId) {
    setCurrentTaskId(taskId);
    setCurrentJob(null);
    setTaskError("");
    setView("task");
  }

  async function handleDownload(downloadUrl, platformKey) {
    setDownloadKey(platformKey);
    setTaskError("");

    try {
      await downloadBuildArtifact({
        downloadUrl,
      });
    } catch (error) {
      setTaskError(getApiErrorMessage(error, "下载构建产物失败"));
    } finally {
      setDownloadKey("");
    }
  }

  const backAction = () => {
    if (view === "task" || view === "history") {
      setView("idle-expanded");
      return;
    }

    if (view === "idle-expanded") {
      setView("idle");
    }
  };

  return (
    <Base
      title="H5封包app - MacCMS"
      description="一门提供模块化混合开发APP底层框架，用做网站的技术做APP，200+原生功能、2000+映射JS接口，打包APP从一门开始！"
      keywords="H5封包, app打包, 安卓打包, iOS打包, macOS打包, Windows打包"
    >
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[400px] md:h-[560px]"
          style={{
            background:
              "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(218,245,238,1) 100%)",
          }}
        />

        <div className="container">
          <button
            type="button"
            onClick={backAction}
            className={clsx(
              TRANSITION,
              "inline-flex items-center gap-1 text-[14px] md:text-[16px] text-dark",
              expanded
                ? "max-h-12 opacity-100 pt-4 md:pt-6"
                : "max-h-0 opacity-0",
            )}
            aria-hidden={!expanded}
            tabIndex={expanded ? 0 : -1}
          >
            <span className="text-[18px] md:text-[20px] leading-none">←</span>
            返回
          </button>
        </div>

        <div
          className={clsx(
            TRANSITION,
            "container text-center",
            expanded
              ? "max-h-0 opacity-0 pt-0 pb-0"
              : "max-h-[300px] opacity-100 pt-[40px] md:pt-[80px] pb-[30px] md:pb-[60px]",
          )}
        >
          <h1 className="text-[24px] md:text-[40px] leading-tight font-medium text-dark">
            H5封包app
          </h1>
          <p className="mt-3 md:mt-4 text-[14px] md:text-[16px] leading-[22px] text-text max-w-[340px] md:max-w-[640px] mx-auto">
            一门提供模块化混合开发APP底层框架，用做网站的技术做APP，200+原生功能、
            <br className="hidden md:block" />
            2000+映射JS接口，打包APP从一门开始！
          </p>
        </div>

        <div
          className={clsx(
            "container transition-[padding] duration-500 ease-out",
            expanded && "pt-6 md:pt-10",
          )}
        >
          <div
            className="mx-auto bg-white rounded-[20px] md:rounded-[29px] border border-[rgba(220,220,220,1)] px-4 md:px-10 py-5 md:py-[30px] max-w-[800px]"
            style={{ boxShadow: "0px 8px 20px 0px rgba(114, 152, 136, 0.08)" }}
          >
            {view === "task" ? (
              <TaskView
                job={currentJob}
                taskLoading={taskLoading}
                taskError={taskError}
                downloadKey={downloadKey}
                onHistory={handleOpenHistory}
                onDownload={handleDownload}
              />
            ) : view === "history" ? (
              <HistoryView
                history={history}
                historyLoading={historyLoading}
                historyError={historyError}
                onNew={() => setView("idle-expanded")}
                onOpenTask={handleOpenTask}
              />
            ) : (
              <FormView
                expanded={view === "idle-expanded"}
                url={url}
                setUrl={setUrl}
                appName={appName}
                setAppName={setAppName}
                selected={selected}
                togglePlatform={togglePlatform}
                pkg={pkg}
                setPkg={setPkg}
                iconFile={iconFile}
                onFileChange={onFileChange}
                onSubmit={handleSubmit}
                onHistory={handleOpenHistory}
                isAndroidSelected={isAndroidSelected}
                formError={formError}
                submitLoading={submitLoading}
                canSubmit={canSubmit}
              />
            )}
          </div>
        </div>
      </section>

      <section className="pt-8 md:pt-[60px] pb-10 md:pb-[100px]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title}>
                <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden aspect-[584/286] bg-[#F5F8F9]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 md:mt-7 text-[18px] md:text-[20px] leading-7 font-medium text-dark">
                  {feature.title}
                </h3>
                <p className="mt-2 md:mt-[14px] text-[14px] leading-5 md:leading-5 text-text">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </Base>
  );
}

function FormView({
  expanded,
  url,
  setUrl,
  appName,
  setAppName,
  selected,
  togglePlatform,
  pkg,
  setPkg,
  iconFile,
  onFileChange,
  onSubmit,
  onHistory,
  isAndroidSelected,
  formError,
  submitLoading,
  canSubmit,
}) {
  return (
    <>
      <div
        className={clsx(
          TRANSITION,
          expanded ? "max-h-[60px] opacity-100 mb-6" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[20px] md:text-[24px] leading-[33px] font-medium text-dark">
            H5封包app
          </h2>
          <button
            type="button"
            onClick={onHistory}
            className="h-[28px] px-3 rounded-[14px] text-[14px] text-primary"
            style={{ backgroundColor: "rgba(64,204,146,0.16)" }}
          >
            历史
          </button>
        </div>
      </div>

      <div
        className={clsx(
          TRANSITION,
          expanded ? "max-h-[40px] opacity-100 mb-[10px]" : "max-h-0 opacity-0",
        )}
      >
        <label className="block text-[14px] md:text-[16px] leading-[22px] text-dark">
          H5 网址
        </label>
      </div>
      <input
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://your-h5-app.com"
        className="w-full h-11 md:h-[50px] rounded-lg px-4 md:px-6 text-[14px] md:text-[16px] text-dark placeholder:text-text bg-[rgba(246,249,250,1)] border-0 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      <div
        className={clsx(
          TRANSITION,
          expanded ? REVEAL_EXPANDED : REVEAL_COLLAPSED,
          expanded && "mt-6 md:mt-7",
        )}
      >
        <label className="block text-[14px] md:text-[16px] leading-[22px] text-dark mb-[10px]">
          App名称
        </label>
        <input
          type="text"
          value={appName}
          maxLength={64}
          onChange={(event) => setAppName(event.target.value)}
          placeholder="My App"
          className="w-full h-11 md:h-[50px] rounded-lg px-4 md:px-6 text-[14px] md:text-[16px] text-dark placeholder:text-text bg-[rgba(246,249,250,1)] border-0 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div
        className={clsx(
          TRANSITION,
          expanded
            ? "max-h-[40px] opacity-100 mt-6 md:mt-7 mb-[10px]"
            : "max-h-0 opacity-0 mt-4 md:mt-[10px]",
        )}
      >
        <label className="block text-[14px] md:text-[16px] leading-[22px] text-dark">
          目标平台
        </label>
      </div>

      <div
        className={clsx(
          "flex flex-wrap gap-2 md:gap-4",
          !expanded && "mt-4 md:mt-[10px]",
        )}
      >
        {PLATFORMS.map((platform) => {
          const active = selected.includes(platform.key);
          return (
            <button
              key={platform.key}
              type="button"
              onClick={() => togglePlatform(platform.key)}
              className="flex items-center gap-1.5 md:gap-2 h-9 md:h-[44px] px-2.5 md:px-4 rounded-[22px] md:rounded-[25px] transition-colors"
              style={{
                backgroundColor: active
                  ? "rgba(237,250,247,1)"
                  : "rgba(245,248,249,1)",
              }}
            >
              <span
                className="inline-flex items-center justify-center w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded border"
                style={{
                  borderWidth: active ? "2px" : "1px",
                  borderColor: active
                    ? "rgba(64,204,146,1)"
                    : "rgba(151,151,151,1)",
                  backgroundColor: active
                    ? "rgba(64,204,146,0.2)"
                    : "transparent",
                }}
              >
                {active ? (
                  <Image
                    src="/images/h5-package/check.png"
                    alt=""
                    width={8}
                    height={5}
                  />
                ) : null}
              </span>
              <span className="inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg">
                <Image
                  src={platform.icon}
                  alt={platform.label}
                  width={20}
                  height={20}
                />
              </span>
              <span className="text-[12px] md:text-[14px] text-dark whitespace-nowrap pr-1.5 md:pr-2">
                {platform.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={clsx(
          TRANSITION,
          expanded && isAndroidSelected ? REVEAL_EXPANDED : REVEAL_COLLAPSED,
          expanded && isAndroidSelected && "mt-6 md:mt-7",
        )}
      >
        <label className="block text-[14px] md:text-[16px] leading-[22px] text-dark mb-[10px]">
          Android包名
        </label>
        <input
          type="text"
          value={pkg}
          onChange={(event) => setPkg(event.target.value)}
          placeholder="com.example.app"
          className="w-full h-11 md:h-[50px] rounded-lg px-4 md:px-6 text-[14px] md:text-[16px] text-dark placeholder:text-text bg-[rgba(246,249,250,1)] border-0 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <p className="mt-[10px] text-[12px] md:text-[14px] leading-5 text-text">
          安卓平台需要填写合法包名，格式类似 `com.example.app`。
        </p>
      </div>

      <div
        className={clsx(
          TRANSITION,
          expanded ? "max-h-[220px] opacity-100" : REVEAL_COLLAPSED,
          expanded && "mt-6 md:mt-7",
        )}
      >
        <label className="block text-[14px] md:text-[16px] leading-[22px] text-dark mb-[10px]">
          App 图标
        </label>
        <div className="flex items-center gap-3 md:gap-4">
          <label
            className="inline-flex items-center justify-center h-11 md:h-[50px] px-5 md:px-6 rounded-[22px] md:rounded-[25px] cursor-pointer text-[14px] md:text-[16px] font-medium text-primary"
            style={{ backgroundColor: "rgba(237,250,247,1)" }}
          >
            选择文件
            <input
              type="file"
              accept="image/png"
              className="hidden"
              onChange={onFileChange}
            />
          </label>
          <span
            className="inline-flex items-center justify-center h-11 md:h-[50px] px-5 md:px-6 rounded-[22px] md:rounded-[25px] text-[14px] md:text-[16px] text-text truncate max-w-[160px] md:max-w-none"
            style={{ backgroundColor: "rgba(246,249,250,1)" }}
          >
            {iconFile ? iconFile.name : "未选择 PNG 文件"}
          </span>
        </div>
        <p className="mt-[10px] text-[12px] md:text-[14px] leading-5 text-text">
          上传一个尺寸至少为 1024x1024 的方形 PNG 图片。服务器会根据不同的平台对图片进行调整处理。
        </p>
      </div>

      {formError ? (
        <p className="mt-5 text-[13px] md:text-[14px] leading-5 text-[#E34D59]">
          {formError}
        </p>
      ) : null}

      <div className="mt-5 md:mt-7 mb-0 md:mb-2 flex justify-center">
        <button
          type="button"
          onClick={onSubmit}
          disabled={expanded && !canSubmit}
          className="inline-flex items-center justify-center gap-2 md:gap-3 h-11 md:h-12 px-8 rounded-3xl bg-primary text-white text-[14px] md:text-[16px] hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {submitLoading ? "提交中..." : "开始包装"}
          <Image
            src="/images/h5-package/arrow.png"
            alt=""
            width={10}
            height={16}
          />
        </button>
      </div>
    </>
  );
}

function TaskView({
  job,
  taskLoading,
  taskError,
  downloadKey,
  onHistory,
  onDownload,
}) {
  const queueState = job?.queue_state || job?.status;
  const waitingText = formatWaitTime(job?.estimated_wait_seconds);
  const platformEntries = Object.entries(job?.platforms ?? {});

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] md:text-[24px] leading-[33px] font-medium text-dark">
          打包状态
        </h2>
        <button
          type="button"
          onClick={onHistory}
          className="h-[28px] px-3 rounded-[14px] text-[14px] text-primary"
          style={{ backgroundColor: "rgba(64,204,146,0.16)" }}
        >
          历史
        </button>
      </div>

      {job?.h5_url ? (
        <p className="mt-4 md:mt-6 text-[14px] text-text break-all">
          {job.h5_url}
        </p>
      ) : null}

      {job ? (
        <div className="mt-4 md:mt-5 rounded-[18px] bg-[rgba(246,249,250,1)] px-4 py-3 md:px-5 md:py-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[13px] md:text-[14px] text-dark">
              队列状态：{formatQueueStatus(queueState)}
            </span>
            <span className="text-[13px] md:text-[14px] text-text">
              提交时间：{formatDateTime(job.created_at)}
            </span>
            {waitingText ? (
              <span className="text-[13px] md:text-[14px] text-text">
                预计等待：{waitingText}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {taskError ? (
        <p className="mt-4 text-[13px] md:text-[14px] leading-5 text-[#E34D59]">
          {taskError}
        </p>
      ) : null}

      {taskLoading && !job ? (
        <p className="mt-6 text-[14px] text-text">正在获取打包状态...</p>
      ) : null}

      <div className="mt-4 md:mt-5 flex flex-col gap-3 md:gap-4">
        {platformEntries.map(([platformKey, platformData]) => (
          <TaskPlatformRow
            key={platformKey}
            platformKey={platformKey}
            platformData={platformData}
            downloading={downloadKey === platformKey}
            onDownload={onDownload}
          />
        ))}
      </div>

      {!taskLoading && !platformEntries.length ? (
        <p className="mt-6 text-[14px] text-text">暂无平台状态信息。</p>
      ) : null}
    </>
  );
}

function TaskPlatformRow({
  platformKey,
  platformData,
  downloading,
  onDownload,
}) {
  const platform = platformByKey(platformKey);
  const statusText = {
    pending: "等待处理",
    running: "打包中...",
    done: "已完成，可下载",
    failed: "打包失败",
    cancelled: "已取消",
  }[platformData.status] ?? platformData.status;

  return (
    <div className="relative rounded-2xl overflow-hidden min-h-[78px] bg-[rgba(246,249,250,1)]">
      <div
        className={clsx(
          "absolute inset-y-0 left-0 pointer-events-none",
          platformData.status === "running"
            ? "animate-build-progress"
            : platformData.status === "done"
              ? "w-full"
              : "w-0",
        )}
        style={{
          background:
            "linear-gradient(90deg, rgba(246,249,250,1) 0%, rgba(224,247,237,1) 100%)",
        }}
      />
      <div className="relative flex items-center h-full px-4 md:px-6 py-4 gap-3 md:gap-4">
        {platform?.icon ? (
          <Image
            src={platform.icon}
            alt={platform.statusLabel}
            width={20}
            height={20}
          />
        ) : null}

        <div className="flex-1 min-w-0">
          <span className="block text-[14px] md:text-[16px] text-dark leading-[22px]">
            {platform?.statusLabel ?? platformKey}
          </span>
          <span className="block text-[12px] md:text-[14px] text-text leading-[20px]">
            {statusText}
          </span>
          {platformData.error ? (
            <p className="mt-1 text-[12px] md:text-[13px] leading-5 text-[#E34D59] break-all">
              {platformData.error}
            </p>
          ) : null}
        </div>

        <div className="ml-auto shrink-0">
          {platformData.download_url ? (
            <button
              type="button"
              onClick={() => onDownload(platformData.download_url, platformKey)}
              disabled={downloading}
              className="inline-flex items-center justify-center h-8 px-4 rounded-[16px] bg-primary text-white text-[12px] md:text-[14px] disabled:opacity-60"
            >
              {downloading ? "下载中..." : "下载"}
            </button>
          ) : (
            <StatusBadge status={platformData.status} />
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryView({
  history,
  historyLoading,
  historyError,
  onNew,
  onOpenTask,
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] md:text-[24px] leading-[33px] font-medium text-dark">
          历史记录
        </h2>
        <button
          type="button"
          onClick={onNew}
          className="h-[28px] px-3 rounded-[14px] text-[14px] text-primary"
          style={{ backgroundColor: "rgba(64,204,146,0.16)" }}
        >
          新建
        </button>
      </div>

      {historyError ? (
        <p className="mt-4 text-[13px] md:text-[14px] leading-5 text-[#E34D59]">
          {historyError}
        </p>
      ) : null}

      <div className="mt-4 md:mt-5 flex flex-col gap-3 md:gap-4 max-h-[420px] overflow-y-auto">
        {historyLoading ? (
          <p className="text-center text-text py-8">正在加载历史记录...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-text py-8">暂无历史记录</p>
        ) : (
          history.map((item) => (
            <HistoryRow
              key={item.task_id}
              item={item}
              onOpenTask={onOpenTask}
            />
          ))
        )}
      </div>
    </>
  );
}

function HistoryRow({ item, onOpenTask }) {
  return (
    <button
      type="button"
      onClick={() => onOpenTask(item.task_id)}
      className="w-full text-left relative rounded-2xl overflow-hidden min-h-[78px] bg-[rgba(246,249,250,1)] px-4 md:px-6 py-4"
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <span className="block text-[14px] md:text-[16px] text-dark leading-[22px] break-all">
            {item.h5_url}
          </span>
          <span className="block mt-1 text-[12px] md:text-[14px] text-text leading-[20px]">
            {formatDateTime(item.created_at)} ·{" "}
            {formatPlatformList(item.requested_platforms)}
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <StatusBadge status={item.status} />
          <span className="text-[12px] md:text-[14px] text-primary">详情</span>
        </div>
      </div>
    </button>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: {
      label: "等待中",
      className: "bg-white text-text",
    },
    submitted: {
      label: "已提交",
      className: "bg-white text-text",
    },
    waiting_capacity: {
      label: "等待资源",
      className: "bg-white text-text",
    },
    queued: {
      label: "排队中",
      className: "bg-white text-text",
    },
    running: {
      label: "打包中",
      className: "bg-white text-primary",
    },
    done: {
      label: "已完成",
      className: "bg-white text-text",
    },
    failed: {
      label: "失败",
      className: "bg-white text-[#E34D59]",
    },
    cancelled: {
      label: "已取消",
      className: "bg-white text-text",
    },
  }[status] ?? {
    label: status,
    className: "bg-white text-text",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 h-7 px-3 rounded-[14px] text-[12px] md:text-[14px]",
        config.className,
      )}
    >
      {status === "done" ? (
        <Image
          src="/images/h5-package/status-check.png"
          alt=""
          width={14}
          height={14}
        />
      ) : null}
      {status === "running" ? (
        <span className="inline-block w-2.5 h-[2px] bg-primary" />
      ) : null}
      {config.label}
    </span>
  );
}

async function validateIcon(file) {
  if (file.type !== "image/png") {
    return "图标必须是 PNG 图片";
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const dimensions = await new Promise((resolve, reject) => {
      const image = new window.Image();
      image.onload = () =>
        resolve({ width: image.width, height: image.height });
      image.onerror = () => reject(new Error("图标必须是有效的 PNG 图片"));
      image.src = objectUrl;
    });

    if (dimensions.width !== dimensions.height) {
      return "图标必须是正方形图片";
    }
    if (dimensions.width < 1024 || dimensions.height < 1024) {
      return "图标尺寸至少需要 1024x1024";
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "图标必须是有效的 PNG 图片";
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
