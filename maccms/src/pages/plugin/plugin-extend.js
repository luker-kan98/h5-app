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
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  

  return (
    <PluginLayout title={`${t('plugin.s21')} | ${t('seo.t.t0')}`} mobile_title={t("menu.plugin")}>
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
                    <h2>{t("plugin.s21")}</h2>
                    <div className={'info'}>
                      <p className={'title'}>TIP</p>
                      <p className={'message'}>{t('plugin.s100')}</p>
                    </div>
                  </div>
                  <div id={'重要位置1'} ref={sectionRefs[1]} className={'w-full'}>
                    <h3>{t("plugin.s22")}</h3>
                    {markdownify(t('plugin.s101'), 'p')}
                  </div>

                  <div id={'重要位置2'} ref={sectionRefs[2]} className={'w-full'}>
                    <h3>{t("plugin.s23")}</h3>
                    {markdownify(t('plugin.s102'), 'p')}
                  </div>

                  <div id={'第三方类库'} ref={sectionRefs[3]} className={'w-full'}>
                    <h3>{t("plugin.s24")}</h3>
                    <p>{t("plugin.s103")}</p>
                    <h4>{t("plugin.s108")}</h4>
                    <p>{t("plugin.s104")}</p>
                    <InlineCode type={'php'} lines={8} code={`<?php

namespace addons\\mydemo\\library;

class HashMap
{
    //类库代码
}`} />
                    <ul className={'list'}>
                      {markdownify(t('plugin.s105'), 'li')}
                      {markdownify(t('plugin.s106'), 'li')}
                      <InlineCode type={'php'} lines={2} code={`$hashMap = new \\addonos\\mydemo\\library\\HaspMap();
$result = $hashMap->myNormalMethod();`} />
                      {markdownify(t('plugin.s107'), 'li')}
                      <InlineCode type={'php'} lines={1} code={`$result = \\addonos\\mydemo\\library\\HashMap::myStaticMethod();`} />
                      {markdownify(t('plugin.s109'), 'p')}
                    </ul>
                    <h4>{t("plugin.s113")}</h4>
                    <ul className={'list'}>
                      <li>{t('plugin.s110')}</li>
                      <li>{t('plugin.s111')}</li>
                      <li>{t('plugin.s112')}</li>
                    </ul>
                    <p className={'text-black font-[500]'}>{t('plugin.s114')}</p>
                    <InlineCode type={'php'} lines={10} code={`/**
 * 应用初始化
 */
public function appInit()
{
    //先判断是否已经通过其它方式引入了此类
    if(!class_exists("\\Yansongda\\Pay\\Pay")){
        \\think\\Loader::addNamespace('Yansongda\\Pay', ADDON_PATH . 'mydemo' . DS . 'library' . DS . 'Yansongda' . DS);
    }
}`} />
                    <p>{t("plugin.s115")}</p>
                    <ul className={'list'}>
                      <li>{t('plugin.s116')}</li>
                      <li>{t('plugin.s117')}</li>
                      <li>{t('plugin.s118')}</li>
                    </ul>
                  </div>

                  <div id={'常见问题'} ref={sectionRefs[4]} className={'w-full'}>
                    <h3>{t("plugin.s25")}</h3>
                    <ul className={'list'}>
                      <li>{t('plugin.s120')}</li>
                      <li>{t('plugin.s121')}</li>
                    </ul>
                  </div>

                  {/* Page */}
                  <div className="pager">
                    <Link href="/plugin/plugin-controller" className="flex flex-row items-center gap-[6px]">
                      <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                      <span className="text-primary text-[16px]">{t("plugin.s13")}</span>
                    </Link>
                    <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                    <Link href="/plugin/plugin-function" className="flex flex-row items-center gap-[6px]">
                      <span className="text-primary text-[16px] text-right">{t("plugin.s26")}</span>
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