import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import ThemeSidebar from "@/layouts/theme/ThemeSidebar";
import ThemeLayout from "@/layouts/theme/ThemeLayout";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s12')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <div className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                <ThemeSidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              </div>
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">

                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("theme.s12")}</h2>
                  {markdownify(t('theme.pl.s1'))}
                  <ul className='list'>
                    {markdownify(t('theme.pl.s2'), 'li')}
                    {markdownify(t('theme.pl.s3'), 'li')}
                    {markdownify(t('theme.pl.s4'), 'li')}
                  </ul>
                </div>

                <div id={'剧情首页'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s106")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.pl.s5'), 'li')}
                    {markdownify(t('theme.pl.s6'), 'li')}
                  </ul>
                </div>

                <div id={'剧情搜索'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s107")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.pl.s7'), 'li')}
                    {markdownify(t('theme.pl.s8'), 'li')}
                  </ul>
                </div>

                <div id={'剧情详情'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s108")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.pl.s9'), 'li')}
                    {markdownify(t('theme.pl.s10'), 'li')}
                  </ul>
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/theme-type" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s11")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/theme-role" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s13")}</span>
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20}/>
                  </Link>
                </div>
                {/* End of Page*/}
              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </ThemeLayout>
  );
}