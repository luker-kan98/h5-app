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
    useRef(null)
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s4')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s4")}</h2>
                  {markdownify(t('theme.ss1'), 'p')}
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.ss2')}</p>
                  </div>

                  <InlineCode type={''} lines={24} code={`========模板结构=======
  │─template/1/  模板1
  │  ├─info.ini  模板信息文件
  │  ├─ads   广告文件目录
  │  ├─js    js文件
  │  ├─css   css文件
  │  ├─images   图片文件
  │  └─html     模板文件目录
  │      └─art     文章模块模板目录
  │      └─comment  评论模块模板目录
  │      └─gbook    留言本模块模板目录
  │      └─index    首页模块模板目录
  │      └─label    自定义页面模块模板目录
  │      └─map      地图页模块模板目录
  │      └─public   公共页面模板目录
  │      └─rss      RSS和sitemap模板目录
  │      └─topic    专题模块模板目录
  │      └─user     用户中心模块模板目录
  │      └─vod      视频模块模板目录
  │      └─plot     分集剧情模块模板目录
  │      └─website  网址导航模块模板目录
  │─tempalte/2/  模板2
  │─...
  │─template/n/  模板N`} />

                </div>
                <div id={'info.ini介绍'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s31")}</h3>
                  {markdownify(t('theme.ss3'), 'p')}
                </div>

                <div id={'模板html目录'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s32")}</h3>
                  <InlineCode type={''} lines={93} code={`html
 └─public
 │   │─include.html    全站公共引入文件 引入js、css样式，还有系统JS变量
 │   │─head.html       全站头部
 │   │─foot.html       全站尾部
 │   │─jump.html       跳转提示页模板     
 │   │─msg.html        错误提示页模板
 │   │─paging.html     分页样式模板
 │   │─digg.html       顶踩样式模板
 │   │─score.html      普通评分样式模板
 │   │─star.html       星星评分样式模板
 │   │─verify.html     搜索验证模板
 └─comment
 │   │─index.html     评论页
 │   │─ajax.html      评论页
 └─book
 │   │─index.html       留言本
 │   │─report.html      报错页面
 └─index/index.html     首页
 └─map
 │   │─rss.html    rss
 │   │─baidu.html   百度sitemap
 │   │─google.html  谷歌sitemap
 └─topic
 │   │─index.html   专题首页
 │   │─detail.html  专题详情页
 └─art
 │   │─index.html   专题首页
 │   │─confirm.html     确认支付积分页面
 │   │─detail.html      文章内容页
 │   │─detail_pwd.html      验证密码页
 │   │─rss.html         文章内容rss
 │   │─search.html      文章搜索页
 │   │─type.html        文章分类页
 │   │─show.html        文章分类筛选页
 └─vod
 │   │─confirm.html     确认支付积分页面
 │   │─copyright.html      版权提示和跳转
 │   │─detail.html      视频内容页
 │   │─detail_pwd.html      验证密码页
 │   │─rss.html         视频内容rss
 │   │─play.html        视频播放页
 │   │─player.html      试看页面播放页
 │   │─player_pwd.html      验证密码页
 │   │─down.html        视频下载页
 │   │─downer_pwd.html      验证密码页
 │   │─search.html      视频搜索页面
 │   │─type.html        视频分类页面
 │   │─show.html        视频分类筛选页
 │   │─plot.html        视频分集剧情列表
 └─user
 │   │─ajax_info.html   用户弹出层登录详情
 │   │─ajax_login.html  用户弹出层登录界面
 │   │─buy.html         用户中心-在线充值
 │   │─cards.html       用户中心-充值卡记录
 │   │─cash.html       用户中心-提现记录
 │   │─downs.html       用户中心-下载记录
 │   │─favs.html        用户中心-收藏记录
 │   │─findpass.html    用户中心-找回密码
 │   │─findpass_msg.html    用户中心-找回密码提示信息
 │   │─foot.html        用户中心-公共底部
 │   │─head.html        用户中心-公共头部
 │   │─include.html     用户中心-公共引入文件
 │   │─index.html       用户中心-首页
 │   │─info.html        用户中心-个人详情
 │   │─login.html       用户中心-登录页
 │   │─orders.html      用户中心-在线充值记录
 │   │─pay.html         用户中心-支付页
 │   │─payment_weixin.html         用户中心-支付微信二维码
 │   │─plays.html       用户中心-点播记录
 │   │─popedom.html     用户中心-权限列表
 │   │─reg.html         用户中心-注册
 │   │─reward.html     用户中心-分销记录
 │   │─upgrade.html     用户中心-会员升级
 └─plot
 │   │─uindex.html        分集剧情首页
 │   │─udetail.html       分集剧情详情页
 └─actor
 │   │─index.html        演员首页
 │   │─detail.html       演员详情页
 │   │─search.html       演员网址搜索页
 │   │─show.html       演员筛选页
 │   │─type.html       演员分类页
 └─role
 │   │─index.html        角色首页
 │   │─detail.html       角色详情页
 │   │─show.html         角色筛选页
 └─website
 │   │─index.html        网址导航首页
 │   │─detail.html       网址详情页
 │   │─search.html       网址搜索页
 │   │─show.html       网址筛选页
 │   │─type.html       网址分类页`} />
                </div>

                <div id={'包含文件'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s33")}</h3>
                  {markdownify(t('theme.ss4'), 'p')}
                  <div className='alert'>
                    <p className='title'>WARNING</p>
                    <p className='message'>{t('theme.ss5')}</p>
                  </div>
                  <InlineCode type={'php'} lines={1} code={`{include file='模版文件1,模版文件2,...' /}`}/>
                  <h4>{t("theme.ss6")}</h4>
                  {markdownify(t('theme.ss7'), 'p')}
                  <InlineCode type={'php'} lines={3} code={`{include file="public/header" /} // 包含头部模版header
{include file="public/menu" /} // 包含菜单模版menu
{include file="blue/public/menu" /} // 包含blue主题下面的menu模版`}/>
                  {markdownify(t('theme.ss8'), 'p')}
                  <InlineCode type={'php'} lines={1} code={`{include file="public/header,public/menu" /}`}/>
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.ss9')}</p>
                  </div>
                  <h4>{t("theme.ss10")}</h4>
                  {markdownify(t('theme.ss11'), 'p')}
                  <InlineCode type={''} lines={1}
                              code={`{include file="../application/view/default/public/header.html" /}`}/>
                  {markdownify(t('theme.ss12'), 'p')}
                  <h4>{t("theme.ss13")}</h4>
                  {markdownify(t('theme.ss14'), 'p')}
                  <InlineCode type={''} lines={1}
                              code={`{include file="Public/header" title="$title" keywords="开源WEB开发框架" /}`}/>
                  {markdownify(t('theme.ss15'), 'p')}
                  <InlineCode type={'html'} lines={5}
                              code={`<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>[title]</title>
<meta name="keywords" content="[keywords]" />
</head>`}/>
                  {markdownify(t('theme.ss16'), 'p')}
                  <div className='alert'>
                    <p className='title'>WARNING</p>
                    <p className='message'>{t('theme.ss17')}</p>
                  </div>
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/theme/writing-a-theme" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s3")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/theme-vod" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s5")}</span>
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