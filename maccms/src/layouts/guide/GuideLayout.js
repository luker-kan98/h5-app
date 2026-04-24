import clsx from "clsx";
import Link from "next/link";
import config from "@/config/config.json";
import { plainify } from "@/lib/utils/textConverter";
import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import HeaderWithSubMenu from "../partials/HeaderSubMenu";
import Footer from "../partials/Footer";

import "react-medium-image-zoom/dist/styles.css";

const GuideLayout = ({
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
            <label className="text-black text-[20px] font-primary">{t("menu.guide")}</label>
            <ul className="doc-menu">
              <li className={clsx("doc-menu-item group", router.pathname == "/guide" && "active")}>
                <Link href={`/guide`}>{`MacCMS V10.x`}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/guide/getting-started") && "active")}>
                <Link href={`/guide/getting-started`}>{t("guide.s5")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/guide/directory-structure") && "active")}>
                <Link href="/guide/directory-structure">{t("guide.s6")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/guide/basic-config") && "active")}>
                <Link href="/guide/basic-config">{t("guide.s7")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/guide/assets") && "active")}>
                <Link href="/guide/assets">{t("guide.s8")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/guide/lang") && "active")}>
                <Link href="/guide/lang">{t("guide.s9")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/guide/update-log") && "active")}>
                <Link href="/guide/update-log">{t("guide.s10")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/guide/often-sql") && "active")}>
                <Link href="/guide/often-sql">{t("guide.s11")}</Link>
              </li>
              <label className="mt-8 text-black text-[20px] font-primary block">{t("guide.s12")}</label>
              <li className={clsx("doc-menu-item group", (router.pathname.startsWith("/guide/help") || router.pathname.startsWith("/guide/faq")) && "active")}>
                <Link href="/guide/help">{t("guide.s13")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.startsWith("/guide/security") && "active")}>
                <Link href="/guide/security">{t("guide.s14")}</Link>
              </li>
              {/*<li className={clsx("doc-menu-item group", router.pathname.startsWith("/guide/coffee") && "active")}>*/}
              {/*  <Link href="/guide/coffee">{t("guide.s15")}</Link>*/}
              {/*</li>*/}
            </ul>
          </div>
        </div>
      </HeaderWithSubMenu>
      {/* main site */}
      <main className="min-h-[calc(100vh-250px)] pt-[50px] md:pt-[60px]" ref={main}>
        {/* Global background */}
        <div className="absolute -z-50 top-0 right-0 w-full aspect-[0.4618] md:aspect-[1.7778] bg-no-repeat bg-contain bg-[url('/images/background/bg.png')] md:bg-[url('/images/background/bg-md.png')]"></div>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default GuideLayout;
