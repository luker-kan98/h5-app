import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import Sidebar from "@/layouts/plugin/Sidebar";
import PluginLayout from "@/layouts/plugin/PluginLayout";
import Zoom from "react-medium-image-zoom";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  

  return (
    <PluginLayout title={`${t('plugin.s145')} | ${t('seo.t.t0')}`} mobile_title={t("menu.plugin")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
              <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
                {/* Desktop sidebar */}
                <div
                    className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                  <Sidebar currentElementIndexInViewport={currentElementIndexInViewport}/>
                </div>
                {/* Content */}
                <article className="doc pt-[10px] md:pt-[35px] grow">
                  <div ref={sectionRefs[0]} className="w-full">
                    {markdownify(t('plugin.s145'), 'h2')}
                    <div className="mt-[30px] w-ful flex flex-wrap items-center gap-[24px]">
                      <Link href="https://cdn.jsdelivr.net/gh/magicblack/maccms_down/" target="_blank" className="link">{t("plugin.s146")}</Link>
                      <Link href="http://www.ppvod.com/" target="_blank" className="link">{t("plugin.s147")}</Link>
                      <Link href="http://www.datll.com/" target="_blank" className="link">{t("plugin.s148")}</Link>
                    </div>
                  </div>

                  <div id={'介绍'} ref={sectionRefs[1]} className={'w-full mt-6 md:mt-10'}>
                    <h3>{t("plugin.s29")}</h3>
                    <div className={'info'}>
                      <p className={'title'}>{t('plugin.s20')}</p>
                      <p className={'message'}>{t('plugin.s149')}</p>
                    </div>
                    <div className={'my-5 w-full flex flex-col gap-3'}>
                      <Zoom>
                        <Image alt="pic" src="/images/plugin/125848_20cc8b43_1713301.png" width={1896} height={819} className="w-full h-auto" />
                      </Zoom>
                      <Zoom>
                        <Image alt="pic" src="/images/plugin/125910_d7cc9d77_1713301.png" width={1550} height={847} className="w-full h-auto" />
                      </Zoom>
                      <Zoom>
                        <Image alt="pic" src="/images/plugin/125918_49d8c984_1713301.png" width={1896} height={880} className="w-full h-auto" />
                      </Zoom>
                      <Zoom>
                        <Image alt="pic" src="/images/plugin/125926_25bffda4_1713301.png" width={1823} height={858} className="w-full h-auto" />
                      </Zoom>
                    </div>
                  </div>

                  <div id={'安装教程'} ref={sectionRefs[2]} className={'w-full'}>
                    <h3>{t("plugin.s30")}</h3>
                    <div className={'my-5 w-full'}>
                      <Zoom>
                        <Image alt="pic" src="/images/plugin/120153_28e98be3_1713301.png" width={685} height={241}
                               className="w-full h-auto"/>
                      </Zoom>
                    </div>
                    <p>{t('plugin.s150')}</p>
                    <p>{t('plugin.s151')}</p>
                    <p>{t('plugin.s152')}</p>

                  </div>

                  <div id={'播放器配置'} ref={sectionRefs[3]} className={'w-full'}>
                    <h3>{t("plugin.s31")}</h3>
                    <p>{t('plugin.s153')}</p>
                    <p>{t('plugin.s154')}</p>
                  </div>

                  <div id={'自动推送'} ref={sectionRefs[4]} className={'w-full'}>
                    <h3>{t("plugin.s32")}</h3>
                    <p>{t('plugin.s155')}</p>
                    <p>{t('plugin.s156')}</p>
                  </div>

                  <div id={'常见问题'} ref={sectionRefs[5]} className={'w-full'}>
                    <h3>{t("plugin.s33")}</h3>
                    <h4>{t("plugin.s157")}</h4>
                    <p>{t('plugin.s158')}
                      <span className={'text-[#D85252 px-1'}>{`http://123.144.12.215:2000`}</span>
                    </p>
                    <h4>{t("plugin.s159")}</h4>
                    <p>{t('plugin.s160')}
                      <span className={'text-[#D85252 px-1'}>{`http://123.144.12.215:2000`}</span>
                    </p>
                    <h4>{t("plugin.s161")}</h4>
                    <p>{t('plugin.s162')}</p>
                    <h4>{t("plugin.s163")}</h4>
                    <p>{t('plugin.s164')}</p>
                    <h4>{t("plugin.s165")}</h4>
                    {markdownify(t('plugin.s166'), 'p')}
                    <h4>{t("plugin.s167")}</h4>
                    {markdownify(t('plugin.s168'), 'p')}
                    <h4>{t("plugin.s169")}</h4>
                    <p>{t('plugin.s170')}</p>
                    <h4>{t("plugin.s171")}</h4>
                    <p>{t('plugin.s172')}</p>
                    <div className={'info'}>
                      <p className={'title'}>{t('plugin.s173')}</p>
                      <p className={'message'}>{t('plugin.s174')}</p>
                    </div>
                    <div className={'alert'}>
                      <p className={'title'}>{t('plugin.s175')}</p>
                      <p className={'message'}>{t('plugin.s176')}</p>
                    </div>
                  </div>

                  <div id={'更新记录'} ref={sectionRefs[6]} className={'w-full'}>
                    <h3>{t("plugin.s34")}</h3>
                    <h4>1.0.7</h4>
                    <ul className="list">
                      <li>{t("plugin.s177")}</li>
                      <li>{t("plugin.s178")}</li>
                      <li>{t("plugin.s179")}</li>
                      <li>{t("plugin.s180")}</li>
                      <li>{t("plugin.s181")}</li>
                    </ul>
                    <h4>1.0.6</h4>
                    <ul className="list">
                      <li>{t("plugin.s182")}</li>
                    </ul>
                    <h4>1.0.5</h4>
                    <ul className="list">
                      <li>{t("plugin.s183")}</li>
                      <li>{t("plugin.s184")}</li>
                    </ul>
                    <h4>1.0.4</h4>
                    <ul className="list">
                      <li>{t("plugin.s185")}</li>
                      <li>{t("plugin.s186")}</li>
                    </ul>
                    <h4>1.0.3</h4>
                    <ul className="list">
                      <li>{t("plugin.s187")}</li>
                      <li>{t("plugin.s188")}</li>
                      <li>{t("plugin.s189")}</li>
                    </ul>
                  </div>


                  {/* Page */}
                  <div className="pager">
                    <Link href="/plugin/plugin-function" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                      <span className="text-primary text-[16px]">{t("plugin.s26")}</span>
                    </Link>
                  </div>
                  {/* End of Page */}

                </article>
              </div>
          )}
        </Scrollspy>

      </div>
    </PluginLayout>
  );
}