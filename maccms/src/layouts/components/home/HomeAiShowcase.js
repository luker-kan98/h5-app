import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import useLocale from "@/hooks/useLocale";

import "swiper/css";
import "swiper/css/pagination";

const SLIDE_COUNT = 3;
const BASE_PATH = "/images/home/ai-showcase/carousel";
const MD_BREAKPOINT = 768;

function getSlideImages(locale) {
  return Array.from({ length: SLIDE_COUNT }, (_, i) => {
    const n = i + 1;
    return {
      pc: `${BASE_PATH}/slide-${n}-pc-${locale}.png`,
      h5: `${BASE_PATH}/slide-${n}-h5-${locale}.png`,
    };
  });
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    setIsDesktop(mql.matches);

    function onChange(e) {
      setIsDesktop(e.matches);
    }

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

export default function HomeAiShowcase() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const isDesktop = useIsDesktop();

  const slides = useMemo(() => getSlideImages(locale), [locale]);
  const viewport = isDesktop ? "pc" : "h5";

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
          <Swiper
            key={`${locale}-${viewport}`}
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            speed={600}
            className="ai-showcase-swiper"
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={isDesktop ? slide.pc : slide.h5}
                  alt={`${t("home.showcaseImgAlt")} ${idx + 1}`}
                  className="h-auto w-full rounded-[12px] md:rounded-2xl"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .ai-showcase-swiper {
          border-radius: 12px;
          overflow: hidden;
          background: transparent;
        }
        .ai-showcase-swiper .swiper-slide {
          background: transparent;
        }
        @media (min-width: 768px) {
          .ai-showcase-swiper {
            border-radius: 16px;
          }
        }
        .ai-showcase-swiper .swiper-pagination {
          bottom: 12px !important;
        }
        .ai-showcase-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #fff;
          opacity: 0.6;
          transition: opacity 0.2s, width 0.2s, border-radius 0.2s;
        }
        .ai-showcase-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 20px;
          border-radius: 4px;
          background: #fff;
        }
      `}</style>
    </section>
  );
}
