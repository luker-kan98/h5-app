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

const ConfigLayout = ({
  title,
  mobile_title,
  description,
  noindex,
  canonical,
  children,
  currentElementIndexInViewport
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
            <label className="text-black text-[20px] font-primary">{t("menu.config")}</label>
            <ul className="doc-menu">
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 0 && "active")}>
                <Link href={`/config#伪静配置`}>{t("config.s1")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#rewrite说明`}
                     >{t("config.s2")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#默认路由`}>{t("config.s3")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 3 && "active")}>
                <Link href={`/config#站群配置`}
                     >{t("config.s4-0")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 4 && "active")}>
                <Link href={`/config#邮件发送`}>{t("config.s4")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 5 && "active")}>
                <Link href={`/config#短信发送`}>{t("config.s5")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#申请阿里云短信包`}
                     >{t("config.s6")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#申请腾讯云短信包`}
                     >{t("config.s7")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 8 && "active")}>
                <Link href={`/config#视频试看配置`}
                     >{t("config.s8")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 9 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#游客开启试看1分钟`}
                     >{t("config.s9")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 10 && "active")}>
                <Link href={`/config#三级分销配置`}
                     >{t("config.s10")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 11 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#如何有效关联`}
                     >{t("config.s11")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 12 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#积分奖励比例计算公式`}
                     >{t("config.s12")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 13 && "active")}>
                <Link href={`/config#第三方登录`}
                     >{t("config.s13")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 14 && "active")}>
                <Link href={`/config#对接微信公众号`}
                     >{t("config.s14")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 15 && "active")}>
                <Link href={`/config#定时任务`}
                     >{t("config.s15")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 16 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#1，采集资源`}
                     >{t("config.s16")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 17 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#2，生成静态`}
                     >{t("config.s17")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 18 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#3，采集规则`}
                     >{t("config.s18")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 19 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#4，清理缓存`}
                     >{t("config.s19")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 20 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#5，网址推送`}
                     >{t("config.s20")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 21 && "active")}>
                <Link href={`/config#采集配置`}
                     >{t("config.s21")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 22 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#对接资源站`}
                     >{t("config.s22")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 23 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#对接资源站`}
                     >{t("config.s23")}</Link>
              </li>
              <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 24 && "active")}>
                <div className="marker group-hover:border-primary"/>
                <Link href={`/config#对接python爬虫`}
                     >{t("config.s24")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 25 && "active")}>
                <Link href={`/config#添加播放器`}
                     >{t("config.s25")}</Link>
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

export default ConfigLayout;
