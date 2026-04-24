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
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  

  return (
    <PluginLayout title={`${t('plugin.s13')} | ${t('seo.t.t0')}`} mobile_title={t("menu.plugin")}>
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
                    <h2>{t("plugin.s13")}</h2>
                    {markdownify(t('plugin.s85'), 'p')}
                    <ul className={'list'}>
                      {markdownify(t('plugin.s86'), 'li')}
                    </ul>
                    <div className={'info'}>
                      <p className={'title'}>{t('plugin.s80')}</p>
                      {markdownify(t('plugin.s87'), 'p', 'message')}
                    </div>
                  </div>
                  <div id={'基类不同'} ref={sectionRefs[1]} className={'w-full'}>
                    <h3>{t("plugin.s14")}</h3>
                    <ul className={'list'}>
                      {markdownify(t('plugin.s88'), 'li')}
                      {markdownify(t('plugin.s89'), 'li')}
                    </ul>
                  </div>

                  <div id={'请求URL不同'} ref={sectionRefs[2]} className={'w-full'}>
                    <h3>{t("plugin.s15")}</h3>
                    <ul className={'list'}>
                      {markdownify(t('plugin.s90'), 'li')}
                      {markdownify(t('plugin.s91'), 'li')}
                    </ul>
                  </div>

                  <div id={'当使用层级控制器时'} ref={sectionRefs[3]} className={'w-full'}>
                    <h3>{t("plugin.s16")}</h3>
                    <ul className={'list'}>
                      {markdownify(t('plugin.s92'), 'li')}
                      {markdownify(t('plugin.s93'), 'li')}
                      {markdownify(t('plugin.s94'), 'li')}
                    </ul>
                  </div>

                  <div id={'控制器定义'} ref={sectionRefs[4]} className={'w-full'}>
                    <h3>{t("plugin.s17")}</h3>
                    <p>{t("plugin.s95")}</p>
                    <InlineCode type={'php'} lines={12} code={`<?php

namespace addons\\mydemo\\controller;
use think\\addons\\Controller;
class Index extends Controller
{
    public function index()
    {
        $this->error("当前插件暂无前台页面");
    }

}`} />
                    <ul className={'list'}>
                      {markdownify(t('plugin.s96'), 'li')}
                    </ul>
                  </div>

                  <div id={'控制器请求'} ref={sectionRefs[5]} className={'w-full'}>
                    <h3>{t("plugin.s18")}</h3>
                    <InlineCode type={''} lines={1} code={`http://www.da.com/addons/mydemo/控制器名/控制器方法`} />
                  </div>

                  <div id={'基类控制器'} ref={sectionRefs[6]} className={'w-full'}>
                    <h3>{t("plugin.s19")}</h3>
                    <ul className={'list'}>
                      {markdownify(t('plugin.s97'), 'li')}
                      {markdownify(t('plugin.s98'), 'li')}
                      {markdownify(t('plugin.s99'), 'li')}
                    </ul>
                  </div>

                  <div id={'基类属性'} ref={sectionRefs[7]} className={'w-full'}>
                    <h3>{t("plugin.s20")}</h3>
                    <InlineCode type={'php'} lines={24} code={`protected $addon = null; //插件名称
protected $controller = null; //控制器名称
protected $action = null; //方法名称
/**
 * 无需登录的方法,同时也就不需要鉴权了
 * @var array
 */
protected $noNeedLogin = ['*'];
/**
 * 无需鉴权的方法,但需要登录
 * @var array
 */
protected $noNeedRight = ['*'];
/**
 * 权限Auth，如果用户是登录状态，可以直接从中读取用户信息
 * @var Auth
 */
protected $auth = null;

/**
 * 布局模板，默认不启用
 * @var string
 */
protected $layout = null;`} />
                  </div>

                  {/* Page */}
                  <div className="pager">
                    <Link href="/plugin/plugin-model" className="flex flex-row items-center gap-[6px]">
                      <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                      <span className="text-primary text-[16px]">{t("plugin.s12")}</span>
                    </Link>
                    <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                    <Link href="/plugin/plugin-extend" className="flex flex-row items-center gap-[6px]">
                      <span className="text-primary text-[16px] text-right">{t("plugin.s21")}</span>
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