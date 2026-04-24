import BaseLayout from "@/layouts/BaseLayout";
import Footer from "@/layouts/partials/Footer";
import Image from "next/image";
import Link from 'next/link';
import {useTranslation} from "react-i18next";
import {Ads} from "@/layouts/components/webmaster/Ads";

export default function Webmaster() {

  const {t} = useTranslation();

  return(
    <BaseLayout title={`${t('wm.s4')} | ${t('seo.t.t0')}`}>
      <div className={'container pt-[20px] md:pt-[50px] w-full min-h-[calc(100vh-250px)] flex flex-col mb-[50px] md:mb-[100px]'}>
        <h2 className={'text-center'}>{t('menu.rsc')}</h2>
        <div className='flex flex-col items-center w-full grow'>
          <Ads />
        </div>
      </div>
      <Footer/>
    </BaseLayout>
  );
}