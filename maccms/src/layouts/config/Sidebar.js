
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const Sidebar = ({ currentElementIndexInViewport }) => {

  const { t } = useTranslation();
  const asPath = useRouter();

  return (
    <div className="w-full">
      <ul className="doc-menu">
        <label className="text-black text-[20px] font-primary">{t("menu.config")}</label>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 0 && "active")}>
          <Link href={`/config#伪静配置`}>{t("config.s1")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#rewrite说明`}>{t("config.s2")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#默认路由`}>{t("config.s3")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 3 && "active")}>
          <Link href={`/config#站群配置`}>{t("config.s4-0")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 4 && "active")}>
          <Link href={`/config#邮件发送`}>{t("config.s4")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 5 && "active")}>
          <Link href={`/config#短信发送`}>{t("config.s5")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#申请阿里云短信包`}>{t("config.s6")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#申请腾讯云短信包`}>{t("config.s7")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 8 && "active")}>
          <Link href={`/config#视频试看配置`}>{t("config.s8")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 9 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#游客开启试看1分钟`}>{t("config.s9")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 10 && "active")}>
          <Link href={`/config#三级分销配置`}>{t("config.s10")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 11 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#如何有效关联`}>{t("config.s11")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 12 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#积分奖励比例计算公式`}>{t("config.s12")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 13 && "active")}>
          <Link href={`/config#第三方登录`}>{t("config.s13")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 14 && "active")}>
          <Link href={`/config#对接微信公众号`}>{t("config.s14")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 15 && "active")}>
          <Link href={`/config#定时任务`}>{t("config.s15")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 16 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#1，采集资源`}>{t("config.s16")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 17 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#2，生成静态`}>{t("config.s17")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 18 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#3，采集规则`}>{t("config.s18")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 19 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#4，清理缓存`}>{t("config.s19")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 20 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#5，网址推送`}>{t("config.s20")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 21 && "active")}>
          <Link href={`/config#采集配置`}>{t("config.s21")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 22 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#对接资源站`}>{t("config.s22")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 23 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#对接资源站`}>{t("config.s23")}</Link>
        </li>
        <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 24 && "active")}>
          <div className="marker group-hover:border-primary"/>
          <Link href={`/config#对接python爬虫`}>{t("config.s24")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 25 && "active")}>
          <Link href={`/config#添加播放器`}>{t("config.s25")}</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;