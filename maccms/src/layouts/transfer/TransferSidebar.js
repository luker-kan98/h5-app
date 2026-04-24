
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const TransferSidebar = ({ currentElementIndexInViewport }) => {

  const { t } = useTranslation();
  const asPath = useRouter();

  return (
    <div className="w-full">
      <ul className="doc-menu">
        <label className="text-black text-[20px] font-primary">{t("wm.s25")}</label>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport === 0 && "active")}>
          <Link href={``}>{t("wm.s26")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport === 1 && "active")}>
          <Link href={`#视频解析`}
          >{t("wm.s27")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport === 2 && "active")}>
          <Link href={`#采集规则`}
          >{t("wm.s28")}</Link>
        </li>
      </ul>
    </div>
  );
}

export default TransferSidebar;