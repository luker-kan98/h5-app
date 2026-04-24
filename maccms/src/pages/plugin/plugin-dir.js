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

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  

  return (
    <PluginLayout title={`${t('plugin.s4')} | ${t('seo.t.t0')}`} mobile_title={t("menu.plugin")}>
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
                    <h2>{t("plugin.s4")}</h2>
                  </div>
                  <div id={'文件结构'} ref={sectionRefs[1]} className={'w-full'}>
                    <h3>{t("plugin.s5")}</h3>
                    {markdownify(t('plugin.s40'), "p")}
                    <div className="inline-code">
                    <pre>
                      <code>{`maccms
 └─ addons
 │   └─mydemo //插件标识
 │        ├─application    //此文件夹中所有文件会覆盖到根目录的/application文件夹
 │        ├─assets        //此文件夹中所有文件会复制到/static/addons/mydemo文件夹
 │        ├─controller    //此文件夹为插件控制器目录
 │        ├─lang            //此文件夹为插件语言包目录
 │        ├─model            //此文件夹为插件模型目录
 │        ├─view            //此文件夹为插件视图目录
 │        ├─Mydemo.php        //此文件为插件核心安装卸载控制器,必需存在
 │        ├─bootstrap.js    //此文件为插件JS启动文件
 │        ├─LICENSE        //版权文件
 │        ├─config.html    //自定义插件配置视图模板，可选
 │        ├─config.php    //插件配置文件,我们在后台插件管理中点配置按钮时配置的文件,必需存在
 │        ├─info.ini        //插件信息文件,用于保存插件基本信息，插件开启状态等,必需存在
 │        └─install.sql    //插件数据库安装文件,此文件仅在插件安装时会进行导入
 ...`}</code>
                    </pre>
                      <CodeLineNumbers lines={17}/>
                      <div className="code-type"></div>
                    </div>
                    <div className='info'>
                      <p className='title'>TIP</p>
                      {markdownify(t('plugin.s42'), 'p', 'message')}
                    </div>
                    {markdownify(t('plugin.s43'), 'p',)}
                    <ul className='list'>
                      {markdownify(t('plugin.s44'), 'li',)}
                      {markdownify(t('plugin.s45'), 'li',)}
                      {markdownify(t('plugin.s46'), 'li',)}
                    </ul>
                  </div>

                  <div id={'info.ini介绍'} ref={sectionRefs[2]} className={'w-full'}>
                    <h3>{t("plugin.s6")}</h3>
                    <p>{t("plugin.s49")}</p>
                    <div className="inline-code">
                    <pre>
                      <code>{`name = mydemo
title = 示例插件
intro = 这是一个示例插件的介绍
author = 大图模板  
website = http://www.datll.com
version = 1.0.0
state = 1
image = /static/addons/mydemo/img/logo.jpg
url = /addons/mydemo.html

`}</code>
                    </pre>
                      <CodeLineNumbers lines={10}/>
                      <div className="code-type">info.ini</div>
                    </div>
                    {markdownify(t('plugin.s50'), 'p',)}
                  </div>

                  {/* Page */}
                  <div className="pager">
                    <Link href="/plugin" className="flex flex-row items-center gap-[6px]">
                      <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                      <span className="text-primary text-[16px]">{t("plugin.s1")}</span>
                    </Link>
                    <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                    <Link href="/plugin/plugin-writing" className="flex flex-row items-center gap-[6px]">
                      <span className="text-primary text-[16px] text-right">{t("plugin.s7")}</span>
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