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

  const list1 = t('theme.ot.s40', {returnObjects: true});

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
    <ThemeLayout title={`${t('theme.s14')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s14")}</h2>
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.ot.s1')}</p>
                    <ul className='message'>
                      {markdownify(t('theme.ot.s2'), 'li')}
                      {markdownify(t('theme.ot.s3'), 'li')}
                    </ul>
                  </div>
                </div>

                <div id={'首页'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s114")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ot.s4'), 'li')}
                    {markdownify(t('theme.ot.s5'), 'li')}
                    {markdownify(t('theme.ot.s6'), 'li')}
                  </ul>
                </div>

                <div id={'留言本'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s115")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ot.s7'), 'li')}
                    {markdownify(t('theme.ot.s8'), 'li')}
                    {markdownify(t('theme.ot.s9'), 'li')}
                    {markdownify(t('theme.ot.s10'), 'li')}
                  </ul>
                  <h4>{t('theme.ot.s16')}</h4>
                  <ul className='list'>
                    {markdownify(t('theme.ot.s11'), 'li')}
                    {markdownify(t('theme.ot.s12'), 'li')}
                    {markdownify(t('theme.ot.s13'), 'li')}
                    {markdownify(t('theme.ot.s14'), 'li')}
                    {markdownify(t('theme.ot.s15'), 'li')}
                  </ul>
                  <h4>{t('theme.ot.s17')}</h4>
                  <InlineCode type={'html'} lines={10} code={`\`gbook_id\` int(10) 留言id,
  \`gbook_rid\` int(10)  回复id,
  \`user_id\` int(10) 用户id,
  \`gbook_status\` tinyint(1) 留言状态,
  \`gbook_name\` varchar(60) 留言名称,
  \`gbook_ip\` int(10) 留言IP,
  \`gbook_time\` int(10) 留言时间,
  \`gbook_reply_time\` 回复时间,
  \`gbook_content\` 留言内容,
  \`gbook_reply\` 回复内容,`}/>
                  <h4>{t('theme.ot.s18')}</h4>
                  <ul className='list'>
                    {markdownify(t('theme.ot.s19'), 'li')}
                    {markdownify(t('theme.ot.s20'), 'li')}
                  </ul>
                  <strong>{t('theme.ot.s21')}</strong>
                  <InlineCode type={'html'} lines={19} code={`   <!-- 初始化留言本 -->
    <script>
        $(function(){
            MAC.Gbook.Login = {$gbook.login};
            MAC.Gbook.Verify = {$gbook.verify};
            MAC.Gbook.Init();
        });
    </script>
    <!-- 获取留言列表 -->
    {maccms:gbook num="10" paging="yes" order="asc" by="sort"}
      {$vo.gbook_id}编号
      {$vo.gbook_name}昵称
      {$vo.gbook_status}状态0未审核1已审核
      {$vo.gbook_ip}ip地址
      {$vo.gbook_time} 时间
      {$vo.gbook_content} 留言内容
      {$vo.gbook_reply_time} 回复时间
      {$vo.gbook_reply} 回复内容
   {/maccms:gbook}
`}/>
                  <h4>{t('theme.ot.s22')}</h4>
                  <ul className='list'>
                    {markdownify(t('theme.ot.s23'), 'li')}
                  </ul>
                  {markdownify(t('theme.ot.s24'), 'p')}
                  <InlineCode type={'html'} lines={29} code={`<!--登录弹窗开始-->
<div class="mac_report reply_box">
    <form class="gbook_form">
        <input type="hidden" name="gbook_rid" value="{$param.id}">
        <p class="msg_cue">请输入报错内容：</p>
        <textarea class="gbook_content" name="gbook_content" style="width:98%;height:150px;">{$param.name}</textarea>
        <div class="msg_code">
            {if condition="$gbook.verify eq 1"}
            验证码：<input type="text" name="verify" class="mac_verify" maxlength="4" style="width:80px;lin-height:20px;">
            {/if}
            <div class="remaining-w fr">还可输入<span class="gbook_remaining remaining " > </span></div>
        </div>
        <div style="text-align: center;">
            <input type="button" class="gbook_submit submit_btn" style="width: 100px;height: 32px;margin: 10px auto;cursor: pointer;" value="提交留言">
        </div>

    </form>
</div>
<!--登录弹窗结束-->
<script>
    $(function(){
        MAC.Gbook.Login = {$gbook.login};
        MAC.Gbook.Verify = {$gbook.verify};
        MAC.Gbook.Init();
    });
</script>

<!-- 然后在需要使用保存功能的页面使用一下代码 -->
<a href="javascript:;" class="pr-2" onclick="MAC.Gbook.Report('编号【{$obj.vod_id}】名称【{$obj.vod_name}】不能观看请检查修复，页面地址' + location.href,'{$obj.vod_id}')"><i class="iconMy iconprompt"></i> 报错</a>`}/>
                </div>

                <div id={'评论'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s116")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.ot.s24'), 'li')}
                  </ul>
                </div>

                <div id={'自定义'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s117")}</h3>
                  {markdownify(t('theme.ot.s26'), 'p')}
                  <ul className='list'>
                    {markdownify(t('theme.ot.s27'), 'li')}
                  </ul>
                  <strong>{t('theme.ot.s28')}</strong>
                  <InlineCode type={''} lines={2} code={`html/label/aaa$$$top.html {:mac_url('label/aaa$$$top')}
html/label/rank.html {:mac_url('label/rank')}`}/>
                </div>

                <div id={'rss模板'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s118")}</h3>
                  {markdownify(t('theme.ot.s29'), 'p')}
                  <ul className='list'>
                    {markdownify(t('theme.ot.s30'), 'li')}
                  </ul>
                  <InlineCode type={''} lines={7} code={`html/rss/baidu.html 百度sitemap
html/rss/bing.html 必应sitemap
html/rss/google.html 谷歌sitemap
html/rss/index.html 通用sitemap
html/rss/sm.html 神马sitemap
html/rss/so.html 360 sitemap
html/rss/sogou.html 搜狗sitemap`}/>
                </div>

                <div id={'map模板'} ref={sectionRefs[6]} className={'w-full'}>
                  <h3>{t("theme.s119")}</h3>
                  {markdownify(t('theme.ot.s31'), 'p')}
                  <ul className='list'>
                    {markdownify(t('theme.ot.s32'), 'li')}
                  </ul>
                </div>

                <div id={'信息提示'} ref={sectionRefs[7]} className={'w-full'}>
                  <h3>{t("theme.s120")}</h3>
                  {markdownify(t('theme.ot.s33'), 'p')}
                  <h4>{t('theme.ot.s36')}</h4>
                  <ul className='list'>
                    {markdownify(t('theme.ot.s34'), 'li')}
                  </ul>
                  <strong>{t('theme.ot.s35')}</strong>
                  <InlineCode type={'html'} lines={21} code={`<!DOCTYPE html>
<html lang="en">
\t<head>
\t<meta charset="utf-8">
\t\t<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
\t<title>网站维护中......</title>
\t<link rel="stylesheet" href="__STATIC__/css/home.css">
\t<style>
\t\tbody{background:#F9FAFD;color:#818181;}
\t</style>
</head>
<body>
<div class="mac_msg_jump">
\t<div class="msg_jump_tit">非常抱歉，网站正在维护中...</div>
\t<div class="title">亲爱的站长们：</div>
\t<div class="text">
\t\t{$close_tip}
\t</div>
</div>
</body>
</html>`}/>
                </div>
                <h4>{t('theme.ot.s37')}</h4>
                <ul className='list'>
                  {markdownify(t('theme.ot.s38'), 'li')}
                  <strong>{t('theme.ot.s35')}</strong>
                  <InlineCode type={'html'} lines={35} code={`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <title>系统提示......</title>
    <link rel="stylesheet" href="__STATIC__/css/home.css">
    <style>
        body{background:#F9FAFD;color:#818181;}
    </style>
</head>
<body>
<div class="mac_msg_jump">
    <div class="msg_jump_tit">系统提示...</div>
    <div class="title">亲爱的：</div>
    <div class="text">{$msg}</div>
    <div class="jump">
        页面自动 <a id="href" href="<?php echo($url);?>">跳转</a> 等待时间： <b id="wait"><?php echo($wait);?></b>
    </div>
</div>
<script type="text/javascript">
    (function(){
        var wait = document.getElementById('wait'),
                href = document.getElementById('href').href;
        var interval = setInterval(function(){
            var time = --wait.innerHTML;
            if(time <= 0) {
                location.href = href;
                clearInterval(interval);
            };
        }, 1000);
    })();
</script>
</body>
</html>`}/>
                  {markdownify(t('theme.ot.s39'), 'li')}
                  <strong>{t('theme.ot.s35')}</strong>
                  <InlineCode type={'html'} lines={22} code={`<!DOCTYPE html>
<html lang="en">
<head>
\t<meta charset="utf-8">
\t<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
\t<title>系统提示......</title>
\t<link rel="stylesheet" href="__STATIC__/css/home.css">
\t<style>
\t\tbody{background:#F9FAFD;color:#818181;}
\t</style>
</head>
<body>
<div class="mac_msg_jump">
\t<div class="msg_jump_tit">系统提示...</div>
\t<div class="title">亲爱的：</div>
\t<div class="text">{$msg}</div>
</div>
<script type="text/javascript">

</script>
</body>
</html>`} />
                </ul>


                <div id={'通用分页'} ref={sectionRefs[8]} className={'w-full'}>
                  <h3>{t("theme.s121")}</h3>
                  <ul className='list'>
                    {list1.map((item, index)=><li key={index}>{markdownify(item)}</li>)}
                  </ul>
                  <InlineCode type={'html'} lines={27} code={`<!-- 通用分页 -->

{if condition="$__PAGING__.record_total gt 0"}
<div class="mac_pages">
    <div class="page_tip">共{$__PAGING__.record_total}条数据,当前{$__PAGING__.page_current}/{$__PAGING__.page_total}页</div>
    <div class="page_info">
        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=1}" title="首页">首页</a>
        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=$__PAGING__.page_prev}" title="上一页">上一页</a>
        {maccms:foreach name="$__PAGING__.page_num" id="num"}
        {if condition="$__PAGING__['page_current'] eq $num"}
        <a class="page_link page_current" href="javascript:;" title="第{$num}页">{$num}</a>
        {else}
        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=$num}" title="第{$num}页" >{$num}</a>
        {/if}
        {/maccms:foreach}
        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=$__PAGING__.page_next}" title="下一页">下一页</a>
        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=$__PAGING__.page_total}" title="尾页">尾页</a>

        <input class="page_input" type="text" placeholder="页码"  id="page" autocomplete="off" style="width:40px">
        <button class="page_btn mac_page_go" type="button" data-url="{$__PAGING__.page_url}" data-total="{$__PAGING__.page_total}" data-sp="{$__PAGING__.page_sp}" >GO</button>
    </div>
</div>
{else/}
<div class="wrap">
    <h1>没有找到匹配数据</h1>
</div>
{/if}`} />
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/theme-role" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s13")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/tags-global" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s15")}</span>
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