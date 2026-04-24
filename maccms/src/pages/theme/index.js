import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

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
  ];

  

  return (
    <ThemeLayout title={`${t('menu.theme')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("menu.theme")}</h2>
                  <div className={'info'}>
                    <p className={'title'}>{t('theme.t1')}</p>
                    <p className={'message'}>{t('theme.t2')}</p>
                  </div>
                  <h3 className={'mt-4'}>{t('theme.t3')}</h3>
                  <div className='mt-4 flex flex-col gap-3'>
                    <Link href={'/theme/using-a-theme'} className={'text-primary text-[16px]'}>- {t('theme.s2')}</Link>
                    <Link href={'/theme/writing-a-theme'} className={'text-primary text-[16px]'}>- {t('theme.s3')}</Link>
                    <Link href={'/theme/tags-global'} className={'text-primary text-[16px]'}>- {t('theme.s15')}</Link>
                    <Link href={'/theme/senior'} className={'text-primary text-[16px]'}>- {t('theme.s16')}</Link>
                  </div>
                </div>


                {/* Page */}
                <div className="pager">
                  <Link href="/theme/using-a-theme" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s2")}</span>
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20} />
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