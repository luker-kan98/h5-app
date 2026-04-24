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
    <GuideLayout title={`${t('guide.s8')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("guide.s8")}</h2>
                  <h3>{t("guide.s103")}</h3>
                  <div className="flex flex-col items-start gap-2">
                    <Link href="https://lanzoui.com/b256378" target="_blank" className="assets_link">{`- ‘https://lanzoui.com/b256378'`}</Link>
                    <Link href="https://www.baidu.com/s?wd=苹果cms教程" target="_blank" className="assets_link">{`- ‘https://www.baidu.com/s?wd=苹果cms教程`}</Link>
                  </div>
                  <h3>{t("guide.s104")}</h3>
                  <div className="flex flex-col items-start gap-2">
                    <Link href="https://lanzoui.com/b355667" target="_blank" className="assets_link">{`- “https://lanzoui.com/b355667”`}</Link>
                    <Link href="https://www.baidu.com/s?wd=苹果cms模板" target="_blank" className="assets_link">{`- https://www.baidu.com/s?wd=苹果cms模板`}</Link>
                  </div>
                  <h3>{t("guide.s105")}</h3>
                  <div className="flex flex-col items-start gap-2">
                    <Link href="https://lanzoui.com/b355668" className="assets_link">{`- https://lanzoui.com/b355668`}</Link>
                    <Link href="https://www.baidu.com/s?wd=%E8%8B%B9%E6%9E%9Ccms%E6%8F%92%E4%BB%B6" target="_blank" className="assets_link">{`- https://lanzoui.com/b355668`}</Link>
                  </div>
                  <h3>{t("guide.s106")}</h3>
                  <div className="flex flex-col items-start gap-2">
                    <Link href="https://cdn8.lanzoui.com/u/magicblack" target="_blank" className="assets_link">{t("guide.s107")}</Link>
                    <Link href="https://www.lanzoui.com/u/magicblack" target="_blank" className="assets_link">{t("guide.s108")}</Link>
                  </div>
                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide/basic-config" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{t("guide.s7")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]" />
                  <Link href="/guide/lang" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s9")}</span>
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