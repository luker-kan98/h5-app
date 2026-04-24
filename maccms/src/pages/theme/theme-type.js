import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import ThemeSidebar from "@/layouts/theme/ThemeSidebar";
import ThemeLayout from "@/layouts/theme/ThemeLayout";
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
    <ThemeLayout title={`${t('theme.s11')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s11")}</h2>
                  <ul className='list'>
                    {markdownify(t('theme.tp.s1'), 'li')}
                    {markdownify(t('theme.tp.s2'), 'li')}
                    {markdownify(t('theme.tp.s3'), 'li')}
                    {markdownify(t('theme.tp.s4'), 'li')}
                  </ul>
                </div>

                <div id={'参数'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s103")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.tp.s5'), 'li')}
                    {markdownify(t('theme.tp.s6'), 'li')}
                    {markdownify(t('theme.tp.s7'), 'li')}
                    {markdownify(t('theme.tp.s8'), 'li')}
                    {markdownify(t('theme.tp.s9'), 'li')}
                    {markdownify(t('theme.tp.s10'), 'li')}
                    {markdownify(t('theme.tp.s11'), 'li')}
                    {markdownify(t('theme.tp.s12'), 'li')}
                    {markdownify(t('theme.tp.s13'), 'li')}

                  </ul>
                </div>

                <div id={'使用示例'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s104")}</h3>
                  <InlineCode type={'html'} lines={3} code={`{maccms:type num="10" order="asc" by="sort" ids="all"}
   <!-- 内部同下方 分类页独有标签 ，只需 {$obj.改为{$vo.开头即可 -->
{/maccms:type}`} />
                </div>
                <p>{t('theme.tp.s14')}</p>
                <InlineCode type={'html'} lines={7} code={`{maccms:type ids="1,2,3,4" order="asc" by="sort" id="vo1" key="key1"}
  <!-- 一级分类：{$vo1.type_name}- -->
  {maccms:type parent="'.$vo1['type_id'].'" order="asc" by="sort" id="vo2" key="key2"}
     <!-- 二级分类{$vo2.type_name} -->
  {/maccms:type}
  <br>
{/maccms:type}`} />

                <div id={'分类字段'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s105")}</h3>
                  <div className='warning'>
                    <p className='title'>{t('theme.tp.s15')}</p>
                    <ul className='message'>
                      {markdownify(t('theme.tp.s16'), 'li')}
                      {markdownify(t('theme.tp.s17'), 'li')}
                    </ul>
                  </div>
                  <InlineCode type={'html'} lines={22} code={`<!-- 分类字段 -->
{$obj.parent} 如果当前访问的是二级分类，这个是一级分类对象，也同样包含以下属性，如{$obj.parent.type_id}一级分类id
{$obj.type_id} 分类id
{$obj.type_name} 名称
{$obj.type_en} 别名
{$obj.type_sort} 排序号
{$obj.type_mid} 所属模块
{$obj.type_pid} 上级id
{$obj.type_status} 状态1开启0关闭
{$obj.type_tpl} 分类页模板
{$obj.type_tpl_list} 筛选页模板
{$obj.type_tpl_detail} 详情页模板
{$obj.type_tpl_play} 播放页模板
{$obj.type_tpl_down} 下载页模板
{$obj.type_key} 关键字
{$obj.type_des} 描述信息
{$obj.type_title} 标题
{$obj.type_extend} 扩展配置json
{$obj.type_logo} 分类图标
{$obj.type_pic} 分类封面
{$obj.type_jumpurl} 跳转url
{:mac_url_type($obj)} 分类链接`} />

                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/theme-user" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s10")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/theme-plot" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s12")}</span>
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20}/>
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