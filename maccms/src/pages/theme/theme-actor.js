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

  const list1 = t('act.p1.s6', {returnObjects: true});

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
    <ThemeLayout title={`${t('theme.s8')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s8")}</h2>
                  <p>{t('act.p1.s1')}</p>
                  <ul className='list'>
                    {markdownify(t('act.p1.s2'), 'li')}
                    {markdownify(t('act.p1.s3'), 'li')}
                    {markdownify(t('act.p1.s4'), 'li')}
                    {markdownify(t('act.p1.s5'), 'li')}
                  </ul>

                </div>
                <div id={'标签参数'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s64")}</h3>
                  <ul className='list'>
                    {list1.map((item, index) =>
                        <li key={index}>{markdownify(item)}</li>
                    )}
                    <InlineCode type={'html'} lines={5} code={`{maccms:actor num="10" order="desc" by="time"}
   <img src="{$vo.actor_pic|mac_url_img}"/>
   <h5>{$vo.actor_name}</h5>
    <!-- 更多内部标签字段请参考视 文章字段 以$vo.开头即可 -->
{/maccms:actor }`}/>
                  </ul>
                </div>

                <div id={'字段说明'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s65")}</h3>
                  {markdownify(t('act.p2.s1'), 'p')}
                  <div className='warning'>
                    <p className='title'>{t('act.p2.s2')}</p>
                    <ul className='message'>
                      {markdownify(t('act.p2.s3'), 'li')}
                      {markdownify(t('act.p2.s4'), 'li')}
                    </ul>
                  </div>
                </div>

                <div id={'演员字段'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s66")}</h3>
                  <InlineCode type={''} lines={39} code={`{$obj.actor_id} 演员id
{$obj.type_id} 分类id
{$obj.type_id_1} 一级分类id
{$obj.actor_name} 姓名
{$obj.actor_en} 拼音
{$obj.actor_alias} 别名
{$obj.actor_status} 状态
{$obj.actor_lock} 锁定
{$obj.actor_letter} 首字母  
{$obj.actor_sex} 性别
{$obj.actor_color} 高亮颜色
{$obj.actor_pic} 图片
{$obj.actor_blurb} 简介
{$obj.actor_remarks} 备注
{$obj.actor_tag} tags
{$obj.actor_class} 扩展分类
{$obj.actor_area} 地区
{$obj.actor_height} 身高
{$obj.actor_weight} 体重
{$obj.actor_birthday} 生日
{$obj.actor_birtharea} 出生地
{$obj.actor_blood} 血型
{$obj.actor_starsign} 星座
{$obj.actor_school} 毕业院校
{$obj.actor_works} 主要作品多个逗号相连
{$obj.actor_level} 推荐值
{$obj.actor_up} 顶数
{$obj.actor_down} 踩数
{$obj.actor_score} 平均分
{$obj.actor_score_all} 总评分
{$obj.actor_score_num} 评分次数
{$obj.actor_time} 更新时间
{$obj.actor_time_add} 添加时间
{$obj.actor_time_hits} 点击时间
{$obj.actor_time_make} 生成时间
{$obj.actor_tpl} 自定义模板
{$obj.actor_jumpurl} 跳转url
{$obj.actor_content} 详情
{$obj|mac_url_actor_detail} 获取演员详情页链接`}/>
                </div>

                <div id={'演员首页'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s67")}</h3>
                  <ul className='list'>
                    {markdownify(t('act.p2.s6'), 'li')}
                    {markdownify(t('act.p2.s7'), 'li')}
                    {markdownify(t('act.p2.s8'), 'li')}
                  </ul>
                </div>

                <div id={'演员分类'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s68")}</h3>
                  <ul className='list'>
                    {markdownify(t('act.p2.s9'), 'li')}
                    {markdownify(t('act.p2.s10'), 'li')}
                    {markdownify(t('act.p2.s11'), 'li')}
                    {markdownify(t('act.p2.s13'), 'li')}
                  </ul>
                </div>

                <div id={'演员筛选'} ref={sectionRefs[6]} className={'w-full'}>
                  <h3>{t("theme.s69")}</h3>
                  <ul className='list'>
                    {markdownify(t('act.p2.s15'), 'li')}
                    {markdownify(t('act.p2.s16'), 'li')}
                    {markdownify(t('act.p2.s17'), 'li')}
                    {markdownify(t('act.p2.s19'), 'li')}
                    {markdownify(t('act.p2.s20'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th className='w-[80px]'>参数</th>
                        <th className='w-[80px]'>示例值</th>
                        <th className='w-[80px]'>必有参数</th>
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
                        <td>sex</td>
                        <td>女</td>
                        <td>否</td>
                        <td>性别</td>
                      </tr>
                      <tr>
                        <td>blood</td>
                        <td>B型</td>
                        <td>否</td>
                        <td>血型</td>
                      </tr>
                      <tr>
                        <td>starsign</td>
                        <td>处女座</td>
                        <td>否</td>
                        <td>星座</td>
                      </tr>
                      <tr>
                        <td>letter</td>
                        <td>H</td>
                        <td>否</td>
                        <td>首字母</td>
                      </tr>
                      <tr>
                        <td>area</td>
                        <td>中国</td>
                        <td>否</td>
                        <td>地区</td>
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
                        <td>排序依据筛选：默认支持：id, time, time_add, score, hits, hits_day, hits_week, hits_month, up,
                          down, level, rnd, in
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                  {markdownify(t('act.p2.s21'), 'p')}
                  <InlineCode type={'html'} lines={65} code={`<!-- 我的明显分类是12 -->
<div class="common-action">
   <ul class="channel-type">   
      <li class="type-item"><span class="type-tip">性别：</span> 
         <div class="type-title {if condition="$param['sex'] eq ''"} cur {/if}">
            <a href="{:mac_url('actor/show',['id'=>actor_id(),'area'=>$param['area'],'sex'=>'','blood'=>$param['blood'],'starsign'=>$param['starsign'],'letter'=>$param['letter']])}">全部</a>
         </div> 
         <div class="show">
         <ul class="item-list">
            {maccms:foreach name=":explode(',','男,女')" id="vo2" key="key2"}
            <li class="item  {if condition="$param['sex'] eq $vo2"} cur {/if} "><a href="{:mac_url('actor/show',['id'=>actor_id(),'area'=>$param['area'],'sex'=>$vo2,'blood'=>$param['blood'],'starsign'=>$param['starsign'],'letter'=>$param['letter']])}">{$vo2}明星</a></li>
            {/maccms:foreach}
         </ul>
         </div>
      </li> 
      <li class="type-item"><span class="type-tip">地区：</span> 
         <div class="type-title {if condition="$param['area'] eq ''"} cur {/if}">
            <a href="{:mac_url('actor/show',['id'=>12,'area'=>'','sex'=>$param['sex'],'blood'=>$param['blood'],'starsign'=>$param['starsign'],'letter'=>$param['letter']])}">全部</a>
         </div> 
         <div class="show">
         <ul class="item-list">
         {maccms:foreach name=":explode(',','内地,中国香港,中国台湾,泰国,印度,俄罗斯,日本,韩国,美国,英国,德国,法国,西班牙,新西兰')" id="vo2" key="key2"}
         <li class="item{if condition="$param['area'] eq $vo2"} cur {/if} "><a href="{:mac_url('actor/show',['id'=>12,'area'=>$vo2,'sex'=>$param['sex'],'blood'=>$param['blood'],'starsign'=>$param['starsign'],'letter'=>$param['letter']])}">{$vo2}</a></li>
         {/maccms:foreach}
         </ul>
      </div>
      </li> 
      <li class="type-item">
         <span class="type-tip">星座：</span> 
         <div class="type-title {if condition="$param['year'] eq ''"} cur{/if}">
            <a href="{:mac_url('actor/show',['id'=>12,'area'=>$param['area'],'sex'=>$param['sex'],'blood'=>$param['blood'],'starsign'=>'','letter'=>$param['letter']])}">全部</a>
         </div> 
         <div class="show">
         <ul class="item-list ">
            {maccms:foreach name=":explode(',','白羊座,金牛座,双子座,巨蟹座,狮子座,处女座,天秤座,天蝎座,射手座,摩羯座,水瓶座,双鱼座')" id="vo2" key="key2"}
            <li class="item {if condition="$param['starsign'] eq $vo2"} cur{/if}"><a href="{:mac_url('actor/show',['id'=>12,'area'=>$param['area'],'sex'=>$param['sex'],'blood'=>$param['blood'],'starsign'=>$vo2,'letter'=>$param['letter']])}">{$vo2}</a></li>
            {/maccms:foreach}
         </ul>
      </div>
      </li>
   </ul>
   <ul class="check-area">
      <a class="check-item" href="{:mac_url('actor/show',['id'=>12,'area'=>$param['area'],'sex'=>$param['sex'],'blood'=>$param['blood'],'starsign'=>$param['starsign'],'letter'=>$param['letter'],'by'=>'time'])}">
         <span {if condition="$param.by eq '' || $param.by eq 'time'"}class="checked"{/if}></span><label>最新</label>
      </a>
      <a class="check-item" href="{:mac_url('actor/show',['id'=>12,'area'=>$param['area'],'sex'=>$param['sex'],'blood'=>$param['blood'],'starsign'=>$param['starsign'],'letter'=>$param['letter'],'by'=>'hits'])}">
         <span {if condition="$param.by eq 'hits'"}class="checked"{/if}"></span> <label>最热</label>
      </a>
      <a class="check-item" href="{:mac_url('actor/show',['id'=>12,'area'=>$param['area'],'sex'=>$param['sex'],'blood'=>$param['blood'],'starsign'=>$param['starsign'],'letter'=>$param['letter'],'by'=>'up'])}">
         <span {if condition="$param.by eq 'up'"}class="checked"{/if}"></span> <label>好评</label>
      </a>
   </ul>
</div

<!--筛选结果-->
{maccms:actor num="35" paging="yes" pageurl="actor/show" order="desc" by="time"}
<li class="m-item">
   <a href="{$vo|mac_url_actor_detail}" title="{$vo.actor_name}">
     <img src="{$vo.actor_pic|mac_url_img}" /> 
     <h5>{$vo.actor_name}</h5>
     <p>{$vo.actor_remarks}</p>
   </a>
</li>
{/maccms:actor}
<!-- 通用分页 -->`} />
                </div>

                <div id={'演员搜索'} ref={sectionRefs[7]} className={'w-full'}>
                  <h3>{t("theme.s70")}</h3>
                  <ul className='list'>
                    {markdownify(t('act.p2.s22'), 'li')}
                    {markdownify(t('act.p2.s23'), 'li')}
                    {markdownify(t('act.p2.s24'), 'li')}
                  </ul>
                  <strong>{t('act.p2.s25')}</strong>
                  <InlineCode type={'html'} lines={4} code={`<form id="search" name="search" method="get" action="{:mac_url('actor/search')}" onSubmit="return qrsearch();">
   <input type="text" name="wd" class="mac_wd" value="{$param.wd}" placeholder="演员名称" />
   <input type="submit" class="mac_search" value="搜索演员" />
</form>`}/>
                  <strong>{t('act.p2.s26')}</strong>
                  <InlineCode type={'html'} lines={7} code={`{maccms:actor num="10" paging="yes" pageurl="actor/search" order="desc" by="time"}
   <li><a class="play-img" href="{:mac_url_actor_detail($vo)}">
      <img src="{:mac_url_img($vo.actor_pic)}" alt="{$vo.actor_name}" /></a>
      <h2><a href="{:mac_url_actor_detail($vo)}">{$vo.actor_name}</a></h2>
      <dl><dt>主演：</dt><dd>{$vo.actor_actor}</dd></dl>
   </li>
   {/maccms:actor}`}/>
                </div>

                <div id={'演员详情'} ref={sectionRefs[8]} className={'w-full'}>
                  <h3>{t("theme.s71")}</h3>
                  <ul className='list'>
                    {markdownify(t('act.p2.s27'), 'li')}
                    {markdownify(t('act.p2.s28'), 'li')}
                    {markdownify(t('act.p2.s29'), 'li')}
                    {markdownify(t('act.p2.s30'), 'li')}
                    {markdownify(t('act.p2.s31'), 'li')}
                  </ul>
                  <div className='info'>
                    <p className='title'>{t('art.p3.s5')}</p>
                    {markdownify(t('act.p2.s32'), 'p', 'message')}
                  </div>
                  <strong>{t('act.p2.s33')}</strong>
                  <InlineCode type={'html'} lines={14} code={`<h1>{$obj.actor_name}</h1>
<!-- 演员详细介绍 -->
<div class="content">
{$obj.actor_content} 
</div>
<!-- 调出演员主演的35个影片 -->
 {maccms:vod num="35" actor="'.$obj['actor_name'].'" paging="yes" pageurl="actor/detail"  order="desc" by="time"}
    <li><a href="{:mac_url_vod_detail($vo)}" title="{$vo.vod_name}">
      <img src="{:mac_url_img($vo.vod_pic)}" alt="{$vo.vod_name}"/>
      <h2>{$vo.vod_name}</h2>
      <p>{$vo.vod_actor}</p>
      <i>{$vo.vod_remarks}</i>
   </a></li>
{/maccms:vod}`} />
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/theme-topic" className="flex flex-row items-center gap-[6px]">
                  <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s7")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/theme-website" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s9")}</span>
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