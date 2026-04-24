import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import GuideLayout from "@/layouts/guide/GuideLayout";
import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import Zoom from "react-medium-image-zoom";
import Sidebar from "@/layouts/guide/Sidebar";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  

  return (
    <GuideLayout title={`${t('guide.s6')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div id={t("guide.s6")} ref={sectionRefs[0]} className="w-full">
                  <h2>{t("guide.s6")}</h2>
                  {markdownify(t("guide.s65"), "p", "font-primary text-black text-[16px]")}
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{`  │─application //应用目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─admin //后台模块`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─api //api模块`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─common //公共模块`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─extra //配置文件`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─index //前台模块`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─install //安装模块`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─lang //语言包`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─database.php //数据库配置文件`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─config.php //tp5应用配置文件`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─route.php //伪静态路配置文件 `}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─common.php //伪静态路配置文件`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─addons  //插件目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─extend  //扩展目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─runtime //缓存目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─static //静态文件目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─template //前台模板目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─thinkphp //tp目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─upload //附件目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─vendor //第三发库目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  └─index.php //入口文件`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  └─api.php //api入口文件`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  └─admin.php //后台入口文件`}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                      </li>
                    </ul>
                  </div>
                  <div className="warning">
                    <span className="title">{t("guide.s62")}</span>
                    <p className="message">{t("guide.s66")}</p>
                  </div>
                  <div className="mt-[30px] w-full flex flex-col gap-3">
                    <span><r>{'application '}</r>{t("guide.s67")}</span>
                    <span><r>{'application/extra/maccms.php '}</r>{t("guide.s68")}</span>
                    <span><r>{'application/extra/addons.php '}</r>{t("guide.s69")}</span>
                    <span><r>{'application/extra/domain.php '}</r>{t("guide.s70")}</span>
                    <span><r>{'application/extra/timming.php '}</r>{t("guide.s71")}</span>
                    <span><r>{'application/extra/vodplayer.php '}</r>{t("guide.s72")}</span>
                    <span><r>{'application/extra/voddowner.php '}</r>{t("guide.s73")}</span>
                    <span><r>{'application/data/backup '}</r>{t("guide.s74")}</span>
                    <span><r>{'application/data/config '}</r>{t("guide.s75")}</span>
                    <span><r>{'application/data/install '}</r>{t("guide.s76")}</span>
                    <span><r>{'application/route.php '}</r>{t("guide.s77")}</span>
                    <span><r>{'application/database.php '}</r>{t("guide.s78")}</span>
                    <span><r>{'addons '}</r>{t("guide.s79")}</span>
                    <span><r>{'plugin '}</r>{t("guide.s80")}</span>
                    <span><r>{'static '}</r>{t("guide.s81")}</span>
                  </div>
                  <div className="info">
                    <span className="title">{t("guide.s82")}</span>
                    <p className="message">{t("guide.s83")}</p>
                    <ul className="message">
                      <li>{t("guide.s84")}</li>
                      <li>{t("guide.s85")}</li>
                      <li>{t("guide.s86")}</li>
                      <li>{t("guide.s87")}</li>
                      <li>{t("guide.s88")}</li>
                      <li>{t("guide.s89")}</li>
                    </ul>
                  </div>
                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide/getting-started" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{t("guide.s5")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]" />
                  <Link href="/guide/basic-config" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s7")}</span>
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20} />
                  </Link>
                </div>
                {/* End of Page */}
              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </GuideLayout>
  );
}