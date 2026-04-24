import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import DocLayout from "@/layouts/DocLayout";
import { markdownify } from "@/lib/utils/textConverter";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  useState(()=>{
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router.asPath]);

  return (
    <DocLayout title={t('seo.t.t1')} mobile_title={t("menu.doc")} version={"v10"}>
      <div className="container mb-[60px] md:mb-[90px]">
        <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
          {/* Desktop sidebar */}
          <div className="doc-sidebar pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[160px] max-h-[200px]">
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
              <li className={clsx("doc-menu-item active group")}>
                <Link href="/doc/v10" className="group-hover:text-primary text-[16px]">{t("doc.s2")}</Link>
              </li>
              <li className={clsx("doc-menu-item group")}>
                <Link href="/doc/v10/faq" className="group-hover:text-primary text-[16px]">{t("doc.s3")}</Link>
              </li>
              <li className={clsx("doc-menu-item group")}>
                <Link href="/doc/v10/label" className="group-hover:text-primary text-[16px]">{t("doc.s4")}</Link>
              </li>
            </ul>
          </div>
          {/* Content */}
          <article className="doc pt-[10px] md:pt-[35px] grow">
            <h2>{t("doc.s5")}</h2>
            <p>{t("doc.s6")}</p>
            <p>{t("doc.s7")}</p>
            <h3>{t("doc.s8")}</h3>
            {markdownify(t("doc.s9"), "p", "")}
            <h3>{t("doc.s10")}</h3>
            <p>{t("doc.s11")}</p>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{`  │─application //应用目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │  │─admin //后台模块`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │  │─api //api模块`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │  │─common //公共模块`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │  │─extra //配置文件`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │  │─index //前台模块`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │  │─install //安装模块`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │─extend  //扩展目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │─runtime //缓存目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │─static //静态文件目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │─template //前台模板目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │─thinkphp //tp目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │─upload //附件目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  │─vendor //第三发库目录`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`  └─index.php //入口文件`}</div>
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