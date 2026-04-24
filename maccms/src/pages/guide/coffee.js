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
    useRef(null)
  ];

  

  return (
    <GuideLayout title={`${t('guide.s15')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="flex flex-col w-full">
                  <h2>{t("guide.s15")}</h2>
                  
                  <div className="info">
                    <span className="title">{t("guide.s200")}</span>
                    <p className="message">{t("guide.s201")}</p>
                  </div>
                  <div className="mt-[20px] w-full md:w-[160px] flex flex-col border">
                    <div className="w-full h-[38px] flex flex-row items-center justify-center bg-[#f2f2f2] border-b-[1px]">
                      <span className="w-1/2 text-center">{t("guide.s202")}</span>
                      <span className="w-1/2 text-center">{t("guide.s203")}</span>
                    </div>
                    <div className="w-full h-[38px] flex flex-row items-center justify-center">
                      <span className="w-1/2 text-center">{t("guide.s204")}</span>
                      <div className="min-w-[1px] bg-lightGray h-[14px]" />
                      <span className="w-1/2 text-center">{t("guide.s204")}</span>
                    </div>
                  </div>
                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide/security" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{t("guide.s14")}</span>
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