import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import TransferLayout from "@/layouts/transfer/TransferLayout";
import TransferSidebar from "@/layouts/transfer/TransferSidebar";
import Zoom from "react-medium-image-zoom";
import Image from "next/image";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];

 

  return (
    <TransferLayout title={`${t('wm.s5')} | ${t('seo.t.t0')}`} mobile_title={t("wm.s5")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <div className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                <TransferSidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              </div>
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("wm.s25")}</h2>
                  <p>{t('wm.s29')}</p>
                  <h3>{t("wm.s26")}</h3>
                  <Zoom>
                    <Image alt="pic" src="/images/webmaster/sql-1.jpg" width={1216} height={645} className="w-full h-auto" />
                  </Zoom>
                </div>

                <div id={'打包站点'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("wm.s27")}</h3>
                  <Zoom>
                    <Image alt="pic" src="/images/webmaster/sql-2.jpg" width={1629} height={571} className="w-full h-auto" />
                  </Zoom>
                  <div className='info'>
                    <p className='title'>{t('wm.s30')}</p>
                    <ul className='message'>
                      {markdownify(t('wm.s31'), 'li')}
                      {markdownify(t('wm.s32'), 'li')}
                    </ul>
                  </div>
                </div>

                <div id={'还原数据'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("wm.s28")}</h3>
                  <Zoom>
                    <Image alt="pic" src="/images/webmaster/sql-3.jpg" width={1879} height={480}
                           className="w-full h-auto"/>
                  </Zoom>
                  <div className='info'>
                    <p className='title'>{t('wm.s30')}</p>
                    <p className='message'>
                      {t('wm.s33')}
                    </p>
                  </div>
                </div>

              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </TransferLayout>
  );
}