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
  const list1 = t('theme.rl.s6', {returnObjects: true});

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s13')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s13")}</h2>
                  {markdownify(t('theme.rl.s1'))}
                  <ul className='list'>
                    {markdownify(t('theme.rl.s2'), 'li')}
                    {markdownify(t('theme.rl.s3'), 'li')}
                    {markdownify(t('theme.rl.s4'), 'li')}
                    {markdownify(t('theme.rl.s5'), 'li')}
                  </ul>
                </div>

                <div id={'标签参数'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s109")}</h3>
                  <ul className='list'>
                    {list1.map((item, index)=><li key={index}>{markdownify(item)}</li>)}
                  </ul>
                  <InlineCode type={'html'} lines={3} code={`{maccms:role num="10" paging="no" rid="'.$obj['vod_id'].'" order="asc" by="sort"}
   <!-- 内部同下方角色字段，{$obj.改为{$vo.开头即可 -->
{/maccms:role}`} />
                </div>

                <div id={'角色字段'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s110")}</h3>
                  <div className='warning'>
                    <p className='title'>{t('theme.rl.s7')}</p>
                    <ul className='message'>
                      {markdownify(t('theme.rl.s8'), 'li')}
                      {markdownify(t('theme.rl.s9'), 'li')}
                    </ul>
                  </div>
                  <InlineCode type={''} lines={31} code={`
{maccms:role num="10" paging="no" rid="'.$obj['vod_id'].'" order="asc" by="sort"}
   内部同下方，{$obj.改为{$vo.开头即可
{/maccms:role}
=======角色内容页独有标签=======
{$obj.role_id} 角色id
{$obj.role_rid} 关联视频id
{$obj.role_name} 角色名
{$obj.role_en} 拼音
{$obj.role_status} 状态
{$obj.role_lock} 锁定
{$obj.role_letter} 首字母
{$obj.role_color} 高亮颜色
{$obj.role_actor} 演员名称
{$obj.role_remarks} 备注
{$obj.role_pic} 图片
{$obj.role_sort} 排序
{$obj.role_level} 推荐值
{$obj.role_up} 顶数
{$obj.role_down} 踩数
{$obj.role_score} 平均分
{$obj.role_score_all} 总评分
{$obj.role_score_num} 评分次数
{$obj.role_time} 更新时间
{$obj.role_time_add} 添加时间
{$obj.role_time_hits} 点击时间
{$obj.role_time_make} 生成时间
{$obj.role_tpl} 自定义模板
{$obj.role_jumpurl} 跳转url
{$obj.role_content} 详情
{$obj|mac_url_role_detail} 获取角色详情页链接`} />
                </div>

                <div id={'角色首页'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s111")}</h3>
                  <p>{t('theme.rl.s10')}</p>
                  <ul className='list'>
                    {markdownify(t('theme.rl.s11'), 'li')}
                    {markdownify(t('theme.rl.s12'), 'li')}
                  </ul>
                </div>

                <div id={'角色搜索'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s112")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.rl.s13'), 'li')}
                    {markdownify(t('theme.rl.s14'), 'li')}
                  </ul>
                  <InlineCode type={'html'} lines={4} code={`<form id="search" name="search" method="get" action="{:mac_url('role/search')}" onSubmit="return qrsearch();">
   <input type="text" name="wd" class="mac_wd" value="{$param.wd}" placeholder="人物名称" />
   <input type="submit" class="mac_search" value="搜索人物" />
</form>`} />
                  <h4>{t('theme.rl.s15')}</h4>
                  <InlineCode type={'html'} lines={7} code={`  {maccms:role num="10" paging="yes" pageurl="role/search" order="desc" by="time"}
   <li><a class="play-img" href="{:mac_url_role_detail($vo)}">
      <img src="{:mac_url_img($vo.role_pic)}" alt="{$vo.role_name}" /></a>
      <h2><a href="{:mac_url_role_detail($vo)}">{$vo.role_name}</a></h2>
      <dl><dt>演员名称：</dt><dd>{$vo.role_actor}</dd></dl>
   </li>
   {/maccms:role}`} />
                </div>

                <div id={'角色详情'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s113")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.rl.s16'), 'li')}
                    {markdownify(t('theme.rl.s17'), 'li')}
                    {markdownify(t('theme.rl.s18'), 'li')}
                  </ul>
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/theme-plot" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s12")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/theme-other" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s14")}</span>
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