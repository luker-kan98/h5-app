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
    <GuideLayout title={`${t('guide.s5')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div id={t("guide.s5")} ref={sectionRefs[0]} className="w-full">
                  <h2>{t("guide.s5")}</h2>
                  {markdownify(t("guide.s41"), "p", "font-primary text-black text-[16px]")}
                  <div className="info">
                    <span className="title">{t("guide.s42")}</span>
                    <ul className="message">
                      <li className="font-primary">{t("guide.s43")}</li>
                      <li className="font-primary">{t("guide.s44")}</li>
                    </ul>
                  </div>
                </div>

                <div id={t("guide.s38")} ref={sectionRefs[1]} className="flex flex-col w-full gap-4">
                  <h3>{t("guide.s38")}</h3>
                  <div className="flex flex-col items-start">
                    <p className="text-[16px]">{t("guide.s45")}</p>
                    <p className="text-[16px]">{t("guide.s46")}</p>
                    <p className="text-[16px]">{t("guide.s47")}</p>
                  </div>
                  <Zoom>
                    <Image alt="pic" src="/images/guide/pic_1@2x.png" width={1836} height={800} className="w-full h-auto" />
                  </Zoom>
                  <Zoom>
                    <Image alt="pic" src="/images/guide/pic_2@2x.png" width={1836} height={1184} className="w-full h-auto" />
                  </Zoom>
                </div>

                <div id={t("guide.s39")} ref={sectionRefs[2]} className="flex flex-col w-full gap-4">
                  <h3>{t("guide.s39")}</h3>
                  <p className="text-[16px]">{t("guide.s48")}</p>
                  <Zoom>
                    <Image alt="pic" src="/images/guide/pic_3@2x.png" width={1836} height={664} className="w-full h-auto" />
                  </Zoom>
                  <p className="text-[16px]">{t("guide.s49")}</p>
                  <div className="scripts">
                    <div className="script">
                      <span className="number">1</span>
                      <Link href="https://cdn.jsdelivr.net/gh/magicblack/maccms_down@master/maccms10.zip" className="code">{`https://cdn.jsdelivr.net/gh/magicblack/maccms_down@master/maccms10.zip`}</Link>
                    </div>
                  </div>
                  <Zoom>
                    <Image alt="pic" src="/images/guide/pic_4@2x.png" width={1836} height={900} className="w-full h-auto" />
                  </Zoom>
                  <p>{t("guide.s50")}</p>
                  <p className="text-[16px]">{t("guide.s51")}</p>
                  <Zoom>
                    <Image alt="pic" src="/images/guide/pic_5@2x.png" width={1836} height={540} className="w-full h-auto" />
                  </Zoom>
                  <span className="text-[16px]">{t("guide.s52")}<Link href={`#${t("guide.s40")}`} className="text-primary text-[16px]">{t("guide.s53")}</Link></span>
                  {markdownify(t("guide.s54"), "p")}
                  <div className="scripts">
                    <div className="script">
                      <span className="number">1</span>
                      <Link href="https://github.com/magicblack/maccms_down/" target="_blank" className="code">{`https://github.com/magicblack/maccms_down/`}</Link>
                    </div>
                  </div>
                  <p>{t("guide.s55")}</p>
                  {markdownify(t("guide.s56"), "p", "mt-3")}
                  <div className="scripts">
                    <div className="script">
                      <span className="number">1</span>
                      <span className="code">{`$ cd E:/苹果cmsv10`}</span>
                    </div>
                    <div className="script">
                      <span className="number">2</span>
                      <span className="code">{`$ git clone https://github.com/magicblack/maccms10.git`}</span>
                    </div>
                    <div className="script">
                      <span className="number">3</span>
                      <span className="code">{`$ cd maccms10`}</span>
                    </div>
                  </div>
                  {markdownify(t("guide.s57"), "p", "mt-3")}
                </div>

                <div id={t("guide.s40")} ref={sectionRefs[3]} className="w-full">
                  <h3>{t("guide.s40")}</h3>
                  <div className="flex flex-col items-start">
                    <p className="text-[16px]">{t("guide.s58")}</p>
                    {markdownify(t("guide.s59"), "p", "text-[16px]")}
                    <p className="text-[16px]">{t("guide.s60")}</p>
                    {markdownify(t("guide.s61"), "p", "text-[16px]")}
                  </div>
                  <Zoom>
                    <Image alt="pic" src="/images/guide/pic_6@2x.png" width={1836} height={1192} className="w-full h-auto" />
                  </Zoom>
                  <Zoom>
                    <Image alt="pic" src="/images/guide/pic_7@2x.png" width={1836} height={1496} className="w-full h-auto" />
                  </Zoom>
                  <div className="warning">
                    <span className="title">{t("guide.s62")}</span>
                    <p className="message">{t("guide.s63")}</p>
                  </div>
                  {markdownify(t("guide.s64"), "p", "mt-[30px]")}
                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{`MacCMS V10.x`}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]" />
                  <Link href="/guide/directory-structure" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s6")}</span>
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