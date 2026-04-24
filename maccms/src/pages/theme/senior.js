import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { Scrollspy } from "@makotot/ghostui";
import ThemeSidebar from "@/layouts/theme/ThemeSidebar";
import ThemeLayout from "@/layouts/theme/ThemeLayout";
import {markdownify} from "@/lib/utils/textConverter";
import InlineCode from "@/layouts/components/InlineCode";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s16')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <div className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                <ThemeSidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              </div>
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">

                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("theme.s16")}</h2>

                </div>

                <div id={'自定义PHP'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s127")}</h3>
                  <p>{t('theme.gl.s15')}</p>
                  <div className='w-full h-[580px]'>
                    <iframe
                      src={'//player.bilibili.com/player.html?aid=847165566&bvid=BV1F54y1E7LU&cid=386101911&page=1'}
                      width='100%' height='100%'/>
                  </div>
                  <h4>{t('theme.gl.s17')}</h4>
                  {markdownify(t('theme.gl.s16'))}
                  <InlineCode type={''} lines={3} code={`html
  └─php
     └─ extra.php`} />
                  <ul className='list'>
                    {markdownify(t('theme.gl.s18'), 'li')}
                    {markdownify(t('theme.gl.s19'), 'li')}
                    <InlineCode type={'php'} lines={22} code={`<?php
    //extra.php
    //自定义模板处理，变量 函数 等等
    //检查入口是否非法访问
\tdefined('ENTRANCE') or exit('Access Denied');
\t//自定义函数
\tfunction get_time(){
\t\treturn date('Y-m-d H:i:s',time());
\t}
\tfunction get_weekday(){
      $weekarray = array("日","一","二","三","四","五","六");
      return "星期".$weekarray[date("w")];
   }

\t//输出99乘法表
   for($i=1;$i<=9;$i++) {
      for($j=1;$j<=$i;$j++) {
         echo "$i*$j=".$i*$j .'&nbsp;&nbsp;';
      }
      echo "<br />";
   }
?>`} />
                    {markdownify(t('theme.gl.s20'), 'li')}
                    <InlineCode type={''} lines={1} code={`{php}require MAC_ROOT_TEMPLATE . 'php/function.php'{/php}`} />
                  </ul>
                </div>

                <div id={'整合插件'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s128")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.gl.s21'), 'li')}
                    {markdownify(t('theme.gl.s22'), 'li')}
                    <strong>示例</strong>
                    <InlineCode type={'php'} lines={7} code={`# 获取ppvod插件的配置参数  
$ppvod = get_addon_config('ppvod');
print_r($ppvod );

# 助手函数获取全后台数据
$mac = config('maccms');
print_r($mac);`} />
                  </ul>

                </div>

                <div id={'使用模型'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s129")}</h3>
                  {markdownify(t('theme.gl.s23'))}
                  <InlineCode type={'php'} lines={7} code={`$list = [];
$where = []
$where['by'] = 'time';
$where['num'] = 20;
$where['type'] = 'all';
$list = model('Vod')->listCacheData($where);
print_r($list);`} />
                  {markdownify(t('theme.gl.s24'))}
                  <InlineCode type={'php'} lines={5} code={`$list = [];
$where = [];
$where['vod_id'] = 123;
$list = model('Vod')->where($where)->limit(10)->select();
print_r($list);`} />
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/tags-global" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s15")}</span>
                  </Link>
                </div>
                {/* End of Page*/}
              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </ThemeLayout>
  );
}