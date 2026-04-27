import { useTranslation } from "react-i18next";

const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  n,
  src: `/images/home/function-deck/fn-${n}.png`,
  srcSet: `/images/home/function-deck/fn-${n}.png 1x, /images/home/function-deck/fn-${n}@2x.png 2x`,
}));

export default function HomeFunctionDeck() {
  const { t } = useTranslation();

  return (
    <section
      className="home-function-deck mt-10 bg-white py-10 md:mt-14 md:py-14 lg:mt-16 lg:py-16"
      aria-labelledby="home-function-deck-title"
    >
      <div className="container">
        <p className="text-center text-[24px] font-semibold tracking-wide text-dark md:text-[30px]">
          {t("home.fnEyebrow")}
        </p>
        <h2 id="home-function-deck-title" className="sr-only">
          {t("home.fnTitle")}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 lg:gap-5">
          {ITEMS.map((item) => (
            <article
              key={item.n}
              className="min-h-[176px] rounded-2xl bg-[#f4f8f8] p-6 md:min-h-[188px]"
            >
              <div className="mb-4 flex h-[48px] w-[48px] shrink-0 items-center justify-center">
                <img
                  src={item.src}
                  srcSet={item.srcSet}
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full object-contain object-center"
                  loading="lazy"
                  decoding="async"
                  aria-hidden
                />
              </div>
              <h3 className="text-[18px] font-semibold leading-snug text-dark md:text-[20px]">
                {t(`home.fn${item.n}t`)}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[#6b7280] md:text-[15px]">
                {t(`home.fn${item.n}d`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
