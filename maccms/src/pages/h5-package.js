import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
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

const PLATFORM_KEYS = ["android", "ios", "macos", "windows"];
const PLATFORM_ICONS = {
  android: "/images/h5-package/android-icon.png",
  ios: "/images/h5-package/ios-icon.png",
  macos: "/images/h5-package/macos-icon.png",
  windows: "/images/h5-package/windows-icon.png",
};

const FEATURE_DEFS = [
  {
    image: "/images/h5-package/android-card.png",
    titleKey: "h5p.feature.androidTitle",
    descKey: "h5p.feature.androidDesc",
  },
  {
    image: "/images/h5-package/ios-card.png",
    titleKey: "h5p.feature.iosTitle",
    descKey: "h5p.feature.iosDesc",
  },
  {
    image: "/images/h5-package/macos-card.png",
    titleKey: "h5p.feature.macosTitle",
    descKey: "h5p.feature.macosDesc",
  },
  {
    image: "/images/h5-package/windows-card.png",
    titleKey: "h5p.feature.windowsTitle",
    descKey: "h5p.feature.windowsDesc",
  },
];

const REVEAL_COLLAPSED = "max-h-0 opacity-0 pointer-events-none";
const REVEAL_EXPANDED = "max-h-[400px] opacity-100";
const TRANSITION = "transition-all duration-500 ease-out overflow-hidden";

const buildPlatforms = (t) =>
  PLATFORM_KEYS.map((key) => ({
    key,
    label: t(`h5p.platform.${key}`),
    statusLabel:
      key === "android"
        ? t("h5p.platform.androidStatus")
        : key === "ios"
          ? t("h5p.platform.iosStatus")
          : t(`h5p.platform.${key}`),
    icon: PLATFORM_ICONS[key],
  }));

const isTerminalBuild = (job) => {
  const statuses = Object.values(job?.platforms ?? {}).map(
    (platform) => platform?.status,
  );
  return statuses.length > 0 && statuses.every((status) => TERMINAL_PLATFORM_STATUSES.has(status));
};

const formatQueueStatus = (t, status) => {
  if (!status) {
    return t("h5p.queueStatus.unknown");
  }
  const key = `h5p.queueStatus.${status}`;
  const translated = t(key);
  return translated === key ? status : translated;
};

const formatPlatformList = (t, platforms = []) => {
  const platformMap = buildPlatforms(t);
  return platforms
    .map(
      (platform) =>
        platformMap.find((entry) => entry.key === platform)?.label ?? platform,
    )
    .join(" / ");
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const formatWaitTime = (t, seconds) => {
  if (!seconds || seconds <= 0) {
    return "";
  }

  if (seconds < 60) {
    return t("h5p.wait.seconds", { value: seconds });
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (remainder === 0) {
    return t("h5p.wait.minutes", { value: minutes });
  }
  return t("h5p.wait.minutesSeconds", { minutes, seconds: remainder });
};

export default function H5Package() {
  const { t } = useTranslation();
  const platforms = useMemo(() => buildPlatforms(t), [t]);

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

        setTaskError(getApiErrorMessage(error, t("h5p.error.statusFail")));
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
  }, [view, currentTaskId, t]);

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
      setHistoryError(getApiErrorMessage(error, t("h5p.error.historyFail")));
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
      setFormError(t("h5p.error.urlRequired"));
      return;
    }
    if (!trimmedName) {
      setFormError(t("h5p.error.appNameRequired"));
      return;
    }
    if (!selected.length) {
      setFormError(t("h5p.error.platformRequired"));
      return;
    }
    if (!iconFile) {
      setFormError(t("h5p.error.iconRequired"));
      return;
    }
    if (isAndroidSelected && !trimmedPkg) {
      setFormError(t("h5p.error.androidPkgRequired"));
      return;
    }
    if (trimmedPkg && !ANDROID_PACKAGE_RE.test(trimmedPkg)) {
      setFormError(t("h5p.error.androidPkgFormat"));
      return;
    }

    const iconErrorKey = await validateIcon(iconFile);
    if (iconErrorKey) {
      setFormError(t(iconErrorKey));
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
      setFormError(getApiErrorMessage(error, t("h5p.error.submitFail")));
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
      setTaskError(getApiErrorMessage(error, t("h5p.error.downloadFail")));
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
      title={t("h5p.meta.title")}
      description={t("h5p.meta.description")}
      keywords={t("h5p.meta.keywords")}
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
            {t("h5p.form.back")}
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
            {t("h5p.form.heroTitle")}
          </h1>
          <p className="mt-3 md:mt-4 text-[14px] md:text-[16px] leading-[22px] text-text max-w-[340px] md:max-w-[640px] mx-auto">
            {t("h5p.form.heroDesc")}
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
                platforms={platforms}
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
                platforms={platforms}
              />
            )}
          </div>
        </div>
      </section>

      <section className="pt-8 md:pt-[60px] pb-10 md:pb-[100px]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8">
            {FEATURE_DEFS.map((feature) => {
              const title = t(feature.titleKey);
              const desc = t(feature.descKey);
              return (
                <div key={feature.titleKey}>
                  <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden aspect-[584/286] bg-[#F5F8F9]">
                    <Image
                      src={feature.image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 md:mt-7 text-[18px] md:text-[20px] leading-7 font-medium text-dark">
                    {title}
                  </h3>
                  <p className="mt-2 md:mt-[14px] text-[14px] leading-5 md:leading-5 text-text">
                    {desc}
                  </p>
                </div>
              );
            })}
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
  platforms,
}) {
  const { t } = useTranslation();

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
            {t("h5p.form.title")}
          </h2>
          <button
            type="button"
            onClick={onHistory}
            className="h-[28px] px-3 rounded-[14px] text-[14px] text-primary"
            style={{ backgroundColor: "rgba(64,204,146,0.16)" }}
          >
            {t("h5p.form.history")}
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
          {t("h5p.form.urlLabel")}
        </label>
      </div>
      <input
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder={t("h5p.form.urlPlaceholder")}
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
          {t("h5p.form.appNameLabel")}
        </label>
        <input
          type="text"
          value={appName}
          maxLength={64}
          onChange={(event) => setAppName(event.target.value)}
          placeholder={t("h5p.form.appNamePlaceholder")}
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
          {t("h5p.form.platformsLabel")}
        </label>
      </div>

      <div
        className={clsx(
          "flex flex-wrap gap-2 md:gap-4",
          !expanded && "mt-4 md:mt-[10px]",
        )}
      >
        {platforms.map((platform) => {
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
              {active ? (
                <Image
                  src="/images/h5-package/cb_ic_sel.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]"
                />
              ) : (
                <span
                  className="inline-flex items-center justify-center w-[18px] h-[18px] md:w-[20px] md:h-[20px] rounded border"
                  style={{
                    borderWidth: "1px",
                    borderColor: "rgba(151,151,151,1)",
                    backgroundColor: "transparent",
                  }}
                />
              )}
              <span className="inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg">
                <Image
                  src={platform.icon}
                  alt={platform.label}
                  width={36}
                  height={36}
                  className="w-[28px] h-[28px] md:w-[36px] md:h-[36px]"
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
          {t("h5p.form.androidPkgLabel")}
        </label>
        <input
          type="text"
          value={pkg}
          onChange={(event) => setPkg(event.target.value)}
          placeholder={t("h5p.form.androidPkgPlaceholder")}
          className="w-full h-11 md:h-[50px] rounded-lg px-4 md:px-6 text-[14px] md:text-[16px] text-dark placeholder:text-text bg-[rgba(246,249,250,1)] border-0 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <p className="mt-[10px] text-[12px] md:text-[14px] leading-5 text-text">
          {t("h5p.form.androidPkgHint")}
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
          {t("h5p.form.iconLabel")}
        </label>
        <div className="flex items-center gap-3 md:gap-4">
          <label
            className="inline-flex items-center justify-center h-11 md:h-[50px] px-5 md:px-6 rounded-[22px] md:rounded-[25px] cursor-pointer text-[14px] md:text-[16px] font-medium text-primary"
            style={{ backgroundColor: "rgba(237,250,247,1)" }}
          >
            {t("h5p.form.iconChoose")}
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
            {iconFile ? iconFile.name : t("h5p.form.iconNone")}
          </span>
        </div>
        <p className="mt-[10px] text-[12px] md:text-[14px] leading-5 text-text">
          {t("h5p.form.iconHint")}
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
          {submitLoading ? t("h5p.form.submitting") : t("h5p.form.submit")}
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
  platforms,
  onHistory,
  onDownload,
}) {
  const { t } = useTranslation();
  const queueState = job?.queue_state || job?.status;
  const waitingText = formatWaitTime(t, job?.estimated_wait_seconds);
  const platformEntries = Object.entries(job?.platforms ?? {});

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] md:text-[24px] leading-[33px] font-medium text-dark">
          {t("h5p.task.title")}
        </h2>
        <button
          type="button"
          onClick={onHistory}
          className="h-[28px] px-3 rounded-[14px] text-[14px] text-primary"
          style={{ backgroundColor: "rgba(64,204,146,0.16)" }}
        >
          {t("h5p.form.history")}
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
              {t("h5p.task.queueStatus", {
                value: formatQueueStatus(t, queueState),
              })}
            </span>
            <span className="text-[13px] md:text-[14px] text-text">
              {t("h5p.task.createdAt", { value: formatDateTime(job.created_at) })}
            </span>
            {waitingText ? (
              <span className="text-[13px] md:text-[14px] text-text">
                {t("h5p.task.estimatedWait", { value: waitingText })}
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
        <p className="mt-6 text-[14px] text-text">{t("h5p.task.loading")}</p>
      ) : null}

      <div className="mt-4 md:mt-5 flex flex-col gap-3 md:gap-4">
        {platformEntries.map(([platformKey, platformData]) => (
          <TaskPlatformRow
            key={platformKey}
            platformKey={platformKey}
            platformData={platformData}
            platforms={platforms}
            downloading={downloadKey === platformKey}
            onDownload={onDownload}
          />
        ))}
      </div>

      {!taskLoading && !platformEntries.length ? (
        <p className="mt-6 text-[14px] text-text">{t("h5p.task.noPlatforms")}</p>
      ) : null}
    </>
  );
}

function TaskPlatformRow({
  platformKey,
  platformData,
  platforms,
  downloading,
  onDownload,
}) {
  const { t } = useTranslation();
  const platform = platforms.find((entry) => entry.key === platformKey);
  const statusKey = `h5p.platformStatus.${platformData.status}`;
  const translatedStatus = t(statusKey);
  const statusText =
    translatedStatus === statusKey ? platformData.status : translatedStatus;

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
            width={36}
            height={36}
            className="w-[24px] h-[24px] md:w-[28px] md:h-[28px]"
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
              {downloading ? t("h5p.task.downloading") : t("h5p.task.download")}
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
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] md:text-[24px] leading-[33px] font-medium text-dark">
          {t("h5p.history.title")}
        </h2>
        <button
          type="button"
          onClick={onNew}
          className="h-[28px] px-3 rounded-[14px] text-[14px] text-primary"
          style={{ backgroundColor: "rgba(64,204,146,0.16)" }}
        >
          {t("h5p.history.new")}
        </button>
      </div>

      {historyError ? (
        <p className="mt-4 text-[13px] md:text-[14px] leading-5 text-[#E34D59]">
          {historyError}
        </p>
      ) : null}

      <div className="mt-4 md:mt-5 flex flex-col gap-3 md:gap-4 max-h-[420px] overflow-y-auto pb-4 md:pb-6">
        {historyLoading ? (
          <p className="text-center text-text py-8">{t("h5p.history.loading")}</p>
        ) : history.length === 0 ? (
          <p className="text-center text-text py-8">{t("h5p.history.empty")}</p>
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
  const { t } = useTranslation();

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
            {formatPlatformList(t, item.requested_platforms)}
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <StatusBadge status={item.status} />
          <span className="text-[12px] md:text-[14px] text-primary">
            {t("h5p.history.detail")}
          </span>
        </div>
      </div>
    </button>
  );
}

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const styleMap = {
    pending: "bg-white text-text",
    submitted: "bg-white text-text",
    waiting_capacity: "bg-white text-text",
    queued: "bg-white text-text",
    running: "bg-white text-primary",
    done: "bg-white text-text",
    failed: "bg-white text-[#E34D59]",
    cancelled: "bg-white text-text",
  };
  const className = styleMap[status] ?? "bg-white text-text";
  const labelKey = `h5p.statusBadge.${status}`;
  const translated = t(labelKey);
  const label = translated === labelKey ? status : translated;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 h-7 px-3 rounded-[14px] text-[12px] md:text-[14px]",
        className,
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
      {label}
    </span>
  );
}

async function validateIcon(file) {
  if (file.type !== "image/png") {
    return "h5p.error.iconPng";
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const dimensions = await new Promise((resolve, reject) => {
      const image = new window.Image();
      image.onload = () =>
        resolve({ width: image.width, height: image.height });
      image.onerror = () => reject(new Error("h5p.error.iconValid"));
      image.src = objectUrl;
    });

    if (dimensions.width !== dimensions.height) {
      return "h5p.error.iconSquare";
    }
    if (dimensions.width < 1024 || dimensions.height < 1024) {
      return "h5p.error.iconSize";
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "h5p.error.iconValid";
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
