import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";

import useOutsideAlerter from "@/hooks/useOutsideAlterter";
import DocLayout from "@/layouts/DocLayout";
import { markdownify } from "@/lib/utils/textConverter";

export default function DocPage() {

  const { t } = useTranslation();

  return (
    <DocLayout title={t('seo.t.t2')} mobile_title={t("menu.doc")} version={"v10"}>
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
              <li className={clsx("doc-menu-item active group")}>
                <Link href="/doc/v10/faq" className="group-hover:text-primary text-[16px]">{t("doc.s3")}</Link>
              </li>
              <li className={clsx("doc-menu-item group")}>
                <Link href="/doc/v10/label" className="group-hover:text-primary text-[16px]">{t("doc.s4")}</Link>
              </li>
            </ul>
          </div>
          {/* Content */}
          <article className="doc pt-[10px] md:pt-[35px] grow">
            <h2>{t("doc.s3")}</h2>
            <p>{t("doc.s27")}</p>
            <h3>{t("doc.s28")}</h3>
            {markdownify(t("doc.s29"), "p")}
            <h3>{t("doc.s30")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{t("doc.s31")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s32")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">-</div>
                </li>
                <li className="w-full">
                  <div className="code-space">-</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s33")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s34")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s35")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s36")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s37")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s38")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"upload_max_filesize = 8M"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"post_max_size = 10M"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">-</div>
                </li>
                <li className="w-full">
                  <div className="code-space">-</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s39")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">-</div>
                </li>
                <li className="w-full">
                  <div className="code-space">-</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s40")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">-</div>
                </li>
                <li className="w-full">
                  <div className="code-space">-</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s41")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"RE:############################################"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s42")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s43")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`sql-mode="NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s44")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION" ` + t("doc.s45")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"############################################"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s46")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s47")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s48")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s49")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s50")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s51")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s52")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s53")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s54")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s55")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s56")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s57")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s58")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s59")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s60")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">&emsp;{`if (!-e $request_filename) {`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">&emsp;&emsp;{`rewrite ^/index.php(.*)$ /index.php?s=$1 last;`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">&emsp;&emsp;{`rewrite ^/admin.php(.*)$ /admin.php?s=$1 last;`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">&emsp;&emsp;{`rewrite ^/api.php(.*)$ /api.php?s=$1 last;`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">&emsp;&emsp;{`rewrite ^(.*)$ /index.php?s=$1 last;`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">&emsp;&emsp;{`break;`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">&emsp;{`}`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"-"}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s61")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{t("doc.s62")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`SELECT * FROM {pre}vod    ` + t("doc.s63")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`SELECT * FROM {pre}vod WHERE vod_id=1000    ` + t("doc.s64")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s65")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`DELETE  FROM {pre}vod    ` + t("doc.s66")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`DELETE  FROM {pre}vod WHERE vod_id=1000    ` + t("doc.s67")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`DELETE  FROM {pre}vod WHERE vod_actor LIKE '%刘德华%'    ` + t("doc.s68")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`DELETE  FROM {pre}vod WHERE vod_type=1    ` + t("doc.s69")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`DELETE  FROM {pre}vod WHERE vod_area LIKE '%台湾%'    ` + t("doc.s70")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`DELETE  FROM {pre}vod WHERE vod_lang LIKE '%粤语%'    ` + t("doc.s71")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s72")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`UPDATE {pre}vod SET vod_hits=1    ` + t("doc.s73")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`UPDATE {pre}vod SET vod_hits=1 WHERE vod_id=1000    ` + t("doc.s74")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s75")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`UPDATE {pre}vod SET vod_pic=REPLACE(vod_pic, '原始字符串', '替换成其他字符串')`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s76")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`PHP： truncate {pre}vod`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s77")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`          或 ALTER TABLE {pre}vod ALTER COLUMN vod_id COUNTER (1, 1)`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`          mssql用   TRUNCATE TABLE  {pre}vod`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s78")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"DELETE FROM {pre}vod where vod_id not in ( SELECT vod_id FROM {pre}vod GROUP BY vod_name HAVING COUNT(*)>1)"}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s79")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{"REPAIR TABLE `{pre}art` ,`{pre}vod` ,`{pre}type` ,`{pre}comment` ,`{pre}gbook` ,`{pre}link` ,`{pre}admin` ,`{pre}topic` ,`{pre}user` ,`{pre}card` ,`{pre}group` ,`{pre}visit`"}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s80")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{t("doc.s81")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s82")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s83")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`opcache.enable=1`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`或`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`opcache.enable_cli=1`}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s84")}</div>
                </li>
                <li className="w-full">
                  <div className="pb-2 code-space border-b-[1px]">&emsp;</div>
                </li>
              </ul>
            </div>
            <h3>{t("doc.s85")}</h3>
            <div className="code-container">
              <div className="w-full h-[25px] px-3 md:px-4 md:h-[38px] bg-[#F2F2F2] flex items-center border-l-[1px] border-t-[1px] border-r-[1px] border-border font-primary">code</div>
              <ul className="w-full">
                <li className="w-full">
                  <div className="code-space">{t("doc.s86")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{t("doc.s87")}</div>
                </li>
                <li className="w-full">
                  <div className="code-space">{`<iframe src="example.com" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"></iframe>`}</div>
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