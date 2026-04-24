import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import GuideLayout from "@/layouts/guide/GuideLayout";
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
    <GuideLayout title={`${t('guide.s9')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("guide.s9")}</h2>
                  <p>{t("guide.s109")}</p>
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{t("guide.s110")}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─application //应用目录`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─lang //公共语言包`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │  │─zh-cn.php //简体中文`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │  │─zh-tw.php //繁体中文`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─...`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─admin/lang //admin模块自定义语言包`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │  │─zh-cn.php //简体中文`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │  │─zh-tw.php //繁体中文`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─...`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │─api/lang //admin模块自定义语言包`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │  │─zh-cn.php //简体中文`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │  │  │─zh-tw.php //繁体中文`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`  │─...`}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide/assets" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{t("guide.s8")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]" />
                  <Link href="/guide/update-log" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s10")}</span>
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