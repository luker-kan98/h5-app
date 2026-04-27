import menu from "@/config/menu.json";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import useLocale from "@/hooks/useLocale";
import { useTranslation } from 'react-i18next';
import useOutsideAlerter from "@/hooks/useOutsideAlterter";
import { SearchUrl } from "@/utils/search";

function ExternalLinkIcon({ className }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 6.5V10a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1H6M8.5 1.5H10.5V3.5M5.5 6.5L10.5 1.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DesktopMenu() {
  const { locale, setLocale } = useLocale();
  const { languages } = menu;
  const { t } = useTranslation();
  const asPath = useRouter();
  const [searchActive, setSearchActive] = useState(false);
  const navSearchBarRef = useRef();
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useOutsideAlerter(navSearchBarRef, setSearchActive);
  const onChangeLocale = (l) => {
    setLocale(l);
  };

  useEffect(() => {
    if (!searchActive) setSearchText('');
  }, [searchActive]);

  useEffect(() => {
    if (searchText !== "") {
      setSearchResult(null);
      var rslt = SearchUrl(searchText);
      if (rslt.length > 0) setSearchResult(rslt);
    }
  }, [searchText]);

  return (
    <ul className="menu-items min-w-0 justify-end">
      <li>
        <Link
          href={"/h5-package"}
          className={clsx(
            "menu-item",
            asPath.pathname.startsWith("/h5-package") && "active"
          )}
        >
          {t(`menu.apppack`)}
        </Link>
      </li>
      <div className="nav-splitter self-center" />
      <li>
        <Link
          href={"/guide"}
          className={clsx(
            "menu-item",
            asPath.pathname.startsWith("/guide") && "active"
          )}
        >
          {t(`menu.guide`)}
        </Link>
      </li>
      <div className="nav-splitter self-center" />
      <li>
        <Link
          href={"/config"}
          className={clsx(
            "menu-item",
            asPath.pathname.startsWith("/config") && "active"
          )}
        >
          {t(`menu.config`)}
        </Link>
      </li>
      <div className="nav-splitter self-center" />
      <li>
        <Link
          href={"/plugin"}
          className={clsx(
            "menu-item",
            asPath.pathname.startsWith("/plugin") && "active"
          )}
        >
          {t(`menu.plugin`)}
        </Link>
      </li>
      <div className="nav-splitter self-center" />
      <li>
        <Link
          href={"/doc/v10"}
          className={clsx(
            "menu-item",
            asPath.pathname.startsWith("/doc") && "active"
          )}
        >
          {t(`menu.doc`)}
        </Link>
      </li>
      <div className="nav-splitter self-center" />
      <li className="dropdown">
        <div className="flex flex-row items-center justify-center px-2 lg:px-3 cursor-pointer menu-item gap-x-1 group border-border">
          {t("menu.learnmore.caption")}
          <div className="menu-item-arrow" />
          <ul className="dropdown-menu z-[100]">
            <li>
              <Link
                href={"/webmaster/resources"}
                className={clsx(
                  "menu-item",
                  asPath.pathname.startsWith("/webmaster/resources") && "active"
                )}
              >
                {t(`menu.rsc`)}
              </Link>
            </li>
            <li>
              <Link
                href={"/webmaster/template"}
                className={clsx(
                  "menu-item",
                  asPath.pathname.startsWith("/webmaster/template") && "active"
                )}
              >
                {t(`menu.learnmore.purchase`)}
              </Link>
            </li>
            <li>
              <Link
                href={"/webmaster/server"}
                className={clsx(
                  "menu-item",
                  asPath.pathname.startsWith("/webmaster/server") && "active"
                )}
              >
                {t(`menu.learnmore.server`)}
              </Link>
            </li>
            <li>
              <Link
                href={"/webmaster/ads"}
                className={clsx(
                  "menu-item",
                  asPath.pathname.startsWith("/webmaster/ads") && "active"
                )}
              >
                {t(`menu.learnmore.adv`)}
              </Link>
            </li>
            <li className='dropdown dropdown-right'>
              <p className={'menu-item expand-btn'}>API</p>
              <ul className="menu-right">
                <li className="menu-item group">
                  <Link href={"/apis/collect"}
                    className="w-full group-hover: text-primary">{t("menu.learnmore.collection")}</Link>
                </li>
                <li className="menu-item group">
                  <Link href={"/apis/web-design"}
                    className="w-full group-hover: text-primary">{t("menu.learnmore.front-end")}</Link>
                </li>
              </ul>
            </li>
            <li className='dropdown dropdown-right'>
              <p className={'menu-item expand-btn'}>{t("menu.learnmore.webmaster")}</p>
              <ul className="menu-right">
                <li className="menu-item group">
                  <Link href={"/guide/faq"}
                    className="w-full group-hover: text-primary">{t("menu.learnmore.faq")}</Link>
                </li>
                <li className="menu-item group">
                  <Link href={"/webmaster/glossary"}
                    className="w-full group-hover: text-primary">{t("menu.learnmore.ind")}</Link>
                </li>
              </ul>
            </li>
            <li className='dropdown dropdown-right'>
              <p className={'menu-item expand-btn'}>{t("menu.learnmore.other")}</p>
              <ul className='menu-right'>
                <li className="menu-item group">
                  <Link href={"/webmaster/migration-guide"}
                    className="w-full group-hover: text-primary">{t("menu.learnmore.migrate")}</Link>
                </li>
                <li className="menu-item group">
                  <Link href={"/webmaster/transfer"}
                    className="w-full group-hover: text-primary">{t("menu.learnmore.transfer")}</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </li>
      <div className="nav-splitter self-center" />
      <li>
        <Link
          href={"/theme"}
          className={clsx(
            "menu-item",
            asPath.pathname.startsWith("/theme") && "active"
          )}
        >
          {t(`menu.theme`)}
        </Link>
      </li>
      <div className="nav-splitter self-center" />
      <li className="dropdown">
        <div className="relative flex flex-row items-center justify-center gap-x-0.5 px-1.5 md:px-2 cursor-pointer menu-item group border-border">
          {t("menu.lang")}
          <div className="menu-item-arrow" />
          <ul className="dropdown-menu z-[100]">
            {languages.map((lang, index) =>
              <li key={index}
                className={clsx("menu-item", locale == lang.code && "active")}
                onClick={() => onChangeLocale(lang.code)}
              >
                {lang.name}
              </li>
            )}
          </ul>
        </div>
      </li>
      <div className="nav-splitter self-center" />
      <li>
        <Link
          href={"https://github.com/magicblack/maccms10"}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx("menu-item gap-1.5")}
        >
          GitHub
          <ExternalLinkIcon className="opacity-70 shrink-0" />
        </Link>
      </li>
      <div className="nav-splitter self-center" />
      <li>
        <Link
          href={"https://t.me/maccms_channel"}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx("menu-item")}
        >
          {t(`menu.telegram`)}
        </Link>
      </li>
      <div className="nav-splitter self-center" />
      <li ref={navSearchBarRef} className="relative shrink-0 pl-1 md:pl-2" onClick={() => setSearchActive(true)}>
        <div
          className={clsx("z-40 flex flex-row items-center h-9 px-2 border-2 border-[#E6ECEA] bg-white/80 rounded-full transition-all duration-200", !searchActive && "min-w-[36px] justify-center", searchActive && "min-w-[200px] max-w-[min(320px,calc(100vw-4rem))]")}>
          <Image alt={t("menu.search")} src="/images/icons/ic_search.png" width={16} height={16} className="shrink-0 opacity-80" />
          <input value={searchText} onChange={(e) => setSearchText(e.target.value)}
            className={clsx("grow nav-search min-w-0 transition-all duration-200", !searchActive && "w-0 p-0 opacity-0")}
            type="search" />
        </div>
        {searchActive && searchResult &&
          <div
            className={clsx("absolute w-[min(100vw-2rem,350px)] max-h-[200px] right-0 top-[calc(100%+6px)] px-4 py-3 bg-white shadow1 border rounded-[10px] overflow-x-hidden overflow-y-auto flex flex-col gap-2 z-[100]")}>
            {searchResult.map((item, index) =>
              <div key={index} className="w-full flex flex-col">
                <Link href={item.url} className="text-text hover:text-primary">{item[locale]}</Link>
              </div>
            )}
          </div>
        }
      </li>
    </ul>
  );
}
