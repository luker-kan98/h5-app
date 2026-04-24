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

  const list1 = t('theme.ws.s8', {returnObjects: true});

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
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s9')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s9")}</h2>
                  <div className='info'>
                    <p className='title'>{t('theme.ws.s1')}</p>
                    <p className='message'>{t('theme.ws.s2')}</p>
                  </div>
                  <ul className='list'>
                    {markdownify(t('theme.ws.s3'), 'li')}
                    {markdownify(t('theme.ws.s4'), 'li')}
                    {markdownify(t('theme.ws.s5'), 'li')}
                    {markdownify(t('theme.ws.s6'), 'li')}
                  </ul>
                </div>
                <div id={'标签参数'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s72")}</h3>
                  <ul className='list'>
                    {list1.map((item, index)=><li key={index}>{markdownify(item)}</li>)}
                  </ul>
                  <h4>{t('theme.ws.s9')}</h4>
                  <InlineCode type={'html'} lines={10} code={`{maccms:website num="10" paging="no" order="asc" by="sort"}
  <a href="{:mac_url_website_detail($vo)}">
      <img src="{:mac_url_img($vo.websitepic)}" alt="{$vo.website_name}" />
      <dl>
         <dt>{$vo.website_name}</dt>
         <dd class="bg">备注：{$vo.website_remarks}</dd>
      </dl>
   </a>
   <!-- 更多内部标签字段请参考网址字段 以$vo.开头即可 -->
{/maccms:website}`} />
                </div>

                <div id={'来路排序示例'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s73")}</h3>
                  {markdownify(t('theme.ws.s10'), 'p')}
                  {markdownify(t('theme.ws.s11'), 'p')}
                  <InlineCode type={'html'} lines={9} code={`{maccms:website num="10" paging="no"  by="sort" by="referer_day"}
  <a href="{:mac_url_website_detail($vo)}">
      <img src="{$vo.website_jumpurl}" alt="{$vo.website_name}" />
      <dl>
         <dt>{$vo.website_name}</dt>
         <dd class="bg">备注：{$vo.website_remarks}</dd>
      </dl>
   </a>
{/maccms:website}`} />
                </div>

                <div id={'网址字段'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s74")}</h3>
                  <InlineCode type={''} lines={35} code={`{$obj.website_id} 网址id
{$obj.type_id} 分类id
{$obj.type_id_1} 一级分类id
{$obj.website_name} 网址名
{$obj.website_sub} 副标
{$obj.website_en} 拼音
{$obj.website_jumpurl} 跳转url
{$obj.website_status} 状态
{$obj.website_lock} 锁定
{$obj.website_letter} 首字母
{$obj.website_color} 高亮颜色
{$obj.website_remarks} 备注
{$obj.website_tag} tags
{$obj.website_class} 扩展分类
{$obj.website_pic} 截图
{$obj.website_pic_screenshot}截图多个图片用$$$连接
{$obj.website_logo} logo
{$obj.website_sort} 排序
{$obj.website_level} 推荐值
{$obj.website_up} 顶数
{$obj.website_down} 踩数
{$obj.website_score} 平均分
{$obj.website_score_all} 总评分
{$obj.website_score_num} 评分次数
{$obj.website_time} 更新时间
{$obj.website_time_add} 添加时间
{$obj.website_time_hits} 点击时间
{$obj.website_time_make} 生成时间
{$obj.website_referer} 总来路
{$obj.website_referer_day} 日来路
{$obj.website_referer_week} 周来路
{$obj.website_referer_month} 月来路
{$obj.website_tpl} 自定义模板
{$obj.website_content} 详情
{$obj|mac_url_website_detail} 获取网址详情页链接`} />
                </div>

                <div id={'网址首页'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s75")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ws.s12'), 'li')}
                    {markdownify(t('theme.ws.s13'), 'li')}
                    {markdownify(t('theme.ws.s14'), 'li')}
                  </ul>
                </div>

                <div id={'网址分类'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s76")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ws.s15'), 'li')}
                    {markdownify(t('theme.ws.s16'), 'li')}
                    {markdownify(t('theme.ws.s17'), 'li')}
                    {markdownify(t('theme.ws.s18'), 'li')}
                    {markdownify(t('theme.ws.s19'), 'li')}
                  </ul>
                  <h4>{t('theme.ws.s20')}</h4>
                  <InlineCode type={'html'} lines={10} code={`<!-- 列表 -->
{maccms:website num="24" paging="yes" type="current" order="desc" by="time"}
 <li><a href="{:mac_url_website_detail($vo)}" title="{$vo.website_name}">
    <img src="{:mac_url_img($vo.website_pic)}" alt="{$vo.website_name}"/>
    <h2>{$vo.website_name}</h2>
    <p>{$vo.website_actor}</p>
    <i>{$vo.website_version}</i>
</a></li>
{/maccms:website}
<!-- 通用分页 -->`} />
                </div>

                <div id={'网址筛选'} ref={sectionRefs[6]} className={'w-full'}>
                  <h3>{t("theme.s77")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ws.s21'), 'li')}
                    {markdownify(t('theme.ws.s22'), 'li')}
                    {markdownify(t('theme.ws.s23'), 'li')}
                  </ul>
                  <strong>{t('theme.ws.s24')}</strong>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th className='w-[90px]'>参数</th>
                        <th className='w-[90px]'>示例值</th>
                        <th className='w-[90px]'>必有</th>
                        <th className='min-w-[300px]'>参数说明</th>
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
                        <td>tag</td>
                        <td>难</td>
                        <td>否</td>
                        <td>标签</td>
                      </tr>
                      <tr>
                        <td>class</td>
                        <td>B型</td>
                        <td>否</td>
                        <td>扩展分类</td>
                      </tr>
                      <tr>
                        <td>lang</td>
                        <td>中文</td>
                        <td>否</td>
                        <td>语言</td>
                      </tr>
                      <tr>
                        <td>area</td>
                        <td>中国</td>
                        <td>否</td>
                        <td>地区</td>
                      </tr>
                      <tr>
                        <td>letter</td>
                        <td>H</td>
                        <td>否</td>
                        <td>首字母</td>
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
                        <td>排序依据筛选：id, time, time_add, score, hits, hits_day, hits_week, hits_month, up, down,
                          level
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <h4>{t('theme.ws.s25')}</h4>
                    <InlineCode type={'html'} lines={54} code={`<div class="ui-cnt">
   <div class="filter-list fn-clear">
      <h5>类型：</h5>
      <ul>
         <li><a {if condition="$param['class'] eq ''"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'level'=>$param['level'],'letter'=>$param['letter'],'tag'=>$param['tag'],'class'=>'','order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部</a></li>
         
         {maccms:foreach name=":explode(',',$obj.type_extend.class)" id="vo2" key="key2"}
         <li><a {if condition="$param['class'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'level'=>$param['level'],'letter'=>$param['letter'],'tag'=>$param['tag'],'class'=>$vo2,'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
         {/maccms:foreach}
            
      </ul>
   </div>
   <div class="filter-list fn-clear">
      <h5>地区：</h5>
      <ul>
         <li><a {if condition="$param['area'] eq ''"} class="current" {/if} href="{:mac_url_type($obj,['area'=>'','lang'=>$param['lang'],'level'=>$param['level'],'letter'=>$param['letter'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部</a></li>
         
         {maccms:foreach name=":explode(',',$obj.type_extend.area)" id="vo2" key="key2"}
         <li><a {if condition="$param['area'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$vo2,'lang'=>$param['lang'],'level'=>$param['level'],'letter'=>$param['letter'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
         {/maccms:foreach}
          
      </ul>
   </div>
   <div class="filter-list fn-clear">
      <h5>语言：</h5>
      <ul>
         <li><a {if condition="$param['lang'] eq ''"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>'','level'=>$param['level'],'letter'=>$param['letter'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部</a></li>
         {maccms:foreach name=":explode(',',$obj.type_extend.lang)" id="vo2" key="key2"}
         <li><a {if condition="$param['lang'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$vo2,'level'=>$param['level'],'letter'=>$param['letter'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a></li>
         {/maccms:foreach} 
      </ul>
   </div>
   <div class="filter-list filter-list-letter fn-clear">
      <h5>字母：</h5>
      <ul>
         <li><a  {if condition="$param['letter'] eq ''"} class="current"{/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'level'=>$param['level'],'letter'=>'','tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部</a></li>
         {maccms:foreach name=":explode(',','A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0~9')" id="vo2" key="key2"}
         <li><a {if condition="$param['letter'] eq $vo2"} class="current"{/if} {/if} href="{:mac_url_type($obj,['area'=>$param['area'],'lang'=>$param['lang'],'level'=>$param['level'],'letter'=>$vo2,'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}</a><li>
         {/maccms:foreach}
      </ul>
   </div>
</div>


<!-- 列表 -->
{maccms:website num="24" paging="yes" pageurl="website/show" type="current" order="desc" by="time"}
 <li><a href="{:mac_url_website_detail($vo)}" title="{$vo.website_name}">
    <img src="{:mac_url_img($vo.website_pic)}" alt="{$vo.website_name}"/>
    <h2>{$vo.website_name}</h2>
    <p>{$vo.website_actor}</p>
    <i>{$vo.website_version}</i>
</a></li>
{/maccms:website}
<!-- 通用分页 -->`}/>
                  </div>
                </div>

                <div id={'网址搜索'} ref={sectionRefs[7]} className={'w-full'}>
                  <h3>{t("theme.s78")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ws.s26'), 'li')}
                    {markdownify(t('theme.ws.s27'), 'li')}
                    {markdownify(t('theme.ws.s28'), 'li')}
                  </ul>
                  <h4>{t('theme.ws.s29')}</h4>
                  <InlineCode type={'html'} lines={4} code={`<form id="search" name="search" method="get" action="{:mac_url('website/search')}" onSubmit="return qrsearch();">
   <input type="text" name="wd" class="mac_wd" value="{$param.wd}" placeholder="网站名称" />
   <input type="submit" class="mac_search" value="搜索网站" />
</form>`}/>
                  <h4>{t('theme.ws.s30')}</h4>
                  <InlineCode type={'html'} lines={7} code={`{maccms:website num="10" paging="yes" pageurl="website/search" order="desc" by="time"}
   <li><a class="play-img" href="{:mac_url_website_detail($vo)}">
      <img src="{:mac_url_img($vo.website_logo)}" alt="logo" /></a>
      <h2><a href="{:mac_url_website_detail($vo)}">{$vo.website_name}</a></h2>
      <dl><dt>网站：</dt><dd>{$vo.website_website}</dd></dl>
   </li>
   {/maccms:website}`} />
                </div>

                <div id={'网址详情'} ref={sectionRefs[8]} className={'w-full'}>
                  <h3>{t("theme.s79")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ws.s31'), 'li')}
                    {markdownify(t('theme.ws.s32'), 'li')}
                    {markdownify(t('theme.ws.s33'), 'li')}
                    {markdownify(t('theme.ws.s34'), 'li')}
                    {markdownify(t('theme.ws.s35'), 'li')}
                  </ul>
                  <div className='info'>
                    <p className='title'>{t('theme.ws.s36')}</p>
                    {markdownify(t('theme.ws.s37'), 'p', 'message')}
                  </div>
                  <h4>{t('theme.ws.s38')}</h4>
                  <InlineCode type={'html'} lines={6} code={`<h1>网站名称：{$obj.website_name}</h1>
<p>域名：{$obj.website_jumpurl}</p>
<img src="{:mac_url_img($obj.website_logo)}" alt="logo" />
<!-- 网站详细介绍 -->
<div class="content">{$obj.website_content}</div>
<!-- 详情页当前网址数据为 {$obj} 数组,如下查询全部字段可以参考网址字段-->`}/>

                  <div className='info'>
                    <p className='title'>{t('theme.ws.s39')}</p>
                    {markdownify(t('theme.ws.s40'), 'p', 'message')}
                  </div>
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/theme-actor" className="flex flex-row items-center gap-[6px]">
                  <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s8")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/theme-user" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s10")}</span>
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