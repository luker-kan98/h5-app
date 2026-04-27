import { useTranslation } from "react-i18next";

export default function HomeAiShowcase() {
  const { t } = useTranslation();

  return (
    <section
      className="home-ai-showcase relative bg-gradient-to-b from-[#eefbf4] via-[#f8fdfb] to-white py-12 md:py-16 lg:py-20"
      aria-labelledby="home-ai-showcase-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/home/ai-showcase/section-bg.png')] bg-cover bg-center bg-no-repeat opacity-[0.45] mix-blend-multiply md:opacity-[0.35]"
        aria-hidden
      />
      <div className="container relative">
        <h2
          id="home-ai-showcase-title"
          className="text-center text-[22px] font-bold leading-tight tracking-tight text-dark md:text-[30px] lg:text-[34px]"
        >
          {t("home.showcaseTitle")}
        </h2>
        <p className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[15px] leading-snug text-[#4b5563] md:mt-5 md:text-lg md:leading-relaxed">
          <span className="whitespace-nowrap">{t("home.showcaseSub1")}</span>
          <img
            src="/images/home/ai-showcase/stars.png"
            srcSet="/images/home/ai-showcase/stars.png 1x, /images/home/ai-showcase/stars@2x.png 2x"
            width={22}
            height={22}
            alt=""
            className="inline-block h-[18px] w-[18px] shrink-0 object-contain md:h-5 md:w-5"
            aria-hidden
            decoding="async"
          />
          <span className="whitespace-nowrap">{t("home.showcaseSub2")}</span>
        </p>

        <div className="relative mx-auto mt-10 max-w-[960px] px-1 md:mt-14 lg:mt-16">
          <img
            src="/images/home/ai-showcase/browser-mockup.png"
            alt={t("home.showcaseImgAlt")}
            className="h-auto w-full rounded-[12px] border border-gray-200/60 shadow-[0_24px_80px_-20px_rgba(15,118,110,0.18)] md:rounded-2xl"
            loading="lazy"
            decoding="async"
          />
          {/* Floating robot-mascot inside white disc (decorative), bottom-right — matches UI reference */}
          <div
            className="pointer-events-none absolute bottom-[5%] right-0 z-10 sm:right-[-2%] md:bottom-[7%] md:right-[-1%]"
            aria-hidden
          >
            <div
              className="flex aspect-square w-[min(32vw,124px)] min-w-[92px] max-w-[154px] items-center justify-center rounded-full border border-white bg-white/95 p-[6px] shadow-[0_14px_40px_-6px_rgba(15,118,110,0.28),0_6px_24px_rgba(0,0,0,0.08)] ring-[5px] ring-[#e8f8f0] sm:min-w-[104px] sm:max-w-[140px] md:w-[min(17vw,156px)] md:max-w-[168px] md:p-2 md:ring-[7px]"
            >
              <img
                src="/images/branding/robot-mascot.png"
                srcSet="/images/branding/robot-mascot.png 1x, /images/branding/robot-mascot@2x.png 2x"
                width={96}
                height={96}
                alt=""
                className="h-full w-full rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
