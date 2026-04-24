import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import GuideLayout from "@/layouts/guide/GuideLayout";
import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import Sidebar from "@/layouts/guide/Sidebar";

import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const query1 = `SELECT * FROM {pre}vod --查询所有数据
SELECT * FROM {pre}vod WHERE vod_id=1000 --查询指定ID数据
DELETE FROM {pre}vod 删除所有数据
DELETE FROM {pre}vod WHERE vod_id=1000 --删除指定的第几条数据
DELETE FROM {pre}vod WHERE vod_actor LIKE '%刘德华%'   --删除vod_actor = "刘德华"的数据
UPDATE {pre}vod SET vod_hits=1 --将所有vod_hits字段里的值修改成"1"
UPDATE {pre}vod SET vod_hits=1 WHERE vod_id=1000 --指定的第几条数据把vod_hits字段里的值修改成"1"
UPDATE {pre}vod SET vod_pic=REPLACE(vod_pic, '原始字符串', '替换成其他字符串') --替换图片地址 
TRUNCATE {pre}vod --清空数据ID重新从1开始慎用`;
const query2 = `DELETE FROM {pre}vod where vod_id not in ( SELECT vod_id FROM {pre}vod GROUP BY vod_name HAVING COUNT(*)>1)`;
const query3 = "REPAIR TABLE `{pre}art` ,`{pre}vod` ,`{pre}type` ,`{pre}comment` ,`{pre}gbook` ,`{pre}link` ,`{pre}admin` ,`{pre}topic` ,`{pre}user` ,`{pre}card` ,`{pre}group` ,`{pre}visit`";
const query4 = "UPDATE {pre}vod SET website_referer_day=0";
const query5 = `-- 影片批量添加编码为 youku 的播放器
UPDATE {pre}vod SET vod_play_from = concat(vod_play_from,'$$$youku')`;
const query6 = `-- 用原来的播放组地址复制一份作为另外一个播放器进行播放,需要先进行 批量添加播放器编码替换
UPDATE {pre}vod SET vod_play_url = concat(vod_play_url,concat('$$$',vod_play_url))`;

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
    <GuideLayout title={`${t('guide.s11')} | ${t('seo.t.t0')}`} mobile_title={t("menu.guide")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <Sidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="flex flex-col w-full">
                  <h2>{t("guide.s11")}</h2>
                  <div className="info">
                    <span className="title">{t("guide.s133")}</span>
                    {markdownify(t("guide.s134"), "p", "message")}
                  </div>
                  <h3>{t("guide.s135")}</h3>
                  <div className="max-w-[calc(100vw-40px)] md:max-w-[calc(100vw-270px)] lg:max-w-[calc(100vw-300px)] xl:max-w-[880px] overflow-auto">
                    <SyntaxHighlighter language="sql" style={oneLight}>{query1}</SyntaxHighlighter>
                  </div>
                  <h3>{t("guide.s136")}</h3>
                  <p className="mt-3 md:mt-5 text-[16px] leading-8">{t("guide.s137")}</p>
                  <div className="max-w-[calc(100vw-40px)] md:max-w-[calc(100vw-270px)] lg:max-w-[calc(100vw-300px)] xl:max-w-[880px] overflow-auto">
                    <SyntaxHighlighter language="sql" style={oneLight}>{query2}</SyntaxHighlighter>
                  </div>
                  <p className="mt-3 md:mt-5 text-[16px] leading-8">{t("guide.s138")}</p>
                  <div className="max-w-[calc(100vw-40px)] md:max-w-[calc(100vw-270px)] lg:max-w-[calc(100vw-300px)] xl:max-w-[880px] overflow-auto">
                    <SyntaxHighlighter language="sql" style={oneLight}>{query3}</SyntaxHighlighter>
                  </div>
                  <p className="mt-3 md:mt-5 text-[16px] leading-8">{t("guide.s139")}</p>
                  <div className="max-w-[calc(100vw-40px)] md:max-w-[calc(100vw-270px)] lg:max-w-[calc(100vw-300px)] xl:max-w-[880px] overflow-auto">
                    <SyntaxHighlighter language="sql" style={oneLight}>{query4}</SyntaxHighlighter>
                  </div>
                  <p className="mt-3 md:mt-5 text-[16px] leading-8">{t("guide.s140")}</p>
                  <div className="max-w-[calc(100vw-40px)] md:max-w-[calc(100vw-270px)] lg:max-w-[calc(100vw-300px)] xl:max-w-[880px] overflow-auto">
                    <SyntaxHighlighter language="sql" style={oneLight}>{query5}</SyntaxHighlighter>
                  </div>
                  <p className="mt-3 md:mt-5 text-[16px] leading-8">{t("guide.s141")}</p>
                  <div className="max-w-[calc(100vw-40px)] md:max-w-[calc(100vw-270px)] lg:max-w-[calc(100vw-300px)] xl:max-w-[880px] overflow-auto">
                    <SyntaxHighlighter language="sql" style={oneLight}>{query6}</SyntaxHighlighter>
                  </div>

                </div>
                {/* Page */}
                <div className="pager">
                  <Link href="/guide/update-log" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20} />
                    <span className="text-primary text-[16px]">{t("guide.s10")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]" />
                  <Link href="/guide/help" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("guide.s13")}</span>
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