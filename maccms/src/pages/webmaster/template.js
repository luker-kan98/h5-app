import BaseLayout from "@/layouts/BaseLayout";
import Footer from "@/layouts/partials/Footer";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import Link from "next/link";
import {Ads} from "@/layouts/components/webmaster/Ads";

export default function Webmaster() {

  const {t} = useTranslation();

  return(
    <BaseLayout title={`${t('wm.s2')} | ${t('seo.t.t0')}`}>
      <div
        className={'container pt-[20px] md:pt-[50px] w-full min-h-[calc(100vh-250px)] flex flex-col mb-[50px] md:mb-[100px]'}>
        <h2 className={'text-center'}>{t('wm.s2')}</h2>
        <div className='flex flex-col items-center w-full grow'>
          <Ads />
        </div>
      </div>
      <Footer/>
    </BaseLayout>

  );
}