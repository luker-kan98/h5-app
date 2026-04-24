import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import GuideLayout from "@/layouts/guide/GuideLayout";
import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import Sidebar from "@/layouts/guide/Sidebar";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, atomOneLight } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();
  const [isFaqSidebarOpen, SetFaqSidebarOpen] = useState(false);

  const sectionRefs = [
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
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="flex flex-col w-full">
                  <h2>{t("guide.s13")}</h2>
                  <div className="flex flex-col items-start w-full gap-[14px] text-[15px] md:text-[14px]">
                    <Link href={`/guide/faq#开启假墙防御后搜索页筛选页的选项参数如何高亮展示`}>- {t("guide.s142")}</Link>
                    <Link href={`/guide/faq#为什么无法在线播放`}>- {t("guide.s143")}</Link>
                    <Link href={`/guide/faq#上传失败常见问题`}>- {t("guide.s144")}</Link>
                    <Link href={`/guide/faq#运行安装页面出现空白页面`}>- {t("guide.s145")}</Link>
                    <Link href={`/guide/faq#提示_SQLSTATE_22001`}>- {t("guide.s146")}</Link>
                    <Link href={`/guide/faq#数据库连接配置文件`}>- {t("guide.s147")}</Link>
                    <Link href={`/guide/faq#如何重装苹果cms`}>- {t("guide.s148")}</Link>
                    <Link href={`/guide/faq#采集资源为何播放不了`}>- {t("guide.s149")}</Link>
                    <Link href={`/guide/faq#宝塔Nginx环境404`}>- {t("guide.s150")}</Link>
                    <Link href={`/guide/faq#采集完数据后为何无法播放`}>- {t("guide.s151")}</Link>
                    <Link href={`/guide/faq#为何新增加了分类，前台页面进入提示没有权限`}>- {t("guide.s152")}</Link>
                    <Link href={`/guide/faq#改乱了怎么办`}>- {t("guide.s153")}</Link>
                    <Link href={`/guide/faq#nginx下除了首页其他都是404怎么办`}>- {t("guide.s154")}</Link>
                    <Link href={`/guide/faq#页面提交数据后过段时间才生效`}>- {t("guide.s155")}</Link>
                  </div>
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