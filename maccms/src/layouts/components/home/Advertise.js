import { useTranslation } from "react-i18next";
import Image from "next/image";

const ADVANTAGE_QUAD = [
  {
    id: "aq1",
    src: "/images/home/advantage-quad/adv-ai.png",
    srcSet:
      "/images/home/advantage-quad/adv-ai.png 1x, /images/home/advantage-quad/adv-ai@2x.png 2x",
  },
  {
    id: "aq2",
    src: "/images/home/advantage-quad/adv-lock.png",
    srcSet:
      "/images/home/advantage-quad/adv-lock.png 1x, /images/home/advantage-quad/adv-lock@2x.png 2x",
  },
  {
    id: "aq3",
    src: "/images/home/advantage-quad/adv-globe.png",
    srcSet:
      "/images/home/advantage-quad/adv-globe.png 1x, /images/home/advantage-quad/adv-globe@2x.png 2x",
  },
  {
    id: "aq4",
    src: "/images/home/advantage-quad/adv-cloud.png",
    srcSet:
      "/images/home/advantage-quad/adv-cloud.png 1x, /images/home/advantage-quad/adv-cloud@2x.png 2x",
  },
];

export default function Advertise() {
  const { t } = useTranslation();

  return (
    <div className="w-full mt-[60px] md:mt-[170px] pb-[60px] md:pb-[170px]">
      <h2 className="text-center">{t("home.s8")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-[39px] md:mt-[84px] gap-[45px] md:gap-[70px]">
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_1.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">
            {t("home.s9")}
          </h3>
          <p>{t("home.s10")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_2.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("home.s11")}</h3>
          <p>{t("home.s12")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_3.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("home.s13")}</h3>
          <p>{t("home.s14")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_4.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("home.s15")}</h3>
          <p>{t("home.s16")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_9.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("home.s19")}</h3>
          <p>{t("home.s20")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_10.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("home.s21")}</h3>
          <p>{t("home.s22")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_11.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("home.s23")}</h3>
          <p>{t("home.s24")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_12.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("home.s25")}</h3>
          <p>{t("home.s26")}</p>
        </div>
        {ADVANTAGE_QUAD.map((card) => (
          <div className="ads" key={card.id}>
            <div className="ads-icon flex w-full min-h-[88px] items-center justify-center md:min-h-[100px] md:justify-start">
              <img
                src={card.src}
                srcSet={card.srcSet}
                alt=""
                width={200}
                height={112}
                className="max-h-[100px] w-auto max-w-full object-contain object-left md:max-h-[112px]"
                loading="lazy"
                decoding="async"
                aria-hidden
              />
            </div>
            <h3 className="ads-title">{t(`home.${card.id}t`)}</h3>
            <p>{t(`home.${card.id}d`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
