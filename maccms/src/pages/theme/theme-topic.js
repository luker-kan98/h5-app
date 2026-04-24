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

  const list1 = t('art.p4.s6', {returnObjects: true});

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s7')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s7")}</h2>
                  <p>{t("art.p4.s1")}</p>
                  <ul className='list'>
                    {markdownify(t('art.p4.s2'), 'li')}
                    {markdownify(t('art.p4.s3'), 'li')}
                    {markdownify(t('art.p4.s4'), 'li')}
                    {markdownify(t('art.p4.s5'), 'li')}
                  </ul>

                </div>
                <div id={'标签参数'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s59")}</h3>
                  <ul className='list'>
                    {list1.map((item, index)=>
                        <li key={index}>{markdownify(item)}</li>
                    )}
                  </ul>
                  <InlineCode type={'html'} lines={5} code={`{maccms:topic num="10" paging="no" order="asc" by="sort" ids="all"}
   <img src="{$vo.topic_pic|mac_url_img}"/>
   <h5>{$vo.topic_name}</h5>
   <!-- 内部为专题全字段，$vo.开头 -->
{/maccms:topic}`} />
                </div>

                <div id={'专题字段'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s60")}</h3>
                  {markdownify(t('art.p4.s7'), 'p')}
                  <InlineCode type={''} lines={37} code={`=======专题页独有标签=======
{$obj.topic_id}专题id
{$obj.topic_name}名称
{$obj.topic_en}别名
{$obj.topic_sub}副标
{$obj.topic_status}状态
{$obj.topic_sort}排序号
{$obj.topic_letter}首字母
{$obj.topic_color}高亮颜色
{$obj.topic_tpl}模板文件
{$obj.topic_type}扩展分类
{$obj.topic_pic}图片
{$obj.topic_pic_thumb}缩略图
{$obj.topic_pic_slide}幻灯图
{$obj.topic_key}seo关键字
{$obj.topic_des}seo描述
{$obj.topic_title}seo标题
{$obj.topic_blurb}简介
{$obj.topic_remarks}备注
{$obj.topic_level}推荐值
{$obj.topic_up}顶数
{$obj.topic_down}踩数
{$obj.topic_score}平均分
{$obj.topic_score_all}总评分
{$obj.topic_score_num}总评次
{$obj.topic_hits}总点击
{$obj.topic_hits_day}日点击
{$obj.topic_hits_week}周点击
{$obj.topic_hits_month}月点击
{$obj.topic_time}更新时间
{$obj.topic_time_add}添加时间
{$obj.topic_content}详细介绍
{$obj.topic_extend}扩展配置json
{$obj.topic_rel_vod|explode=',',###|count} 专题包含视频数量
{$obj.topic_rel_art|explode=',',###|count} 专题包含文章数量
{:mac_url_topic_detail($obj)} 专题详情页链接
{:mac_url_topic_index()}  专题首页链接`} />
                </div>

                <div id={'专题首页'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s61")}</h3>
                  <ul className='list'>
                    {markdownify(t('art.p4.s8'), 'li')}
                    {markdownify(t('art.p4.s9'), 'li')}
                  </ul>
                  <h4>{t('art.p4.s10')}</h4>
                  <InlineCode type={'html'} lines={9} code={`{maccms:topic num="5" paging="yes" order="desc" by="time"}
<li><a class="play-img" href="{:mac_url_topic_detail($vo)}"><img src="{$vo.topic_pic|mac_url_img}" alt="{$vo.topic_name}" /></a>
   <div class="play-txt">
         <h2><a href="{:mac_url_topic_detail($vo)}">{$vo.topic_name}({$vo.topic_rel_vod|explode=',',###|count})</a></h2>
         <p class="juqing">专题介绍：{$vo.topic_blurb}……<a class="link detail-desc" href="{:mac_url_topic_detail($vo)}">【详细剧情】</a></p>
   </div>
</li>
{/maccms:topic}
<!-- 可用通用分页方式分页 -->`} />
                </div>

                <div id={'专题搜索'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s62")}</h3>
                  <ul className='list'>
                    {markdownify(t('art.p4.s11'), 'li')}
                    {markdownify(t('art.p4.s12'), 'li')}
                  </ul>
                </div>

                <div id={'专题详情'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s63")}</h3>
                  <ul className='list'>
                    {markdownify(t('art.p4.s13'), 'li')}
                    {markdownify(t('art.p4.s14'), 'li')}
                    {markdownify(t('art.p4.s15'), 'li')}
                    {markdownify(t('art.p4.s16'), 'li')}
                  </ul>
                  <div className='info'>
                    <p className='title'>{t('art.p3.s5')}</p>
                    {markdownify(t('art.p4.s17'), 'p', 'message')}
                  </div>
                  {markdownify(t('art.p4.s18'), 'p')}
                  <InlineCode type={'html'} lines={24} code={` <!-- 左侧影视 -->
<div class="qire-box ztl">
   <div class="channel-item">
      <div class="ui-title fn-clear"><span>本专题共“{$obj.vod_list|count}”部视频</span><h2>专题相关视频</h2></div>
      <div class="box_con">
            <ul class="zt-list">
               {maccms:foreach name="$obj.vod_list"}
               <li><a href="{:mac_url_vod_detail($vo)}" title="{$vo.vod_name}"><img src="{:mac_url_img($vo.vod_pic)}" alt="{$vo.vod_name}"/><h2>{$vo.vod_name}</h2><p>{$vo.vod_actor}</p><i>{$vo.vod_remarks}</i><em></em></a></li>
               {/maccms:foreach}
            </ul>
      </div>
   </div>
</div>
<!-- 右侧文章 -->
<div class="qire-l ztr">
   <div class="ui-ranking">
      <h3>本专题最新文章</h3>
      <ul class="ranking-list">
            {maccms:foreach name="$obj.art_list"}
            <li><i {if condition="$key lt 3"}class="stress" {/if}>{$key+1}</i><a href="{:mac_url_art_detail($vo)}" title="{$vo.art_name}">{$vo.art_name}</a></li>
            {/maccms:foreach}
      </ul>
   </div>
</div>`} />
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/theme-art" className="flex flex-row items-center gap-[6px]">
                  <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s6")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/theme-actor" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s8")}</span>
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