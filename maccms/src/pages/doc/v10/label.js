import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import DocLayout from "@/layouts/DocLayout";

export default function DocPage() {

  const { t } = useTranslation();

  return (
    <DocLayout title={t('seo.t.t3')} mobile_title={t("menu.doc")} version={"v10"}>
      <div className="container mb-[60px] md:mb-[90px]">
        <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
          {/* Desktop sidebar */}
          <div className="doc-sidebar pt-[20px] md:pt-[65px]  hidden md:flex flex-col min-w-[160px] max-h-[200px]">
            {/* Version Select */}
            <div className="flex flex-row gap-2 items-center">
              <Link href="/doc/v10">
                <div className="w-[54px] h-[30px] flex items-center justify-center rounded-[4px] bg-primary text-white">V10</div>
              </Link>
              <Link href="/doc/v8">
                <div className="w-[54px] h-[30px] flex items-center justify-center rounded-[4px] border bg-white text-black">V8</div>
              </Link>            
            </div>
            {/* End of Version select */}
            <label className="mt-[20px] mb-[10px] text-black text-[20px] font-primary">{t("doc.s1")}</label>
            <ul className="doc-menu">
              <li className={clsx("doc-menu-item group")}>
                <Link href="/doc/v10" className="group-hover:text-primary text-[16px]">{t("doc.s2")}</Link>
              </li>
              <li className={clsx("doc-menu-item group")}>
                <Link href="/doc/v10/faq" className="group-hover:text-primary text-[16px]">{t("doc.s3")}</Link>
              </li>
              <li className={clsx("doc-menu-item active group")}>
                <Link href="/doc/v10/label" className="group-hover:text-primary text-[16px]">{t("doc.s4")}</Link>
              </li>
            </ul>
          </div>
          {/* Content */}
          <article className="doc pt-[10px] md:pt-[35px] grow">
            <h2>{t("doc.s4")}</h2>
            <p>{t("doc.s88")}</p>
            <h3>{t("doc.s89")}</h3>
            <p>{t("doc.s90")}</p>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`│─template/1/  模板1`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│  ├─ads   广告文件目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│  ├─js    js文件`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│  ├─css   css文件`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│  ├─images   图片文件`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│  └─html     模板文件目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─art     文章模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─comment  评论模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─gbook    留言本模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─index    首页模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─label    自定义页面模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─map      地图页模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─public   公共页面模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─rss      RSS和sitemap模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─topic    专题模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─user     用户中心模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─vod      视频模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│      └─plot     分集剧情模块模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│─tempalte/2/  模板2`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│─...`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│─template/n/  模板N`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s91")}</h3>
            <p>{t("doc.s92")}</p>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{t("doc.s93")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`public/include.html    全站公共引入文件 引入js、css样式，还有系统JS变量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`public/head.html       全站头部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`public/foot.html       全站尾部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`public/jump.html       跳转提示页模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`public/msg.html        错误提示页模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`public/paging.html     分页样式模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`public/digg.html       顶踩样式模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`public/score.html      普通评分样式模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`public/star.html       星星评分样式模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`comment/index.html     评论页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`comment/ajax.html     评论页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`gbook/index.html       留言本`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`gbook/report.html      报错页面`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`index/index.html     首页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`map/rss.html    rss`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`map/baidu.html   百度sitemap`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`map/google.html  谷歌sitemap`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"│"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`topic/index.html   专题首页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"topic/detail.html  专题详情页"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art/detail.html      文章内容页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art/rss.html         文章内容rss`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art/search.html      文章搜索页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"art/type.html        文章分类页"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"art/show.html        文章分类筛选页"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"│"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod/confirm.html     确认支付积分页面`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod/detail.html      视频内容页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"vod/rss.html         视频内容rss"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"vod/play.html        视频播放页"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod/player.html      试看页面播放页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod/down.html        视频下载页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"vod/search.html      视频搜索页面"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"vod/type.html        视频分类页面"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod/show.html        视频分类筛选页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`│`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/ajax_info.html   用户弹出层登录详情"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/ajax_login.html  用户弹出层登录界面"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`user/buy.html         用户中心-在线充值`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`user/cards.html       用户中心-充值卡记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/downs.html       用户中心-下载记录"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/favs.html        用户中心-收藏记录"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`user/findpass.html    用户中心-找回密码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`user/foot.html        用户中心-公共底部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/head.html        用户中心-公共头部"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/include.html     用户中心-公共引入文件"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`user/index.html       用户中心-首页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`user/info.html        用户中心-个人详情`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/login.html       用户中心-登录页"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/orders.html      用户中心-在线充值记录"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`user/pay.html         用户中心-支付页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`user/plays.html       用户中心-点播记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/popedom.html     用户中心-权限列表"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/reg.html         用户中心-注册"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"user/upgrade.html     用户中心-会员升级"}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s94")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`文件：home.js`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Url当前网页地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Title当前网页标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.UserAgent获取浏览器类型`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Copy(s)复制内容到剪切板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Home(obj,url)设置网址为浏览器主页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Fav(url,name)加入网址到收藏夹`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Open(w,h,u)弹出网址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Cookie.Set(name,val,day)设置cookie`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Cookie.Get(name)获取cookie`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Cookie.Del(name)删除cookie`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.GoBack()返回上个页面`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Qrcode() 重写class="mac_qrcode" 的图片地址为一个二维码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Image.Lazyload.Show()异步载入图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Image.Lazyload.Box(id)载入指定id内部的图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Verify.Init() 把class="mac_verify" 的input框后边插入图片验证码class="mac_verify_img"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.PageGo()把class="mac_page_go"的按钮绑定事件切换分页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Hits()把class="mac_hits"的元素载入点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Score().Init()在class="mac_score"的内部初始化普通评分插件，class="score_btn"提交评分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Star().Init()在class="mac_star"的元素初始化星星评分插件`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Digg.Init()在class="digg_link"的元素上绑定 点击事件`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Gbook().Init()在class="gbook_content",class="gbook_submit"绑定事件留言本使用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Search().Init()在class="mac_search"的按钮上绑定事件，跳转到搜索页面`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Suggest().Init()在class="mac_wd"的文本框内部加入搜索联想结果功能`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.History().Init()在class="mac_history"的元素上加入鼠标移入移除事件展示浏览日志`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Ulog().Init()在class="mac_ulog"的元素上初始化用户日志相关操作，包含1浏览2收藏3想看4点播5下载`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.User().Init()在class="mac_user"的元素上初始化用户无刷新登录、用户详情`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Pop().Show()弹出层插件`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"    MAC.AdsWrap()输出占位符"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"    MAC.Css()加载css文件"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"    MAC.Desktop()跳转到保存到桌面"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    MAC.Comment()评论相关功能`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s95")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_name}        网站名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_url}         网站url`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_keywords}    网站关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_description} 网站描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_icp}         备案号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_qq}          站长qq`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_email}       站长email`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_tj}          统计代码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_status}      网站状态1开启0关闭`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.site_close_tip}   网站关闭提示信息`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.path}             网站目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.path_tpl}         当前模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.search_hot}       热门搜索词`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.mid}模块id，1视频2文章3专题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.aid}当前系统页面id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`首页1`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`地图2`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`rss3`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`留言本4`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`评论5`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`用户中心6`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`自定义页面7`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频首页10`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章首页20`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`专题首页30`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频分类页11`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频分类筛选12`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频搜索13`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"视频详情14"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"视频播放15"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"视频下载16"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章分类21`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章分类筛选22`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"文章搜索23"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"文章详情24"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"专题详情31"}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s96")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`{include file="public/head"}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s97")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{t("doc.s98")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {if condition="($name == 1) OR ($name > 100) "} value1`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {elseif condition="$name eq 2"/}value2`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {else /} value3`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/if}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`empty标签用于判断某个变量是否为空，用法：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {empty name="name"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    name为空值`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/empty}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`如果判断没有赋值，可以使用：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {notempty name="name"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    name不为空`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/notempty}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s99")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    type:友情链接类型 font表示文字,pic表示图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num: 获取数据条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:link num="2" type="pic"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:link num="2" type="pic"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.link_name}名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.link_url}地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.link_pic}图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:link}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s100")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`     num:数据条数  默认值10`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    paging:是否开启分页yes`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by:数据排序依据 id,time`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:gbook num="10" paging="no" order="desc" by="time"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$key}序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.gbook_id}      编号id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.gbook_name}    留言昵称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.gbook_content} 留言内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.gbook_reply}   回复内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.gbook_ip}      留言者IP`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.gbook_time}    留言时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.gbook_replytime} 回复时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:gbook}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s101")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num:数据条数  默认值10`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    paging:是否开启分页yes`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by:数据排序依据 id,time`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:comment num="10" paging="no" order="desc" by="time"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$key}      排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.comment_id}      编号id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.comment_name}    评论昵称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.comment_content} 评论内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.comment_ip}      评论者IP`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.comment_ip}      评论者IP`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.childs}    回复评论项`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:comment}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s102")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order排列顺序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by排序依据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    start从第几条开始`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num获取条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    ids指定分类parent获取一级分诶；child获取子分类；1,2,3一组指定ID；`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    ids指定分类parent获取一级分诶；child获取子分类；1,2,3一组指定ID；`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:type num="10" order="asc" by="sort" ids="all"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`       内部同下方，{$obj.改为{$vo.开头即可`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:type}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`=======分类页独有标签=======`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.parent} 如果当前访问的是二级分类，这个是一级分类对象，也同样包含以下属性，如{$obj.parent.type_id}一级分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_id}分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_name}名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_enname}别名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_sort}排序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_mid}所属模块`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_pid}上级id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_status}状态1开启0关闭`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_tpl}分类页模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_tpl_list}筛选页模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_tpl_detail}详情页模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_tpl_play}播放页模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_tpl_down}下载页模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_key}关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_des}描述信息`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_title}标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_extend}扩展配置json`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {:mac_url_type($obj)} 分类链接`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s103")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order排列顺序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by排序依据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    start从第几条开始`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num获取条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    ids指定1,2,3一组指定ID；`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    timeadd添加时间 一天前 -1 day，一周前-1 week，一月前-1 month，一小时前-1 hour`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    timehits点击时间 一天前 -1 day，一周前-1 week，一月前-1 month，一小时前-1 hour`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    time更新时间 一天前 -1 day，一周前-1 week，一月前-1 month，一小时前-1 hour`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hitsmonth月点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hitsweek周点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hitsday日点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hits总点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    paging是否分页yes`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:topic num="10" paging="no" order="asc" by="sort" ids="all"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:topic num="10" paging="no" order="asc" by="sort" ids="all"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:topic}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`=======专题页独有标签=======`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_id}专题id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_name}名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_en}别名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_sub}副标`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_status}状态`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_sort}排序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_letter}首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_color}高亮颜色`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_tpl}模板文件`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_type}扩展分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_pic}图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_pic_thumb}缩略图`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_pic_slide}幻灯图`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_key}seo关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_des}seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_title}seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_blurb}简介`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_remarks}备注`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_level}推荐值`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_up}顶数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_down}踩数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_score}平均分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_score_all}总评分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_score_num}总评次`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_hits}总点击`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_hits_day}日点击`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_hits_week}周点击`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_hits_month}月点击`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_time}更新时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_time_add}添加时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_content}详细介绍`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.topic_extend}扩展配置json`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {:mac_url_topic_detail($obj)} 专题详情页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {:mac_url_topic_index()}  专题首页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s104")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`剧情分类标签参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order: 排序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num:显示条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:class num="10" order="desc"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$key}             序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.class_name}   分类名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.class_link}   链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:class}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`地区标签参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order: 排序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num:显示条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:area num="5" order="desc"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$key} 排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.area_name} 地区名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.area_link} 链接地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:area}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`语言标签参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order:排序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num:显示条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:lang num="5" order="desc"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$key} 排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.lang_name} 语言名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.lang_link} 链接地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:lang}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:lang}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order:排序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num:显示条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:year num="5" order="desc"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$key} 排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.year_name} 语言名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.year_name} 语言名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:year}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`版本标签参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order:排序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num:显示条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:version num="5" order="desc"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$key} 排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.version_name} 版本名称，如高清版,剧场版`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.version_link} 链接地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:version}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`资源标签参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order:排序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num:显示条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:state num="5" order="desc"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$key} 排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.state_name} 状态名称，如正片,预告片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo.state_link} 链接地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:state}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>

            <h3>{t("doc.s105")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`分页标签可用在，首页、分类页、筛选页、专题首页、搜索页、文章内容页、留言本、评论`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`其中包含隐藏参数pageurl=""，视频默认是vod/type，文章分页默认是art/type，分页时必须加入此参数以免分页出错！！！`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例如：{maccms:vod num="10" paging="yes" pageurl="vod/type" half="3"} {/maccms:vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频分类页是pageurl="vod/type"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频筛选页是pageurl="vod/show"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频搜索页是pageurl="vod/search"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`首页是pageurl="index/index"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章分类页是pageurl="art/type"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章筛选页是pageurl="art/show"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章搜索页是pageurl="art/search"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`其中half参数是设置显示分页数字页码的个数，不设置默认为5。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`参数详解:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`     系统提供了$__PAGING__分页变量，可以来进行diy定制。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`     例子：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`     例子：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    <div class="page_tip">共{$__PAGING__.record_total}条数据,当前{$__PAGING__.page_current}/{$__PAGING__.page_total}页</div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    <div class="page_info">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|str_replace='%7Bpg%7D',1,###}" title="首页">首页</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|str_replace='%7Bpg%7D',$__PAGING__.page_prev,###}" title="上一页">上一页</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {maccms:foreach name="$__PAGING__.page_num" id="num"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {if condition="$__PAGING__['page_current'] eq $num"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link page_current" href="javascript:;" title="第{$num}页">{$num}</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {else}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|str_replace='%7Bpg%7D',$num,###}" title="第{$num}页">{$num}</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {/if}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {/maccms:foreach}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|str_replace='%7Bpg%7D',$__PAGING__.page_next,###}" title="下一页">下一页</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|str_replace='%7Bpg%7D',$__PAGING__.page_total,###}" title="尾页">尾页</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <input class="page_input" type="text" placeholder="页码" id="page" autocomplete="off" style="width:40px">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <button class="page_btn" type="button" onclick="pagego('{$__PAGING__.page_url}','{$__PAGING__.page_total}')">GO</button>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    </div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</div>`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>

            <h3>{t("doc.s106")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数详解:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    wd:名称或主演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    ids:数据id支持多个逗号分割 1,2,3`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    letter:首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    enname:别名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    actor:主演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    director:导演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    area:地区`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    lang:语言`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    year:上映年代`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    version:版本`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    state:资源类型`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    level:推荐等级`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    tid:分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order:排序 desc(倒序) asc (正序)`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by:排序字段`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`独有标签：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$param.page}当前页码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$param.wd}关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$param.wd}关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$param.lang}语言`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$param.year}年代`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$param.actor}演员`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$param.director}导演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$param.class}扩展分类`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>

            <h3>{t("doc.s107")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order排列顺序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by排序依据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    start从第几条开始`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num获取条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    ids指定1,2,3一组ID；`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    type指定获取分类数据 all所有；1,2,3指定；`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    class指定某扩展分类 支持多个 动作,喜剧`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    tag指定tag 支持多个  aaa,xxx`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    level指定推荐值 支持多个  1,2`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    area指定地区 支持多个  大陆,香港`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    lang指定语言 支持多个  国语,粤语`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    year指定年代 支持多个 2002,2003`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    state资源类别 支持多个 高清版,剧场版,抢先版`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    version资源版本 支持多个 正片,预告片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    weekday更新周期 支持多个  一,二,三`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    rel指定关联数据 1,2,3 或 变形金刚`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    timeadd添加时间 一天前 -1 day，一周前-1 week，一月前-1 month，一小时前-1 hour`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    timehits点击时间 一天前 -1 day，一周前-1 week，一月前-1 month，一小时前-1 hour`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    time更新时间 一天前 -1 day，一周前-1 week，一月前-1 month，一小时前-1 hour`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hitsmonth月点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hitsweek周点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hitsday日点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hits总点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    paging是否分页yes`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    pageurl分页地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:vod num="10" paging="no" type="all" order="asc" by="sort"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`       内部同下方，{$obj.改为{$vo.开头即可`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`=======视频内容页独有标签=======`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_id} 视频id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_id} 分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_id_1} 一级分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type} 视频分类对象，二级属性可参考分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_1} 一级分类对象，二级属性可参考分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.group_id} 用户组id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_name} 视频名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_sub} 副标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_en} 别名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_status} 状态0未审1已审`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_letter} 首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_color} 颜色`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_tag} tags`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_class} 扩展分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_pic} 图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_pic_thumb} 缩略图`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_pic_slide} 幻灯图`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_actor} 主演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_director} 导演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_writer}编剧`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_blurb} 简介`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_remarks} 备注`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_pubdate}上映日期`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_total} 总集数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_serial} 连载数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_tv} 上映电视台`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_weekday} 节目周期`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_area} 地区`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_lang} 语言`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_year} 年代`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_version} 版本-dvd,hd,720p`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_state} 资源类别-正片,预告片,花絮`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_author} 编辑人员`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_jumpurl} 跳转url`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_tpl} 独立模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_tpl_play} 独立播放页模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_tpl_down} 独立下载页模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_isend} 是否完结`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_lock} 锁定1`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_level} 推荐级别`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_points_play} 点播付费`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_points_down} 下载付费`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_hits} 总点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_hits_day} 日点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_hits_week} 周点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_hits_month} 月点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_duration} 时长`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_up} 顶数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_down} 踩数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_score} 平均分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_score_all} 总评分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_score_num} 评分次数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_time} 更新时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_time_add} 添加时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_time_hits} 点击时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_time_make} 生成时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_trysee} 试看时长分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_reurl} 来源地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_rel_vod} 关联视频ids`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_rel_art} 关联文章ids`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_content} 详细介绍`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_play_from} 播放组`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_play_server} 播放服务器组`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_play_note} 播放备注`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_play_url} 播放地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_down_from} 下载租`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_down_server} 下载服务器组`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_down_note} 下载备注`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.vod_down_url} 下载地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {:mac_url_vod_detail($obj)}  视频详情页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {:mac_url_vod_play($obj,['sid'=>1,'nid'=>1])}   视频播放页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {:mac_url_vod_down($obj,['sid'=>1,'nid'=>1])}   视频下载页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>


            <h3>{t("doc.s108")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{``}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{` 列出播放地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:foreach name="obj.vod_play_list" id="vo"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<div class="ui-box marg" id="playlist_{$key}">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    <div class="down-title">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <h2>{$vo.from}-在线播放</h2><span>[{$vo.player_info.tip}]</span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    </div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    <div class="video_list fn-clear">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {maccms:foreach name="vo.urls" id="vo2"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a href="{:mac_url_vod_play($obj,['sid'=>$vo.sid,'nid'=>$vo2.nid])}">{$vo2.title}</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {/maccms:foreach}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    </div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:foreach}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`列出下载地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:foreach name="obj.vod_down_list" id="vo"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<div class="ui-box marg" id="downlist_{$key}">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    <div class="down-title">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <h2>{$vo.from}-下载</h2><span>[{$vo.player_info.tip}]</span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    </div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    <div class="video_list fn-clear">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {maccms:foreach name="vo.urls" id="vo2"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a href="{:mac_url_vod_down($obj,['sid'=>$vo.sid,'nid'=>$vo2.nid])}">{$vo2.title}</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {/maccms:foreach}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    </div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:foreach}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`上边循环过程中，其中获取播放器详细信息的方法是`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.player_info.from} 编码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.player_info.show} 名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.player_info.des} 备注`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.player_info.tip} 提示`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.player_info.sort} 排序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.player_info.parse} 解析接口`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`=======视频播放页独有标签=======`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$param.sid} 当前播放组序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$param.nid} 当前集数序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj.player_info.link_next} 下一页地址，最后一页时此链接将当前页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj.player_info.link_pre} 上一页地址，第一页时此链接将当前页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj['vod_play_list'][$param['sid']]} 获取当前播放组数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj['vod_play_list'][$param['sid']]['player_info']}  播放器信息`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj['vod_play_list'][$param['sid']]['server_info']}  服务器组信息`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj['vod_play_list'][$param['sid']]['url_count']} 总集数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj['vod_play_list'][$param['sid']]['urls']} 集数信息`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj['vod_play_list'][$param['sid']]['urls'][$param['nid']]} 当前集数信息`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj['vod_play_list'][$param['sid']]['urls'][$param['nid']]['name']} 当前集数名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$obj['vod_play_list'][$param['sid']]['urls'][$param['nid']]['url']} 当前集数url`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`下载页获取以上信息，请把vod_play_list改为vod_down_list，其他参数不变`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$player_data} 播放数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$player_js} 加载播放器`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`=======获取与当前视频相关联视频和关联文章数据======`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<h2>与<strong>“{$obj.vod_name}”</strong>关联的视频</h2>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<ul class="img-list dis">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:vod num="6" rel="'.$obj['vod_rel_vod'].'" order="desc" by="time"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <li><a href="{:mac_url_vod_detail($vo)}" title="{$vo.vod_name}"><img src="{:mac_url_img($vo.vod_pic)}" alt="{$vo.vod_name}"><h2>{$vo.vod_name}</h2><p></p><i>{$vo.vod_version}</i><em></em></a></li>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</ul>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<h2>与<strong>“{$obj.vod_name}”</strong>关联的文章</h2>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<ul class="img-list dis">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:art num="6" rel="'.$obj['vod_rel_art'].'" order="desc" by="time"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <li><a href="{:mac_url_art_detail($vo)}" title="{$vo.art_name}"><img src="{:mac_url_img($vo.art_pic)}" alt="{$vo.art_name}"><h2>{$vo.art_name}</h2><p></p><i>{$vo.vod_from}</i><em></em></a></li>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:art}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</ul>`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>


            <h3>{t("doc.s109")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order排列顺序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by排序依据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    start从第几条开始`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num获取条数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    ids指定1,2,3一组ID；`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    type指定获取分类数据 all所有；1,2,3指定；`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    class指定某扩展分类 支持多个`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    tag指定tag 支持多个  aaa,xxx`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    level指定推荐值 支持多个`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    rel指定关联数据 1,2,3 或 变形金刚`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    timeadd添加时间 一天前 -1 day，一周前-1 week，一月前-1 month，一小时前-1 hour`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    timehits点击时间 一天前 -1 day，一周前-1 week，一月前-1 month，一小时前-1 hour`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    time更新时间 一天前 -1 day，一周前-1 week，一月前-1 month，一小时前-1 hour`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hitsmonth月点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hitsweek周点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hitsday日点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    hits总点击量 大于一千 gt 1000, 小于一千 lt 1000，区间一千二千之间 between 1000,2000`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    paging是否分页yes`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    pageurl分页地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:art num="10" paging="no" type="all" order="asc" by="sort"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`       内部同下方，{$obj.改为{$vo.开头即可`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:art}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`=======文章内容页独有标签=======`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_id} 文章id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_id} 分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_id_1} 一级分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type} 视频分类对象，二级属性可参考分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.type_1} 一级分类对象，二级属性可参考分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.group_id} 用户组id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_name} 标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_sub} 副标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_en} 别名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_status} 状态0未审1已审`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_letter} 首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_letter} 首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_from} 来源`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_author} 作者`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_tag} tags`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_class} 扩展分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_pic} 主图`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_pic_thumb} 缩略图`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_pic_slide} 幻灯图`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_blurb} 简介`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_remarks} 备注`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_jumpurl} 跳转url`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_tpl} 独立模板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_level} 推荐等级`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_lock} 锁定`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_up} 顶数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_down} 踩数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_hits} 总点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_hits_day} 日点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_hits_week} 周点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_hits_month} 月点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_time} 更新时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_time_add} 添加时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_time_hits} 点击时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_time_make} 生成时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_score} 平均分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_score_all} 总评分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_score_num} 评分次数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_rel_art} 关联文章`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_rel_vod} 关联视频`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_title} 页标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_note} 页备注`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {$obj.art_content} 页详细介绍`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {:mac_url_art_detail($obj)}  文章详情页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`=======获取与当前文章相关联视频和关联文章数据======`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<h2>与<strong>“{$obj.art_name}”</strong>关联的视频</h2>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<ul class="img-list dis">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:vod num="6" ids="'.$obj['art_rel_vod'].'" order="desc" by="time"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <li><a href="{:mac_url_vod_detail($vo)}" title="{$vo.vod_name}"><img src="{:mac_url_img($vo.vod_pic)}" alt="{$vo.vod_name}"><h2>{$vo.vod_name}</h2><p></p><i>{$vo.vod_version}</i><em></em></a></li>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</ul>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<h2>与<strong>“{$obj.art_name}”</strong>关联的文章</h2>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<ul class="img-list dis">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:art num="6" ids="'.$obj['art_rel_art'].'" order="desc" by="time"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <li><a href="{:mac_url_art_detail($vo)}" title="{$vo.art_name}"><img src="{:mac_url_img($vo.art_pic)}" alt="{$vo.art_name}"><h2>{$vo.art_name}</h2><p></p><i>{$vo.vod_from}</i><em></em></a></li>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:art}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</ul>`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>


            <h3>{t("doc.s110")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`分页代码可用在分类页、筛选页、搜索页、文章内容页、留言本、评论、专题首页等页面，使用前提是页面有包含paging='yes'获取分页数据的标签。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`其中包含隐藏参数pageurl=""，视频默认是vod/type，文章分页默认是art/type，分页时必须加入此参数以免分页出错！！！`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例如：{maccms:vod num="10" paging="yes" pageurl="vod/type"} {/maccms:vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频分类页是pageurl="vod/type"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频筛选页是pageurl="vod/show"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频搜索页是pageurl="vod/search"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`首页是pageurl="index/index"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章分类页是pageurl="art/type"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章筛选页是pageurl="art/show"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章搜索页是pageurl="art/search"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<div class="mac_pages">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    <div class="page_tip">共{$__PAGING__.record_total}条数据,当前{$__PAGING__.page_current}/{$__PAGING__.page_total}页</div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    <div class="page_info">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=1}" title="首页">首页</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=$__PAGING__.page_prev}" title="上一页">上一页</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {maccms:foreach name="$__PAGING__.page_num" id="num"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {if condition="$__PAGING__['page_current'] eq $num"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link page_current" href="javascript:;" title="第{$num}页">{$num}</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {else}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=$num}" title="第{$num}页">{$num}</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {/if}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {/maccms:foreach}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=$__PAGING__.page_next}" title="下一页">下一页</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <a class="page_link" href="{$__PAGING__.page_url|mac_url_page=$__PAGING__.page_total}" title="尾页">尾页</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <input class="page_input" type="text" placeholder="页码" id="page" autocomplete="off" style="width:40px">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        <button class="page_btn mac_page_go" type="button" data-url="{$__PAGING__.page_url}" data-total="{$__PAGING__.page_total}" data-sp="{$__PAGING__.page_sp}">GO</button>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    </div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</div>`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>


            <h3>{t("doc.s111")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`允许使用多个函数，都使用|分隔开`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{:mac_data_count(0,'all','vod')} 获取视频总数量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{:mac_data_count(0,'today','vod')} 获取今日更新视频总数量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{:mac_data_count(0,'all','art')} 获取文章总数量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{:mac_data_count(0,'today','art')} 获取今日更新文章总数量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{:mac_data_count(1,'all')} 获取某个分类下的数据总量，支持视频和文章,传入分类ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{:mac_data_count(1,'today')} 获取某个分类下的今日更新数据总量，支持视频和文章,传入分类ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{:mac_url('map/index')} 获取站内链接,参数代表 模块/页面`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.vod_pic|mac_url_img}  自动转换图片地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.vod_content|mac_substring=100}返回截取字符串100个字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.vod_content|mac_filter_html}返回没有html代码的内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.actor|mac_url_create='actor','vod','search'}把,号相连的一串字符生成N个搜索链接,后2个参数可以不填写默认是生成vod模块搜索链接。 例子是创建演员搜索链接。支持演员、导演、tag、扩展分类等字段`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.vod_time|mac_day} 自动返回日期`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.vod_time|mac_friend_date} 友好时间提醒 几秒前，几分前，几小时前，几天前。。。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$vo.vod_year|mac_default='未知'}如果字符串为空，则返回默认字符串`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$user.user_login_ip|mac_long2ip}返回格式化ip地址`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>


            <h3>{t("doc.s112")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`会员-收藏视频内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<a href="javascript:;" class="mac_ulog" data-type="2" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}">我要收藏</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`会员-收藏文章内容页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<a href="javascript:;" class="mac_ulog" data-type="2" data-mid="{$maccms.mid}" data-id="{$obj.art_id}">我要收藏</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`会员-收藏专题内容页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<a href="javascript:;" class="mac_ulog" data-type="2" data-mid="{$maccms.mid}" data-id="{$obj.topic_id}">我要收藏</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`以下内容一般放到body结尾之前，不用于显示，只用户记录信息。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`会员-文章浏览记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<span style="display:none" class="mac_ulog_set" alt="设置文章内容页浏览记录" data-type="1" data-mid="{$maccms.mid}" data-id="{$obj.art_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`会员-专题浏览记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<span style="display:none" class="mac_ulog_set" alt="设置专题内容页浏览记录" data-type="1" data-mid="{$maccms.mid}" data-id="{$obj.topic_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`会员-视频浏览记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<span style="display:none" class="mac_ulog_set" alt="设置内容页浏览记录" data-type="1" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`会员-视频播放记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<span style="display:none" class="mac_ulog_set" alt="设置视频播放记录" data-type="4" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`会员-视频下载记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<span style="display:none" class="mac_ulog_set" alt="设置视频播放记录" data-type="5" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频、文章、专题 顶和踩  通用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<a class="digg_link" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}" data-mid="{$maccms.mid}" data-type="up" href="javascript:;">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  顶<em class="digg_num">{$obj.vod_up}{$obj.art_up}{$obj.topic_up}</em>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<a class="digg_link" data-id="{$vod_id}{$art_id}{$topic_id}" data-mid="{$maccms.mid}" data-type="down" href="javascript:;">`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  踩<em class="digg_num">{$obj.vod_down}{$obj.art_down}{$obj.topic_down}</em>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频、文章、专题点击量显示  通用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`总点击量：<span class="mac_hits hits" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}" "="" data-type="hits"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`日点击量：<span class="mac_hits hits_day" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}" "="" data-type="hits_day"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`周点击量：<span class="mac_hits hits_week" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}" "="" data-type="hits_week"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`月点击量：<span class="mac_hits hits_month" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}" "="" data-type="hits_month"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`前台浏览历史记录调用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<a href="javascript:;" class="mac_history">历史记录</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`在视频、文章、专题详情页面写入浏览历史记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<span style="display:none" class="mac_history_set" alt="设置视频历史记录" data-name="[{$obj.type.type_name}]{$obj.vod_name}" data-pic="{$obj.vod_pic|mac_url_img}"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<span style="display:none" class="mac_history_set" alt="设置文章历史记录" data-name="[{$obj.type.type_name}]{$obj.art_name}" data-pic="{$obj.art_pic|mac_url_img}"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<span style="display:none" class="mac_history_set" alt="设置专题历史记录" data-name="{$obj.topic_name}" data-pic="{$obj.topic_pic|mac_url_img}"></span>`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>


            <h3>{t("doc.s113")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`mid:模块1视频2文章3专题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`limit:每页条数，支持10,20,30`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`page:页码，最多不超过20页，防止非法采集`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`接口地址是index.php/ajax/data.html?mid=1&page=1&limit=10`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>


            <h3>{t("doc.s114")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`1，在循环中获取每个分类的数据量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:type ids="1,2,3,4" order="asc" by="sort" id="vo1" key="key1"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`分成：{$vo1.type_name}；总数量： {$vo1.type_id|mac_data_count=all}；今日数量：{$vo1.type_id|mac_data_count=today}。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:type}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`2，嵌套循环外层分类内部视频或文章,重点在于外部和内部标签各自设置 id 和 key，系统默认都是vo不适合会导致数据冲掉。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:type ids="1,2,3,4" order="asc" by="sort" id="vo1" key="key1"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:vod num="10" type="'.$vo1['type_id'].'" order="desc" by="time" id="vo2" key="key2"}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {$vo1.type_name}:{$vo2.vod_name}；`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:type}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>

            <p>{t("doc.s26")}</p>
          </article>
        </div>
      </div>
    </DocLayout>
  );
}