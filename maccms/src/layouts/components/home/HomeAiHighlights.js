import { useTranslation } from "react-i18next";

const ITEM_KEYS = ["hl1", "hl2", "hl3", "hl4"];

export default function HomeAiHighlights() {
  const { t } = useTranslation();

  return (
    <div className="home-ai-highlights mt-12 border-t border-[#e8eeef] pt-12 pb-14 md:mt-16 md:pt-16 md:pb-20 lg:mt-20 lg:pt-20 lg:pb-24">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-8">
        {ITEM_KEYS.map((key) => (
          <div key={key} className="flex min-w-0 flex-col">
            <span className="text-[22px] font-semibold tabular-nums leading-none text-primary md:text-[26px]">
              {t(`home.${key}n`)}
            </span>
            <div className="mt-3 h-px w-10 bg-primary md:mt-3.5 md:w-12" aria-hidden />
            <h3 className="mt-5 text-[16px] font-bold leading-snug text-dark md:mt-6 md:text-[17px]">
              {t(`home.${key}t`)}
            </h3>
            <p className="mt-2.5 text-[13px] leading-relaxed text-[#6b7280] md:mt-3 md:text-[14px] md:leading-relaxed">
              {t(`home.${key}d`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
