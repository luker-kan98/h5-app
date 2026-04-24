import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import GuideLayout from "@/layouts/guide/GuideLayout";
import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import Sidebar from "@/layouts/guide/Sidebar";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  

  return (
    <GuideLayout title={`${t('guide.s14')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="flex flex-col w-full">
                  <h2>{t("guide.s14")}</h2>
                  <h3>{t("guide.s179")}</h3>
                  <div className="alert">
                    <span className="title">{t("guide.s182")}</span>
                    <p className="message">{t("guide.s183")}</p>
                  </div>
                  <p className="mt-4">{t("guide.s184")}</p>
                  <p className="mt-3 text-[16px]">{t("guide.s185")}</p>
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{"\\application\\database.php"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`\\application\\route.php`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`\\application\\extra\\maccms.php`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`\\application\\extra\\bind.php`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`\\application\\extra\\timming.php`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`\\application\\extra\\vodplayer.php`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`\\application\\extra\\voddowner.php`}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{`\\application\\extra\\vodserver.php`}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                      </li>
                    </ul>
                  </div>
                  <p className="mt-3 text-[16px]">{t("guide.s186")}</p>
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{"\\plugin"}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">{`\\upload`}</div>
                      </li>
                    </ul>
                  </div>
                  <p className="mt-3 text-[16px]">{t("guide.s187")}</p>
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{"\\addons\\"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\application\\"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\extend\\"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\static\\"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\runtime\\"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\thinkphp\\"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\vendor\\"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\说明文档\\"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\admin.php 自定义后台入口文件"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\api.php 自定义api入口文件"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"\\index.php"}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">{`\\install.php`}</div>
                      </li>
                    </ul>
                  </div>

                  <p className="mt-3 text-[16px]">{t("guide.s188")}</p>
                  <p className="text-[16px]">{t("guide.s189")}</p>
                  <div className="info">
                    <span className="title">TIP</span>
                    <p className="message">{t("guide.s190")}</p>
                  </div>

                </div>
                <div id="关于盗版" ref={sectionRefs[1]} className="flex flex-col w-full">
                  <h3>{t("guide.s180")}</h3>
                  <div className="alert">
                    <span className="title">{t("guide.s191")}</span>
                    {markdownify(t("guide.s192"), "p", "message")}
                  </div>
                  <h4>GitHub</h4>
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="code-space">{"https://github.com/magicblack"}</div>
                      </li>
                      <li className="w-full">
                        <div className="code-space">{"https://github.com/magicblack/maccms10"}</div>
                      </li>
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">{`https://github.com/magicblack/maccms8`}</div>
                      </li>
                    </ul>
                  </div>
                  {markdownify(t("guide.s193"), "h4")}
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">{`https://cdn.jsdelivr.net/gh/magicblack/maccms_down/`}</div>
                      </li>
                    </ul>
                  </div>
                  <div className="warning">
                    <p className="title">{t("guide.s194")}</p>
                    <p className="message">{t("guide.s195")}</p>
                  </div>

                </div>
                <div id="利用cloudflare防止cc攻击" ref={sectionRefs[2]} className="flex flex-col w-full">
                  <h3>{t("guide.s181")}</h3>
                  <p>{t("guide.s196")}</p>
                  {markdownify(t("guide.s197"), "p", "text-[16px]")}
                  <p>{t("guide.s198")}</p>
                  <div className="code-container">
                    <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary"></div>
                    <ul className="w-full">
                      <li className="w-full">
                        <div className="pb-2 code-space border-b-[1px]">{`ip.geoip.country ne "CN" and ip.geoip.country ne "HK" and ip.geoip.country ne "TW"`}</div>
                      </li>
                    </ul>
                  </div>
                  <p className="text-[16px]">{t("guide.s199")}</p>
                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide/help" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{t("guide.s13")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]" />
                  <Link href="/guide/coffee" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s15")}</span>
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