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
  ];

  

  return (
    <ApiLayout title={`${t('apis.clt.s1')} | ${t('seo.t.t0')}`} mobile_title={t("apis.clt.s1")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <div className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                <ApiSidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              </div>
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("apis.clt.s1")}</h2>
                  <h3>{t("apis.clt.s3")}</h3>
                  <ul className='list'>
                    <li>{t('apis.clt.s6')}</li>
                    <li>{t('apis.clt.s7')}</li>
                    <li>{t('apis.clt.s8')}</li>
                  </ul>
                </div>
                <div id={'下载模块'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("apis.clt.s4")}</h3>
                  {markdownify(t('apis.clt.s9'), 'p')}
                  <h4>{t("apis.clt.s10")}</h4>
                  {markdownify(t('apis.clt.s11'), 'p')}
                  <div className='info'>
                    <p className='title'>{t('apis.clt.s12')}</p>
                    <p className='message'>{t('apis.clt.s13')}</p>
                  </div>
                  <h4>{t("apis.clt.s14")}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.clt.s15'), 'li')}
                    {markdownify(t('apis.clt.s16'), 'li')}
                    {markdownify(t('apis.clt.s17'), 'li')}
                    {markdownify(t('apis.clt.s18'), 'li')}
                    {markdownify(t('apis.clt.s19'), 'li')}
                  </ul>
                  <h4>{t("apis.clt.s21")}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.clt.s21'), 'li')}
                    {markdownify(t('apis.clt.s22'), 'li')}
                  </ul>
                  {markdownify(t('apis.clt.s23'), 'p')}
                  <strong>{t('apis.clt.s24')}</strong>
                  <div className={'table-wrapper'}>
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
                        <td>pass</td>
                        <td>a54s848s</td>
                        <td>必填</td>
                        <td>入库密码，后台可自定义</td>
                      </tr>
                      <tr>
                        <td>type_id</td>
                        <td>1</td>
                        <td>必填</td>
                        <td>绑定分类id</td>
                      </tr>
                      <tr>
                        <td>XXX_name</td>
                        <td>极地救援预告片</td>
                        <td>必填</td>
                        <td>名称必填 vod_name、art_name、actor_name、vod_role</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <strong>{t('apis.clt.s25')}</strong>
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
                        <td>vod_play_from</td>
                        <td>dplayer</td>
                        <td>必填</td>
                        <td>后台播放器id ，空值会发布失败</td>
                      </tr>
                      <tr>
                        <td>vod_play_url</td>
                        <td>高清$http://www.baidu.com/vod.mp4</td>
                        <td>必填</td>
                        <td>播放地址，没有播放地址会发布失败</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  {markdownify(t('apis.clt.s26'), 'p')}
                  <InlineCode type={'html'} lines={6} code={`<!-- 播放器分组 -->
dplayer$$$videojs$$$ppvod
<!-- 播放地址分组 -->
高清$http://www.1.com/vod.mp4#高清$http://www.1.com/vod.mp4#高清$http://www.1.com/vod.mp4$$$ 
高清$http://www.1.com/vod.mp4#高清$http://www.1.com/vod.mp4#高清$http://www.1.com/vod.mp4$$$ 
高清$http://www.1.com/vod.mp4#高清$http://www.1.com/vod.mp4#高清$http://www.1.com/vod.mp4`}/>
                  {markdownify(t('apis.clt.s27'), 'p')}
                  <InlineCode type={'html'} lines={5} code={`https://img3.doubanio.com/view/photo/l/public/p2676386050.jpg#
https://img1.doubanio.com/view/photo/l/public/p2717826857.jpg#
https://img1.doubanio.com/view/photo/l/public/p2717826878.jpg#
https://img1.doubanio.com/view/photo/l/public/p2717827518.jpg#
https://img1.doubanio.com/view/photo/l/public/p2717341007.jpg#`}/>
                  <div className={'warning'}>
                    <p className={'title'}>{t('apis.clt.s28')}</p>
                    <ul className='message'>
                      {markdownify(t('apis.clt.s29'), 'li')}
                      {markdownify(t('apis.clt.s30'), 'li')}
                    </ul>
                  </div>
                </div>

                <div id={'开放资源api'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t('apis.clt.s5')}</h3>
                  <p>{t('apis.clt.s31')}</p>
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('apis.clt.s32')}</p>
                  </div>
                  <h4>{t('apis.clt.s33')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.clt.s34'), 'li')}
                  </ul>
                  <h4>{t('apis.clt.s35')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.clt.s36'), 'li')}
                  </ul>
                  <h4>{t('apis.clt.s37')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.clt.s38'), 'li')}
                  </ul>
                  <h4>{t('apis.clt.s39')}</h4>
                  <ul className='list'>
                    {markdownify(t('apis.clt.s40'), 'li')}
                  </ul>
                </div>

                {/* Page */}
                <div className="pager">
                  <Link href="/apis/web-design" className="flex flex-row items-center gap-[6px]">
                      <span className="text-primary text-[16px]">{t("apis.wd.s1")}</span>
                      <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20}/>
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