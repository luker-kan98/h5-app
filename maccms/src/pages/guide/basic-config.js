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
  ];

  

  return (
    <GuideLayout title={`${t('guide.s7')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div id={t("guide.s90")} ref={sectionRefs[0]} className="w-full">
                  <h2>{t("guide.s7")}</h2>
                  <h3>{t("guide.s90")}</h3>
                  {markdownify(t("guide.s92"), "p", "font-primary text-black text-[16px]")}
                  <div className="flex flex-col items-start">
                    {markdownify(t("guide.s93"), "p", "text-[16px]")}
                    {markdownify(t("guide.s94"), "p", "text-[16px]")}
                    {markdownify(t("guide.s95"), "p", "text-[16px]")}
                  </div>
                  <div className="warning">
                    <span className="title">{t("guide.s62")}</span>
                    <ul className="message">
                      {markdownify(t('guide.s96'), 'li')}
                      {markdownify(t('guide.s97'), 'li')}
                    </ul>
                  </div>
                </div>

                <div id={t("guide.s91")} ref={sectionRefs[1]} className="w-full">
                  <h3>{t("guide.s91")}</h3>
                  {markdownify(t("guide.s98"), "p", "font-primary text-black text-[16px]")}
                  <div className="flex flex-col items-start">
                    {markdownify(t("guide.s99"), "p", "text-[16px]")}
                    {markdownify(t("guide.s100"), "p", "text-[16px]")}
                  </div>
                  <div className="warning">
                    <span className="title">{t("guide.s62")}</span>
                    <ul className="message">
                      <li className="font-primary">{t("guide.s101")}</li>
                      <li className="font-primary">{t("guide.s102")}</li>
                    </ul>
                  </div>
                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide/directory-structure" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{t("guide.s6")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]" />
                  <Link href="/guide/assets" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s8")}</span>
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