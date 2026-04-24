
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const ThemeSidebar = ({ currentElementIndexInViewport }) => {

  const { t } = useTranslation();
  const asPath = useRouter();

  return (
    <div className="w-full">
      <ul className="doc-menu">
        <label className="text-black text-[20px] font-primary">{t("menu.theme")}</label>
        <li
          className={clsx("doc-menu-item group", (asPath.pathname == "/theme" && currentElementIndexInViewport == 0) && "active")}>
          <Link href={`/theme`}>{t("theme.s1")}</Link>
        </li>
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/using-a-theme") && currentElementIndexInViewport == 0) && "active")}>
          <Link href={`/theme/using-a-theme`}>{t("theme.s2")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/using-a-theme") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#安装一个模板`}
              >{t("theme.s17")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#其他`}
              >{t("theme.s18")}</Link>
            </li>
          </>
        }

        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/writing-a-theme") && currentElementIndexInViewport == 0) && "active")}>
          <Link href={`/theme/writing-a-theme`}>{t("theme.s3")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/writing-a-theme") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#使用标签`}
              >{t("theme.s19")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#使用函数`}
              >{t("theme.s20")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#常用处理函数`}
              >{t("theme.s21")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#常用JS处理函数`}
              >{t("theme.s22")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#使用默认值`}
              >{t("theme.s23")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#使用运算符`}
              >{t("theme.s24")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#三元运算`}
              >{t("theme.s25")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 8 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#模板继承`}
              >{t("theme.s26")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 9 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#比较标签`}
              >{t("theme.s27")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 10 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#条件判断`}
              >{t("theme.s28")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 11 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#标签嵌套`}
              >{t("theme.s29")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 12 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#使用PHP`}
              >{t("theme.s30")}</Link>
            </li>

          </>
        }
        <li className={clsx("doc-menu-item group", asPath.pathname.startsWith("/theme/structure") && "active")}>
          <Link href="/theme/structure"
          >{t("theme.s4")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/structure") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#info.ini介绍`}
              >{t("theme.s31")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#模板html目录`}
              >{t("theme.s32")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#包含文件`}
              >{t("theme.s33")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-vod") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-vod"
          >{t("theme.s5")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-vod") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#标签参数`}
              >{t("theme.s34")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#视频字段`}
              >{t("theme.s35")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#常用函数`}
              >{t("theme.s36")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#视频首页`}
              >{t("theme.s37")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#视频分类`}
              >{t("theme.s38")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#视频筛选`}
              >{t("theme.s39")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#视频搜索`}
              >{t("theme.s40")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 8 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#视频详情`}
              >{t("theme.s41")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 9 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#详情常用示例`}
              >{t("theme.s42")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 10 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#视频播放`}
              >{t("theme.s43")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 11 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#iframe播放器`}
              >{t("theme.s44")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 12 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#视频下载`}
              >{t("theme.s45")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 13 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#iframe下载器`}
              >{t("theme.s46")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 14 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#分集剧情`}
              >{t("theme.s47")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 15 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#影片角色`}
              >{t("theme.s48")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 16 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#相关提示`}
              >{t("theme.s49")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-art") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-art">{t("theme.s6")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-art") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#标签参数`}
              >{t("theme.s50")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#字段说明`}
              >{t("theme.s51")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#文章字段`}
              >{t("theme.s52")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#文章首页`}
              >{t("theme.s53")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#文章分类`}
              >{t("theme.s54")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#文章筛选`}
              >{t("theme.s55")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#文章搜索`}
              >{t("theme.s56")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 8 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#文章详情`}
              >{t("theme.s57")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 9 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#相关提示`}
              >{t("theme.s58")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-topic") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-topic">{t("theme.s7")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-topic") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#标签参数`}
              >{t("theme.s59")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#专题字段`}
              >{t("theme.s60")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#专题首页`}
              >{t("theme.s61")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#专题搜索`}
              >{t("theme.s62")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#专题详情`}
              >{t("theme.s63")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-actor") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-actor">{t("theme.s8")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-actor") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#标签参数`}
              >{t("theme.s64")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#字段说明`}
              >{t("theme.s65")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#演员字段`}
              >{t("theme.s66")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#演员首页`}
              >{t("theme.s67")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#演员分类`}
              >{t("theme.s68")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#演员筛选`}
              >{t("theme.s69")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#演员搜索`}
              >{t("theme.s70")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 8 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#演员详情`}
              >{t("theme.s71")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-website") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-website">{t("theme.s9")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-website") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#标签参数`}
              >{t("theme.s72")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#来路排序示例`}
              >{t("theme.s73")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#网址字段`}
              >{t("theme.s74")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#网址首页`}
              >{t("theme.s75")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#网址分类`}
              >{t("theme.s76")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#网址筛选`}
              >{t("theme.s77")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#网址搜索`}
              >{t("theme.s78")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 8 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#网址详情`}
              >{t("theme.s79")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-user") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-user"
          >{t("theme.s10")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-user") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#用户字段`}
              >{t("theme.s80")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#全局调用`}
              >{t("theme.s81")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#用户登录`}
              >{t("theme.s82")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#用户注册`}
              >{t("theme.s83")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#用户中心`}
              >{t("theme.s84")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#修改信息`}
              >{t("theme.s85")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#用户权限`}
              >{t("theme.s86")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 8 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#我的播放`}
              >{t("theme.s87")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 9 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#我的下载`}
              >{t("theme.s88")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 10 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#我的收藏`}
              >{t("theme.s89")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 11 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#在线充值`}
              >{t("theme.s90")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 11 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#支付页面`}
              >{t("theme.s91")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 12 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#微信充值`}
              >{t("theme.s92")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 13 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#订单记录`}
              >{t("theme.s93")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 14 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#卡密记录`}
              >{t("theme.s94")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 15 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#积分记录`}
              >{t("theme.s95")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 16 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#提现记录`}
              >{t("theme.s96")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 17 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#分销记录`}
              >{t("theme.s97")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 18 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#升级会员`}
              >{t("theme.s98")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 19 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#绑定信息`}
              >{t("theme.s99")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 20 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#找回密码`}
              >{t("theme.s100")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 21 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#弹出层`}
              >{t("theme.s101")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 22 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#通用分页`}
              >{t("theme.s102")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-type") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-type"
          >{t("theme.s11")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-type") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#参数`}
              >{t("theme.s103")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#使用示例`}
              >{t("theme.s104")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#分类字段`}
              >{t("theme.s105")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-plot") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-plot"
          >{t("theme.s12")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-plot") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#剧情首页`}
              >{t("theme.s106")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#剧情搜索`}
              >{t("theme.s107")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#剧情详情`}
              >{t("theme.s108")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-role") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-role"
          >{t("theme.s13")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-role") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#标签参数`}
              >{t("theme.s109")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#角色字段`}
              >{t("theme.s110")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#角色首页`}
              >{t("theme.s111")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#角色搜索`}
              >{t("theme.s112")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#角色详情`}
              >{t("theme.s113")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/theme-other") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/theme-other"
          >{t("theme.s14")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/theme-other") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#首页`}
              >{t("theme.s114")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#留言本`}
              >{t("theme.s115")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#评论`}
              >{t("theme.s116")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#自定义`}
              >{t("theme.s117")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#rss模板`}
              >{t("theme.s118")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#map模板`}
              >{t("theme.s119")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#信息提示`}
              >{t("theme.s120")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 8 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#通用分页`}
              >{t("theme.s121")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/tags-global") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/tags-global"
          >{t("theme.s15")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/tags-global") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#网站常用参数`}
              >{t("theme.s122")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#常用tp5标签`}
              >{t("theme.s123")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#网站统计标签`}
              >{t("theme.s124")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#登录状态`}
              >{t("theme.s125")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#友情链接`}
              >{t("theme.s126")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/theme/senior") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/theme/senior"
          >{t("theme.s16")}</Link>
        </li>
        {asPath.pathname.startsWith("/theme/senior") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#自定义PHP`}
              >{t("theme.s127")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#整合插件`}
              >{t("theme.s128")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`#使用模型`}
              >{t("theme.s129")}</Link>
            </li>
          </>
        }
      </ul>
    </div>
  );
}

export default ThemeSidebar;