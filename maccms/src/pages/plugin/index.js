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

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  

  return (
    <PluginLayout title={`${t('menu.plugin')} | ${t('seo.t.t0')}`} mobile_title={t("menu.plugin")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <div className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              </div>
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("menu.plugin")}</h2>
                  <p>{t("plugin.s35")}</p>
                </div>
                <div id={'后端扩展插件'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("plugin.s2")}</h3>
                  <p>{t("plugin.s36")}</p>
                  <ul className={'list'}>
                    {markdownify(t('plugin.s37'), "li")}
                    {markdownify(t('plugin.s38'), "li")}
                  </ul>
                </div>

                <div id={'播放器插件'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("plugin.s3")}</h3>
                  <p>{t("plugin.s39")}</p>
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/plugin/plugin-dir" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("plugin.s4")}</span>
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20} />
                  </Link>
                </div>
                {/* End of Page*/}
              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </PluginLayout>
  );
}