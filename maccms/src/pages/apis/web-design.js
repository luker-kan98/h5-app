import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { Scrollspy } from "@makotot/ghostui";

import ApiLayout from "@/layouts/api/ApiLayout";
import ApiSidebar from "@/layouts/api/ApiSidebar";
import {markdownify} from "@/lib/utils/textConverter";
import InlineCode from "@/layouts/components/InlineCode";

export default function ApiPage() {

  const { t } = useTranslation();
  const router = useRouter();

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
    useRef(null)
  ];

  

  return (
    <ApiLayout title={`${t('apis.wd.s1')} | ${t('seo.t.t0')}`} mobile_title={t("apis.wd.s1")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <div
                className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                <ApiSidebar currentElementIndexInViewport={currentElementIndexInViewport}/>
              </div>
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("apis.wd.s1")}</h2>
                  <h3>{t("apis.wd.s155")}</h3>
                  <h4>{t("apis.wd.s110")}</h4>
                  <ul className="list">
                    <li>{t("apis.wd.s119")}</li>
                    <li>{t("apis.wd.s120")}</li>
                    <li>{t("apis.wd.s121")}</li>
                    <li>{t("apis.wd.s122")}</li>
                  </ul>

                  <h4>{t("apis.wd.s111")}</h4>
                  <ul className="list">
                    <li>{t("apis.wd.s124")}</li>
                    <li>{t("apis.wd.s125")}</li>
                    <li>{t("apis.wd.s126")}</li>
                    <li>{t("apis.wd.s123")}</li>
                    <li>{t("apis.wd.s127")}</li>
                  </ul>

                  <h4>{t("apis.wd.s112")}</h4>
                  <ul className="list">
                    <li>{t("apis.wd.s128")}</li>
                    <li>{t("apis.wd.s129")}</li>
                    <li>{t("apis.wd.s133")}</li>
                    <li>{t("apis.wd.s130")}</li>
                    <li>{t("apis.wd.s131")}</li>
                    <li>{t("apis.wd.s132")}</li>
                    <li>{t("apis.wd.s134")}</li>
                  </ul>
                  <InlineCode type={"text"} lines={7} code={t("apis.wd.s135")} />

                  <h4>{t("apis.wd.s113")}</h4>
                  <ul className="list">
                    <li>{t("apis.wd.s137")}</li>
                    <li>{t("apis.wd.s136")}</li>
                    <li>{t("apis.wd.s138")}</li>
                    <li>{t("apis.wd.s139")}</li>
                  </ul>
                  <p>{t("apis.wd.s140")}</p>

                  <h4>{t("apis.wd.s114")}</h4>
                  <ul className="list">
                    <li>{t("apis.wd.s141")}</li>
                    <li>{t("apis.wd.s142")}</li>
                    <li>{t("apis.wd.s143")}</li>
                    <li>{t("apis.wd.s144")}</li>
                  </ul>

                  <h4>{t("apis.wd.s115")}</h4>
                  <ul className="list">
                    <li>{t("apis.wd.s146")}</li>
                    <li>{t("apis.wd.s145")}</li>
                    <li>{t("apis.wd.s147")}</li>
                    <li>{t("apis.wd.s148")}</li>
                  </ul>

                  <h4>{t("apis.wd.s116")}</h4>
                  <ul className="list">
                    <li>{t("apis.wd.s149")}</li>
                    <li>{t("apis.wd.s150")}</li>
                    <li>{t("apis.wd.s151")}</li>
                    <li>{t("apis.wd.s152")}</li>
                  </ul>
                </div>

                <div id={'数据接口'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t('apis.wd.s2')}</h3>
                  <p>{t('apis.wd.s15')}</p>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s16'), 'li')}
                    {markdownify(t('apis.wd.s17'), 'li')}
                    {markdownify(t('apis.wd.s18'), 'li')}
                    {markdownify(t('apis.wd.s19'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className={'thead'}>
                      <tr>
                        <th>参数名</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数类型</th>
                        <th className='min-w-[300px]'>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>mid</td>
                        <td>1</td>
                        <td>必填</td>
                        <td>text</td>
                        <td>模型mid 1影片、2文章、3专题、8明星、9角色、11剧情</td>
                      </tr>
                      <tr>
                        <td>limit</td>
                        <td>20</td>
                        <td>必填</td>
                        <td>text</td>
                        <td>每页条数，支持10,20,30</td>
                      </tr>
                      <tr>
                        <td>page</td>
                        <td>1</td>
                        <td>必填</td>
                        <td>text</td>
                        <td>页码，最多不超过20页，防止非法采集</td>
                      </tr>
                      <tr>
                        <td>tid</td>
                        <td>1</td>
                        <td>必填</td>
                        <td>text</td>
                        <td>分类id</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <strong>{t('apis.wd.s20')}</strong>
                  <InlineCode type={'json'} lines={26} code={`{
\t"code": 1,
\t"msg": "数据列表",
\t"page": 1,
\t"pagecount": 221,
\t"limit": 10,
\t"total": 2204,
\t"list": [
\t\t{
\t\t\t"vod_id": 3683,
\t\t\t"type_id": 1,
\t\t\t"type_id_1": 0,
\t\t\t"group_id": 0,
\t\t\t"vod_name": "不表演才艺居然不给我饭吃#抖音汽车",
\t\t\t...
\t\t},
\t\t{
\t\t\t"vod_id": 3685,
\t\t\t"type_id": 1,
\t\t\t"type_id_1": 0,
\t\t\t"group_id": 0,
\t\t\t"vod_name": "所以非要这样吗？#当别人问我上班..",
\t\t\t...
\t\t},
\t]
}`}/>
      </div>
                <div id={'搜素联想'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t('apis.wd.s3')}</h3>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s21'), 'li')}
                    {markdownify(t('apis.wd.s22'), 'li')}
                    {markdownify(t('apis.wd.s23'), 'li')}
                    <div className='table-wrapper'>
                      <table>
                        <thead className='thead'>
                        <tr>
                          <th>参数名</th>
                          <th>示例值</th>
                          <th>是否必填</th>
                          <th>参数类型</th>
                          <th>参数描述</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>mid</td>
                          <td>1</td>
                          <td>必填</td>
                          <td>text</td>
                          <td>模型mid 1影片、2文章、3专题、8明星、9角色、11剧情</td>
                        </tr>
                        <tr>
                          <td>wd</td>
                          <td>招魂</td>
                          <td>必填</td>
                          <td>text</td>
                          <td>关键词</td>
                        </tr>
                        <tr>
                          <td>limit</td>
                          <td>10</td>
                          <td>必填</td>
                          <td>text</td>
                          <td>获取数量</td>
                        </tr>
                        <tr>
                          <td>imestamp</td>
                          <td>1574339368127</td>
                          <td>必填</td>
                          <td>text</td>
                          <td>时间戳</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                    {markdownify(t('apis.wd.s24'), 'li')}
                    <InlineCode type={'json'} lines={71} code={`{
\t"code": 1,
\t"msg": "数据列表",
\t"page": 1,
\t"pagecount": 3,
\t"limit": 10,
\t"total": 25,
\t"list": [
\t\t{
\t\t\t"id": 1593,
\t\t\t"name": "我也搞不懂他是怎么被困这里的 #宅家dou剧场  #我的观影报告  #萤火计划",
\t\t\t"en": "woyegaobudongtashizenmebeikunzhelidezhaijiadoujuchangwodeguanyingbaogaoyinghuojihua",
\t\t\t"pic": "https://p3.douyinpic.com/tos-cn-p-0015/34f94d7f8bda45048c14988492ef9500_1620207826~tplv-dy-360p.jpeg?from=4257465056&s=&se=false&sh=&sc=&l=202105312051560101501660281A0EC310&biz_tag=feed_cover"
\t\t},
\t\t{
\t\t\t"id": 1467,
\t\t\t"name": "假如爱情来临我的心永远不会迟到@DOU+小助手",
\t\t\t"en": "jiaruaiqinglailinwodexinyongyuanbuhuichidaoDOUxiaozhushou",
\t\t\t"pic": "https://p3.douyinpic.com/tos-cn-p-0015/be736dd849f744e7848473210c3c8131_1619099706~tplv-dy-360p.jpeg?from=4257465056"
\t\t},
\t\t{
\t\t\t"id": 1360,
\t\t\t"name": "有人说我的视频没营养 怎么？你的视频在炖骨头汤？",
\t\t\t"en": "yourenshuowodeshipinmeiyingyangzenmenideshipinzaidungutoutang",
\t\t\t"pic": "https://p9.douyinpic.com/tos-cn-p-0015/2af445900fa14c64b03c0d0390e2bd81_1618493679~tplv-dy-360p.jpeg?from=4257465056&s=&se=false&sh=&sc=&l=20210531205248010150201080310EC297&biz_tag=feed_cover"
\t\t},
\t\t{
\t\t\t"id": 1350,
\t\t\t"name": "有了油菜花，就承托不出我的马甲线了，",
\t\t\t"en": "youliaoyoucaihuajiuchengtuobuchuwodemajiaxianliao",
\t\t\t"pic": "https://p26.douyinpic.com/tos-cn-p-0015/47c6c91025a64b6daa95ee55d33fdcff_1618363339~tplv-dy-360p.jpeg?from=4257465056"
\t\t},
\t\t{
\t\t\t"id": 1301,
\t\t\t"name": "#抖in美好溧阳 #万物皆可智慧 #没事开心一下 #摆好你的姿态 #没错是我的腿呀 #你的女友已上线请查收",
\t\t\t"en": "douinmeihaoliyangwanwujiekezhihuimeishikaixinyixiabaihaonidezitaimeicuoshiwodetuiyanidenvyouyishangxianqingchashou",
\t\t\t"pic": "https://p29.douyinpic.com/tos-cn-p-0015/6b3f2a301a2b40fd805ed8e1c5b57de6_1618228574~tplv-dy-360p.jpeg?from=4257465056"
\t\t},
\t\t{
\t\t\t"id": 1284,
\t\t\t"name": "好久没有直播有没有想我的？@抖音小助手 #舞蹈 #创作灵感",
\t\t\t"en": "haojiumeiyouzhiboyoumeiyouxiangwodedouyinxiaozhushouwudaochuangzuolinggan",
\t\t\t"pic": "https://p6.douyinpic.com/tos-cn-p-0015/124267af2a314b54bed771e528cac1a8_1618113455~tplv-dy-360p.jpeg?from=4257465056&s=&se=false&sh=&sc=&l=202105312053370101501821001E0ED364&biz_tag=feed_cover"
\t\t},
\t\t{
\t\t\t"id": 1246,
\t\t\t"name": "关于我的故事还是听我的版本好一点#原相机",
\t\t\t"en": "guanyuwodegushihuanshitingwodebanbenhaoyidianyuanxiangji",
\t\t\t"pic": "https://p9.douyinpic.com/tos-cn-p-0015/dfa28fcbe6e840f094f824827ff8b7a0_1617918242~tplv-dy-360p.jpeg?from=4257465056&s=&se=false&sh=&sc=&l=20210531205331010150157232090F227B&biz_tag=feed_cover"
\t\t},
\t\t{
\t\t\t"id": 1199,
\t\t\t"name": "#创作灵感 #牛仔裤 小时候偷喝我爸两罐红牛，追着我打，笑死，我的能量超乎你想象",
\t\t\t"en": "chuangzuolingganniuzikuxiaoshihoutouhewobaliangguanhongniuzhuizhuowodaxiaosiwodenengliangchaohunixiangxiang",
\t\t\t"pic": "https://p26.douyinpic.com/tos-cn-p-0015/488f094a79154123ad43f3152ef3fdd7_1617541987~tplv-dy-360p.jpeg?from=4257465056&s=&se=false&sh=&sc=&l=202105312054250101502221495B0F3590&biz_tag=feed_cover"
\t\t},
\t\t{
\t\t\t"id": 1189,
\t\t\t"name": "你有你的背景，我有我的背影，安排#大长腿",
\t\t\t"en": "niyounidebeijingwoyouwodebeiyinganpaidachangtui",
\t\t\t"pic": "https://p26.douyinpic.com/tos-cn-p-0015/6f993bd8cd46412c82d41df0f3a64e31_1616750332~tplv-dy-360p.jpeg?from=4257465056"
\t\t},
\t\t{
\t\t\t"id": 1161,
\t\t\t"name": "我的小蛮腰中午可以露出来了，继续减肥再瘦十斤#微胖",
\t\t\t"en": "wodexiaomanyaozhongwukeyiluchulailiaojixujianfeizaishoushijinweipang",
\t\t\t"pic": "https://p6.douyinpic.com/tos-cn-p-0015/71ccc83db7674648a83d08314a2323de_1617954719~tplv-dy-360p.jpeg?from=4257465056&s=&se=false&sh=&sc=&l=202105312054120101511722311C0F10D3&biz_tag=feed_cover"
\t\t}
\t],
\t"url": "/index.php/vodsearch/mac_wd-------------.html"
}`} />
                  </ul>

                </div>

                <div id={'顶踩接口'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t('apis.wd.s4')}</h3>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s25'), 'li')}
                    {markdownify(t('apis.wd.s26'), 'li')}
                    {markdownify(t('apis.wd.s27'), 'li')}
                    <div className={'table-wrapper'}>
                      <table>
                        <thead className={'thead'}>
                        <tr>
                          <th>参数名</th>
                          <th>示例值</th>
                          <th>是否必填</th>
                          <th>参数类型</th>
                          <th>参数描述</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>mid</td>
                          <td>1</td>
                          <td>必填</td>
                          <td>text</td>
                          <td>模型mid 1影片、2文章、3专题、8明星、9角色、11剧情</td>
                        </tr>
                        <tr>
                          <td>id</td>
                          <td>1542</td>
                          <td>必填</td>
                          <td>text</td>
                          <td>评论的数据id 影片id 、文章id等</td>
                        </tr>
                        <tr>
                          <td>type</td>
                          <td>up</td>
                          <td>必填</td>
                          <td>text</td>
                          <td>类型，up顶、down踩</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                    {markdownify(t('apis.wd.s28'), 'li')}
                    <InlineCode type={'json'} lines={8} code={`{
\t"code": 1,
\t"msg": "操作成功！",
\t"data": {
\t\t"up": 826,
\t\t"down": 511
\t}
}`} />
                  </ul>
                </div>

                <div id={'记录接口'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t('apis.wd.s5')}</h3>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s29'), 'li')}
                    {markdownify(t('apis.wd.s30'), 'li')}
                    <div className='table-wrapper'>
                      <table>
                        <thead className={'thead'}>
                        <tr>
                          <th>参数</th>
                          <th>示例值</th>
                          <th>是否必填</th>
                          <th>参数描述</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>mid</td>
                          <td>1</td>
                          <td>必填</td>
                          <td>模型mid 1影片、2文章、3专题、8明星、9角色、11剧情</td>
                        </tr>
                        <tr>
                          <td>id</td>
                          <td>1233</td>
                          <td>必填</td>
                          <td>评论的数据id 影片id 、文章id等</td>
                        </tr>
                        <tr>
                          <td>type</td>
                          <td>2</td>
                          <td>必填</td>
                          <td>浏览1、 收藏2, 想看3、播放4、下载5</td>
                        </tr>
                        <tr>
                          <td>ac</td>
                          <td>set</td>
                          <td>必填</td>
                          <td>参数为 set 是提交，不为 set 是获取</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                    {markdownify(t('apis.wd.s31'), 'li')}
                    <InlineCode type={'json'} lines={1} code={`{"code":1,"msg":"保存成功!"}`} />
                  </ul>
                </div>

                <div id={'点击量提交'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t('apis.wd.s6')}</h3>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s22'), 'li')}
                    {markdownify(t('apis.wd.s33'), 'li')}
                    {markdownify(t('apis.wd.s34'), 'li')}
                    {markdownify(t('apis.wd.s35'), 'li')}
                    <div className='table-wrapper'>
                      <table>
                        <thead className={'thead'}>
                        <tr>
                          <th>参数</th>
                          <th>示例值</th>
                          <th>是否必填</th>
                          <th>参数描述</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>mid</td>
                          <td>1</td>
                          <td>必填</td>
                          <td>模型mid 1影片、2文章、3专题、8明星、9角色、11剧情</td>
                        </tr>
                        <tr>
                          <td>id</td>
                          <td>1233</td>
                          <td>必填</td>
                          <td>评论的数据id 影片id 、文章id等</td>
                        </tr>
                        <tr>
                          <td>type</td>
                          <td>update</td>
                          <td>必填</td>
                          <td>更新</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                    {markdownify(t('apis.wd.s36'), 'li')}
                    <InlineCode type={'json'} lines={10} code={`{
\t"code": 1,
\t"msg": "操作成功！",
\t"data": {
\t\t"hits": 425,
\t\t"hits_day": 2,
\t\t"hits_week": 2,
\t\t"hits_month": 2
\t}
}`} />
                  </ul>
                </div>

                <div id={'来路统计'} ref={sectionRefs[6]} className={'w-full'}>
                  <h3>{t('apis.wd.s7')}</h3>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s37'), 'li')}
                    {markdownify(t('apis.wd.s38'), 'li')}
                    {markdownify(t('apis.wd.s39'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className={'thead'}>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>domain</td>
                        <td>www.apivv.cn</td>
                        <td>必填</td>
                        <td
                         >来路域名，可用 <code>js</code> 的 <code>document.referrer</code> 来提取
                        </td>
                      </tr>
                      <tr>
                        <td>url</td>
                        <td>https://www.apivv.cn/index.html</td>
                        <td>必填</td>
                        <td>来路url，直接提交 <code>document.referrer</code></td>
                      </tr>
                      <tr>
                        <td>type</td>
                        <td>update</td>
                        <td>必填</td>
                        <td>更新</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  {markdownify(t('apis.wd.s40'))}
                  <InlineCode type={'html'} lines={1} code={`<div class="mac_referer"></div>`} />
                  <strong>{t('apis.wd.s41')}</strong>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s42'), 'li')}
                  </ul>
                  <InlineCode type={'json'} lines={10} code={`{
\t"code": 1,
\t"msg": "ok",
\t"data": {
\t\t"referer": 1,
\t\t"referer_day": 1,
\t\t"referer_week": 1,
\t\t"referer_month": 1
\t}
}`} />
                </div>

                <div id={'评论接口'} ref={sectionRefs[7]} className={'w-full'}>
                  <h3>{t('apis.wd.s8')}</h3>
                  <h4>{t('apis.wd.s43')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s44'), 'li')}
                    {markdownify(t('apis.wd.s45'), 'li')}
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>rid</td>
                        <td>1245</td>
                        <td>必填</td>
                        <td>数据id</td>
                      </tr>
                      <tr>
                        <td>mid</td>
                        <td>1</td>
                        <td>必填</td>
                        <td>模型mid 1影片、2文章、3专题、8明星、9角色、11剧情</td>
                      </tr>
                      <tr>
                        <td>page</td>
                        <td>1</td>
                        <td>必填</td>
                        <td>页码</td>
                      </tr>
                      </tbody>
                    </table>
                  </ul>
                  {markdownify(t('apis.wd.s46'), 'p')}
                  <InlineCode type={'html'} lines={12} code={`<div class="ui-title">
   <h3>评论</h3>
</div>
<div class="mac_comment" data-id="{$obj.vod_id}" data-mid="{$maccms.mid}" ></div>
<script>
   $(function(){
      MAC.Comment.Login = {$comment.login};
      MAC.Comment.Verify = {$comment.verify};
      MAC.Comment.Init();
      MAC.Comment.Show(1);
   });
</script>`}/>
                  <strong>{t('apis.wd.s47')}</strong>
                  <InlineCode type={'json'} lines={1}
                              code={`"    <!--评论开始-->\\n    <form class=\\"comment_form cmt_form clearfix\\"  >\\n        <input type=\\"hidden\\" name=\\"comment_pid\\" value=\\"0\\">\\n        <!--评论框-->\\n        <div class=\\"input_wrap fl clearfix\\">\\n            <textarea class=\\"comment_content fl\\" name=\\"comment_content\\" placeholder=\\"有事没事说两句...\\"><\\/textarea>\\n            <div class=\\"fl clearfix handle\\">\\n                <div class=\\"comment_face_panel face\\">\\n                    <i class=\\"icon-face\\"><\\/i>\\n                <\\/div>\\n                <div class=\\"comment_face_box face-box\\">\\n                                        <img data-id=\\"1\\" src=\\"\\/static\\/images\\/face\\/1.gif\\">\\n                                        <img data-id=\\"2\\" src=\\"\\/static\\/images\\/face\\/2.gif\\">\\n                                        <img data-id=\\"3\\" src=\\"\\/static\\/images\\/face\\/3.gif\\">\\n                                        <img data-id=\\"4\\" src=\\"\\/static\\/images\\/face\\/4.gif\\">\\n                                        <img data-id=\\"5\\" src=\\"\\/static\\/images\\/face\\/5.gif\\">\\n                                        <img data-id=\\"6\\" src=\\"\\/static\\/images\\/face\\/6.gif\\">\\n                                        <img data-id=\\"7\\" src=\\"\\/static\\/images\\/face\\/7.gif\\">\\n                                        <img data-id=\\"8\\" src=\\"\\/static\\/images\\/face\\/8.gif\\">\\n                                        <img data-id=\\"9\\" src=\\"\\/static\\/images\\/face\\/9.gif\\">\\n                                        <img data-id=\\"10\\" src=\\"\\/static\\/images\\/face\\/10.gif\\">\\n                                        <img data-id=\\"11\\" src=\\"\\/static\\/images\\/face\\/11.gif\\">\\n                                        <img data-id=\\"12\\" src=\\"\\/static\\/images\\/face\\/12.gif\\">\\n                                        <img data-id=\\"13\\" src=\\"\\/static\\/images\\/face\\/13.gif\\">\\n                                        <img data-id=\\"14\\" src=\\"\\/static\\/images\\/face\\/14.gif\\">\\n                                        <img data-id=\\"15\\" src=\\"\\/static\\/images\\/face\\/15.gif\\">\\n                                        <img data-id=\\"16\\" src=\\"\\/static\\/images\\/face\\/16.gif\\">\\n                                    <\\/div>\\n                <div class=\\"remaining-w\\">还可以输入<span class=\\"comment_remaining remaining fr\\" >200<\\/span><\\/div>\\n                <div class=\\"smt fr clearfix\\">\\n                        <span style=\\"display: none;\\">\\n                            <span><\\/span>\\n                        <\\/span>\\n                                        验证码:<input class=\\"mac_verify cmt_text\\" type=\\"text\\" id=\\"verify\\" name=\\"verify\\" \\/>\\n                                        <input class=\\"comment_submit cmt_post\\" type=\\"button\\" value=\\"发布\\">\\n                <\\/div>\\n            <\\/div>\\n        <\\/div>\\n\\n    <\\/form>\\n        <div class=\\"cmt_wrap\\" >\\n            <p class=\\"smt_wrap fl clearfix\\">\\n                <span class=\\"total fl\\">共<em id=\\"item_count\\">0<\\/em>条评论<\\/span>\\n            <\\/p>\\n            \\n        <\\/div>\\n    <!--评论结束-->\\n    <div class=\\"mac_pages\\" >\\n        <div class=\\"page_tip\\">共0条数据,当前\\/页<\\/div>\\n        <div class=\\"page_info\\">\\n            <a class=\\"page_link\\" href=\\"javascript:void(0);\\" onclick=\\"MAC.Comment.Show(1)\\" title=\\"首页\\">首页<\\/a>\\n            <a class=\\"page_link\\" href=\\"javascript:void(0);\\" onclick=\\"MAC.Comment.Show('')\\" title=\\"上一页\\">上一页<\\/a>\\n                        <a class=\\"page_link\\" href=\\"javascript:void(0)\\" onclick=\\"MAC.Comment.Show('')\\" title=\\"下一页\\">下一页<\\/a>\\n            <a class=\\"page_link\\" href=\\"javascript:void(0)\\" onclick=\\"MAC.Comment.Show('')\\" title=\\"尾页\\">尾页<\\/a>\\n\\n            <input class=\\"page_input\\" type=\\"text\\" placeholder=\\"页码\\" id=\\"page\\" autocomplete=\\"off\\" style=\\"width:40px">\\n            <button class=\\"page_btn\\" type=\\"button\\"  onclick="MAC.Comment.Show($('#page').val())">GO<\\/button>\\n        <\\/div>\\n    <\\/div>\\n"`}/>
                  <h4>{t('apis.wd.s52')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s48'), 'li')}
                    {markdownify(t('apis.wd.s49'), 'li')}
                  </ul>
                  <strong>{t('apis.wd.s50')}</strong>
                  <div className='table-wrapper'>
                    <table>
                      <thead className={'thead'}>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>comment_mid</td>
                        <td>1</td>
                        <td>必填</td>
                        <td>模型mid 1影片、2文章、3专题、8明星、9角色、11剧情</td>
                      </tr>
                      <tr>
                        <td>comment_content</td>
                        <td>我留了个评论</td>
                        <td>必填</td>
                        <td>评论内容</td>
                      </tr>
                      <tr>
                        <td>comment_pid</td>
                        <td>0</td>
                        <td>选填</td>
                        <td>回复评id，回复的时候用到</td>
                      </tr>
                      <tr>
                        <td>verify</td>
                        <td>9223</td>
                        <td>选填</td>
                        <td>评论验证码，后台如果开启就要提交验证码</td>
                      </tr>
                      <tr>
                        <td>comment_rid</td>
                        <td>1560</td>
                        <td>必填</td>
                        <td>评论的数据 文章id、影片id</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <strong>{t('apis.wd.s53')}</strong>
                  <InlineCode type={'json'} lines={1} code={`{"code":1,"msg":"感谢你的留言！"}`} />
                </div>

                <div id={'留言本接口'} ref={sectionRefs[8]} className={'w-full'}>
                  <h3>{t('apis.wd.s9')}</h3>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s54'), 'li')}
                    {markdownify(t('apis.wd.s49'), 'li')}
                  </ul>
                  <strong>{t('apis.wd.s50')}</strong>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>gbook_content</td>
                        <td>我留了个言</td>
                        <td>必填</td>
                        <td>留言内容</td>
                      </tr>
                      <tr>
                        <td>verify</td>
                        <td>9223</td>
                        <td>选填</td>
                        <td>评论验证码，后台如果开启就要提交验证码</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <strong>{t('apis.wd.s51')}</strong>
                  <InlineCode type={'json'} lines={1} code={`{code: 1, msg: "感谢你的留言！"}`}/>
                </div>

                <div id={'定时任务'} ref={sectionRefs[9]} className={'w-full'}>
                  <h3>{t('apis.wd.s10')}</h3>
                  <p>{t('apis.wd.s55')}</p>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s56'), 'li')}
                    {markdownify(t('apis.wd.s57'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>t</td>
                        <td>1545</td>
                        <td>必填</td>
                        <td>随机值、时间戳都可以 如：<code>Math.random()</code></td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  {markdownify(t('apis.wd.s58'), 'p')}
                  <InlineCode type={'html'} lines={1} code={`<span style="display: none;" class="mac_timming" data-file="" ></span>`} />
                </div>

                <div id={'后台事件'} ref={sectionRefs[10]} className={'w-full'}>
                  <h3>{t('apis.wd.s11')}</h3>
                  {markdownify(t('apis.wd.s59'), 'p')}
                  <h4>{t('apis.wd.s60')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s61'), 'li')}
                    {markdownify(t('apis.wd.s62'), 'li')}
                  </ul>
                  <strong>{t('apis.wd.s63')}</strong>
                  <InlineCode type={''} lines={39} code={`生成首页 /api.php/timming/make/param/ac/index
生成wap首页 /api.php/timming/make/param/ac/index/ac2/wap
生成生成地图 /api.php/timming/make/param/ac/map

视频生成

全部分类 /api.php/timming/make/param/ac=type&tab=vod&vodtype=1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,27
当天分类 /api.php/timming/make/param/ac=type&tab=vod&vodtype=&ac2=day
全部内容 /api.php/timming/make/param/ac=info&tab=vod&vodtype=1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,27
当天内容 /api.php/timming/make/param/ac=info&tab=vod&vodtype=&ac2=day
未生成的 /api.php/timming/make/param/ac=info&tab=vod&ac2=nomake
一键当天 /api.php/timming/make/param/ac=info&tab=vod&vodtype=&ac2=day&jump=1

文章生成

全部分类 /api.php/timming/make/param/ac=type&tab=art&arttype=5,17,18
当天分类 /api.php/timming/make/param/ac=type&tab=art&arttype=&ac2=day
全部内容 /api.php/timming/make/param/ac=info&tab=art&arttype=5,17,18
当天内容 /api.php/timming/make/param/ac=info&tab=art&arttype=&ac2=day
未生成的 /api.php/timming/make/param/ac=info&tab=art&ac2=nomake
一键当天 /api.php/timming/make/param/ac=info&tab=art&arttype=&ac2=day&jump=1

生成专题

选择专题 /api.php/timming/make/param/ac=topic_info
全部专题 /api.php/timming/make/param/ac=topic_info&topic=7,6,5,4,3,2,1
专题首页 /api.php/timming/make/param/ac=topic_index

生成自定义页面：
自定义页面 /api.php/timming/make/param/ac=label&label=aaa$$$top.html


RSS订阅文件  /api.php/timming/make/param/ac=rss&ac2=index
谷歌SiteMap  /api.php/timming/make/param/ac=rss&ac2=google
百度SiteMap  /api.php/timming/make/param/ac=rss&ac2=baidu
SO-SiteMap  /api.php/timming/make/param/ac=rss&ac2=so
搜狗SiteMap  /api.php/timming/make/param/ac=rss&ac2=sogou
Bing-SiteMap  /api.php/timming/make/param/ac=rss&ac2=bing
神马SiteMap  /api.php/timming/make/param/ac=rss&ac2=sm`}/>
                  <h4>{t('apis.wd.s64')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s65'), 'li')}
                    {markdownify(t('apis.wd.s66'), 'li')}
                  </ul>
                  <InlineCode type={''} lines={5} code={`采集当天 /api.php/timming/collect/param/ac=cj&cjflag=0f8170804201c8383ff33bd788d1a2f8&cjurl=http%3A%2F%2Fcj.wlzy.tv%2Finc%2Fapi_mac_m3u8.php&h=24&t=&ids=&wd=&type=1&mid=1&opt=0&filter=0&filter_from=&param=  

采集本周 /api.php/timming/collect/param/ac=cj&cjflag=0f8170804201c8383ff33bd788d1a2f8&cjurl=http%3A%2F%2Fcj.wlzy.tv%2Finc%2Fapi_mac_m3u8.php&h=168&t=&ids=&wd=&type=1&mid=1&opt=0&filter=0&filter_from=&param=  

采集所有 /api.php/timming/collect/param/ac=cj&cjflag=0f8170804201c8383ff33bd788d1a2f8&cjurl=http%3A%2F%2Fcj.wlzy.tv%2Finc%2Fapi_mac_m3u8.php&h=&t=&ids=&wd=&type=1&mid=1&opt=0&filter=0&filter_from=&param= `}/>
                  <h4>{t('apis.wd.s67')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s68'), 'li')}
                    {markdownify(t('apis.wd.s69'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className={'thead'}>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>ac</td>
                        <td>任意</td>
                        <td>必填</td>
                        <td>任意值，建议使用时间戳</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <InlineCode type={''} lines={1} code={`/api.php/timming/make/cache/ac=121`} />
                  <h4>{t('apis.wd.s70')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s71'), 'li')}
                    {markdownify(t('apis.wd.s72'), 'li')}
                  </ul>
                  <InlineCode type={''} lines={10} code={`百度主动推送当天视频 /api.php/timming/urlsend/param/ac=Baidu&limit=50&page=1&ac2=today&mid=1
百度主动推送当天文章 /api.php/timming/urlsend/param/ac=Baidu&limit=50&page=1&ac2=today&mid=2
百度主动推送当天专题 /api.php/timming/urlsend/param/ac=Baidu&limit=50&page=1&ac2=today&mid=3
百度主动推送当天演员 /api.php/timming/urlsend/param/ac=Baidu&limit=50&page=1&ac2=today&mid=8
百度主动推送当天角色 /api.php/timming/urlsend/param/ac=Baidu&limit=50&page=1&ac2=today&mid=9
百度快速推送当天视频 /api.php/timming/urlsend/param/ac=Baidufast&limit=10&page=1&ac2=today&mid=1
百度快速推送当天文章 /api.php/timming/urlsend/param/ac=Baidufast&limit=10&page=1&ac2=today&mid=2
百度快速推送当天专题 /api.php/timming/urlsend/param/ac=Baidufast&limit=10&page=1&ac2=today&mid=3
百度快速推送当天演员 /api.php/timming/urlsend/param/ac=Baidufast&limit=10&page=1&ac2=today&mid=8
百度快速推送当天角色 /api.php/timming/urlsend/param/ac=Baidufast&limit=10&page=1&ac2=today&mid=9`} />
                </div>

                <div id={'生成二维码'} ref={sectionRefs[11]} className={'w-full'}>
                  <h3>{t('apis.wd.s12')}</h3>
                  <p>{t('apis.wd.s73')}</p>
                  {markdownify(t('apis.wd.s74'), 'p')}
                  <strong>{t('apis.wd.s75')}</strong>
                  <InlineCode type={'html'} lines={1} code={`<img class="mac_qrcode" alt="扫一扫手机看"/>`} />
                </div>

                <div id={'生成短网址'} ref={sectionRefs[12]} className={'w-full'}>
                  <h3>{t('apis.wd.s13')}</h3>
                  <p>{t('apis.wd.s76')}</p>
                  {markdownify(t('apis.wd.s77'), 'p')}
                  <strong>{t('apis.wd.s75')}</strong>
                  <InlineCode type={'html'} lines={4} code={`<div class="mac_shorten"></div>
<script>
   MAC.Shorten.Init();
</script>`} />
                </div>

                <div id={'用户接口'} ref={sectionRefs[13]} className={'w-full'}>
                  <h3>{t('apis.wd.s14')}</h3>
                  <p>{t('apis.wd.s78')}</p>
                  <h4>{t('apis.wd.s79')}</h4>
                  <p>{t('apis.wd.s80')}</p>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s81'), 'li')}
                    {markdownify(t('apis.wd.s82'), 'li')}
                    {markdownify(t('apis.wd.s83'), 'li')}
                    {markdownify(t('apis.wd.s84'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>user_name</td>
                        <td>ceshi123</td>
                        <td>必填</td>
                        <td>注册用户名</td>
                      </tr>
                      <tr>
                        <td>user_pwd</td>
                        <td>admin123</td>
                        <td>必填</td>
                        <td>注册登录密码</td>
                      </tr>
                      <tr>
                        <td>user_pwd2</td>
                        <td>admin123</td>
                        <td>必填</td>
                        <td>确认密码</td>
                      </tr>
                      <tr>
                        <td>ac</td>
                        <td>phone</td>
                        <td>选填</td>
                        <td>注册验证类型，手机验证phone 、邮箱验证email</td>
                      </tr>
                      <tr>
                        <td>code</td>
                        <td>验证码</td>
                        <td>选填</td>
                        <td>手机或者邮箱的验证密码</td>
                      </tr>
                      <tr>
                        <td>verify</td>
                        <td>验证码</td>
                        <td>选填</td>
                        <td>后台开启注册验证码时必填</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <strong>{t('apis.wd.s85')}</strong>
                  <InlineCode type={'json'} lines={4} code={`{
\t"code": 1,
\t"msg": "注册成功"
}`}/>
                  <h4>{t('apis.wd.s86')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s87'), 'li')}
                    {markdownify(t('apis.wd.s84'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className={'thead'}>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>ac</td>
                        <td>phone</td>
                        <td>选填</td>
                        <td>注册验证类型，手机验证phone 、邮箱验证email</td>
                      </tr>
                      <tr>
                        <td>to</td>
                        <td>admin@qq.com</td>
                        <td>选填</td>
                        <td>手机或者邮箱</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <strong>{t('apis.wd.s85')}</strong>
                  <InlineCode type={'json'} lines={4} code={`{
\t"code": 1,
\t"msg": "信息已发送"
}`}/>
                  <h4>{t('apis.wd.s88')}</h4>
                  {markdownify(t('apis.wd.s89'), 'p')}
                  <ul className='list'>
                    {markdownify(t('apis.wd.s90'), 'li')}
                    {markdownify(t('apis.wd.s91'), 'li')}
                    {markdownify(t('apis.wd.s92'), 'li')}
                    {markdownify(t('apis.wd.s84'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className={'thead'}>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>user_nick_name</td>
                        <td>大图模板</td>
                        <td>选填</td>
                        <td>修改昵称</td>
                      </tr>
                      <tr>
                        <td>user_pwd</td>
                        <td>admin888</td>
                        <td>必填</td>
                        <td>原始密码</td>
                      </tr>
                      <tr>
                        <td>user_pwd1</td>
                        <td>admin888</td>
                        <td>选填</td>
                        <td>新密码，不修改密码的话就留空</td>
                      </tr>
                      <tr>
                        <td>user_pwd2</td>
                        <td>admin888</td>
                        <td>选填</td>
                        <td>确定密码，不修改密码的话就留空</td>
                      </tr>
                      <tr>
                        <td>user_qq</td>
                        <td>834023388</td>
                        <td>选填</td>
                        <td>用户QQ</td>
                      </tr>
                      <tr>
                        <td>user_email</td>
                        <td>admin@163.com</td>
                        <td>选填</td>
                        <td>用户绑定邮箱，绑定时需要验证邮箱可用<a
                          href="#%E4%BF%A1%E6%81%AF%E5%8F%91%E9%80%81%E6%8E%A5%E5%8F%A3">信息发送接口</a></td>
                      </tr>
                      <tr>
                        <td>user_phone</td>
                        <td>admin@163.com</td>
                        <td>选填</td>
                        <td>用户绑手机号，绑定时需要短信验证</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <h4>{t('apis.wd.s93')}</h4>
                  {markdownify(t('apis.wd.s94'), 'p')}
                  <ul className='list'>
                    {markdownify(t('apis.wd.s95'), 'li')}
                    {markdownify(t('apis.wd.s91'), 'li')}
                    {markdownify(t('apis.wd.s92'), 'li')}
                    {markdownify(t('apis.wd.s84'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>file</td>
                        <td>图片文件</td>
                        <td>必填</td>
                        <td>{`合法图片文件 type="file"`}</td>
                      </tr>
                      <tr>
                        <td>imgdata</td>
                        <td>base64</td>
                        <td>必填</td>
                        <td>合法图片类base64编码</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <strong>{t('apis.wd.s85')}</strong>
                  <InlineCode type={'json'} lines={5} code={`{
\t"code": 1,
\t"msg": "头像上传成功",
   "file":"upload/user/4/4.jpg"
}`} />
                </div>

                <div id={'AI对话搜索'} ref={sectionRefs[14]} className={'w-full'}>
                  <h3>{t('apis.wd.s96')}</h3>
                  <p>{t('apis.wd.s97')}</p>
                  <ul className='list'>
                    {markdownify(t('apis.wd.s98'), 'li')}
                    {markdownify(t('apis.wd.s99'), 'li')}
                    {markdownify(t('apis.wd.s100'), 'li')}
                  </ul>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th>参数</th>
                        <th>示例值</th>
                        <th>是否必填</th>
                        <th>参数描述</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>question</td>
                        <td>推荐几部最近更新的动作片</td>
                        <td>必填</td>
                        <td>用户提问内容，长度受后台配置限制</td>
                      </tr>
                      <tr>
                        <td>mid</td>
                        <td>1</td>
                        <td>选填</td>
                        <td>模型筛选，支持 0,1,2,3,8,9,11,12；不传默认全模型</td>
                      </tr>
                      <tr>
                        <td>limit</td>
                        <td>6</td>
                        <td>选填</td>
                        <td>返回条数，范围 1-12</td>
                      </tr>
                      <tr>
                        <td>__token__</td>
                        <td>csrf_token</td>
                        <td>必填</td>
                        <td>页面会话 token（需和 session 中 token 一致）</td>
                      </tr>
                    </tbody>
                    </table>
                  </div>
                  <strong>{t('apis.wd.s101')}</strong>
                  <InlineCode type={'json'} lines={16} code={`{
\t"code": 1,
\t"msg": "ok",
\t"data": {
\t\t"answer": "这里是AI生成的摘要结果...",
\t\t"list": [
\t\t\t{
\t\t\t\t"id": 1001,
\t\t\t\t"name": "示例影片",
\t\t\t\t"url": "/voddetail/1001.html"
\t\t\t}
\t\t],
\t\t"session_id": "chat_1710000000",
\t\t"retry_after": 0
\t}
}`}/>
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/apis/collect" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("apis.clt.s1")}</span>
                  </Link>
                </div>
                {/* End of Page*/}
              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </ApiLayout>
  );
}