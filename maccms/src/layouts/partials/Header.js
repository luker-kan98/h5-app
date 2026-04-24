import Logo from "../components/Logo";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import useLocale from "@/hooks/useLocale";
import { useTranslation } from 'react-i18next';
import MobileMenu from "../components/nav/MobileMenu";
import DesktopMenu from "../components/nav/DesktopMenu";

const Header = () => {
  const { locale, setLocale } = useLocale();
  const { main, home, language, languages } = menu;
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const [showMenu, setShowMenu] = useState(false);
  const [sticky, setSticky] = useState(false);
  const headerRef = useRef(null);
  const [direction, setDirection] = useState(null);

  const asPath = useRouter();

  /// i18n
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  //sticky header
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const onScroll = () => {
      const scrollY = window.scrollY;
      scrollY > 0 ? setSticky(true) : setSticky(false);
    }

    if (typeof window !== "undefined") window.addEventListener("scroll", onScroll);

  }, [showMenu]);

  // logo source
  const { logo } = config.site;

  return (
    <>
      <header
        className={clsx("header", (showMenu || sticky) && "header-sticky", !showMenu && direction === 1 && "unpinned")}
        ref={headerRef}
      >
        <nav className={clsx("navbar nav-container")}>
          {/* logo */}
          <div className="order-0" onClick={() => setShowMenu(false)}>
            <Logo src={logo} lang={locale} />
          </div>

          {/* Desktop menu */}
          <DesktopMenu />
          
          <div className="flex items-center order-1 md:ml-0">
            {/* navbar toggler */}
            {showMenu ? (
              <button
                className="-mr-3 md:hidden"
                onClick={() => setShowMenu(!showMenu)}
              >
                <svg width="48px" height="48px" viewBox="0 0 88 88" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <title>Close</title>
                  <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="导航" transform="translate(-657.000000, -94.000000)">
                      <g id="Navigation-Bar" transform="translate(-0.000000, 88.000000)">
                        <g id="home_menu" transform="translate(657.000000, 6.000000)">
                          <rect id="矩形" fill="#EAEAEA" opacity="0" x="0" y="0" width="88" height="88"></rect>
                          <path d="M47,23 L47,41 L65,41 L65,45 L47,45 L47,63 L43,63 L43,45 L25,45 L25,41 L43,41 L43,23 L47,23 Z" id="形状结合" fill="#05031A" transform="translate(45.000000, 43.000000) rotate(-225.000000) translate(-45.000000, -43.000000) "></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            ) : (
              <button
                className="-mr-3 text-dark md:hidden"
                onClick={() => setShowMenu(!showMenu)}
              >
                <svg
                  width="48px"
                  height="48px"
                  viewBox="0 0 88 88"
                  version="1.1"
                >
                  <title>Home</title>
                  <g
                    id="页面-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="$avav_h5"
                      transform="translate(-657.000000, -94.000000)"
                    >
                      <g
                        id="Navigation-Bar"
                        transform="translate(0.000000, 88.000000)"
                      >
                        <g
                          id="home_menu"
                          transform="translate(657.000000, 6.000000)"
                        >
                          <rect
                            id="矩形"
                            fill="#EAEAEA"
                            opacity="0"
                            x="0"
                            y="0"
                            width="88"
                            height="88"
                          ></rect>
                          <path
                            d="M63,55 L63,59 L25,59 L25,55 L63,55 Z M63,42 L63,46 L25,46 L25,42 L63,42 Z M63,29 L63,33 L25,33 L25,29 L63,29 Z"
                            id="ic"
                            fill="#000000"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            )}
            {/* /navbar toggler */}
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={clsx(
          "mobile-menu-wrapper",
          showMenu && "right-0",
          !showMenu && "-right-[100vw]"
        )}
      >
        <MobileMenu setShowMenu={setShowMenu} />
      </div>
    </>
  );
};

export default Header;
