import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

import DocLayout from "@/layouts/DocLayout";

export default function DocPage() {

  const { t } = useTranslation();

  return (
    <DocLayout title={t('seo.t.t6')} mobile_title={t("menu.doc")} version={"v8"}>
      <div className="container mb-[60px] md:mb-[90px]">
        <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
          {/* Desktop sidebar */}
          <div className="doc-sidebar pt-[20px] md:pt-[65px]  hidden md:flex flex-col min-w-[160px] max-h-[200px]">
            {/* Version Select */}
            <div className="flex flex-row gap-2 items-center">
              <Link href="/doc/v10">
                <div className="w-[54px] h-[30px] flex items-center justify-center rounded-[4px] border bg-white text-black">V10</div>
              </Link>
              <Link href="/doc/v8">
                <div className="w-[54px] h-[30px] flex items-center justify-center rounded-[4px] bg-primary text-white">V8</div>
              </Link>            
            </div>
            {/* End of Version select */}
            <label className="mt-[20px] mb-[10px] text-black text-[20px] font-primary">{t("doc.s1")}</label>
            <ul className="doc-menu">
              <li className={clsx("doc-menu-item group")}>
                <Link href="/doc/v8" className="group-hover:text-primary text-[16px]">{t("doc.s2")}</Link>
              </li>
              <li className={clsx("doc-menu-item group")}>
                <Link href="/doc/v8/faq" className="group-hover:text-primary text-[16px]">{t("doc.s3")}</Link>
              </li>
              <li className={clsx("doc-menu-item active group")}>
                <Link href="/doc/v8/label" className="group-hover:text-primary text-[16px]">{t("doc.s4")}</Link>
              </li>
            </ul>
          </div>
          {/* Content */}
          <article className="doc pt-[10px] md:pt-[35px] grow">
            <h2>{t("doc.s4")}</h2>
            <p>{t("doc.s119")}</p>
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
                  <div className="code-space">{`│  └─html     模板文件`}</div>
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
                  <div className="code-space">{`home_include.html    全站公共引入文件 引入js、css样式，还有系统JS变量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`home_head.html       全站头部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`home_foot.html       全站尾部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`home_gbook.html      留言本`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`home_comment.html    评论`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`label_   开头的都是自定义页面`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art_detail.html      文章内容页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art_index.html       文章首页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art_list.html        文章分类筛选页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art_map.html         文章地图页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art_search.html      文章搜索页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art_topicindex.html  文章专题首页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art_topiclist.html   文章专题数据列表页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`art_type.html        文章分类页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod_detail.html      视频内容页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod_index.html       视频首页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod_list.html        视频分类筛选页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod_map.html         视频地图页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"vod_play.html        视频播放页"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod_playopen.html    视频弹窗播放页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"vod_search.html      视频搜索页面"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod_topicindex.html  视频专题首页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod_topiclist.html   视频专题数据列表页`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`vod_type.html        视频分类页面`}</div>
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
                  <div className="code-space">{`文件：js/home.js`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.Url         当前网页的链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.Url         当前网页的链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.Copy(s)     复制内容到剪切板; s=字符串`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.Home(o,u)   设置默认主页;     onclick="MAC.Home(this,'http://www.maccms.la')"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.Fav(u,s)    加入浏览器收藏夹;  onclick="MAC.FAV('http://www.maccms.la','苹果CMS')"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.Open(u,w,h)  弹出网页;u=网址,w=宽度,h=高度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.Cookie.Set(name,value,days)   设置cookie的值; name=cookie名称,value=cookie值,days=过期时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.Cookie.Get(name)              获取cookie的值; name=cookie名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.Cookie.Del(name)              删除cookie的值; name=cookie名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`MAC.AdsWrap(w,h,n)                预留广告位占位; w=宽度,h=高度,n=名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`自动加载设置项：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`html元素ID为history：  自动设置为鼠标移动滑入滑出  显示隐藏 历史记录。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`html元素ID为wd： 自动设置联想搜索功能。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`延迟加载图片： img元素不要使用src调用图片地址，而是用data-original。  < img class="lazy" data-original="[vod:pic]" src="{maccms:path}images/blank.png" />`}</div>
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
                  <div className="code-space">{`{maccms:runtime}       页面运行时间、查询次数、占用内存`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:date}          当前日期`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:siteaid}       当前所在模块ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:url}           网站域名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:name}          网站名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:keywords}      网站关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:description}   网站描述信息`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:icp}           网站备案号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:qq}            网站管理QQ`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:visits}        网站统计代码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{$maccms.path}             网站目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:path_ads}      当前模版广告文件目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:path_tpl}      当前模版HTML文件目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_gbook}      留言本链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_search_vod}  视频搜索页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_search_art}  文章搜索页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_index}      视频首页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_index_art}   文章首页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_map_vod}     视频地图链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_map_art}     文章地图链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_topic_vod}   视频专题首页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_topic_art}   文章专题首页链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_map_rss}     RSS链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_map_baidu}   Baidu SiteMap链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:link_map_google}  Google SiteMap链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:count_vod_all}    视频数据总量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:count_vod_day}    视频当天更新数据量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:count_art_all}    文章数据总量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"{maccms:count_art_day}    文章当天更新数据量"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"{maccms:count_user_all}      会员总数"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"{maccms:count_user_day}   会员当天注册数量"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:userid}         当前登录会员ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:username}       当前登录会员名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"{maccms:username}       当前登录会员名"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"{maccms:curvodtypeid}  视频当前分类ID"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"{maccms:curvodtypepid}  视频当前分类的父分类ID"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:curvodtopicid} 视频当前专题ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:curarttypeid}  文章当前分类ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:curarttypepid} 文章当前分类的父分类ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:curarttopicid} 文章当前专题ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:load label.html}     载入自定义页面内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:getlink label.html}  获取自定义页面的链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:siteaid}  当前所在系统模版id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频首页 10`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频地图页 11`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频分类，筛选页  12`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频专题首页 13`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频专题数据列表 14`}</div>
                </li>

                <li className="w-full">
                  <div className="code-space">{`视频搜索页   15`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频内容页   16`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频播放页   17`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`视频下载页   18`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章首页 20`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章地图页  21`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章分类，筛选页  22`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章专题首页  23`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章专题数据列表  24`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章搜索页  25`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`文章内容页  26`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`系统留言本  30`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`系统评论    31`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`系统用户中心  40`}</div>
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
                  <div className="code-space">{`if标签,支持多重嵌套,每个层级的if标签不能相同`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{if-A:[vod:num] > 1 }....{endif-A}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{if-A:[vod:num] mod 2=0}....{else-A}....{endif-A}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{if-A:[vod:num] mod 2=0}....{elseif-A}....{else-A}....{endif-A}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{if-A:not isN("[vod:remarks]")}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`   [vod:remarks]`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{elseif-A:[vod:state]=0}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`   [完结]`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{elseif-A:[vod:state]>0}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{if-B:[vod:state]>10000}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[连载[vod:state]]期`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{else-B}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[连载[vod:state]]集`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{endif-B}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{else-A}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{endif-A}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s120")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`用户登录窗口iframe调用:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`src="{maccms:path}index.php?m=user-iframe.html"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`特有标签:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:userid}        会员ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:username}      会员名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:userqq}        QQ号码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:useremail}     email地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:userphone}     电话`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:userregtime}   注册时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:userpoints}    剩余点数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:userlogintime}   最后登录时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:userloginnum}    总登录次数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:usertj}          推荐人数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:usergroupid}     会员组ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:usergroupname}   会员组名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:userloginip}     最后登录IP`}</div>
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
                  <div className="code-space">{`    {maccms:link type=pic num=2}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    [link:num]序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    [link:name]名称，支持长度控制[link:name len=10]`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    [link:link]地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    [link:pic]图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    [link:pic]图片`}</div>
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
                  <div className="code-space">{`    num:数据条数  默认值10，非分页时使用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    pagesize:每页数据条数,分页时使用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by:数据排序依据 id,time`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:gbook num=10 order=desc by=time}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:num]      排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:numfill] 自动补位序号，个位数前补0`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:numjoin] 如使用start参数，则自动从start开始计数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:id]      编号id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:name]    留言昵称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:content] 留言内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:reply]   回复内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:ip]      留言者IP`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:time]    留言时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:replytime] 回复时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [gbook:color]     随机颜色`}</div>
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
                  <div className="code-space">{`    num:数据条数  默认值10，非分页时使用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    pagesize:每页数据条数,分页时使用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by:数据排序依据 id,time`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:comment num=10 order=desc by=time}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [comment:num]      排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [comment:numfill] 自动补位序号，个位数前补0`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [comment:numjoin] 如使用start参数，则自动从start开始计数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [comment:id]      编号id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [comment:name]    评论昵称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [comment:content] 评论内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [comment:ip]      评论者IP`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [comment:time]    评论时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [comment:color]   随机颜色`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:comment}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>

            <h3>{t("doc.s121")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    type: all获取所有分类包含父子，parent获取所有父分类，child获取所有子分类, 1,2,3 指定分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by:数据排序依据 id,sort 默认sort`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order: 数据排序方式 desc(倒序) asc (正序)`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    table:必有参数vod则调用视频分类,art调用文章分类。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例: 调用视频分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:matrix type=1,2,6 table=vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [matrix:num]:序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [matrix:id]:id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [matrix:name]:名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [matrix:title]:seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [matrix:key]:seo关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [matrix:des]:seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [matrix:count]:包含数据量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [matrix:link]:链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`               {maccms:vod num=5 type=[matrix:id] start=1 order=desc by=time}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`               {/maccms:vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:matrix}`}</div>
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
                  <div className="code-space">{`    type:all获取所有分类包含父子，parenet获取所有父分类，child获取所有子分类 ,auto 在分类页、搜索页使用（将进入分类筛选页面和搜索筛选页，自动筛选一二级分类）`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    by:数据排序依据 id,sort 默认sort`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    order: 数据排序方式 desc(倒序) asc (正序)`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    parent: 父栏目ID, 0表示所有顶级栏目, 具体id表示调用指定分类的子分类菜单`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num:取分类数目，按照排序顺序。 6表示取得排序前6个分类。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    table:必有参数vod则调用视频分类,art调用文章分类。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例:视频单级别分类调用:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {maccms:menu type=parent order=asc table=vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [menu:num]:序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [menu:id]:id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [menu:pid]:父分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [menu:name]:名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [menu:key]:seo关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [menu:des]:seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [menu:title]:seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [menu:link]:链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    {/maccms:menu}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s122")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s123")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`地区标签参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`order: 排序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        type:auto时，分类筛选、搜索页面使用、自动补齐筛选参数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:area order=desc type=auto}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[area:num] 排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[area:name] 地区名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[area:link] 搜索链接地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:area}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例如：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:area order=desc type=auto}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    <a target="_blank" href="[area:link]">[area:name]</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:area}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`语言标签参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`order:排序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`type:auto时，分类筛选、搜索页面使用、自动补齐筛选参数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:lang order=desc}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[lang:num] 排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[lang:id] 语言id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[lang:name] 语言名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[lang:link] 搜索链接地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:lang}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例如：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:lang order=desc type=auto}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<a href="[lang:link]">[lang:name]</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:lang}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`年代标签参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`order:排序desc倒序，asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`start:起始年代`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`end:结束年代`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`type:auto时，分类筛选、搜索页面使用、自动补齐筛选参数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例如：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:year order=desc type=auto start=2000 end=2012}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<a href="[year:link]">[year:name]</a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:year}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s124")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数详解:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`wd:名称或主演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`ids:数据id支持多个逗号分割 1,2,3`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`letter:首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`pinyin:拼音`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`starring:主演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`directed:导演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`area:地区`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`lang:语言`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`year:上映日期`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`typeid:所属分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`classid:所属剧情分类`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`order:排序 desc(倒序) asc (正序)`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`by:排序字段`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例如：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`index.php?m=vod-search-wd-火影   搜索名称为火影的数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`index.php?m=vod-search-ids-123,567      搜索数据id为 123和567的数据，可以多条，逗号分割`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`index.php?m=vod-search-starring-刘德华   搜索主演为刘德华的数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`index.php?m=vod-search-letter-A      搜索首字母为A的数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`index.php?m=vod-search-typeid-1-wd-海贼   搜素分类ID为1下属的名称为海贼的数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`index.php?m=vod-search-wd-火影-order-desc-by-hits   搜索名称为火影的数据按照 总人气倒序排列`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`支持标签:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:key}       搜索关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:des}       搜索关键字描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:wd}        搜索的名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:wdencode}  url编码后的名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:pinyin}    搜索的拼音`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:letter}    搜索的首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:starring}        搜索的主演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:starringencode}  url编码后的主演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:directed}        搜索的导演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:directedencode}  url编码后的导演`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:area}            搜索的地区`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:areaencode}      url编码后的地区`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:language}        搜索的语言`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:languageencode}  url编码后的语言`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:year}      搜索的年代`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:typeid}    搜索的分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:now}         当前页数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:datacount}   搜索结果总数量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:size}        搜索结果每页显示数量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:count}       搜索数据分页总数`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s125")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数详解:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`id:分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`pg:页码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`支持标签:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:id}     当前分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:pid}    当前分类的父级id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:name}   当前分类名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:name}   当前分类拼音名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:key}    当前分类seo关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:des}    当前分类seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:title}  当前分类seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:link}   当前分类链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:textlink}    当前位置导航链接  例如当前位置:首页  >>  电影 >> 动作片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linkbytime}  进入分页筛选页面，按照时间排序链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linkbyhits}  进入分页筛选页面，按照人气排序链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linkbyscore} 进入分页筛选页面，按照评分排序链接`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s126")}</h3>
            <div className="code-container">
              <div
                  className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code
              </div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数详解:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`id:数据id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`pg:页码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`letter:首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`area:地区`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`lang:语言`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`year:上映日期`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`order:排序 desc(倒序) asc (正序)`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`by:排序字段 time时间,hits点击,score评分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例如:`}</div>
                </li>
                <li className="w-full">
                  <div
                      className="code-space">{`index.php?m=vod-list-id-5-pg-1-order-desc-by-hits-year-2013-letter-B-area-大陆-lang-国语`}</div>
                </li>
                <li className="w-full">
                  <div
                      className="code-space">{`筛选分类为5，第1页，倒序，按人气排序，2013年上映，首字母B，地区大陆，语言国语`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`支持标签:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:id}     当前分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:pid}    当前分类的父级id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:name}   当前分类名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:name}   当前分类拼音名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:key}    当前分类seo关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:des}    当前分类seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:title}  当前分类seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:link}   当前分类链接`}</div>
                </li>
                <li className="w-full">
                  <div
                      className="code-space">{`{page:textlink} 当前位置导航链接  例如当前位置:首页  >>  电影 >> 动作片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:year}      筛选参数-上映年代`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:lang}          筛选参数-语言`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:langencode}    筛选参数-语言url编码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:area}          筛选参数-地区`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:areaencode}    筛选参数-地区url编码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:letter}    筛选参数-首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:classid}  剧情分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:classname}  剧情分类名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linkyear}    筛选链接-年代-全部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linkletter}  筛选链接-首字母-全部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linkarea}    筛选链接-地区-全部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linklang}    筛选链接-语言-全部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linkbytime}  筛选链接-按照时间排序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linkbyhits}  筛选链接-按照人气排序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:linkbyscore} 筛选链接-按照评分排序`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s127")}</h3>
            <div className="code-container">
              <div
                  className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code
              </div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`分页标签可用在，首页、分类页、筛选页、专题首页、专题数据列表、搜索页、文章内容页、留言本、评论`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`参数详解:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`len:显示几个数字链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`linktype:分类类型,只在首页分页时用到linktype=index`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`请自行在模版的css样式表中设计分页样式`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例如:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<div class="page">{maccms:pages len=6}</div>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`解析后:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<div class="page">共10002条数据 当前:1/834页 <em>首页</em> <em>上一页</em> <span class="pagenow">1</span> <a target="_self" class="pagelink_b" href="?m=vod-type-id-1-pg-2.html">2</a> <a target="_self" class="pagelink_b" href="?m=vod-type-id-1-pg-3.html">3</a> <a target="_self" class="pagelink_b" href="?m=vod-type-id-1-pg-4.html">4</a> <a target="_self" class="pagelink_b" href="?m=vod-type-id-1-pg-5.html">5</a> <a target="_self" class="pagelink_b" href="?m=vod-type-id-1-pg-6.html">6</a> <a target="_self" href="?m=vod-type-id-1-pg-2.html" class="pagelink_a">下一页</a> <a target="_self" href="?m=vod-type-id-1-pg-834.html" class="pagelink_a">尾页</a> <input type="input" name="page" id="page" size="4" class="pagego"><input type="button" value="跳 转" onclick="pagego('?m=vod-type-id-1-pg-{pg}.html',834)" class="pagebtn"></div>`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s128")}</h3>
            <div className="code-container">
              <div
                  className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code
              </div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`num:数据条数  默认值10，非分页时使用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`pagesize:每页数据条数,分页时使用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`state: 影片连载 series(连载)`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`level：推荐种类 1,2,3,4,5 /all`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`by:数据排序依据 id,addtime添加时间,time更新时间,hits总点击,dayhits日点击,weekhits周点击,monthhits月点击,level推荐值,up顶数,down踩数,score评分,scoreall评分总数,scorenum评分次数, rnd随机数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`order: 数据排序方式 desc(倒序) asc (正序)`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`type:数据所在分类,可调出多个分类数据,如 1,2,3/all,current列表页当前分类,默认为全部`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`topic:指定专题 1,2,3/all可调多个  默认无`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`start:起点位置  1  默认1`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`day: 单天数据, 0当天数据. 1表示昨天的数据，2表示前天的数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`days:截止到今日数据， 0当天数据，1昨天到今天的数据，2前天到今天的数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`year:上映年代   2014`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`area: 所属地区   港台`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`lang: 所属语言   粤语`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`letter: 首字母   B`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`starring:调用主演的数据，如starring=刘德华`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`similar:调用相似相关数据 starring主演相似，directed导演相似、tag相似、name名称相似`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`label:自定义页面名称，不带label_前缀,如 hot.html； 只在自定义页面中使用，可生成自定义页面的分页.`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`maxpage:自定义页面中，最大分页数量。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例如:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:vod num=15 order=desc by=time type=all topic=1,2,3 level=1,2 start=5 area=大陆 lang=粤语 letter=A}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:num] 序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:numfill] 自动补位序号，个位数前补0`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:numjoin] 如使用start参数，则自动从start开始计数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:id] 编号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:name] 名称:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:encodename] 名称:urlencode编码，可用于搜索`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:colorname] 带颜色名称:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:subname] 副标名称:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:enname] 拼音名:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:ennamelink] 拼音名搜索链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:letter] 首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:letterlink] 首字母搜索链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:state]  状态`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:color]  颜色`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:pic]  图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:picthumb]  缩略图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:picslide]  幻灯图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:tag]     TAG`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:taglink]  TAG链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:taglink]  TAG链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:starringlink] 主演搜索链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:directed] 导演:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:directedlink] 导演搜索链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:year] 发行日期`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:yearlink] 发行日期搜索链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:area] 发行地区`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:arealink] 发行地区搜索链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:language] 发行语言`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:languagelink] 语言搜索链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:level]  推荐值`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:stint] 播放每集所需积分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:stintdown] 下载每集所需积分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:hits]  总点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:dayhits]  今天点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:weekhits]  本星期点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:monthhits]  本月点击量`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:content]  描述:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:contenttext]  过滤html后的描述:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:remarks]备注`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:good] 顶数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:bad] 踩数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:score] 平局分`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:scoreall]  总评分数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:scorenum] 评分次数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:duration] 数据播放时长`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:addtime style=y-m-d]  添加时间:可控时间格式 yy-m-d ,y-m-d , m-d`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:time style=y-m-d]  更新时间:可控时间格式 yy-m-d ,y-m-d , m-d`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:from] 播放类型`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:fromdown] 下载类型`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:link] 链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:playlink] 播放链接，默认是第1组播放器的第1条数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:playlinks] 播放链接组，所有播放组的第1条数据链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:downlink] 下载链接，默认是第1组下载器的第1条数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:downlinks] 下载链接组，所有下载组的第1条数据链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:type] 分类ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typepid]  父分类ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typelink] 父分类链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typepname]  父分类名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typepenname]  父分类拼音名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typepkey]  父分类seo关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typepdes]  父分类seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typeptitle]  父分类seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typelink] 分类链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typeexpandlink] 扩展分类链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typename]  分类名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typeenname]  分类拼音名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typeenname]  分类拼音名`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typedes]  分类seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:typetitle]  分类seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:classname] 剧情分类名称，多个用空格连接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:classlink] 剧情分类链接，多个用空格连接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:topiclink]  专题链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:userfav]   用户收藏链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:vod}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s129")}</h3>
            <div className="code-container">
              <div
                  className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code
              </div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`调用当前视频数据的标签，同vod标签, 例如[vod:id]  [vod:name]`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`支持标签:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:comment] 评论`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:hits] 动态载入点击量并更新点击量， 如不使用该标签点击量将不会增加`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:fav] 收藏到浏览器链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:share] 分享当前地址链接，复制到剪切板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:error] 报错链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:digg] 顶踩功能`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:history] 历史记录标签，使用该标签才会记录浏览历史，否则不记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:history] 历史记录标签，使用该标签才会记录浏览历史，否则不记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:scoremark2]  普通评分功能`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:prelink] 上一条记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:nextlink] 下一跳记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:textlink] 当前位置导航链接  例如当前位置:首页  >>  电影 >> 动作片 >> 火影忍者`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`播放页特有标签:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:playerinfo]`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:player]      这2个是播放器代码，必须有。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`------------------- 非静态单播放页模式可以用标签 --------------`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:playnum]  当前第几集`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:playname]  当前集数名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:playurlpath]  当前播放数据的真实播放地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:playurlpath]  当前播放数据的真实播放地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:playshow] 当前播放数据的来源显示名称 例如：优酷视频`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`------------------------------`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`下载页特有标签:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:downinfo]`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:downer]    这2个是必须调用的代码。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`------------------- 非静态单下载页模式可以用标签 --------------`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:downnum]      当前第几集`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:downname]     当前集数名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:downurlpath]  当前数据的真实播放地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:downfrom]     当前数据的来源标记  例如：xunlei`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[vod:downshow] 当前数据的来源显示名称 例如： 迅雷下载`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`------------------------------`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`播放列表标签，下载列表标签`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`from:current 在播放页面可以只获取当前组的列表, 不能用在静态模式生成单页中。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:play}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:num] 序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:count] 共有几组播放地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:urlcount] 当前播放租共有多少条播放地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:from] 播放组来源`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:sort] 播放组排序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:tip] 播放组提示说明`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:show] 播放组名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:server] 播放组-服务器组名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:serversort] 播放组-服务器组排序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:serverurl] 播放组-服务器组地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[play:servertip] 播放组-服务器组提示信息`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:url order=desc}     desc倒序,  asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[url:num] 顺序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[url:name]集数名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[url:link]播放链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[url:path]播放片源地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {/maccms:url}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:play}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`模式2：竖排显示`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:play type=mode2 order=asc}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<li><span>[play:num].[play:name]</span>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:url order=asc}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<a class="play_ico play_ico_[url:from]" title="[url:name]" href="[url:link]">  </a>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:url}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`</li>`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:play}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`显示效果是：每一行显示添加的所有播放组`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`第一集： 优酷 土豆 快播 百度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`第二集： 优酷 土豆 快播 百度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`备注：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`此模式建议关闭播放器的头部和列表，以达到最佳显示效果。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`添加时候的时候需要注意，需要某组播放器的某集数据暂缺的话， 请把当前集数的地址设置为no， 正常数据的[url:from]为播放类型如youku,baidu，暂缺数据的播放类型+no如youkuno,qvodno, 用此来区别显示图片。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`系统默认模板那只了这套模式的图片和css，play_mode2.css , play_mode2.gif 有需要的可自行修改。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`参数:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`from:current 在播放页面可以只获取当前组的列表,不能用在静态模式生成单页中。`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:down}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:num] 序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:count] 共有几组播放地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:urlcount] 当前播放租共有多少条播放地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:from] 播放组来源`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:sort] 播放组排序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:tip] 播放组提示说明`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:show] 播放组名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:server] 播放组-服务器组名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:serversort] 播放组-服务器组排序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:serverurl] 播放组-服务器组地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[down:servertip] 播放组-服务器组提示信息`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:url order=desc}     desc倒序,  asc正序`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[url:num] 顺序号`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[url:name] 集数名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[url:link] 下载链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[url:path] 下载片源地址`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        {/maccms:url}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:down}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s130")}</h3>
            <div className="code-container">
              <div
                  className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code
              </div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数详解:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`id:分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`pg:页码`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`支持标签:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:id}     当前分类id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:pid}    当前分类的父级id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:name}   当前分类名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:name}   当前分类拼音名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:key}    当前分类seo关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:des}    当前分类seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:title}  当前分类seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:link}   当前分类链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{page:textlink}    当前位置导航链接  例如当前位置:首页  >>  电影 >> 动作片`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s131")}</h3>
            <div className="code-container">
              <div
                  className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code
              </div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`参数：`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`    num:数据条数  默认值10，非分页时使用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`pagesize:每页数据条数,分页时使用`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`by:数据排序依据 id,hits总点击,dayhits日点击,weekhits周点击,monthhits月点击,addtime添加时间,time更新时间`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`order: 数据排序方式 desc(倒序) asc (正序)`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`start:起点位置  1  默认1`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        type:文章分类id  1,2/all`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`topic:文章专题id   1,2/all`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`day: 单天数据, 0当天数据. 1表示昨天的数据，2表示前天的数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`days:截止到今日数据， 0当天数据，1昨天到今天的数据，2前天到今天的数据`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`similar:调用相似相关数据 tag相似、name名称相似`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`letter: 首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`level：推荐种类 1,2,3,4,5 /all`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`例:`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{maccms:art num=3 order=desc by=time type=1}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:num]       排序位`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:numfill]   自动补位序号，个位数前补0`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:numjoin]   如使用start参数，则自动从start开始计数`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:id]        编号id`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:name]      标题:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:encodename]  url编码后的标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:enname]    拼音标题:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:letter]    首字母`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:subname]     副标题:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:colorname]   带颜色标题:可控长度`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:from]      来源`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:content]   内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:contenttext] 过滤html代码后内容`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:author]    作者`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:color]     颜色`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:level]     推荐值`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:hits]       总人气`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:dayhits]    日人气`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:weekhits]   周人气`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:monthhits]  月人气`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:addtime]   添加时间:可控时间格式 yy-m-d ,y-m-d , m-d`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:time]      更新时间:可控时间格式 yy-m-d ,y-m-d , m-d`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:pic]       图片`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:type]      分类ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typepid]   父分类ID`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typepname]   父分类名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typeplink]   父分类链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typepkey]    父分类seo关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typepdes]    父分类seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typeptitle]  父分类seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`        [art:typename]   分类名称`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typelink]   分类链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typekey]    分类seo关键字`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typedes]    分类seo描述`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:typetitle]  分类seo标题`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:link]      链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`{/maccms:art}`}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s132")}</h3>
            <div className="code-container">
              <div
                  className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code
              </div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`调用当前视频数据的标签，同art标签, 例如[art:id]  [art:name]`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:comment]     评论`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:hits]        动态载入点击量并更新点击量，如不使用该标签点击量将不会增加`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:prelink]     上一条记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:nextlink]    下一条记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:fav]         收藏到浏览器链接`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:share]       分享当前地址链接，复制到剪切板`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:digg]        顶踩功能`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:prelink]     上一条记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:nextlink]    下一跳记录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`[art:textlink]    当前位置导航链接  例如当前位置:首页  >>  新闻 >> 第一条文章`}</div>
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