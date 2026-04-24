import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Zoom from "react-medium-image-zoom";

import ConfigLayout from "@/layouts/config/ConfigLayout";
import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import Sidebar from "@/layouts/config/Sidebar";

export default function DocPage() {

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
    <ConfigLayout title={`${t('menu.config')} | ${t('seo.t.t0')}`} mobile_title={t("menu.config")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <div className="doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]">
                <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              </div>

              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div id="伪静配置" ref={sectionRefs[0]} className="w-full">
                  <h2>{t("config.s1")}</h2>
                  <p>{t("config.s27")}</p>
                  <ul className="list">
                    {markdownify(t("config.s28"), "li")}
                    {markdownify(t("config.s29"), "li")}
                    {markdownify(t("config.s30"), "li")}
                  </ul>
                </div>
                <div id="rewrite说明" ref={sectionRefs[1]} className="w-full">
                  <h3>{t("config.s2")}</h3>
                  <ul className="list">
                    <li>{t("config.s31")}</li>
                    <li>{t("config.s32")}</li>
                    <li>{t("config.s33")}</li>
                  </ul>
                  <p>{t("config.s34")}</p>
                  <ul className="list">
                    <li>{t("config.s35")}</li>
                    <li>{t("config.s36")}</li>
                  </ul>
                  <h4>{t("config.s37")}</h4>
                  <p>{t("config.s38")}</p>
                  <h4>{t("config.s39")}</h4>
                  <p>{t("config.s40")}</p>
                </div>
                <div id="默认路由" ref={sectionRefs[2]} className="w-full">
                  <h3>{t("config.s3")}</h3>
                  <div className="code-container">
                    <div
                      className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{"map   => map/index"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"rss   => rss/index"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{""}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"index-<page?>   => index/index"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{""}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"gbook-<page?>   => gbook/index"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"gbook$   => gbook/index"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{""}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"topic-<page?>   => topic/index"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"topic$  => topic/index"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"topicdetail-<id>   => topic/detail"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"actortype/<id>-<page?>   => actor/type"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"actortype/<id>   => actor/type"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"actor-<page?>   => actor/index"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"actor$ => actor/index"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"actordetail-<id>   => actor/detail"}</div>
                      </li>
                      <li className="w-full">
                        <div
                          className="code-space">{"actorshow/<id>-<area?>-<blood?>-<by?>-<letter?>-<level?>-<order?>-<page?>-<sex?>-<starsign?>   => actor/show"}</div>
                      </li>
                      <li className="w-full">
                        <div
                          className="code-space">{"actorsearch/<wd?>-<area?>-<blood?>-<by?>-<letter?>-<level?>-<order?>-<page?>-<sex?>-<starsign?>   => actor/search"}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                      </li>
                    </ul>
                  </div>
                  <p className="font-primary text-[16px] text-black font-[500]">{t("config.s41")}</p>
                  <div className="w-full h-[580px]">
                    <iframe width="100%" height="100%"
                            src="//player.bilibili.com/player.html?aid=932224513&bvid=BV1iM4y157Zm&cid=386093551&page=1"/>
                  </div>
                </div>
                <div id="站群配置" ref={sectionRefs[3]} className="w-full">
                  <h2>{t("config.s4-0")}</h2>
                  <ul className="list">
                    <li>{t("config.s42")}</li>
                    <li>{t("config.s43")}</li>
                  </ul>
                  <p>{t("config.s44")}</p>
                  <div className="info">
                    <p className="title">{t("config.s45")}</p>
                    <p className="message">{t("config.s46")}</p>
                  </div>
                </div>

                <div id="邮件发送" ref={sectionRefs[4]} className="w-full">
                  <h2>{t("config.s4")}</h2>
                  <p>{t("config.s47")}</p>
                  <p>{t("config.s48")}</p>
                  <div className="info">
                    <p className="title">{t("config.s49")}</p>
                    <p className="message">{t("config.s50")}</p>
                  </div>
                  <p className="mt-4">{t("config.s51")}</p>
                  {markdownify(t("config.s52"), "p", "text-[16px] font-[500] text-black")}
                  <Zoom>
                    <Image alt="youxiang.jpg" src="/images/config/youxiang.jpg" width={1266} height={944}
                           className="w-full h-auto"/>
                  </Zoom>
                  {markdownify(t("config.s53"), "p", "mt-5 text-[16px] text-black font-[500]")}
                  <ul className="list">
                    {markdownify(t("config.s54"), "li")}
                    {markdownify(t("config.s55"), "li")}
                    {markdownify(t("config.s56"), "li")}
                    {markdownify(t("config.s57"), "li")}
                  </ul>
                  <p className="text-[16px] text-black font-[500]">{t("config.s58")}</p>
                  <p>{t("config.s59")}</p>
                  <Zoom>
                    <Image alt="youxiang.jpg" src="/images/config/youxiang-2.png" width={826} height={300}
                           className="w-full h-auto"/>
                  </Zoom>
                </div>

                <div id="短信发送" ref={sectionRefs[5]} className="w-full">
                  <h2>{t("config.s5")}</h2>
                  <p>{t("config.s60")}</p>
                </div>

                <div id="申请阿里云短信包" ref={sectionRefs[6]} className="w-full">
                  <h3>{t("config.s6")}</h3>
                  {markdownify(t("config.s61"), "p", "")}
                  <Zoom>
                    <Image alt="config" src="/images/config/aliyun-msm.jpg" width={1041} height={816}
                           className="w-full h-auto"/>
                  </Zoom>
                  <p>{t("config.s62")}</p>
                  <div className="code-container">
                    <div
                      className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{t("config.s63")}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                      </li>
                    </ul>
                  </div>
                  {markdownify(t("config.s64"), "p", "")}
                  <Zoom>
                    <Image alt="config" src="/images/config/aliyun-msm-2.jpg" width={1035} height={197}
                           className="w-full h-auto"/>
                  </Zoom>
                  {markdownify(t("config.s65"), "p", "mt-4")}
                  <p>{t("config.s66")}</p>
                  <Zoom>
                    <Image alt="config" src="/images/config/aliyun-msm-3.jpg" width={1057} height={864}
                           className="w-full h-auto"/>
                  </Zoom>
                  <div className="info">
                    <p className="title">{t("config.s67")}</p>
                    <ul className="message">
                      {markdownify(t("config.s68"), "li", "")}
                      {markdownify(t("config.s69"), "li", "")}
                      {markdownify(t("config.s70"), "li", "")}
                    </ul>
                  </div>
                  <h4>{t("config.s71")}</h4>
                  {markdownify(t("config.s72"), "p", "")}
                  <p className="text-[16px]">{t("config.s73")}</p>
                  <Zoom>
                    <Image alt="config" src="/images/config/aliyun-msm-4.jpg" width={1179} height={588}
                           className="w-full h-auto"/>
                  </Zoom>
                  <Zoom>
                    <Image alt="config" src="/images/config/aliyun-msm-5.jpg" width={1256} height={465}
                           className="w-full h-auto"/>
                  </Zoom>
                  {markdownify(t("config.s74"), "p", "text-[16px] mt-4")}
                  <Zoom>
                    <Image alt="config" src="/images/config/aliyun-msm-6.jpg" width={1197} height={360}
                           className="w-full h-auto"/>
                  </Zoom>
                  {markdownify(t("config.s75"), "p", "text-[16px] mt-4")}
                  <Zoom>
                    <Image alt="config" src="/images/config/aliyun-msm-7.jpg" width={1125} height={590}
                           className="w-full h-auto"/>
                  </Zoom>
                </div>
                <div id="申请腾讯云短信包" ref={sectionRefs[7]} className="w-full">
                  <h3>{t("config.s7")}</h3>
                  {markdownify(t("config.s76"), "p", "")}
                  {markdownify(t("config.s77"), "p", "")}
                  {markdownify(t("config.s78"), "p", "")}
                  <Zoom>
                    <Image alt="config" src="/images/config/qq-msm.jpg" width={852} height={883}
                           className="w-full h-auto"/>
                  </Zoom>
                  {markdownify(t("config.s79"), "p", "mt-4")}
                  <Zoom>
                    <Image alt="config" src="/images/config/qq-msm-1.jpg" width={1175} height={316}
                           className="w-full h-auto"/>
                  </Zoom>
                  <Zoom>
                    <Image alt="config" src="/images/config/qq-msm-2.jpg" width={1152} height={822}
                           className="w-full h-auto"/>
                  </Zoom>
                  <h4>{t("config.s80")}</h4>
                  {markdownify(t("config.s81"), "p", "")}
                  <Zoom>
                    <Image alt="config" src="/images/config/qq-msm-3.jpg" width={933} height={517}
                           className="w-full h-auto"/>
                  </Zoom>
                </div>

                <div id="视频试看配置" ref={sectionRefs[8]} className="w-full">
                  <h2>{t("config.s8")}</h2>
                  <p>{t("config.s82")}</p>
                  <div className="info">
                    <p className="title">{t("config.s83")}</p>
                    <div className="message">
                      <ul className="list">
                        <li>{t("config.s84")}</li>
                        <li>{t("config.s84")}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div id="游客开启试看1分钟" ref={sectionRefs[9]} className="w-full">
                  <h3>{t("config.s8")}</h3>
                  {markdownify(t("config.s86"), "p", "text-[16px]")}
                  <Zoom>
                    <Image alt="config" src="/images/config/shikan.png" width={1259} height={852}
                           className="w-full h-auto"/>
                  </Zoom>
                  <p className={'mt-5 text-[16px]'}>{t("config.s87")}</p>
                  <p>{t("config.s88")}</p>
                  <Zoom>
                    <Image alt="config" src="/images/config/shikan2.png" width={1038} height={558}
                           className="w-full h-auto"/>
                  </Zoom>
                  <p className={'mt-5'}>{t("config.s89")}</p>
                  <div className={'info'}>
                    <p className={'title'}>{t("config.s90")}</p>
                    <p className={'message'}>{t("config.s91")}</p>
                  </div>
                </div>

                <div id="三级分销配置" ref={sectionRefs[10]} className="w-full">
                  <h2>{t("config.s10")}</h2>
                  <p>{t("config.s92")}</p>
                </div>

                <div id="如何有效关联" ref={sectionRefs[11]} className="w-full">
                  <h3>{t("config.s11")}</h3>
                  {markdownify(t("config.s93"), "p", "")}
                  <ul className={'list'}>
                    <li>{t('config.s94')}</li>
                    <li>{t('config.s95')}</li>
                    <li>{t('config.s96')}</li>
                  </ul>
                  <p>{t('config.s97')}</p>
                </div>

                <div id="积分奖励比例计算公式" ref={sectionRefs[12]} className="w-full">
                  <h3>{t("config.s12")}</h3>
                  <Zoom>
                    <Image alt="config" src="/images/config/sanjifenxiao.png" width={1297} height={199}
                           className="w-full h-auto"/>
                  </Zoom>
                  <ul className={'mt-5 list'}>
                    <li>{t('config.s98')}</li>
                    <li>{t('config.s99')}</li>
                  </ul>
                  <p>{t('config.s100')}</p>
                  <div className="code-container">
                    <div
                      className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">php
                    </div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{`# $fee_points 消费的积分`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`# $GLOBALS['config']['user']['reward_ratio'] 后台配置比例`}</div>
                      </li>
                      <li className="w-full">
                        <div
                          className="code-space">{`$points = floor($fee_points / 100 * $GLOBALS['config']['user']['reward_ratio']);`}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                      </li>
                    </ul>
                  </div>
                  <p>{t('config.s101')}</p>
                  {markdownify(t("config.s102"), "p", "")}
                </div>

                <div id="第三方登录" ref={sectionRefs[13]} className="w-full">
                  <h2>{t("config.s13")}</h2>
                  <p>{t('config.s103')}</p>
                  <ul className={'list'}>
                    {markdownify(t("config.s104"), "li", "")}
                    {markdownify(t("config.s105"), "li", "")}
                  </ul>
                  <div className={'info'}>
                    <p className={'title'}>{t("config.s106")}</p>
                    <div className={'message'}>
                      <ul className={'list'}>
                        {markdownify(t("config.s107"), "li", "")}
                        {markdownify(t("config.s108"), "li", "")}
                        {markdownify(t("config.s109"), "li", "")}
                      </ul>
                    </div>
                  </div>
                </div>

                <div id="对接微信公众号" ref={sectionRefs[14]} className="w-full">
                  <h2>{t("config.s14")}</h2>
                  {markdownify(t("config.s110"), "p", "")}
                  <p className={'text-black font-[500] text-[16px]'}>{t('config.s111')}</p>
                  <div className="w-full h-[580px]">
                    <iframe width="100%" height="100%"
                            src="//player.bilibili.com/player.html?aid=762198065&bvid=BV1564y1s7BF&cid=385723362&page=1"/>
                  </div>
                </div>

                <div id="定时任务" ref={sectionRefs[15]} className="w-full">
                  <h2>{t("config.s15")}</h2>
                  <p className={'text-[16px]'}>{t('config.s112')}</p>
                </div>

                <div id="1，采集资源" ref={sectionRefs[16]} className="w-full">
                  <h3>{t("config.s16")}</h3>
                  <ul className={'list'}>
                    {markdownify(t("config.s113"), "li", "")}
                    <li>{t("config.s114")}</li>
                    <li>{t("config.s115")}</li>
                    {markdownify(t("config.s116"), "li", "")}
                    <li>{t("config.s117")}</li>
                    {markdownify(t("config.s118"), "li", "")}
                  </ul>
                </div>
                <div id="2，生成静态" ref={sectionRefs[17]} className="w-full">
                  <h3>{t("config.s17")}</h3>
                  <ul className={'list'}>
                    {markdownify(t("config.s119"), "li", "")}
                    {markdownify(t("config.s120"), "li", "")}
                    {markdownify(t("config.s121"), "li", "")}
                    {markdownify(t("config.s122"), "li", "")}
                    {markdownify(t("config.s123"), "li", "")}
                    {markdownify(t("config.s124"), "li", "")}
                    {markdownify(t("config.s125"), "li", "")}
                    {markdownify(t("config.s126"), "li", "")}
                    {markdownify(t("config.s127"), "li", "")}
                    {markdownify(t("config.s128"), "li", "")}
                    {markdownify(t("config.s129"), "li", "")}
                    {markdownify(t("config.s130"), "li", "")}
                    {markdownify(t("config.s131"), "li", "")}
                    {markdownify(t("config.s132"), "li", "")}
                    {markdownify(t("config.s133"), "li", "")}
                    {markdownify(t("config.s134"), "li", "")}
                    {markdownify(t("config.s135"), "li", "")}
                    {markdownify(t("config.s136"), "li", "")}
                    {markdownify(t("config.s137"), "li", "")}
                  </ul>
                </div>

                <div id="3，采集规则" ref={sectionRefs[18]} className="w-full">
                  <h3>{t("config.s18")}</h3>
                  <ul className={'list'}>
                    {markdownify(t("config.s138"), "li", "")}
                    {markdownify(t("config.s139"), "li", "")}
                    {markdownify(t("config.s140"), "li", "")}
                  </ul>
                </div>

                <div id="4，清理缓存" ref={sectionRefs[19]} className="w-full">
                  <h3>{t("config.s19")}</h3>
                  <ul className={'list'}>
                    {markdownify(t("config.s141"), "li", "")}
                    {markdownify(t("config.s142"), "li", "")}
                  </ul>
                </div>

                <div id="5，网址推送" ref={sectionRefs[20]} className="w-full">
                  <h3>{t("config.s20")}</h3>
                  <ul className={'list'}>
                    {markdownify(t("config.s143"), "li", "")}
                    <p className={'pt-2 text-black font-[500] text-[16px]'}>{t('config.s144')}</p>
                    {markdownify(t("config.s145"), "li", "")}
                    {markdownify(t("config.s146"), "li", "")}
                    {markdownify(t("config.s147"), "li", "")}
                    {markdownify(t("config.s148"), "li", "")}
                    {markdownify(t("config.s149"), "li", "")}
                    {markdownify(t("config.s150"), "li", "")}
                    {markdownify(t("config.s151"), "li", "")}
                    {markdownify(t("config.s152"), "li", "")}
                    {markdownify(t("config.s153"), "li", "")}
                    {markdownify(t("config.s154"), "li", "")}
                  </ul>
                </div>

                <div id="采集配置" ref={sectionRefs[21]} className="w-full">
                  <h2>{t("config.s21")}</h2>
                </div>

                <div id="对接资源站" ref={sectionRefs[22]} className="w-full">
                  <h3 className={'mt-0'}>{t("config.s22")}</h3>
                  <div className={'info'}>
                    <p className={'title'}>{t('config.s155')}</p>
                    <p className={'message'}>{t('config.s156')}</p>
                  </div>
                </div>

                <div id="对接火车采集" ref={sectionRefs[23]} className="w-full">
                  <h3>{t("config.s23")}</h3>
                  <p className={'text-black font-[500] text-[16px]'}>{t('config.s157')}</p>
                  <div className="w-full h-[580px]">
                    <iframe width="100%" height="100%"
                            src="//player.bilibili.com/player.html?aid=504672025&bvid=BV1mg411L75z&cid=386122280&page=1"/>
                  </div>
                </div>

                <div id="对接python爬虫" ref={sectionRefs[24]} className="mt-5 w-full">
                  <h3>{t("config.s24")}</h3>
                  {markdownify(t("config.s158"), "p", "")}
                </div>

                <div id="添加播放器" ref={sectionRefs[25]} className="w-full">
                  <h2>{t("config.s25")}</h2>
                  <p>{t('config.s159')}</p>
                </div>


              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </ConfigLayout>
  );
}