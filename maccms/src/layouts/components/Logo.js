import ImageFallback from "./ImageFallback";
import config from "@/config/config.json";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Logo = ({ src, lang }) => {

  const { logo, width, height, logo_title } = config.site;
  const {t} = useTranslation();

  return (
    <Link href={`/`} className="block navbar-brand">
      <div className="flex flex-row items-center h-[48px] md:h-[60px]">
        <ImageFallback
          width={width}
          height={height}
          src={src ? src : logo}
          alt={logo_title}
          priority
          className={`w-[36px] h-[36px] md:w-[50px] md:h-[50px]`}
        />
        <label className="ml-[6px] md:ml-[10px] text-[18px] md:text-[24px] text-dark pt-[6px] md:pt-[8px] font-medium break-keep">{t("menu.logo")}</label>
      </div>
    </Link>
  );
};

export default Logo;
