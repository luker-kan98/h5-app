import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import GuideLayout from "@/layouts/guide/GuideLayout";
import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import FaqSidebar from "@/layouts/guide/FaqSidebar";

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
    useRef(null)
  ];

  

  return (
    <GuideLayout title={`${t('guide.s13')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <FaqSidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="flex flex-col w-full">
                  <h2>{t("guide.s13")}</h2>
                </div>
                <div ref={sectionRefs[1]} id="开启假墙防御后搜索页筛选页的选项参数如何高亮展示">
                  <h3>{t("guide.s142")}</h3>
                  <p>{t("guide.s157")}</p>
                  {markdownify(t("guide.s158"), "p", "")}
                  <h4>{t("guide.s159")}</h4>
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">html</div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{`<a {if condition="$param['area'] eq ''"} class="current" {/if} href="{:mac_url_type($obj,['area'=>'','lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">全部`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{``}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{empty name="$obj.type_extend.area"}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{maccms:foreach name=":explode(',',$obj.parent.type_extend.area)" id="vo2" key="key2"}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`<a {if condition="$param['area'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$vo2,'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{``}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{/maccms:foreach}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{else /}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{maccms:foreach name=":explode(',',$obj.type_extend.area)" id="vo2" key="key2"}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`<a {if condition="$param['area'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$vo2,'lang'=>$param['lang'],'year'=>$param['year'],'level'=>$param['level'],'letter'=>$param['letter'],'state'=>$param['state'],'tag'=>$param['tag'],'class'=>$param['class'],'order'=>$param['order'],'by'=>$param['by'] ],'show')}">{$vo2}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{``}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{/maccms:foreach}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{/empty}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                      </li>
                    </ul>
                  </div>
                  <h4>{t("guide.s160")}</h4>
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">html</div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{`<a {if condition="$pp['area'] eq ''"} class="current" {/if} href="{:mac_url_type($obj,['area'=>'','lang'=>$pp['lang'],'year'=>$pp['year'],'level'=>$pp['level'],'letter'=>$pp['letter'],'state'=>$pp['state'],'tag'=>$pp['tag'],'class'=>$pp['class'],'order'=>$pp['order'],'by'=>$pp['by'] ],'show')}">全部`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{empty name="$obj.type_extend.area"} {maccms:foreach name=":explode(',',$obj.parent.type_extend.area)" id="vo2" key="key2"}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`<a {if condition="$pp['area'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$vo2,'lang'=>$pp['lang'],'year'=>$pp['year'],'level'=>$pp['level'],'letter'=>$pp['letter'],'state'=>$pp['state'],'tag'=>$pp['tag'],'class'=>$pp['class'],'order'=>$pp['order'],'by'=>$pp['by'] ],'show')}">{$vo2}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{/maccms:foreach} {else /} {maccms:foreach name=":explode(',',$obj.type_extend.area)" id="vo2" key="key2"}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`<a {if condition="$pp['area'] eq $vo2"} class="current" {/if} href="{:mac_url_type($obj,['area'=>$vo2,'lang'=>$pp['lang'],'year'=>$pp['year'],'level'=>$pp['level'],'letter'=>$pp['letter'],'state'=>$pp['state'],'tag'=>$pp['tag'],'class'=>$pp['class'],'order'=>$pp['order'],'by'=>$pp['by'] ],'show')}">{$vo2}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`{/maccms:foreach} {/empty}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div ref={sectionRefs[2]} id="为什么无法在线播放">
                  <h3>{t("guide.s143")}</h3>
                  <p>{t("guide.s161")}</p>
                </div>

                <div ref={sectionRefs[3]} id="上传失败常见问题">
                  <h3>{t("guide.s144")}</h3>
                  {markdownify(t("guide.s162"), "p")}
                  <div className="info">
                    <span className="title">TIP</span>
                    {markdownify(t("guide.s163"), "p", "message")}
                  </div>
                </div>

                <div ref={sectionRefs[4]} id="运行安装页面出现空白页面">
                  <h3>{t("guide.s145")}</h3>
                  <p>{t("guide.s164")}</p>
                </div>

                <div ref={sectionRefs[5]} id="提示_SQLSTATE_22001">
                  <h3>{t("guide.s146")}</h3>
                  <div className="info">
                    <span className="title">TIP</span>
                    {markdownify(t("guide.s165"), "p", "message")}
                  </div>
                  {markdownify(t("guide.s166"), "p", "mt-4")}
                </div>

                <div ref={sectionRefs[6]} id="数据库连接配置文件">
                  <h3>{t("guide.s147")}</h3>
                  {markdownify(t("guide.s167"), "p")}
                </div>

                <div ref={sectionRefs[7]} id="如何重装苹果cms">
                  <h3>{t("guide.s148")}</h3>
                  {markdownify(t("guide.s168"), "p")}
                </div>

                <div ref={sectionRefs[8]} id="采集资源为何播放不了">
                  <h3>{t("guide.s149")}</h3>
                  <p>{t("guide.s169")}</p>
                  <ul className="list">
                    <li>{t("guide.s170")}</li>
                    <li>{t("guide.s171")}</li>
                  </ul>
                </div>

                <div ref={sectionRefs[9]} id="宝塔Nginx环境404">
                  <h3>{t("guide.s150")}</h3>
                  <p>{t("guide.s172")}</p>
                </div>

                <div ref={sectionRefs[10]} id="采集完数据后为何无法播放">
                  <h3>{t("guide.s151")}</h3>
                  <p>{t("guide.s173")}</p>
                </div>

                <div ref={sectionRefs[11]} id="为何新增加了分类，前台页面进入提示没有权限">
                  <h3>{t("guide.s152")}</h3>
                  <p>{t("guide.s174")}</p>
                </div>

                <div ref={sectionRefs[12]} id="改乱了怎么办">
                  <h3>{t("guide.s153")}</h3>
                  <ul className="list">
                    <li>{t("guide.s175")}</li>
                    <li>{t("guide.s176")}</li>
                  </ul>
                </div>

                <div ref={sectionRefs[13]} id="nginx下除了首页其他都是404怎么办">
                  <h3>{t("guide.s154")}</h3>
                  <p>{t("guide.s177")}</p>
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">html</div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{`if (!-e $request_filename) {`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`   rewrite ^/index.php(.*)$ /index.php?s=$1 last;`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`   rewrite ^/admin.php(.*)$ /admin.php?s=$1 last;`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`   rewrite ^/api.php(.*)$ /api.php?s=$1 last;`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`   rewrite ^(.*)$ /index.php?s=$1 last;`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`   break;`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`}`}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div ref={sectionRefs[14]} id="页面提交数据后过段时间才生效">
                  <h3>{t("guide.s155")}</h3>
                  {markdownify(t("guide.s178"), "p")}
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/guide/often-sql" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{t("guide.s11")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]" />
                  <Link href="/guide/security" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s14")}</span>
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20} />
                  </Link>
                </div>
                {/* End of Page */}
              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </GuideLayout>
  );
}