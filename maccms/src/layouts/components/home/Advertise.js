import { useTranslation } from "react-i18next";
import Image from "next/image";


export default function Advertise() {

  const { t } = useTranslation();

  return (
    <div className="w-full mt-[60px] md:mt-[170px]">
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
      </div>
    </div>
  );
}