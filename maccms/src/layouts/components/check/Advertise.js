import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function Advertise() {

  const {t} = useTranslation();

  return (
    <div className="w-full mt-[60px] md:mt-[170px]">
      <h2 className="text-center">{t("check.s4")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-[39px] md:mt-[84px] gap-[45px] md:gap-[70px]">
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_5.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("check.s5")}</h3>
          <p>{t("check.s6")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_6.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("check.s7")}</h3>
          <p>{t("check.s8")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_7.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("check.s9")}</h3>
          <p>{t("check.s10")}</p>
        </div>
        <div className="ads">
          <div className="ads-icon">
            <Image alt="icon" src="/images/gifs/icon_8.gif" width={80} height={80} />
          </div>
          <h3 className="ads-title">{t("check.s11")}</h3>
          <p>{t("check.s12")}</p>
        </div>
      </div>
    </div>
  );
}