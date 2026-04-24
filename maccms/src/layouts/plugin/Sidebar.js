
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
        <label className="text-black text-[20px] font-primary">{t("menu.plugin")}</label>
        <li
          className={clsx("doc-menu-item group", (asPath.pathname == "/plugin" && currentElementIndexInViewport == 0) && "active")}>
          <Link href={`/plugin`}>{t("plugin.s1")}</Link>
        </li>
        {asPath.pathname == "/plugin" &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin#后端扩展插件`}
              >{t("plugin.s2")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin#播放器插件`}
              >{t("plugin.s3")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/plugin/plugin-dir") && currentElementIndexInViewport == 0) && "active")}>
          <Link href={`/plugin/plugin-dir`}>{t("plugin.s4")}</Link>
        </li>
        {asPath.pathname.startsWith("/plugin/plugin-dir") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-dir#文件结构`}
              >{t("plugin.s5")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-dir#info.ini介绍`}
              >{t("plugin.s6")}</Link>
            </li>
          </>
        }

        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/plugin/plugin-writing") && currentElementIndexInViewport == 0) && "active")}>
          <Link href={`/plugin/plugin-writing`}>{t("plugin.s7")}</Link>
        </li>
        {asPath.pathname.startsWith("/plugin/plugin-writing") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-writing#创建插件`}
              >{t("plugin.s8")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-writing#创建插件配置文件`}
              >{t("plugin.s9")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-writing#创建钩子模板文件`}
              >{t("plugin.s10")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-writing#行为事件`}
              >{t("plugin.s11")}</Link>
            </li>
          </>
        }
        <li className={clsx("doc-menu-item group", asPath.pathname.startsWith("/plugin/plugin-model") && "active")}>
          <Link href="/plugin/plugin-model"
          >{t("plugin.s12")}</Link>
        </li>
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/plugin/plugin-controller") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/plugin/plugin-controller"
          >{t("plugin.s13")}</Link>
        </li>
        {asPath.pathname.startsWith("/plugin/plugin-controller") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-controller#基类不同`}
              >{t("plugin.s14")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-controller#请求URL不同`}
              >{t("plugin.s15")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-controller#当使用层级控制器时`}
              >{t("plugin.s16")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-controller#控制器定义`}
              >{t("plugin.s17")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-controller#控制器请求`}
              >{t("plugin.s18")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-controller#基类控制器`}
              >{t("plugin.s19")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-controller#基类属性`}
              >{t("plugin.s20")}</Link>
            </li>
          </>
        }
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/plugin/plugin-extend") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/plugin/plugin-extend">{t("plugin.s21")}</Link>
        </li>
        {asPath.pathname.startsWith("/plugin/plugin-extend") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-extend#重要位置1`}
              >{t("plugin.s22")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-extend#重要位置2`}
              >{t("plugin.s23")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-extend#第三方类库`}
              >{t("plugin.s24")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-extend#常见问题`}
              >{t("plugin.s25")}</Link>
            </li>
          </>
        }

        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/plugin/plugin-function") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/plugin/plugin-function">{t("plugin.s26")}</Link>
        </li>
        {asPath.pathname.startsWith("/plugin/plugin-function") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-function#addon_url`}
              >{`addon_url`}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-function#getaddonlist`}
              >getaddonlist</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-function#get_addon_info`}
              >get_addon_info</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-function#get_addon_fullconfig`}
              >get_addon_fullconfig</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-function#get_addon_config`}
              >get_addon_config</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-function#get_addon_instance`}
              >get_addon_instance</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 7 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-function#set_addon_info`}
              >set_addon_info</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 8 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-function#set_addon_config`}
              >set_addon_config</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 9 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-function#set_addon_fullconfig`}
              >set_addon_fullconfig</Link>
            </li>
          </>
        }

        <p className="mt-5 mb-0 text-black text-[20px] font-primary">{t("plugin.s27")}</p>
        <li
          className={clsx("doc-menu-item group", (asPath.pathname.startsWith("/plugin/plugin-ppvod-maccms") && currentElementIndexInViewport == 0) && "active")}>
          <Link href="/plugin/plugin-ppvod-maccms"
          >{t("plugin.s28")}</Link>
        </li>
        {asPath.pathname.startsWith("/plugin/plugin-ppvod-maccms") &&
          <>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 1 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-ppvod-maccms#介绍`}
              >{t("plugin.s29")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 2 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-ppvod-maccms#安装教程`}
              >{t("plugin.s30")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 3 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-ppvod-maccms#播放器配置`}
              >{t("plugin.s31")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 4 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-ppvod-maccms#自动推送`}
              >{t("plugin.s32")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 5 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-ppvod-maccms#常见问题`}
              >{t("plugin.s33")}</Link>
            </li>
            <li className={clsx("doc-menu-subitem group", currentElementIndexInViewport == 6 && "active")}>
              <div className="marker group-hover:border-primary"/>
              <Link href={`/plugin/plugin-ppvod-maccms#更新记录`}
              >{t("plugin.s34")}</Link>
            </li>
          </>
        }
      </ul>
    </div>
  );
}

export default Sidebar;