import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import GuideLayout from "@/layouts/guide/GuideLayout";
import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
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
    <GuideLayout title={`MacCMS V10.x | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div id="maccms-v10-x" ref={sectionRefs[0]} className="w-full">
                  <h2>MacCMS V10.x</h2>
                  <div className="flex flex-wrap w-full gap-3 md:gap-6 font-primary">
                    <div className="flex flex-row items-center gap-[6px] rounded-full bg-lightGray">
                      <div
                        className="h-full px-[10px] flex items-center justify-center bg-[#7286EF] text-white rounded-full">issues
                      </div>
                      <span className="pr-[10px]">37 open</span>
                    </div>
                    <div className="flex flex-row items-center gap-[6px] rounded-full bg-lightGray">
                      <div
                        className="h-full px-[10px] flex items-center justify-center bg-primary text-white rounded-full">forks
                      </div>
                      <span className="pr-[10px]">745</span>
                    </div>
                    <div className="flex flex-row items-center gap-[6px] rounded-full bg-lightGray">
                      <div
                        className="h-full px-[10px] flex items-center justify-center bg-[#51A4F3] text-white rounded-full">stars
                      </div>
                      <span className="pr-[10px]">2.1k</span>
                    </div>
                    <div className="flex flex-row items-center gap-[6px] rounded-full bg-lightGray">
                      <div
                        className="h-full px-[10px] flex items-center justify-center bg-[#F3C115] text-white rounded-full">php
                      </div>
                      <span className="pr-[10px]">{`>=5.6x`}</span>
                    </div>
                    <div className="flex flex-row items-center gap-[6px] rounded-full bg-lightGray">
                      <div
                        className="h-full px-[10px] flex items-center justify-center bg-[#7286EF] text-white rounded-full">MySQL
                      </div>
                      <span className="pr-[10px]">{`>=5.5x`}</span>
                    </div>
                  </div>
                  <div className="mt-[30px] mb-[30px] w-ful flex flex-wrap items-center gap-x-[24px] gap-y-[12px]">
                    <Link href="https://cdn.jsdelivr.net/gh/magicblack/maccms_down/" target="_blank"
                          className="link">{t("guide.s16")}</Link>
                    <Link href="https://www.maccms.la/" target="_blank" className="link">{t("guide.s17")}</Link>
                    <Link href="https://t.me/maccms_channel" target="_blank" className="link">{t("guide.s18")}</Link>
                    <Link href="http://www.datll.com/" target="_blank" className="link">{t("guide.s19")}</Link>
                    <Link href="https://github.com/magicblack/maccms10" target="_blank"
                          className="link">{`Github`}</Link>
                  </div>
                  <div className="info">
                    <span className="title">{t("guide.s20")}</span>
                    {markdownify(t("guide.s21"), "p", "message")}
                  </div>
                </div>

                <div id={t("guide.s2")} ref={sectionRefs[1]} className="w-full mt-[16px]">
                  <h3>{t("guide.s2")}</h3>
                  {markdownify(t("guide.s22"), "p", "")}
                </div>

                <div id={t("guide.s3")} ref={sectionRefs[2]} className="w-full">
                  <h3>{t("guide.s3")}</h3>
                  {markdownify(t("guide.s23"), "p", "")}
                </div>

                <div id={t("guide.s4")} ref={sectionRefs[3]} className="w-full">
                  <h3>{t("guide.s4")}</h3>
                  <div className="flex flex-col items-start gap-[12px] md:gap-[14px]">
                    <Link href="/guide/getting-started#添加网站" className="link">- {t("guide.s16")}</Link>
                    <Link href="/guide/getting-started#进入安装步骤" className="link">- {t("guide.s24")}</Link>
                    <Link href="/guide/update-log" className="link">- {t("guide.s25")}</Link>
                    <span className="pl-4">...</span>
                  </div>
                </div>

                <div id={t("guide.s31")} ref={sectionRefs[3]} className="w-full">
                  <h3>{t("guide.s31")}</h3>
                  <div className="flex flex-col items-start gap-[12px] md:gap-[14px]">
                    <Link href="/config#积分奖励比例计算公式" className="link">- {t("guide.s32")}</Link>
                    <Link href="/config#伪静配置" className="link">- {t("guide.s33")}</Link>
                    <Link href="/config#定时任务" className="link">- {t("guide.s34")}</Link>
                    <Link href="/config#站群配置" className="link">- {t("guide.s35")}</Link>
                    <span className="pl-4">...</span>
                  </div>
                </div>

                <div ref={sectionRefs[3]} className="w-full">
                  <h3>{t("menu.theme")}</h3>
                  <div className="flex flex-col items-start gap-[12px] md:gap-[14px]">
                    <Link href="/theme/using-a-theme" className="link">- {t("guide.s90")}</Link>
                    <Link href="/theme/writing-a-theme" className="link">- {t("theme.s3")}</Link>
                    <Link href="/theme/tags-global" className="link">- {t("theme.s4")}</Link>
                    <span className="pl-4">...</span>
                  </div>
                </div>

                <div id={t("guide.s26")} ref={sectionRefs[3]} className="w-full">
                  <h3>{t("guide.s26")}</h3>
                  <div className="flex flex-col items-start gap-[12px] md:gap-[14px]">
                    <Link href="/plugin" className="link">- {t("guide.s27")}</Link>
                    <Link href="/plugin/plugin-writing" className="link">- {t("guide.s28")}</Link>
                    <Link href="/plugin/official/plugin-google-analytics" className="link">- {t("guide.s29")}</Link>
                    <Link href="https://vuepress-plugin-blog.ulivz.com/" target="_blank" className="link">- {t("guide.s205")}</Link>
                    <span className="pl-4">...</span>
                  </div>
                </div>

                <div className="warning">
                  <span className="title">{t("guide.s36")}</span>
                  <p className="message">{t("guide.s37")}</p>
                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide/getting-started" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s5")}</span>
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20}/>
                  </Link>
                </div>
                {/* End of Page*/}
              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </GuideLayout>
  );
}