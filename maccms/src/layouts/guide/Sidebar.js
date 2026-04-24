
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const Sidebar = ({ currentElementIndexInViewport }) => {

  const { t } = useTranslation();
  const asPath = useRouter();

  return (
    <div className="doc-sidebar pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px] max-h-[200px]">
      <ul className="doc-menu">
        <label className="text-black text-[20px] font-primary">{t("menu.guide")}</label>
        <li className={clsx("doc-menu-item group", asPath.pathname == "/guide" && "active")}>
          <Link href={`/guide`}>{`MacCMS V10.x`}</Link>
        </li>
        {asPath.pathname == "/guide" &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide#${t("guide.s2")}`}>{t("guide.s2")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide#${t("guide.s3")}`}>{t("guide.s3")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide#${t("guide.s4")}`}>{t("guide.s4")}</Link>
            </li>
          </>
        }
        <li className={clsx("doc-menu-item group", asPath.pathname.startsWith("/guide/getting-started") && "active")}>
          <Link href={`/guide/getting-started`}>{t("guide.s5")}</Link>
        </li>
        {asPath.pathname.startsWith("/guide/getting-started") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide/getting-started#${t("guide.s38")}`}>{t("guide.s38")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide/getting-started#${t("guide.s39")}`}>{t("guide.s39")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide/getting-started#${t("guide.s40")}`}>{t("guide.s40")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", asPath.pathname.startsWith("/guide/directory-structure") && "active")}>
          <Link href="/guide/directory-structure">{t("guide.s6")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", asPath.pathname.startsWith("/guide/basic-config") && "active")}>
          <Link href="/guide/basic-config">{t("guide.s7")}</Link>
        </li>
        {asPath.pathname.startsWith("/guide/basic-config") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 0 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide/basic-config#${t("guide.s90")}`}>{t("guide.s90")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide/basic-config#${t("guide.s91")}`}>{t("guide.s91")}</Link>
            </li>
          </>}
        <li className={clsx("doc-menu-item group", asPath.pathname == "/guide/assets" && "active")}>
          <Link href="/guide/assets">{t("guide.s8")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", asPath.pathname == "/guide/lang" && "active")}>
          <Link href="/guide/lang">{t("guide.s9")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", asPath.pathname == "/guide/update-log" && "active")}>
          <Link href="/guide/update-log">{t("guide.s10")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", asPath.pathname == "/guide/often-sql" && "active")}>
          <Link href="/guide/often-sql">{t("guide.s11")}</Link>
        </li>
        <label className="mt-8 text-black text-[20px] font-primary block">{t("guide.s12")}</label>
        <li className={clsx("doc-menu-item group", asPath.pathname == "/guide/help" && "active")}>
          <Link href="/guide/help">{t("guide.s13")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", asPath.pathname.startsWith("/guide/security") && "active")}>
          <Link href="/guide/security">{t("guide.s14")}</Link>
        </li>
        {asPath.pathname.startsWith("/guide/security") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 0 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide/security`}>{t("guide.s179")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide/security#关于盗版`}>{t("guide.s180")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/guide/security#利用cloudflare防止cc攻击`}>{t("guide.s181")}</Link>
            </li>
          </>}
        {/*<li className={clsx("doc-menu-item group", asPath.pathname == "/guide/coffee" && "active")}>*/}
        {/*  <Link href="/guide/coffee">{t("guide.s15")}</Link>*/}
        {/*</li>*/}
      </ul>
    </div>
  );
}

export default Sidebar;