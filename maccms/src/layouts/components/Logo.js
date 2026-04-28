import config from "@/config/config.json";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";
import logoAnimation from "../../../public/images/logo-animation.json";

const Logo = ({ src, lang }) => {

  const { logo_title } = config.site;
  const {t} = useTranslation();

  return (
    <Link href={`/`} className="block navbar-brand">
      <div className="flex flex-row items-center gap-2 h-[48px] md:h-[60px]">
        <Lottie
          animationData={logoAnimation}
          loop={true}
          autoplay={true}
          className="w-[36px] h-[36px] md:w-[50px] md:h-[50px] shrink-0 self-center"
          aria-label={logo_title}
        />
        <span className="ml-[2px] md:ml-[2px] text-[18px] md:text-[24px] text-dark font-medium break-keep leading-none self-center">
          {t("menu.logo")}
        </span>
        <span className="inline-flex shrink-0 items-center justify-center self-center rounded-full bg-[#DCF5E8] px-2.5 py-1 text-xs font-semibold leading-tight text-[#16a34a] md:px-3 md:py-1.5 md:text-sm">
          {t("menu.aibadge")}
        </span>
      </div>
    </Link>
  );
};

export default Logo;
