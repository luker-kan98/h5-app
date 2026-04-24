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

  const list1 = t('theme.gl.s14', {returnObjects: true});

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s15')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s15")}</h2>
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <ul className='message'>
                      {markdownify(t('theme.gl.s1'), 'li')}
                      {markdownify(t('theme.gl.s2'), 'li')}
                    </ul>
                  </div>
                </div>

                <div id={'网站常用参数'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s122")}</h3>
                  <InlineCode type={'php'} lines={29} code={`{$maccms.site_name}网站名称
{$maccms.site_url}网站url
{$maccms.site_wapurl} wap网站url
{$maccms.site_logo}网站logo
{$maccms.site_waplogo} wap网站logo
{$maccms.site_keywords}网站关键字
{$maccms.site_description}网站描述
{$maccms.site_icp}备案号
{$maccms.site_qq}站长qq
{$maccms.site_email}站长email 
{$maccms.site_tj}统计代码；也可以用{$maccms.path}static/js/tj.js 来动态引入统计代码。
{$maccms.site_status}网站状态1开启0关闭
{$maccms.site_close_tip}网站关闭提示信息
 
{$maccms.path}网站目录
{$maccms.path_tpl}当前模板目录
{$maccms.date} 当前日期
{$maccms.search_hot}       热门搜索词
{$maccms.art_extend_class}       全局文章扩展分类
{$maccms.vod_extend_class}       全局视频扩展分类
{$maccms.vod_extend_state}       全局视频资源
{$maccms.vod_extend_version}       全局视频版本
{$maccms.vod_extend_area}       全局视频地区
{$maccms.vod_extend_lang}       全局视频语言
{$maccms.vod_extend_year}       全局视频年代
{$maccms.vod_extend_weekday}       全局视频更新周期
{$maccms.actor_extend_area}       全局演员地区
{$maccms.http_type}  当前url访问协议，会输出 http:// 或者 https://
{$maccms.controller_action} 当前页面触发的程序路径controller/action`} />
                  <p>{t('theme.gl.s3')}</p>
                  {markdownify(t('theme.gl.s4'))}
                  <InlineCode type={'php'} lines={1} code={`{php} dump($GLOBALS['config']);die; {/php}`} />
                  <ul className='list'>
                    <li>{t('theme.gl.s5')}</li>
                  </ul>
                  <InlineCode type={''} lines={44} code={`$GLOBALS['config']['site'] 站点配置 
$GLOBALS['config']['app'] 预留参数配置
$GLOBALS['config']['user'] 用户配置
$GLOBALS['config']['gbook'] 留言本配置
$GLOBALS['config']['comment'] 评论配置
$GLOBALS['config']['upload'] 上传配置
$GLOBALS['config']['interface'] 站外入库配置
$GLOBALS['config']['pay'] 支付配置
$GLOBALS['config']['collect'] 采集配置
$GLOBALS['config']['api'] api配置
$GLOBALS['config']['connect'] 第三方登录配置
$GLOBALS['config']['weixin'] 微信配置
$GLOBALS['config']['view'] url浏览模式配置
$GLOBALS['config']['path'] url静态路径配置
$GLOBALS['config']['rewrite'] 路由配置
$GLOBALS['config']['weixin'] 微信配置
$GLOBALS['config']['email'] 邮件配置
$GLOBALS['config']['play'] 播放器配置
$GLOBALS['config']['urlsend'] url推送配置
$GLOBALS['config']['sms'] 短信配置
$GLOBALS['config']['extra'] 自定义参数配置
$GLOBALS['config']['seo'] SEO参数配置

------------------SEO参数信息------------------------------ 
{$maccms.seo.vod.name}  视频首页SEO标题
{$maccms.seo.vod.key}  视频首页SEO关键字
{$maccms.seo.vod.des}  视频首页SEO描述
{$maccms.seo.art.name}  文章首页SEO标题
{$maccms.seo.art.key}  文章首页SEO关键字
{$maccms.seo.art.des}  文章首页SEO描述

{$maccms.seo.actor.name}  演员首页SEO标题
{$maccms.seo.actor.key}  演员首页SEO关键字
{$maccms.seo.actor.des}  演员首页SEO描述

{$maccms.seo.role.name}  角色首页SEO标题
{$maccms.seo.role.key}  角色首页SEO关键字
{$maccms.seo.role.des}  角色首页SEO描述
{$maccms.seo.plot.name}  剧情首页SEO标题
{$maccms.seo.plot.key}  剧情首页SEO关键字
{$maccms.seo.plot.des}  剧情首页SEO描述
{$maccms.seo.website.name}  网址导航首页SEO标题
{$maccms.seo.website.key}  网址导航首页SEO关键字
{$maccms.seo.website.des}  网址导航首页SEO描述`} />
                </div>

                <div id={'常用tp5标签'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s123")}</h3>
                  <p>{t('theme.gl.s6')}</p>
                  <InlineCode type={'html'} lines={9} code={`<!-- url请求类 -->
{:Request()->domain()} 当前完整域名包括协议 结果为：https://www.maccms.plus/
{:request()->baseFile()} 当前入口文件 结果为：/index.php
{:request()->url()} 当前入口文件 结果为：/index.php/play/225-1-1.html

<!-- 请求参数类 -->
{:input()} 或者url参数数组
{:input('?get.id')} 获得GET请求的的id参数值
{:input('?post.name')} 或者 POST 请求的 name 参数值`} />
                </div>

                <div id={'网站统计标签'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s124")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.gl.s7'), 'li')}
                    {markdownify(t('theme.gl.s8'), 'li')}
                  </ul>
                </div>

                <div id={'登录状态'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s125")}</h3>
                  {markdownify(t('theme.gl.s9'), 'p')}
                  <InlineCode type={''} lines={5} code={`$GLOBALS['user']['user_id'] //用户id
$GLOBALS['user']['group_id'] //用户组id
$GLOBALS['user']['user_name'] //用户名
$GLOBALS['user']['user_nick_name'] //用户昵称
...`}/>
                  <ul className='list'>
                    <li>{t('theme.gl.s10')}</li>
                  </ul>
                  <InlineCode type={'php'} lines={3} code={`if(empty($GLOBALS['user']['user_id'])){
   echo '未登录';
}`}/>
                  <div className={'info'}>
                    <p className='title'>TIP</p>
                    {markdownify(t('theme.gl.s11'), 'p', 'message')}
                  </div>
                  <p>{t('theme.gl.s12')}</p>
                  <InlineCode type={'js'} lines={5} code={`if(MAC.Cookie.Get('user_id') !=undefined && MAC.Cookie.Get('user_id')!=''){
   console.log('已登录')
}else{
   console.log('未登录')
}`} />
                </div>

                <div id={'友情链接'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s126")}</h3>
                  <div className={'info'}>
                    <p className='title'>TIP</p>
                    {markdownify(t('theme.gl.s13'), 'p', 'message')}
                  </div>
                  <ul className='list'>
                    {list1.map((item, index)=><li key={index}>{markdownify(item)}</li>)}
                  </ul>
                  <InlineCode type={'html'} lines={10} code={`{maccms:link num="10" type="all" order="asc" by="sort"}
   {$vo.link_id}编号
   {$vo.link_name}名称
   {$vo.link_type}类型0文字1图片
   {$vo.link_url}链接
   {$vo.link_sort}排序
   {$vo.link_logo}图标
   {$vo.link_add_time} 添加时间
   {$vo.link_time} 更新时间
{/maccms:link}`} />
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/theme-other" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s14")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/senior" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s16")}</span>
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