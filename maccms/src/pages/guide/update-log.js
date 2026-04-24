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

  const updates = t('updates', {returnObjects: true});

  return (
    <GuideLayout title={`${t('guide.s10')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("guide.s10")}</h2>
                  <h3>2024.1000.4040</h3>
                  <ul className='list-log'>
                    {updates.v4040.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2024.1000.4030</h3>
                  <ul className='list-log'>
                    {updates.v4030.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2024.1000.4020</h3>
                  <ul className='list-log'>
                    <li>{t('updates.v4020')}</li>
                  </ul>
                  <h3>2024.1000.4010</h3>
                  <ul className='list-log'>
                    <li>{t('updates.v4010')}</li>
                  </ul>
                  <h3>2024.1000.4000</h3>
                  <ul className='list-log'>
                    {updates.v4000.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2023.1000.3052</h3>
                  <ul className='list-log'>
                    {updates.v3052.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2023.1000.3050</h3>
                  <ul className='list-log'>
                    {updates.v3050.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2022.1000.3032</h3>
                  <ul className='list-log'>
                    {updates.v3032.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2022.1000.3031</h3>
                  <ul className='list-log'>
                    {updates.v3031.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2022.1000.3030</h3>
                  <ul className='list-log'>
                    {updates.v3030.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2022.1000.3028</h3>
                  <ul className='list-log'>
                    {updates.v3028.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2022.1000.3027</h3>
                  <ul className='list-log'>
                    {updates.v3027.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2022.1000.3026</h3>
                  <ul className='list-log'>
                    {updates.v3026.map((item, index) =>
                      <li key={index}>{item}</li>
                    )}
                  </ul>
                  <h3>2020.1000.1060</h3>
                  <ul className="list-log">
                    <li>{t("guide.s111")}</li>
                    <li>{t("guide.s112")}</li>
                    <li>{t("guide.s113")}</li>
                    <li>{t("guide.s114")}</li>
                    <li>{t("guide.s115")}</li>
                    <li>{t("guide.s116")}</li>
                    <li>{t("guide.s117")}</li>
                    <li>{t("guide.s118")}</li>
                    <li>{t("guide.s119")}</li>
                    <li>{t("guide.s120")}</li>
                    <li>{t("guide.s121")}</li>
                  </ul>
                  <h3>2020.1000.1051</h3>
                  <ul className="list-log">
                    <li>{t("guide.s122")}</li>
                    <li>{t("guide.s123")}</li>
                    <li>{t("guide.s124")}</li>
                  </ul>
                  <h3>2020.1000.1042</h3>
                  <ul className="list-log">
                    <li>{t("guide.s125")}</li>
                    <li>{t("guide.s126")}</li>
                    <li>{t("guide.s127")}</li>
                    <li>{t("guide.s128")}</li>
                    <li>{t("guide.s129")}</li>
                    <li>{t("guide.s130")}</li>
                    <li>{t("guide.s131")}</li>
                    <li>{t("guide.s132")}</li>
                  </ul>
                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide/lang" className="flex flex-row items-center gap-[6px]">
                  <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{t("guide.s9")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]" />
                  <Link href="/guide/often-sql" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s11")}</span>
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