import { useTranslation } from "react-i18next";

const LIST = [
  {
    key: "grItem1",
    src: "/images/home/growth-section/ic-users.png",
    srcSet:
      "/images/home/growth-section/ic-users.png 1x, /images/home/growth-section/ic-users@2x.png 2x",
  },
  {
    key: "grItem2",
    src: "/images/home/growth-section/ic-wallet.png",
    srcSet:
      "/images/home/growth-section/ic-wallet.png 1x, /images/home/growth-section/ic-wallet@2x.png 2x",
  },
  {
    key: "grItem3",
    src: "/images/home/growth-section/ic-crown.png",
    srcSet:
      "/images/home/growth-section/ic-crown.png 1x, /images/home/growth-section/ic-crown@2x.png 2x",
  },
  {
    key: "grItem4",
    src: "/images/home/growth-section/ic-target.png",
    srcSet:
      "/images/home/growth-section/ic-target.png 1x, /images/home/growth-section/ic-target@2x.png 2x",
  },
];

export default function HomeGrowthSection() {
  const { t } = useTranslation();

  return (
    <section
      className="home-growth-section bg-[#f4f6f5] py-12 md:py-16 lg:py-20"
      aria-labelledby="home-growth-title"
    >
      <div className="container">
        <p className="text-center text-[24px] font-semibold tracking-wide text-dark md:text-[30px]">
          {t("home.grEyebrow")}
        </p>

        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-0">
          <div className="min-w-0">
            <h2
              id="home-growth-title"
              className="w-[240px] font-['PingFangSC','PingFang_SC'] font-medium text-[30px] text-[#05031A] leading-[42px] text-left"
            >
              {t("home.grTitle")}
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#6b7280] md:text-[15px]">
              {t("home.grLead")}
            </p>

            <ul className="mt-8 space-y-5 border-l-2 border-primary pl-5 md:mt-10 md:space-y-6">
              {LIST.map((row) => (
                <li key={row.key} className="flex gap-3.5">
                  <img
                    src={row.src}
                    srcSet={row.srcSet}
                    alt=""
                    width={28}
                    height={28}
                    className="mt-0.5 h-7 w-7 shrink-0 object-contain"
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  <span className="text-[15px] font-medium leading-snug text-[#374151] md:text-base">
                    {t(`home.${row.key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:pt-1">
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_16px_48px_-12px_rgba(15,23,42,0.12)] md:rounded-3xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 md:px-6 md:py-4">
                <span className="text-[15px] font-bold text-dark md:text-base">
                  {t("home.grCardTitle")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] text-[#6b7280] md:text-[13px]">
                  <span>{t("home.grBadgePrefix")}</span>
                  <span className="font-semibold text-primary">
                    {t("home.grBadgeValue")}
                  </span>
                </span>
              </div>
              <div className="p-3 md:p-5">
                <img
                  src="/images/home/growth-section/growth-chart.png"
                  alt={t("home.grChartAlt")}
                  className="h-auto w-full rounded-xl object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
