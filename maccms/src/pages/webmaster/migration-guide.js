import BaseLayout from "@/layouts/BaseLayout";
import Footer from "@/layouts/partials/Footer";
import Image from "next/image";
import {useTranslation} from "react-i18next";

export default function Webmaster() {

  const {t} = useTranslation();

  return(
    <BaseLayout title={`${t('wm.s24')} | ${t('seo.t.t0')}`}>
      <div className={'pt-[50px] w-full min-h-[calc(100vh-250px)] flex flex-col'}>
        <h2 className={'text-center'}>{t('wm.s24')}</h2>
        <div className='grow w-full flex flex-col items-center justify-center'>
          <Image src={'/images/webmaster/com_ic_empty.png'} alt={"Empty"} width={110} height={110}/>
          <span className={'text-[16px]'}>{t('wm.s1')}</span>
        </div>
      </div>
      <Footer/>
    </BaseLayout>

  );
}