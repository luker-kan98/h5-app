
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const ApiSidebar = ({ currentElementIndexInViewport }) => {

  const { t } = useTranslation();
  const asPath = useRouter();

  return (
    <div className="w-full">
      <ul className="doc-menu">
        <label className="text-black text-[20px] font-primary">API</label>
        <li
          className={clsx("doc-menu-item group", (asPath.pathname == "/apis/collect" && currentElementIndexInViewport == 0) && "active")}>
          <Link href={`/apis/collect`} className="group-hover:text-primary text-[16px]">{t("apis.clt.s2")}</Link>
        </li>
        {asPath.pathname.startsWith("/apis/collect") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 0 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={``}
                    className="group-hover:text-primary text-[16px]">{t("apis.clt.s3")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#下载模块`}
                    className="group-hover:text-primary text-[16px]">{t("apis.clt.s4")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#开放资源api`}
                    className="group-hover:text-primary text-[16px]">{t("apis.clt.s5")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/apis/web-design") && currentElementIndexInViewport == 0) && "active")}>
          <Link href={`/apis/web-design`} className="group-hover:text-primary text-[16px]">{t("apis.wd.s1")}</Link>
        </li>
        {asPath.pathname.startsWith("/apis/web-design") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#数据接口`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s2")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#搜素联想`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s3")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#顶踩接口`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s4")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#记录接口`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s5")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#点击量提交`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s6")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#来路统计`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s7")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#评论接口`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s8")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 8 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#留言本接口`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s9")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 9 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#定时任务`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s10")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 10 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#后台事件`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s11")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 11 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#生成二维码`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s12")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 12 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#生成短网址`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s13")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 13 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#用户接口`}
                    className="group-hover:text-primary text-[16px]">{t("apis.wd.s14")}</Link>
            </li>

          </>
        }
      </ul>
    </div>
  );
}

export default ApiSidebar;