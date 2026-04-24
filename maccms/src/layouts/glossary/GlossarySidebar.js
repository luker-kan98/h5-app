
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const GlossarySidebar = ({ currentElementIndexInViewport }) => {

  const { t } = useTranslation();
  const asPath = useRouter();

  return (
    <div className="w-full">
      <ul className="doc-menu">
        <label className="text-black text-[20px] font-primary">{t("menu.theme")}</label>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport === 0 && "active")}>
          <Link href={``}>{t("wm.s6")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport === 1 && "active")}>
          <Link href={`#视频解析`}
          >{t("wm.s7")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport === 2 && "active")}>
          <Link href={`#采集规则`}
          >{t("wm.s8")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport === 3 && "active")}>
          <Link href={`#CF`}
          >{t("wm.s9")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport === 4 && "active")}>
          <Link href={`#假墙攻击`}
          >{t("wm.s10")}</Link>
        </li>
      </ul>
    </div>
  );
}

export default GlossarySidebar;