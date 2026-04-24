import clsx from "clsx";
import Link from "next/link";
import config from "@/config/config.json";
import { plainify } from "@/lib/utils/textConverter";
import Head from "next/head";
import { useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import HeaderWithSubMenu from "../partials/HeaderSubMenu";
import Footer from "../partials/Footer";

import "react-medium-image-zoom/dist/styles.css";

const ThemeLayout = ({
  title,
  mobile_title,
  description,
  noindex,
  canonical,
  children,
}) => {
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url } = config.site;
  const main = useRef();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Head>
        {/* title */}
        <title>
          {plainify(
            title ? title : config.site.title
          )}
        </title>

        {/* canonical url */}
        {canonical && <link rel="canonical" href={canonical} itemProp="url" />}

        {/* noindex robots */}
        {noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* meta-description */}
        <meta
          name="description"
          content={plainify(description ? description : meta_description)}
        />

        {/* og-title */}
        <meta
          property="og:title"
          content={plainify(
            title ? title : config.site.title
          )}
        />

        {/* og-description */}
        <meta
          property="og:description"
          content={plainify(description ? description : meta_description)}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${base_url}${router.asPath.replace("/", "")}`}
        />

        {/* twitter-title */}
        <meta
          name="twitter:title"
          content={plainify(
            title ? title : config.site.title
          )}
        />

        {/* twitter-description */}
        <meta
          name="twitter:description"
          content={plainify(description ? description : meta_description)}
        />

        {/* og-image */}
        <meta property="og:image" content={`${base_url}${meta_image}`} />

        {/* twitter-image */}
        <meta
          name="twitter:image"
          content={`${base_url}twitter-image.png`}
        />
        <meta
          property="twitter:image"
          content={`${base_url}twitter-image.png`}
        />

        <meta name="twitter:image:type" content="image/png" />
        <meta name="twitter:image:width" content="144" />
        <meta name="twitter:image:height" content="144" />
        <meta property="twitter:image:alt" content="MacCMS" />
        <meta name="twitter:card" content="summary" />

        {/* author from config.json */}
        <meta name="author" content={meta_author} />
      </Head>
      <HeaderWithSubMenu mobile_title={mobile_title}>
        <div
          className="container flex justify-center pt-[70px] pb-[40px]"
          id="mobile-menu"
        >
          <div className="w-full flex flex-col items-start gap-[10px]">
            <label className="text-black text-[20px] font-primary">{t("menu.theme")}</label>
            <ul className="doc-menu">

              <li className={clsx("doc-menu-item group", router.pathname == "/theme" && "active")}>
                <Link href={`/theme`}>{t("theme.s1")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/using-a-theme") && "active")}>
                <Link href={`/theme/using-a-theme`}
                     >{t("theme.s2")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/writing-a-theme") && "active")}>
                <Link href={`/theme/writing-a-theme`}
                     >{t("theme.s3")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/structure") && "active")}>
                <Link href={`/theme/structure`}
                     >{t("theme.s4")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-vod") && "active")}>
                <Link href={`/theme/theme-vod`}
                     >{t("theme.s5")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-art") && "active")}>
                <Link href={`/theme/theme-art`}
                     >{t("theme.s6")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-topic") && "active")}>
                <Link href={`/theme/theme-topic`}
                     >{t("theme.s7")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-actor") && "active")}>
                <Link href={`/theme/theme-actor`}
                     >{t("theme.s8")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-website") && "active")}>
                <Link href={`/theme/theme-website`}
                     >{t("theme.s9")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-user") && "active")}>
                <Link href={`/theme/theme-user`}
                     >{t("theme.s10")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-type") && "active")}>
                <Link href={`/theme/theme-type`}
                     >{t("theme.s11")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-plot") && "active")}>
                <Link href={`/theme/theme-plot`}
                     >{t("theme.s12")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-role") && "active")}>
                <Link href={`/theme/theme-role`}
                     >{t("theme.s13")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-other") && "active")}>
                <Link href={`/theme/theme-other`}
                     >{t("theme.s14")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/theme-global") && "active")}>
                <Link href={`/theme/theme-global`}
                     >{t("theme.s15")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/theme/senior") && "active")}>
                <Link href={`/theme/senior`}
                     >{t("theme.s16")}</Link>
              </li>

            </ul>
          </div>
        </div>
      </HeaderWithSubMenu>
      {/* main site */}
      <main className="min-h-[calc(100vh-250px)] pt-[50px] md:pt-[60px]" ref={main}>
        {/* Global background */}
        <div
            className="absolute -z-50 top-0 right-0 w-full aspect-[0.4618] md:aspect-[1.7778] bg-no-repeat bg-contain bg-[url('/images/background/bg.png')] md:bg-[url('/images/background/bg-md.png')]"></div>
        {children}
      </main>
      <Footer/>
    </>
  );
};

export default ThemeLayout;
