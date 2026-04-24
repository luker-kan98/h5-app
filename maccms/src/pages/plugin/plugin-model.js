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
import CodeLineNumbers from "@/layouts/components/CodeLineNumbers";
import InlineCode from "@/layouts/components/InlineCode";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
  ];

  

  return (
    <PluginLayout title={`${t('plugin.s12')} | ${t('seo.t.t0')}`} mobile_title={t("menu.plugin")}>
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
                    <h2>{t("plugin.s12")}</h2>
                    {markdownify(t('plugin.s78'), 'p')}
                    {markdownify(t('plugin.s79'), 'p')}
                    <div className={'info'}>
                      <p className={'title'}>{t('plugin.s80')}</p>
                      <p className={'message'}>{t('plugin.s81')}</p>
                    </div>
                    <h3>{t("plugin.s82")}</h3>
                    <div className="inline-code">
                    <pre>
                      <code>{`addons/mydemo/model/User.php`}</code>
                    </pre>
                      <CodeLineNumbers lines={1}/>
                    </div>
                    <h3>{t("plugin.s83")}</h3>
                    <div className="inline-code">
                    <pre>
                      <code>{`addon\\mydemo\\model`}</code>
                    </pre>
                      <CodeLineNumbers lines={1}/>
                    </div>
                    <h3>{t("plugin.s84")}</h3>
                    <InlineCode type={'php'} lines={6} code={`namespace addons\\mydemo\\model;
use think\\Model;
class User extends Model
{
    
}`} />
                  </div>

                  {/* Page */}
                  <div className="pager">
                    <Link href="/plugin/plugin-writing" className="flex flex-row items-center gap-[6px]">
                      <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                      <span className="text-primary text-[16px]">{t("plugin.s7")}</span>
                    </Link>
                    <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                    <Link href="/plugin/plugin-controller" className="flex flex-row items-center gap-[6px]">
                      <span className="text-primary text-[16px] text-right">{t("plugin.s13")}</span>
                      <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20}/>
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