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

  const list1 = t('theme.ss35', { returnObjects: true });

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
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
    <ThemeLayout title={`${t('theme.s5')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s5")}</h2>
                  <ul className='list'>
                    {markdownify(t('theme.ss18'), 'li')}
                    {markdownify(t('theme.ss19'), 'li')}
                    {markdownify(t('theme.ss20'), 'li')}
                    {markdownify(t('theme.ss21'), 'li')}
                  </ul>
                </div>
                <div id={'标签参数'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s34")}</h3>
                  <ul className='list'>
                    {list1.map((list, index) =>
                        <li key={index}>{markdownify(list)}</li>
                    )}
                  </ul>
                  <h4>{t('theme.ss36')}</h4>
                  <InlineCode type={'html'} lines={5}
                              code={`{maccms:vod type="all" by="time" num="10" order="desc"}
   <img src="{$vo.vod_pic|mac_url_img}"/>
   <h5>{$vo.vod_name}</h5>
    <!-- 更多内部标签字段请参考视 视频字段 以$vo.开头即可 -->
{/maccms:vod}`}/>
                </div>

                <div id={'视频字段'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s35")}</h3>
                  {markdownify(t('theme.ss37'), 'p')}
                  <div className='warning'>
                    <p className='title'>{t('theme.ss38')}</p>
                    <ul className='message'>
                      {markdownify(t('theme.ss39'), 'li')}
                      {markdownify(t('theme.ss40'), 'li')}
                    </ul>
                  </div>

                  <InlineCode type={'html'} lines={90}
                              code={`<!-- 视频字段 -->

{$obj.vod_id} 视频id
{$obj.type_id} 分类id
{$obj.type_id_1} 一级分类id
{$obj.type} 分类对象，二级属性可参考分类属性
{$obj.type.type_name} 分类名
{$obj.type.type_en} 分类拼音
{$obj.type_1} 一级分类对象，二级属性可参考分类属性
{$obj.type_1.type_name} 一级分类名
{$obj.type_1.type_en} 一级分类拼音
{$obj.group_id} 用户组id
{$obj.vod_name} 视频名
{$obj.vod_sub} 副标题
{$obj.vod_en} 别名
{$obj.vod_status} 状态0未审1已审
{$obj.vod_letter} 首字母
{$obj.vod_color} 颜色
{$obj.vod_tag} tags 
{$obj.vod_class} 扩展分类
{$obj.vod_pic} 图片
{$obj.vod_pic_thumb} 缩略图
{$obj.vod_pic_slide} 幻灯图
{$obj.vod_pic_screenshot}截图多个图片用$$$连接
{$obj.vod_actor} 主演
{$obj.vod_director} 导演
{$obj.vod_writer}编剧
{$obj.vod_behind}幕后
{$obj.vod_blurb} 简介
{$obj.vod_remarks} 备注
{$obj.vod_pubdate}上映日期
{$obj.vod_total} 总集数
{$obj.vod_serial} 连载数
{$obj.vod_tv} 上映电视台
{$obj.vod_weekday} 节目周期
{$obj.vod_area} 地区
{$obj.vod_lang} 语言
{$obj.vod_year} 年代
{$obj.vod_version} 版本-dvd,hd,720p
{$obj.vod_state} 资源类别-正片,预告片,花絮
{$obj.vod_author} 编辑人员
{$obj.vod_jumpurl} 跳转url
{$obj.vod_tpl} 独立模板
{$obj.vod_tpl_play} 独立播放页模板
{$obj.vod_tpl_down} 独立下载页模板
{$obj.vod_isend} 是否完结
{$obj.vod_lock} 锁定1
{$obj.vod_level} 推荐级别
{$obj.vod_points} 访问整个视频所需积分
{$obj.vod_points_play} 每集点播付费
{$obj.vod_points_down} 每集下载付费
{$obj.vod_hits} 总点击量
{$obj.vod_hits_day} 日点击量
{$obj.vod_hits_week} 周点击量
{$obj.vod_hits_month} 月点击量
{$obj.vod_duration} 时长
{$obj.vod_up} 顶数
{$obj.vod_down} 踩数
{$obj.vod_douban_score} 豆瓣评分
{$obj.vod_douban_id} 豆瓣ID
{$obj.vod_score} 平均分
{$obj.vod_score_all} 总评分
{$obj.vod_score_num} 评分次数
{$obj.vod_time} 更新时间
{$obj.vod_time_add} 添加时间
{$obj.vod_time_hits} 点击时间
{$obj.vod_time_make} 生成时间
{$obj.vod_trysee} 试看时长分
{$obj.vod_reurl} 来源地址
{$obj.vod_rel_vod} 关联视频ids
{$obj.vod_rel_art} 关联文章ids
{$obj.vod_content} 详细介绍
{$obj.vod_pwd} 访问内容页密码
{$obj.vod_pwd_url} 获取密码链接
{$obj.vod_pwd_play} 访问播放页密码
{$obj.vod_pwd_play_url} 获取密码链接
{$obj.vod_pwd_down} 访问下载页密码
{$obj.vod_pwd_down_url} 获取密码链接
{$obj.vod_copyright} 是否开启版权提示
{$obj.vod_play_from} 播放组
{$obj.vod_play_server} 播放服务器组
{$obj.vod_play_note} 播放备注
{$obj.vod_play_url} 播放地址
{$obj.vod_down_from} 下载租
{$obj.vod_down_server} 下载服务器组
{$obj.vod_down_note} 下载备注
{$obj.vod_down_url} 下载地址
{$obj.vod_plot} 是否包含分集剧情
{$obj.vod_plot_name} 分集剧情名称
{$obj.vod_plot_detail} 分集剧情详情`}/>
                </div>

                <div id={'常用函数'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s36")}</h3>
                  <InlineCode type={''} lines={'6'} code={`{:mac_url_vod_detail($obj)}  视频详情页链接
{:mac_url_vod_play($obj,['sid'=>1,'nid'=>1])}   视频播放页链接
{:mac_url_vod_play($obj,'first')}   视频播放页第一条链接
{:mac_url_vod_down($obj,['sid'=>1,'nid'=>1])}   视频下载页链接
{:mac_url_vod_down($obj,'first')}   视频下载页第一条链接
{$obj.vod_content|mac_url_content_img} 影片详情介绍`} />
                </div>

                <div id={'视频首页'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s37")}</h3>
                  {markdownify(t('theme.ss41'), 'p')}
                  <ul className='list'>
                    {markdownify(t('theme.ss42'), 'li')}
                    {markdownify(t('theme.ss43'), 'li')}
                  </ul>

                </div>

                <div id={'视频分类'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s38")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss44.s1'), 'li')}
                    {markdownify(t('theme.ss44.s2'), 'li')}
                    {markdownify(t('theme.ss44.s3'), 'li')}
                    {markdownify(t('theme.ss44.s4'), 'li')}
                  </ul>
                  <h4>{t("theme.ss45")}</h4>
                  <InlineCode type={'html'} lines={9} code={`<!-- 列表 -->
{maccms:vod num="24" paging="yes" type="current" order="desc" by="time"}
 <li><a href="{:mac_url_vod_detail($vo)}" title="{$vo.vod_name}">
    <img src="{:mac_url_img($vo.vod_pic)}" alt="{$vo.vod_name}"/>
    <h2>{$vo.vod_name}</h2>
    <p>{$vo.vod_actor}</p>
    <i>{$vo.vod_version}</i>
</a></li>
{/maccms:vod}`} />
                </div>

                <div id={'视频筛选'} ref={sectionRefs[6]} className={'w-full'}>
                  <h3>{t("theme.s39")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss46.s1'), 'li')}
                    {markdownify(t('theme.ss46.s2'), 'li')}
                    {markdownify(t('theme.ss46.s3'), 'li')}
                    {markdownify(t('theme.ss46.s4'), 'li')}
                    {markdownify(t('theme.ss46.s5'), 'li')}
                    <div className='table-wrapper'>
                      <table>
                        <thead className='thead'>
                        <tr>
                          <th className='w-1/6'>参数</th>
                          <th className='w-1/6'>示例值</th>
                          <th className='w-1/6'>必有参数</th>
                          <th>参数说明</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>id</td>
                          <td>1</td>
                          <td>是</td>
                          <td>分类id</td>
                        </tr>
                        <tr>
                          <td>area</td>
                          <td>大陆</td>
                          <td>否</td>
                          <td>地区筛选</td>
                        </tr>
                        <tr>
                          <td>lang</td>
                          <td>国语</td>
                          <td>否</td>
                          <td>语言筛选</td>
                        </tr>
                        <tr>
                          <td>year</td>
                          <td>2019</td>
                          <td>否</td>
                          <td>年份筛选</td>
                        </tr>
                        <tr>
                          <td>level</td>
                          <td>9</td>
                          <td>否</td>
                          <td>推荐值筛选</td>
                        </tr>
                        <tr>
                          <td>letter</td>
                          <td>A</td>
                          <td>否</td>
                          <td>首字母筛选</td>
                        </tr>
                        <tr>
                          <td>state</td>
                          <td>1</td>
                          <td>否</td>
                          <td>审核状态筛选</td>
                        </tr>
                        <tr>
                          <td>tag</td>
                          <td>国产大片</td>
                          <td>否</td>
                          <td>tag筛选</td>
                        </tr>
                        <tr>
                          <td>class</td>
                          <td>科幻片</td>
                          <td>否</td>
                          <td>扩展分类，类型筛选</td>
                        </tr>
                        <tr>
                          <td>order</td>
                          <td>desc</td>
                          <td>否</td>
                          <td>倒序正序筛选</td>
                        </tr>
                        <tr>
                          <td>by</td>
                          <td>
                            <div>time</div>
                          </td>
                          <td>
                            <div>否</div>
                          </td>
                          <td>排序依据筛选：默认支持：id,
                            time, time_add, score, hits, hits_day, hits_week, hits_month, up, down, level, rnd, in
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>

                    {markdownify(t('theme.ss46.s6'), 'li')}
                    <InlineCode type={''} lines={1}
                                code={`/index.php/vodshow/1/area/大陆/by/time/class/科幻/lang/国语/letter/A/year/2020.html`}/>
                    {markdownify(t('theme.ss46.s7'), 'li')}
                    {markdownify(t('theme.ss46.s8'), 'li')}
                    {markdownify(t('theme.ss46.s9'), 'li')}
                    <InlineCode type={'html'} lines={83} code={`<!-- 筛选条件 -->
<div class="ui-box filter-focus">
    <div class="ui-title"><h3>{$obj.type_name} - 高级搜索</h3></div>
    <div class="ui-cnt">
        <div class="filter-list fn-clear">
            <h5>类型：</h5>
            <ul>
                <li><a {if condition="$param['class'] eq ''"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>'','order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部</a></li>
                {empty name="$obj.type_extend.area"}
                {maccms:foreach name=":explode(',',$obj.parent.type_extend.class)" id="vo2" key="key2"}
                <li><a {if condition="$param['class'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$vo2,'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
                {/maccms:foreach}
                {else /}
                {maccms:foreach name=":explode(',',$obj.type_extend.class)" id="vo2" key="key2"}
                <li><a {if condition="$param['class'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$vo2,'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
                {/maccms:foreach}
                {/empty}
            </ul>
        </div>
        <div class="filter-list fn-clear">
            <h5>地区：</h5>
            <ul>
                <li><a {if condition="$param['area'] eq ''"} class="current" {/if} href="{:mac_url_type($obj,['area'=>'','lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部</a></li>
                {empty name="$obj.type_extend.area"}
                    {maccms:foreach name=":explode(',',$obj.parent.type_extend.area)" id="vo2" key="key2"}
                    <li><a {if condition="$param['area'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$vo2,'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
                    {/maccms:foreach}
                {else /}
                    {maccms:foreach name=":explode(',',$obj.type_extend.area)" id="vo2" key="key2"}
                    <li><a {if condition="$param['area'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$vo2,'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
                    {/maccms:foreach}
                {/empty}
            </ul>
        </div>
        <div class="filter-list fn-clear">
            <h5>语言：</h5>
            <ul>
                <li><a {if condition="$param['lang'] eq ''"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>'','year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部</a></li>
                {empty name="$obj.type_extend.lang"}
                    {maccms:foreach name=":explode(',',$obj.parent.type_extend.lang)" id="vo2" key="key2"}
                    <li><a {if condition="$param['area'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$vo2,'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
                    {/maccms:foreach}
                {else /}
                    {maccms:foreach name=":explode(',',$obj.type_extend.lang)" id="vo2" key="key2"}
                    <li><a {if condition="$param['lang'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$vo2,'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
                    {/maccms:foreach}
                {/empty}
            </ul>
        </div>
        <div class="filter-list fn-clear">
            <h5>年代：</h5>
            <ul>
                <li><a {if condition="$param['year'] eq ''"} class="current"{/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>'','level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部</a></li>
                {empty name="$obj.type_extend.year"}
                    {maccms:foreach name=":explode(',',$obj.parent.type_extend.year)" id="vo2" key="key2"}
                    <li><a {if condition="$param['area'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$vo2,'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
                    {/maccms:foreach}
                {else /}
                    {maccms:foreach name=":explode(',',$obj.type_extend.year)" id="vo2" key="key2"}
                    <li><a {if condition="$param['year'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$vo2,'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
                    {/maccms:foreach}
                {/empty}
            </ul>
        </div>
        <div class="filter-list filter-list-letter fn-clear">
            <h5>字母：</h5>
            <ul>
                <li><a  {if condition="$param['letter'] eq ''"} class="current"{/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>'','state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部</a></li>
                {maccms:foreach name=":explode(',','A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0~9')" id="vo2" key="key2"}
                <li><a {if condition="$param['letter'] eq $vo2"} class="current"{/if} {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$vo2,'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a><li>
                {/maccms:foreach}
            </ul>
        </div>
    </div>
</div>
<!-- 排序方式 -->
<div class=" fn-clear">
    <div class="view-filter">
        <a href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>'time' ],'show')}" class="order {if condition="$param.by eq '' || $param.by eq 'time'"}current{/if}">按时间</a>
        <a href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>'hits' ],'show')}" class="order {if condition="$param.by eq 'hits'"}current{/if}">按人气</a>
        <a href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>'score' ],'show')}" class="order {if condition="$param.by eq 'score'"}current{/if}">按评分</a>
    </div>
</div>`} />
                    {markdownify(t('theme.ss46.s10'), 'li')}
                    <InlineCode type={'html'} lines={10} code={`<!-- 筛选结果列表 -->
 {maccms:vod num="20" paging="yes" pageurl="vod/show" type="current" order="desc" by="time"}
   <li><a href="{:mac_url_vod_detail($vo)}" title="{$vo.vod_name}">
      <img src="{:mac_url_img($vo.vod_pic)}" alt="{$vo.vod_name}"/>
      <h2>{$vo.vod_name}</h2>
      <p>{$vo.vod_actor}</p>
      <i>{$vo.vod_remarks}</i>
   </a></li>
{/maccms:vod}
<!-- 通用分页代码 -->`} />
                  </ul>

                </div>

                <div id={'视频搜索'} ref={sectionRefs[7]} className={'w-full'}>
                  <h3>{t("theme.s40")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss47.s1'), 'li')}
                    {markdownify(t('theme.ss47.s2'), 'li')}
                    {markdownify(t('theme.ss47.s3'), 'li')}
                    <div className='table-wrapper'>
                      <table>
                        <thead className='thead'>
                        <tr>
                          <th>参数</th>
                          <th>示例值</th>
                          <th>必有参数</th>
                          <th>参数说明</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>wd</td>
                          <td>1</td>
                          <td>是</td>
                          <td>关键词</td>
                        </tr>
                        <tr>
                          <td>area</td>
                          <td>大陆</td>
                          <td>否</td>
                          <td>搜索地区</td>
                        </tr>
                        <tr>
                          <td>lang</td>
                          <td>国语</td>
                          <td>否</td>
                          <td>搜索语言</td>
                        </tr>
                        <tr>
                          <td>year</td>
                          <td>2019</td>
                          <td>否</td>
                          <td>搜索年代</td>
                        </tr>
                        <tr>
                          <td>tag</td>
                          <td>国产大片</td>
                          <td>否</td>
                          <td>搜索标签</td>
                        </tr>
                        <tr>
                          <td>class</td>
                          <td>科幻片</td>
                          <td>否</td>
                          <td>搜搜类型</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>

                    {markdownify(t('theme.ss47.s4'), 'li')}
                    <InlineCode type={''} lines={1} code={`index.php/vodsearch/变形金刚-------------.html`}/>
                    {markdownify(t('theme.ss47.s5'), 'li')}
                    {markdownify(t('theme.ss47.s6'), 'li')}
                    {markdownify(t('theme.ss47.s7'), 'li')}
                    <InlineCode type={'html'} lines={11} code={`<!-- 表单 -->
<form id="search" name="search" method="get" action="{:mac_url('vod/search')}" onSubmit="return qrsearch();">
   <input type="text" name="wd" class="mac_wd" value="{$param.wd}" placeholder="请在此处输入影片名或演员名称" />
   <input type="submit" class="mac_search" value="搜索影片" />
</form>
<!-- 后台预设关键词 -->
 <div class="hotkeys">热搜：
   {maccms:foreach name=":explode(',',$maccms.search_hot)" id="vo2" key="key2"}
   <a href="{:mac_url('vod/search',['wd'=>$vo2])}">{$vo2}</a>
   {/maccms:foreach}
</div>`}/>
                  </ul>
                </div>

                <div id={'视频详情'} ref={sectionRefs[8]} className={'w-full'}>
                  <h3>{t("theme.s41")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss48.s1'), 'li')}
                    {markdownify(t('theme.ss48.s2'), 'li')}
                    {markdownify(t('theme.ss48.s3'), 'li')}
                    {markdownify(t('theme.ss48.s4'), 'li')}
                    <div className='info'>
                      <p className='title'>{t('theme.ss48.s5')}</p>
                      {markdownify(t('theme.ss48.s6'), 'p', 'message')}
                    </div>
                  </ul>
                </div>

                <div id={'详情常用示例'} ref={sectionRefs[9]} className={'w-full'}>
                  <h3>{t("theme.s42")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss48.s7'), 'li')}
                    <InlineCode type={'html'} lines={5} code={`{notempty name="$obj.vod_pic_screenshot"}
{volist name=":explode('$$$',$obj.vod_pic_screenshot);" id="vo2"}
    <img src="{:mac_url_img($vo2)}" >
{/volist}
{/notempty}`} />
                    {markdownify(t('theme.ss48.s8'), 'li')}
                    <InlineCode type={'html'} lines={26} code={`<!-- 播放 -->
{maccms:foreach name="obj.vod_play_list" id="vo"}
<div class="ui-box marg" id="playlist_1">
    <div class="down-title">
        <h2>{$vo.from}-在线播放</h2><span>[{$vo.player_info.tip}]</span>
    </div>
    <div class="video_list fn-clear">
        {maccms:foreach name="vo.urls" id="vo2"}
        <a href="{:mac_url_vod_play($obj,['sid'=>$vo.sid,'nid'=>$vo2.nid])}" >{$vo2.name}</a>
        {/maccms:foreach}
    </div>
</div>
{/maccms:foreach}
<!-- 下载 -->
{maccms:foreach name="obj.vod_down_list" id="vo"}
<div class="ui-box marg" id="downlist_1">
    <div class="down-title">
        <h2>{$vo.from}-下载</h2><span>[{$vo.player_info.tip}]</span>
    </div>
    <div class="video_list fn-clear">
        {maccms:foreach name="vo.urls" id="vo2"}
        <a href="{:mac_url_vod_down($obj,['sid'=>$vo.sid,'nid'=>$vo2.nid])}" >{$vo2.name}</a>
        {/maccms:foreach}
    </div>
</div>
{/maccms:foreach}`}/>
                  </ul>
                </div>

                <div id={'视频播放'} ref={sectionRefs[10]} className={'w-full'}>
                  <h3>{t("theme.s43")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss49.s1'))}
                    {markdownify(t('theme.ss49.s2'))}
                    {markdownify(t('theme.ss49.s3'))}
                    {markdownify(t('theme.ss49.s4'))}
                  </ul>
                  <div className='info'>
                    <p className='title'>{t('theme.ss49.s5')}</p>
                    {markdownify(t('theme.ss49.s6'), 'p', 'message')}
                  </div>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>必有参数</th>
                        <th>参数说明</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>id</td>
                        <td>1</td>
                        <td>是</td>
                        <td>影片id</td>
                      </tr>
                      <tr>
                        <td>nid</td>
                        <td>1</td>
                        <td>是</td>
                        <td>当前播放组id</td>
                      </tr>
                      <tr>
                        <td>aid</td>
                        <td>1</td>
                        <td>是</td>
                        <td>当前集数id</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4>{t('theme.ss49.s7')}</h4>
                  <InlineCode type={''} lines={15} code={`=======视频播放页独有标签=======
{$param.sid} 当前播放组序号
{$param.nid} 当前集数序号

{$obj.player_info.link_next} 下一页地址，最后一页时此链接将当前页链接
{$obj.player_info.link_pre} 上一页地址，第一页时此链接将当前页链接

{$obj['vod_play_list'][$param['sid']]} 获取当前播放组数据
{$obj['vod_play_list'][$param['sid']]['player_info']}  播放器信息
{$obj['vod_play_list'][$param['sid']]['server_info']}  服务器组信息
{$obj['vod_play_list'][$param['sid']]['url_count']} 总集数
{$obj['vod_play_list'][$param['sid']]['urls']} 集数信息
{$obj['vod_play_list'][$param['sid']]['urls'][$param['nid']]} 当前集数信息
{$obj['vod_play_list'][$param['sid']]['urls'][$param['nid']]['name']} 当前集数名称
{$obj['vod_play_list'][$param['sid']]['urls'][$param['nid']]['url']} 当前集数url`}/>
                  {markdownify(t('theme.ss49.s8'))}
                  <h4>{t('theme.ss49.s9')}</h4>
                  <ul className='list'>
                    <li>{t('theme.ss49.s10')}</li>
                    <InlineCode type={''} lines={2} code={`{$player_data} 播放数据
{$player_js} 加载播放器`}/>
                  </ul>
                  <h4>{t('theme.ss49.s11')}</h4>
                  <InlineCode type={'html'} lines={12} code={`<h2>与<strong>“{$obj.vod_name}”</strong>关联的视频</h2>
<ul class="img-list dis">
    {maccms:vod num="6" ids="'.$obj['vod_rel_vod'].'" order="desc" by="time"}
        <li><a href="{:mac_url_vod_detail($vo)}" title="{$vo.vod_name}"><img src="{:mac_url_img($vo.vod_pic)}" alt="{$vo.vod_name}"/><h2>{$vo.vod_name}</h2><p></p><i>{$vo.vod_version}</i><em></em></a></li>
    {/maccms:vod}
</ul>
<h2>与<strong>“{$obj.vod_name}”</strong>关联的文章</h2>
<ul class="img-list dis">
    {maccms:art num="6" ids="'.$obj['vod_rel_art'].'" order="desc" by="time"}
        <li><a href="{:mac_url_art_detail($vo)}" title="{$vo.art_name}"><img src="{:mac_url_img($vo.art_pic)}" alt="{$vo.art_name}"/><h2>{$vo.art_name}</h2><p></p><i>{$vo.vod_from}</i><em></em></a></li>
    {/maccms:art}
</ul>`}/>
                  <h4>{t('theme.ss49.s12')}</h4>
                  <ul className='list'>
                    <li>{t('theme.ss49.s13')}</li>
                    <InlineCode type={'html'} lines={5} code={`<script>
    {if condition="$obj.vod_jumpurl neq ''"}
        location.href='{$obj.vod_jumpurl}';
    {/if}
</script>`}/>
                  </ul>
                  <li>{t('theme.ss49.s14')}</li>
                  {markdownify(t('theme.ss49.s15'), 'li')}
                  <li>{t('theme.ss49.s16')}</li>
                  <InlineCode type={'html'} lines={5} code={`<script>
    {if condition="strpos($obj['vod_play_list'][$param['sid']]['urls'][$param['nid']]['url'],'jump:')!==false "}
        location.href='{$obj['vod_play_list'][$param['sid']]['urls'][$param['nid']]['url']|str_replace="jump:","http:",###}';
    {/if}
</script>`} />
                </div>

                <div id={'iframe播放器'} ref={sectionRefs[11]} className={'w-full'}>
                  <h3>{t("theme.s44")}</h3>
                  {markdownify(t('theme.ss49.s17'), 'p')}
                  <ul className='list'>
                    {markdownify(t('theme.ss49.s18'), 'li')}
                    {markdownify(t('theme.ss49.s19'), 'li')}
                    {markdownify(t('theme.ss49.s20'), 'li')}
                    {markdownify(t('theme.ss49.s21'), 'li')}
                    {markdownify(t('theme.ss49.s22'), 'li')}
                    <InlineCode type={'html'} lines={55} code={`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <title>iframe播放器</title>
    <style>*{word-wrap:break-word;outline:none} html,body{width:100%;height:100%;background:#000;color:#fff;}
    .player_popeom{ width:500px;height:150px; position:absolute;text-align:center; top:50%;left:50%;margin:-75px 0 0 -250px; }
    .player_popeom a{  padding: 10px 16px;
        font-size: 18px;
        line-height: 1.3333333;
        border-radius: 6px; color: #fff;  background-color: #5cb85c;  border-color: #4cae4c;  }
    </style>
    <script src="{$maccms.path}static/js/jquery.js"></script>
    <script>var maccms={"path":"__ROOT__","mid":"{$maccms['mid']}","url":"{$maccms['site_url']}","wapurl":"{$maccms['site_wapurl']}","mob_status":"{$maccms['mob_status']}"};</script>
</head>
<body topmargin="0" leftmargin="0" marginheight="0" marginwidth="0">
{$player_data}
{$player_js}
{if condition="$popedom.code gt 1"/}
<div class="player_showtry" style="display:none;">
    <div class="player_box">
        <div class="player_popeom">
            {if condition="$obj.vod_points_play eq 0"}
            <p>试看{$popedom.trysee}分钟结束，完整观看本影片需要升级会员组，请升级后观看。</p>
            <small>提示：购买VIP会员组，享受超级权限，谢谢支持。</small>
            <p><a href="{:url('user/index')}" target="_blank">会员中心</a> <a href="{:url('user/upgrade')}" target="_blank">马上升级</a></p>
            {else/}
            <p>试看{$popedom.trysee}分钟结束，完整观看本影片需要花费{$obj.vod_points_play}积分，请支付后观看。</p>
            <small>提示：一次支付，永久观看，不重复扣费，谢谢支持。</small>

            {if condition="$user.group.group_id eq 1"}
                <p><a href="{:url('user/login')}" target="_blank">马上登录</a></p>
            {else/}
                <p><a href="{:url('user/buy')}" target="_blank">马上充值</a> <a href="javascript:;" onclick="window.parent.MAC.User.BuyPopedom(this)" data-id="{$obj.vod_id}" data-sid="{$param.sid}" data-nid="{$param.nid}" data-type="4" data-mid="1">确认购买</a></p>
            {/if}
            {/if}

        </div>
    </div>
</div>
<script>
    //方式一本页面计算
     window.setTimeout(function(){
     $('.MacPlayer').html( $('.player_showtry').html() );
     },1000*60*{$popedom.trysee});

    //方式二调用父页面公共函数库
    //window.parent.MAC.User.PopedomCallBack({$popedom.trysee},$('.player_showtry').html() );
</script>
{/if}


</body>
</html>`}/>
                  </ul>

                </div>

                <div id={'视频下载'} ref={sectionRefs[12]} className={'w-full'}>
                  <h3>{t("theme.s45")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss49.s23'), 'li')}
                    {markdownify(t('theme.ss49.s24'), 'li')}
                    {markdownify(t('theme.ss49.s25'), 'li')}
                    {markdownify(t('theme.ss49.s26'), 'li')}
                    <div className='info'>
                      <p className='title'>{t('theme.ss49.s5')}</p>
                      {markdownify(t('theme.ss49.s27'), 'p', 'message')}
                    </div>
                  </ul>
                </div>

                <div id={'iframe下载器'} ref={sectionRefs[13]} className={'w-full'}>
                  <h3>{t("theme.s46")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss49.s28'), 'li')}
                    {markdownify(t('theme.ss49.s29'), 'li')}
                    <InlineCode type={'html'} lines={51} code={`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <title>iframe下载器</title>
    <style>*{word-wrap:break-word;outline:none} html,body{width:100%;height:100%;background:#000;color:#fff;}
    .player_popeom{ width:500px;height:150px; position:absolute;text-align:center; top:50%;left:50%;margin:-75px 0 0 -250px; }
    .player_popeom a{  padding: 10px 16px;
        font-size: 18px;
        line-height: 1.3333333;
        border-radius: 6px; color: #fff;  background-color: #5cb85c;  border-color: #4cae4c;  }
    </style>
    <script src="{$maccms.path}static/js/jquery.js"></script>
    <script>var maccms={"path":"__ROOT__","mid":"{$maccms['mid']}","url":"{$maccms['site_url']}","wapurl":"{$maccms['site_wapurl']}","mob_status":"{$maccms['mob_status']}"};</script>
</head>
<body topmargin="0" leftmargin="0" marginheight="0" marginwidth="0">
{$player_data}
{$player_js}
{if condition="$popedom.code gt 1"/}
<div class="player_showtry" style="display:none;">
    <div class="player_box">
        <div class="player_popeom">
            {if condition="$obj.vod_points_down eq 0"}
            <p>试看{$popedom.trysee}分钟结束，完整观看本影片需要升级会员组，请升级后观看。</p>
            <small>提示：购买VIP会员组，享受超级权限，谢谢支持。</small>
            <p><a href="{:url('user/index')}" target="_blank">会员中心</a> <a href="{:url('user/upgrade')}" target="_blank">马上升级</a></p>
            {else/}
            <p>试看{$popedom.trysee}分钟结束，完整观看本影片需要花费{$obj.vod_points_down}积分，请支付后观看。</p>
            <small>提示：一次支付，永久观看，不重复扣费，谢谢支持。</small>

            {if condition="$user.group.group_id eq 1"}
                <p><a href="{:url('user/login')}" target="_blank">马上登录</a></p>
            {else/}
                <p><a href="{:url('user/buy')}" target="_blank">马上充值</a> <a href="javascript:;" onclick="window.parent.MAC.User.BuyPopedom(this)" data-id="{$obj.vod_id}" data-sid="{$param.sid}" data-nid="{$param.nid}" data-type="5">确认购买</a></p>
            {/if}
            {/if}
        </div>
    </div>
</div>
<script>
    //方式一本页面计算
     window.setTimeout(function(){
     $('.MacPlayer').html( $('.player_showtry').html() );
     },1000*60*{$popedom.trysee});
    //方式二调用父页面公共函数库
    //window.parent.MAC.User.PopedomCallBack({$popedom.trysee},$('.player_showtry').html() );
</script>
{/if}
</body>
</html>`} />
                  </ul>
                </div>

                <div id={'分集剧情'} ref={sectionRefs[14]} className={'w-full'}>
                  <h3>{t("theme.s47")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss49.s30'), 'li')}
                    {markdownify(t('theme.ss49.s31'), 'li')}
                    {markdownify(t('theme.ss49.s32'), 'li')}
                    {markdownify(t('theme.ss49.s33'), 'li')}
                  </ul>
                </div>

                <div id={'影片角色'} ref={sectionRefs[15]} className={'w-full'}>
                  <h3>{t("theme.s48")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss49.s34'), 'li')}
                    {markdownify(t('theme.ss49.s31'), 'li')}
                    {markdownify(t('theme.ss49.s32'), 'li')}
                    {markdownify(t('theme.ss49.s33'), 'li')}
                  </ul>
                </div>

                <div id={'相关提示'} ref={sectionRefs[16]} className={'w-full'}>
                  <h3>{t("theme.s49")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ss49.s35'), 'li')}
                    {markdownify(t('theme.ss49.s36'), 'li')}
                    <InlineCode type={'html'} lines={39} code={`<!DOCTYPE html>
<html lang="en">
<head>
\t<meta charset="utf-8">
\t<title>使用积分购买权限</title>
\t<link rel="stylesheet" href="__STATIC__/css/home.css">
\t<style>
\t\tbody{background:#F9FAFD;color:#818181;}
\t\t.text a{  padding: 10px 16px;
\t\t\tfont-size: 18px;
\t\t\tline-height: 1.3333333;
\t\t\tborder-radius: 6px; color: #fff;  background-color: #5cb85c;  border-color: #4cae4c;  }
\t</style>
\t<script src="{$maccms.path}static/js/jquery.js"></script>
\t<script>var maccms={"path":"__ROOT__","mid":"{$maccms['mid']}","url":"{$maccms['site_url']}","wapurl":"{$maccms['site_wapurl']}","mob_status":"{$maccms['mob_status']}"};</script>
\t<script src="{$maccms.path}static/js/home.js"></script>
</head>
<body>
<div class="mac_msg_jump">
\t<div class="msg_jump_tit">系统提示:</div>
\t<div class="title">亲爱的用户：</div>
\t<div class="text">
\t\t{$popedom.msg}
\t\t<p>提示：一次支付，永久观看，不重复扣费，谢谢支持。</p>
\t\t<p>
\t\t\t{if condition="$user.group.group_id eq 1"}
\t\t\t<a href="javascript:;" class="mac_user" target="_blank">马上登录</a>
\t\t\t{else/}
\t\t\t<a href="{:url('user/buy')}" target="_blank">马上充值</a>
\t\t\t<a href="javascript:;" onclick="MAC.User.BuyPopedom(this)" data-id="{$obj.vod_id}" data-sid="{$param.sid}" data-nid="{$param.nid}" data-mid="1" data-type="{if condition="$obj.player_info.flag eq 'play'"}4{else/}5{/if}" data-mid="1">确认购买</a>
\t\t\t{/if}
\t\t</p>
\t</div>
</div>
<script type="text/javascript">

</script>
</body>
</html>`} />
                    {markdownify(t('theme.ss49.s37'), 'li')}
                    {markdownify(t('theme.ss49.s36'), 'li')}
                    <InlineCode type={'html'} lines={40} code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <title>系统提示【{$obj['vod_name']}】因为版权问题，本站不提供在线播放</title>
    <link rel="stylesheet" href="__STATIC__/css/home.css">
    <style>
        body{background:#F9FAFD;color:#818181;}
    </style>
</head>
<body>
<div class="mac_msg_jump">
    <div class="msg_jump_tit">系统提示...</div>
    <div class="title">亲爱的用户：</div>
    <div class="text">【{$obj['vod_name']}】{$GLOBALS['config']['app']['copyright_notice']}</div>
    <div class="jump">
        {if condition="$obj['vod_jumpurl'] neq ''"}
        页面自动 <a id="href" href="<?php echo($obj['vod_jumpurl']);?>">跳转</a> 等待时间： <b id="wait">3</b>
        {/if}
    </div>
    <!-- 可自定义该页面的显示方式，可加入广告 -->
</div>
<script type="text/javascript">
    {if condition="$obj['vod_jumpurl'] neq ''"}
    (function(){
        var wait = document.getElementById('wait'),
            href = document.getElementById('href').href;
        var interval = setInterval(function(){
            var time = --wait.innerHTML;
            if(time <= 0) {
                top.location.href = href;
                clearInterval(interval);
            };
        }, 1000);
    })();
    {/if}
</script>
</body>
</html>`} />
                    {markdownify(t('theme.ss49.s38'), 'li')}
                    {markdownify(t('theme.ss49.s36'), 'li')}
                    <InlineCode type={'html'} lines={41} code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <title>系统提示......</title>
    <link rel="stylesheet" href="__STATIC__/css/home.css">
    <style>
        body{background:#F9FAFD;color:#818181}
        input{border:1px solid #ccc;padding:7px 0;border-radius:3px;padding-left:5px}
        .item{line-height:50px}
        .submit_btn{width:70px;height:40px;border-width:0;padding:10px;display:border-radius: 3px;background:#1E90FF;cursor:pointer;font-family:Microsoft YaHei;color:#fff;font-size:17px}
    </style>
    <script src="{$maccms.path}static/js/jquery.js"></script>
    <script>var maccms={"path":"__ROOT__","mid":"{$maccms['mid']}","url":"{$maccms['site_url']}","wapurl":"{$maccms['site_wapurl']}","mob_status":"{$maccms['mob_status']}"};</script>
    <script src="{$maccms.path}static/js/home.js"></script>
</head>
<body>
<div class="mac_msg_jump">
    <div class="msg_jump_tit">系统提示...</div>
    <div class="title">亲爱的访问此数据需要密码哦~~~</div>
    <div class="text">
        <form id="form1" name="form1" action="" style="margin:0;width:400px;text-align: center;" method="post">
            <div class="item">
                <label>密码：</label>
                <input type="password" name="pwd" placeholder="请在此输入访问密码..."/>
                {if condition="$obj.vod_pwd_url neq ''"}
                    <a href="{$obj.vod_pwd_url}" target="_blank">点击获取密码</a>
                {else/}
                    <span>密码：{$obj.vod_pwd}</span>
                {/if}
            </div>
            <div class="item">
                <a class="submit_btn" href="javascript:;" onclick="MAC.Pwd.Check(this)" data-mid="1" data-id="{$obj.vod_id}" data-type="1" />点击确认</a>
            </div>
        </form>
    </div>
</div>
</div>
</body>
</html>`} />
                    {markdownify(t('theme.ss49.s39'), 'li')}
                    {markdownify(t('theme.ss49.s36'), 'li')}
                    <InlineCode type={'html'} lines={41} code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <title>系统提示......</title>
    <link rel="stylesheet" href="__STATIC__/css/home.css">
    <style>
        body{background:#000000;color:#818181}
        input{border:1px solid #ccc;padding:7px 0;border-radius:3px;padding-left:5px}
        .item{line-height:50px}
        .submit_btn{width:70px;height:40px;border-width:0;padding:10px;display:border-radius: 3px;background:#1E90FF;cursor:pointer;font-family:Microsoft YaHei;color:#fff;font-size:17px}
    </style>
    <script src="{$maccms.path}static/js/jquery.js"></script>
    <script>var maccms={"path":"__ROOT__","mid":"{$maccms['mid']}","url":"{$maccms['site_url']}","wapurl":"{$maccms['site_wapurl']}","mob_status":"{$maccms['mob_status']}"};</script>
    <script src="{$maccms.path}static/js/home.js"></script>
</head>
<body>
<div class="mac_msg_jump">
    <div class="msg_jump_tit">系统提示...</div>
    <div class="title">亲爱的访问此数据需要密码哦~~~</div>
    <div class="text">
        <form id="form1" name="form1" action="" style="margin:0;width:400px;text-align: center;" method="post">
            <div class="item">
                <label>密码：</label>
                <input type="password" name="pwd" placeholder="请在此输入访问密码..."/>
                {if condition="$obj.vod_pwd_play_url neq ''"}
                    <a href="{$obj.vod_pwd_url}" target="_blank">点击获取密码</a>
                {else/}
                    <span>密码：{$obj.vod_pwd_play}</span>
                {/if}
            </div>
            <div class="item">
                <a class="submit_btn" href="javascript:;" onclick="MAC.Pwd.Check(this)" data-mid="1" data-id="{$obj.vod_id}" data-type="4" />点击确认</a>
            </div>
        </form>
    </div>
</div>
</div>
</body>
</html>`} />
                    {markdownify(t('theme.ss49.s40'), 'li')}
                    {markdownify(t('theme.ss49.s36'), 'li')}
                    <InlineCode type={'html'} lines={41} code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <title>系统提示......</title>
    <link rel="stylesheet" href="__STATIC__/css/home.css">
    <style>
        body{background:#000000;color:#818181}
        input{border:1px solid #ccc;padding:7px 0;border-radius:3px;padding-left:5px}
        .item{line-height:50px}
        .submit_btn{width:70px;height:40px;border-width:0;padding:10px;display:border-radius: 3px;background:#1E90FF;cursor:pointer;font-family:Microsoft YaHei;color:#fff;font-size:17px}
    </style>
    <script src="{$maccms.path}static/js/jquery.js"></script>
    <script>var maccms={"path":"__ROOT__","mid":"{$maccms['mid']}","url":"{$maccms['site_url']}","wapurl":"{$maccms['site_wapurl']}","mob_status":"{$maccms['mob_status']}"};</script>
    <script src="{$maccms.path}static/js/home.js"></script>
</head>
<body>
<div class="mac_msg_jump">
    <div class="msg_jump_tit">系统提示...</div>
    <div class="title">亲爱的访问此数据需要密码哦~~~</div>
    <div class="text">
        <form id="form1" name="form1" action="" style="margin:0;width:400px;text-align: center;" method="post">
            <div class="item">
                <label>密码：</label>
                <input type="password" name="pwd" placeholder="请在此输入访问密码..."/>
                {if condition="$obj.vod_pwd_down_url neq ''"}
                    <a href="{$obj.vod_pwd_url}" target="_blank">点击获取密码</a>
                {else/}
                    <span>密码：{$obj.vod_pwd_down}</span>
                {/if}
            </div>
            <div class="item">
                <a class="submit_btn" href="javascript:;" onclick="MAC.Pwd.Check(this)" data-mid="1" data-id="{$obj.vod_id}" data-type="5" />点击确认</a>
            </div>
        </form>
    </div>
</div>
</div>
</body>
</html>`} />
                    {markdownify(t('theme.ss49.s41'), 'li')}
                  </ul>
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/structure" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s4")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/theme-art" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s6")}</span>
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