import menu from "@/config/menu.json";
import useLocale from "@/hooks/useLocale";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import useOutsideAlerter from "@/hooks/useOutsideAlterter";

export default function MobileMenu({ setShowMenu }) {
  const { setLocale } = useLocale();
  const asPath = useRouter();
  const { t } = useTranslation();
  const { languages } = menu;
  const [searchActive, setSearchActive] = useState(false);
  const searchBarRef = useRef();
  useOutsideAlerter(searchBarRef, setSearchActive);

  const [searchResult, setSearchResult] = useState(null);

  const onChangeLocale = (l) => {
    setLocale(l);
    setShowMenu(false);
  };

  return (
    <div
      className=" pt-16 pb-10"
      id="mobile-menu"
    >
      <div className="container relative w-full flex justify-end">
        <div ref={searchBarRef} onClick={() => setSearchActive(true)} className={clsx("group px-2 flex flex-row items-center h-[36px] border-2 overflow-x-hidden rounded-full transition-all duration-200",
          !searchActive && "w-[36px]", searchActive && "w-full ")}>
          <Image alt={t("menu.search")} src="/images/icons/ic_search.png" width={16} height={16} />
          <input className="grow nav-search" type="search" hidden={!searchActive} />
          {searchActive && searchResult && searchResult.length > 0 &&
            <div className="absolute z-10 w-full left-0 top-[40px] px-4 py-3 shadow1 border rounded-[10px] bg-white flex flex-col gap-3">
              No results.
            </div>
          }
        </div>
      </div>

      <div className="flex flex-col items-center">
        <Link
          href="/"
          className={clsx(
            "nav-link text-center block",
            asPath.pathname == "/" && "active"
          )}
          onClick={() => setShowMenu(false)}
        >
          {t("menu.home")}
        </Link>
        <Link
          href={"/h5-package"}
          className={clsx(
            "nav-link text-center block",
            asPath.pathname.startsWith("/h5-package") && "active"
          )}
          onClick={() => setShowMenu(false)}
        >
          {t("menu.apppack")}
        </Link>
        <Link
          href={"/guide"}
          className={clsx(
            "nav-link text-center block",
            asPath.pathname.startsWith("/guide") && "active"
          )}
          onClick={() => setShowMenu(false)}
        >
          {t("menu.guide")}
        </Link>
        <Link
          href={"/config"}
          className={clsx("nav-link text-center block", asPath.pathname.startsWith("/config") && "active")}
          onClick={() => setShowMenu(false)}
        >
          {t("menu.config")}
        </Link>
        <Link
          href={"/plugin"}
          className={clsx("nav-link text-center block", asPath.pathname.startsWith("/plugin") && "active")}
          onClick={() => setShowMenu(false)}
        >
          {t("menu.plugin")}
        </Link>
        <Link
          href={"/doc/v10"}
          className={clsx("nav-link text-center block", asPath.pathname.startsWith("/doc") && "active")}
          onClick={() => setShowMenu(false)}
        >
          {t("menu.doc")}
        </Link>

        <MobileDropDownMenuItem caption={t("menu.learnmore.caption")} isSubMenu={false}>
          <div className="w-full flex flex-col items-center">
            <Link
              href={"/webmaster/resources"}
              className={clsx("mobile-menu-item w-full hover:text-primary", asPath.pathname.startsWith("/webmaster/resources") && "active")}
              onClick={() => setShowMenu(false)}
            >
              {t("menu.rsc")}
            </Link>
            <Link
              href={"/webmaster/template"}
              className={clsx("mobile-menu-item w-full hover:text-primary", asPath.pathname.startsWith("/webmaster/template") && "active")}
              onClick={() => setShowMenu(false)}
            >
              {t("menu.learnmore.purchase")}
            </Link>
            <Link
              href={"/webmaster/server"}
              className={clsx("mobile-menu-item w-full hover:text-primary", asPath.pathname.startsWith("/webmaster/server") && "active")}
              onClick={() => setShowMenu(false)}
            >
              {t("menu.learnmore.server")}
            </Link>
            <Link
              href={"/webmaster/ads"}
              className={clsx("mobile-menu-item w-full hover:text-primary", asPath.pathname.startsWith("/webmaster/ads") && "active")}
              onClick={() => setShowMenu(false)}
            >
              {t("menu.learnmore.adv")}
            </Link>
            <MobileDropDownMenuItem caption={"API"} isSubMenu={true}>
              <div className="w-full flex flex-col items-center">
                <Link href={"/apis/collect"} className="mobile-menu-item w-full hover:text-primary" onClick={() => setShowMenu(false)}>
                  {t("menu.learnmore.collection")}
                </Link>
                <Link href={"/apis/web-design"} className="mobile-menu-item w-full hover:text-primary" onClick={() => setShowMenu(false)}>
                  {t("menu.learnmore.front-end")}
                </Link>
              </div>
            </MobileDropDownMenuItem>
            <MobileDropDownMenuItem caption={t("menu.learnmore.webmaster")} isSubMenu={true}>
              <div className="w-full flex flex-col items-center">
                <Link href={"/guide/faq"} className="mobile-menu-item w-full hover:text-primary" onClick={() => setShowMenu(false)}>
                  {t("menu.learnmore.faq")}
                </Link>
                <Link href={"/webmaster/glossary"} className="mobile-menu-item w-full hover:text-primary" onClick={() => setShowMenu(false)}>
                  {t("menu.learnmore.ind")}
                </Link>
              </div>
            </MobileDropDownMenuItem>
            <MobileDropDownMenuItem caption={t("menu.learnmore.other")} isSubMenu={true}>
              <div className="w-full flex flex-col items-center">
                <Link href={"/webmaster/migration-guide"} className="mobile-menu-item w-full hover:text-primary" onClick={() => setShowMenu(false)}>
                  {t("menu.learnmore.migrate")}
                </Link>
                <Link href={"/webmaster/transfer"} className="mobile-menu-item w-full hover:text-primary" onClick={() => setShowMenu(false)}>
                  {t("menu.learnmore.transfer")}
                </Link>
              </div>
            </MobileDropDownMenuItem>
          </div>
        </MobileDropDownMenuItem>

        <Link
          href={"/theme"}
          className={clsx("nav-link text-center block", asPath.pathname.startsWith("/theme") && "active")}
          onClick={() => setShowMenu(false)}
        >
          {t("menu.theme")}
        </Link>

        <MobileLangMenu languages={languages} onChangeLocale={onChangeLocale} />

        <Link
          href={"https://github.com/magicblack/maccms10"}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx("nav-link")}
          onClick={() => setShowMenu(false)}
        >
          GitHub
        </Link>

        <Link
          href={"https://t.me/maccms_channel"}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx("nav-link")}
          onClick={() => setShowMenu(false)}
        >
          {t(`menu.telegram`)}
        </Link>
      </div>
    </div >
  );
}

const MobileDropDownMenuItem = ({ caption, children, isSubMenu }) => {
  const [isExpand, setExpand] = useState(false);

  return (
    <>
      <div
        className="w-full flex flex-row items-center justify-center gap-4"
        onClick={() => setExpand(!isExpand)}
      >
        <p className={clsx("block cursor-pointer", isSubMenu && "mobile-menu-item", !isSubMenu && "nav-link")}>
          {caption}
        </p>
        <div
          className={clsx(
            "bg-[url('/images/nav/nav_ic_arrow_unfold.svg')] w-[10px] h-[10px] transition-all duration-200",
            isExpand && "rotate-180"
          )}
        />
      </div>
      <div
        className={clsx("w-full overflow-y-hidden transition-transform duration-300 ease-out", !isExpand && `h-0`, isSubMenu && isExpand && "bg-[#EAEAEA] bg-opacity-25")}>
        <div className={clsx('w-full min-h-[1px] bg-[#EAEAEA]', isSubMenu && "hidden")}/>
        {children}
        <div className={clsx('w-full min-h-[1px] bg-[#EAEAEA]', isSubMenu && "hidden")}/>
      </div>
    </>
  );
};

const MobileLangMenu = ({ onChangeLocale, languages }) => {
  const [isActive, setActive] = useState(false);
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <>
      <div
        className="flex flex-row items-center justify-center gap-4"
        onClick={() => setActive(!isActive)}
      >
        <p className="block cursor-pointer nav-link">{t("menu.lang")}</p>
        <div
          className={clsx(
            "bg-[url('/images/nav/nav_ic_arrow_unfold.svg')] w-[10px] h-[10px] transition-all duration-200",
            isActive && "rotate-180"
          )}
        />
      </div>
      <div
        className={clsx(
          "w-full flex flex-col overflow-y-hidden transition-all duration-100 ease-out h-0",
          isActive && "h-auto"
        )}
      >
        <div className="w-full flex flex-col">
          <div className={clsx('w-full min-h-[1px] bg-[#EAEAEA]', !isActive && "hidden")}/>
          {languages.map((lang, index) => {
            return (
              <div key={index}
                className={clsx("mobile-menu-item", locale == lang.code && "active")}
                onClick={() => onChangeLocale(lang.code)}
              >
                {lang.name}
              </div>
            );
          })}
          <div className={clsx('w-full min-h-[1px] bg-[#EAEAEA]', !isActive && "hidden")}/>
        </div>
      </div>
    </>
  );
};
