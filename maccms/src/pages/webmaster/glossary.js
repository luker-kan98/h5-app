import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import GlossaryLayout from "@/layouts/glossary/GlossaryLayout";
import GlossarySidebar from "@/layouts/glossary/GlossarySidebar";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  return (
    <GlossaryLayout title={`${t('wm.s5')} | ${t('seo.t.t0')}`} mobile_title={t("wm.s5")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <div className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                <GlossarySidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              </div>
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("wm.s5")}</h2>
                  <p>{t('wm.s12')}</p>
                  <h3>{t("wm.s6")}</h3>
                  <p>{t('wm.s13')}</p>
                </div>

                <div id={'视频解析'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("wm.s7")}</h3>
                  <p>{t('wm.s14')}</p>
                  <ul className='list'>
                    {markdownify(t('wm.s15'), 'li')}
                    {markdownify(t('wm.s16'), 'li')}
                    {markdownify(t('wm.s17'), 'li')}
                  </ul>
                </div>

                <div id={'采集规则'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("wm.s8")}</h3>
                  <p>{t('wm.s18')}</p>
                </div>

                <div id={'CF'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("wm.s9")}</h3>
                  {markdownify(t('wm.s19'), 'p')}

                </div>

                <div id={'假墙攻击'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("wm.s10")}</h3>
                  {markdownify(t('wm.s20'), 'p')}
                  <h4>{t("wm.s11")}</h4>
                  <ul className='list'>
                    <li>{t('wm.s21')}</li>
                    <li>{t('wm.s22')}</li>
                    <li>{t('wm.s23')}</li>
                  </ul>
                </div>
              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </GlossaryLayout>
  );
}