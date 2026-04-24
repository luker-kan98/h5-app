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

  const list1 = t('art.p1.s5', {returnObjects: true});

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
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s6')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s6")}</h2>
                  <ul className='list'>
                    {markdownify(t('art.p1.s1'), 'li')}
                    {markdownify(t('art.p1.s2'), 'li')}
                    {markdownify(t('art.p1.s3'), 'li')}
                    {markdownify(t('art.p1.s4'), 'li')}

                  </ul>
                </div>
                <div id={'标签参数'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s50")}</h3>
                  <ul className='list'>
                    {list1.map((item, index)=>
                        <li key={index}>{markdownify(item)}</li>
                    )}
                    <InlineCode type={'html'} lines={5} code={`{maccms:art type="all" by="time" num="10" order="desc"}
   <img src="{$vo.art_pic|mac_url_img}"/>
   <h5>{$vo.art_name}</h5>
    <!-- 更多内部标签字段请参考视 文章字段 以$vo.开头即可 -->
{/maccms:art}`} />
                  </ul>
                </div>

                <div id={'字段说明'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s51")}</h3>
                  {markdownify(t('art.p2.s1'), 'p')}
                  <div className='warning'>
                    <p className='title'>{t('art.p2.s2')}</p>
                    <ul className='message'>
                      {markdownify(t('art.p2.s3'), 'li')}
                      {markdownify(t('art.p2.s4'), 'li')}
                    </ul>
                  </div>
                </div>

                <div id={'文章字段'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s52")}</h3>
                  <InlineCode type={''} lines={53} code={`{$obj.art_id} 文章id
{$obj.type_id} 分类id
{$obj.type_id_1} 一级分类id
{$obj.type} 分类对象，二级属性可参考分类属性
{$obj.type.type_name} 分类名
{$obj.type.type_en} 分类拼音
{$obj.type_1} 一级分类对象，二级属性可参考分类属性
{$obj.type_1.type_name} 一级分类名
{$obj.type_1.type_en} 一级分类拼音
{$obj.group_id} 用户组id
{$obj.art_name} 标题
{$obj.art_sub} 副标题
{$obj.art_en} 别名
{$obj.art_status} 状态0未审1已审
{$obj.art_letter} 首字母
{$obj.art_color} 颜色
{$obj.art_from} 来源
{$obj.art_author} 作者
{$obj.art_tag} tags
{$obj.art_class} 扩展分类
{$obj.art_pic} 主图
{$obj.art_pic_thumb} 缩略图
{$obj.art_pic_slide} 幻灯图
{$obj.art_pic_screenshot}截图多个图片用$$$连接
{$obj.art_blurb} 简介
{$obj.art_remarks} 备注
{$obj.art_jumpurl} 跳转url
{$obj.art_tpl} 独立模板
{$obj.art_level} 推荐等级
{$obj.art_lock} 锁定
{$obj.art_up} 顶数
{$obj.art_down} 踩数
{$obj.art_hits} 总点击量
{$obj.art_hits_day} 日点击量
{$obj.art_hits_week} 周点击量
{$obj.art_hits_month} 月点击量
{$obj.art_time} 更新时间
{$obj.art_time_add} 添加时间
{$obj.art_time_hits} 点击时间
{$obj.art_time_make} 生成时间
{$obj.art_score} 平均分
{$obj.art_score_all} 总评分
{$obj.art_score_num} 评分次数
{$obj.art_rel_art} 关联文章
{$obj.art_rel_vod} 关联视频
{$obj.art_title} 页标题
{$obj.art_note} 页备注
{$obj.art_content} 页详细介绍
{$obj.art_points} 访问整个文章所需点数
{$obj.art_points_detail} 访问每一页所需点数
{$obj.art_pwd} 访问密码
{$obj.art_pwd_url} 密码获取链接
{:mac_url_art_detail($obj)}  文章详情页链接`} />
                </div>

                <div id={'文章首页'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s53")}</h3>
                  <p>{t("art.p2.s5")}</p>
                  <ul className='list'>
                    {markdownify(t('art.p2.s6'), 'li')}
                    {markdownify(t('art.p2.s7'), 'li')}
                    {markdownify(t('art.p2.s8'), 'li')}
                  </ul>
                </div>

                <div id={'文章分类'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s54")}</h3>
                  <ul className='list'>
                    {markdownify(t('art.p2.s9'), 'li')}
                    {markdownify(t('art.p2.s10'), 'li')}
                    {markdownify(t('art.p2.s11'), 'li')}
                    {markdownify(t('art.p2.s12'), 'li')}
                    {markdownify(t('art.p2.s13'), 'li')}
                    <h4>{t('art.p2.s14')}</h4>
                    <InlineCode type={'html'} lines={9} code={`<!-- 列表 -->
{maccms:art num="24" paging="yes" type="current" order="desc" by="time"}
 <li><a href="{:mac_url_art_detail($vo)}" title="{$vo.art_name}">
    <img src="{:mac_url_img($vo.art_pic)}" alt="{$vo.art_name}"/>
    <h2>{$vo.art_name}</h2>
    <p>{$vo.art_actor}</p>
    <i>{$vo.art_version}</i>
</a></li>
{/maccms:art}`} />
                  </ul>
                </div>

                <div id={'文章筛选'} ref={sectionRefs[6]} className={'w-full'}>
                  <h3>{t("theme.s55")}</h3>
                  <ul className='list'>
                    {markdownify(t('art.p2.s15'), 'li')}
                    {markdownify(t('art.p2.s16'), 'li')}
                    {markdownify(t('art.p2.s17'), 'li')}
                    {markdownify(t('art.p2.s18'), 'li')}
                    {markdownify(t('art.p2.s19'), 'li')}
                    {markdownify(t('art.p2.s20'), 'li')}
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
                                  <td>八卦</td>
                                  <td>否</td>
                                  <td>tag筛选</td>
                              </tr>
                              <tr>
                                  <td>class</td>
                                  <td>明星</td>
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
                                  <td>排序依据筛选：默认支持：id, time, time_add, score, hits, hits_day, hits_week,
                                      hits_month, up, down, level, rnd, in
                                  </td>
                              </tr>
                              </tbody>
                          </table>
                      </div>

                      <li>{t('art.p2.s21')}</li>
                      <InlineCode type={''} lines={1} code={`/index.php/artshow/1/by/time/class/明星/letter/A.html`}/>
                      {markdownify(t('art.p2.s22'), 'li')}
                      {markdownify(t('art.p2.s23'), 'li')}
                      {markdownify(t('art.p2.s24'), 'li')}
                      <InlineCode type={'html'} lines={10} code={`<!-- 筛选结果列表 -->
 {maccms:art num="20" paging="yes" pageurl="art/show" type="current" order="desc" by="time"}
   <li><a href="{:mac_url_art_detail($vo)}" title="{$vo.art_name}">
      <img src="{:mac_url_img($vo.art_pic)}" alt="{$vo.art_name}"/>
      <h2>{$vo.art_name}</h2>
      <p>{$vo.art_actor}</p>
      <i>{$vo.art_remarks}</i>
   </a></li>
{/maccms:art}
<!-- 通用分页代码 -->`}/>
                  </ul>
                </div>

                  <div id={'文章搜索'} ref={sectionRefs[7]} className={'w-full'}>
                      <h3>{t("theme.s56")}</h3>
                      <ul className='list'>
                          {markdownify(t('art.p2.s25'), 'li')}
                          {markdownify(t('art.p2.s26'), 'li')}
                          {markdownify(t('art.p2.s27'), 'li')}
                          {markdownify(t('art.p2.s28'), 'li')}
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

                        {markdownify(t('art.p2.s29'), 'li')}
                        <InlineCode type={''} lines={1} code={`index.php/artsearch/变形金刚-------------.html`}/>
                        {markdownify(t('art.p2.s30'), 'li')}
                        {markdownify(t('art.p2.s31'), 'li')}
                        {markdownify(t('art.p2.s32'), 'li')}
                        <InlineCode type={'html'} lines={11} code={`<!-- 表单 -->
<form id="search" name="search" method="get" action="{:mac_url('art/search')}" onSubmit="return qrsearch();">
   <input type="text" name="wd" class="mac_wd" value="{$param.wd}" placeholder="请在此处输入影片名或演员名称" />
   <input type="submit" class="mac_search" value="搜索影片" />
</form>
<!-- 后台预设关键词 -->
 <div class="hotkeys">热搜：
   {maccms:foreach name=":explode(',',$maccms.search_hot)" id="vo2" key="key2"}
   <a href="{:mac_url('art/search',['wd'=>$vo2])}">{$vo2}</a>
   {/maccms:foreach}
</div>`}/>
                      </ul>
                  </div>

                <div id={'文章详情'} ref={sectionRefs[8]} className={'w-full'}>
                  <h3>{t("theme.s57")}</h3>
                  <ul className='list'>
                    {markdownify(t('art.p3.s1'), 'li')}
                    {markdownify(t('art.p3.s2'), 'li')}
                    {markdownify(t('art.p3.s3'), 'li')}
                    {markdownify(t('art.p3.s4'), 'li')}
                  </ul>
                  <div className='info'>
                    <p className='title'>{t('art.p3.s5')}</p>
                    {markdownify(t('art.p3.s6'), 'p', 'message')}
                  </div>
                  <h4>{t('art.p3.s7')}</h4>
                  <ul className='list'>
                    {markdownify(t('art.p3.s8'), 'li')}
                  </ul>
                  <InlineCode type={'html'} lines={22} code={`<h1>{$obj.art_name} - {$obj.art_page_list[$param['page']]['title']}</h1>
<div class="source"> 来源：{$obj.art_from}&nbsp;&nbsp;&nbsp;发布时间：{$obj.art_time|date='Y-m-d H:i:s',###}&nbsp;&nbsp;&nbsp;浏览次数：{$obj.art_hits}</div>
<div class="content">{$obj.art_page_list[$param['page']]['content']|mac_url_content_img}</div>
<!-- 可使用通用分页类获取文章内容分页 -->

<!-- 上下篇 -->
<div class="next">
   {php}
      $where=[];
      $where['art_status'] = ['eq',1];
      $where['art_id'] = ['lt',$obj['art_id']];
      $pre_info = model('art')->infoData($where,'*',1);
      $where['art_id'] = ['gt',$obj['art_id']];
      $next_info = model('art')->infoData($where,'*',1);
   {/php}
   {if condition="$pre_info['code'] eq 1"}
      <a href="{:mac_url_art_detail($pre_info['info'])}" >上一篇：{$pre_info['info']['art_name']}</a>
   {/if}
   {if condition="$next_info['code'] eq 1"}
   <a href="{:mac_url_art_detail($next_info['info'])}" >下一篇：{$next_info['info']['art_name']}</a>
   {/if}
</div>`} />
                </div>

                <div id={'相关提示'} ref={sectionRefs[9]} className={'w-full'}>
                  <h3>{t("theme.s58")}</h3>
                  <ul className='list'>
                    {markdownify(t('art.p3.s9'))}
                    {markdownify(t('art.p3.s10'))}
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
\t\t\t<a href="javascript:;" onclick="MAC.User.BuyPopedom(this)" data-id="{$obj.art_id}" data-sid="{$param.sid}" data-nid="{$param.nid}" data-mid="1" data-type="{if condition="$obj.player_info.flag eq 'play'"}4{else/}5{/if}" data-mid="1">确认购买</a>
\t\t\t{/if}
\t\t</p>
\t</div>
</div>
<script type="text/javascript">

</script>
</body>
</html>`} />
                    {markdownify(t('art.p3.s11'))}
                    {markdownify(t('art.p3.s10'))}
                    <InlineCode type={'html'} lines={40} code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <title>系统提示【{$obj['art_name']}】因为版权问题，本站不提供在线播放</title>
    <link rel="stylesheet" href="__STATIC__/css/home.css">
    <style>
        body{background:#F9FAFD;color:#818181;}
    </style>
</head>
<body>
<div class="mac_msg_jump">
    <div class="msg_jump_tit">系统提示...</div>
    <div class="title">亲爱的用户：</div>
    <div class="text">【{$obj['art_name']}】{$GLOBALS['config']['app']['copyright_notice']}</div>
    <div class="jump">
        {if condition="$obj['art_jumpurl'] neq ''"}
        页面自动 <a id="href" href="<?php echo($obj['art_jumpurl']);?>">跳转</a> 等待时间： <b id="wait">3</b>
        {/if}
    </div>
    <!-- 可自定义该页面的显示方式，可加入广告 -->
</div>
<script type="text/javascript">
    {if condition="$obj['art_jumpurl'] neq ''"}
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
                    {markdownify(t('art.p3.s12'))}
                    {markdownify(t('art.p3.s10'))}
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
                {if condition="$obj.art_pwd_url neq ''"}
                    <a href="{$obj.art_pwd_url}" target="_blank">点击获取密码</a>
                {else/}
                    <span>密码：{$obj.art_pwd}</span>
                {/if}
            </div>
            <div class="item">
                <a class="submit_btn" href="javascript:;" onclick="MAC.Pwd.Check(this)" data-mid="1" data-id="{$obj.art_id}" data-type="1" />点击确认</a>
            </div>
        </form>
    </div>
</div>
</div>
</body>
</html>`} />
                    {markdownify(t('art.p3.s13'))}
                  </ul>
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/theme-vod" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s5")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/theme-topic" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s7")}</span>
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