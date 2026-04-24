import { useTranslation } from "react-i18next";
import { markdownify } from "@/lib/utils/textConverter";
import Base from "@/layouts/BaseLayout";
import Image from "next/image";
import Link from "next/link";
import Advertise from "@/layouts/components/home/Advertise";
import Footer from "@/layouts/partials/Footer";

export default function Home() {
  const {t} = useTranslation();

  return (
    <Base title={t('seo.index.title')} description={t('seo.index.description')} keywords={t('seo.index.keywords')}>
      <section>
        <div className="container pt-[35px] md:pt-[90px] xl:pt-[150px]">
          {/* banner title */}
          <div className="flex flex-wrap">
            {markdownify(t("home.s1"), "h1", "")}
            {markdownify(t("home.s2"), "h1", "")}
          </div>
          {/* banner subtitle */}
          {markdownify(t("home.s3"), "p", "text-text text-[17px] md:text-[24px] pt-5 md:pt-[18px]")}
          {/* description */}
          {markdownify(t("home.s4"), "p", "opacity-50 pt-5 md:pt-4")}

          {/* download link */}
          <div className="mt-[35px] md:mt-[120px] md:h-[220px] flex flex-col md:flex-row items-end md:gap-x-5 gap-y-4">
            <div className="relative banner-download group">
              <Link href="https://www.maccms.la/down/maccms10.zip" className="banner-download-icon-cover">
                <div className="download-icon"></div>
              </Link>
              <span className="download-text">{t('home.s27')}</span>
            </div>
            <div className="relative banner-download group">
              <Link href="https://github.com/magicblack/maccms10" target="_blank" className="banner-download-icon-cover">
                <div className="download-icon"></div>
              </Link>
              <p className="download-text">{t('home.s28')}</p>
            </div>
            <div className="relative banner-download group">
              <Link href="https://www.maccms.la/down/maccms10.zip" target="_blank" className="banner-download-icon-cover">
                <div className="download-icon"></div>
              </Link>
              <span className="download-text">{t('home.s29')}</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          {/* Ads */}
          <Advertise />
          {/* thanks */}
          <div className="w-full flex flex-col mt-[35px] md:mt-[150px] mb-[60px] md:mb-[90px] items-center gap-[16px]">
            <Link href="https://github.com/magicblack" target="_blank" className="ads-thanks group">
              <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="页面-1" stroke="none" fill="none" strokeWidth="1" fillRule="evenodd">
                  <g id="home_1" transform="translate(-837.000000, -1584.000000)">
                    <g id="1" transform="translate(820.000000, 1576.000000)">
                      <g id="home_btn_ic_love" transform="translate(17.000000, 8.000000)">
                        <rect id="矩形" x="0" y="0" width="20" height="20"></rect>
                        <path className="ads-love-icon" d="M13.2276786,2.5 C14.5690115,2.5 15.7843663,3.06698022 16.6650149,3.97949583 C17.5518953,4.89846856 18.1,6.16760198 18.1000366,7.56067355 C18.0910935,8.29981407 17.9949259,8.7820493 17.7903479,9.32113252 C17.7173609,9.52160557 17.6264684,9.72538617 17.5128757,9.94635991 C16.4903348,11.7164534 15.205456,13.1848093 13.4386249,14.7801707 C12.5148592,15.6144583 11.503723,16.442995 10.4289556,17.243391 C10.2022752,17.4170563 9.99665042,17.5 9.78625,17.5 C9.58473442,17.5 9.39274512,17.4325001 9.22556191,17.3059108 C7.65419131,16.1413814 6.49396261,15.1251773 5.78678982,14.4669211 C3.81006057,12.6371871 2.49414505,10.9903171 1.89903373,9.5668563 C1.63570689,8.92132979 1.51178571,8.37505945 1.51178267,7.87081992 C1.50643321,6.33856297 2.03932277,5.0005583 2.91470963,4.04155588 C3.79444156,3.07779337 5.01923663,2.5 6.37232143,2.5 C7.02838188,2.5 7.66664533,2.63740029 8.27304502,2.91000222 C8.70733122,3.10521158 9.10974207,3.3594533 9.46929481,3.6732007 C10.4855842,3.36184548 10.8863916,3.10538431 11.3205824,2.91021757 C11.9290791,2.63747043 12.5694764,2.5 13.2276786,2.5 L13.2276786,2.5 Z" stroke="#4D5366" fillRule="nonzero"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="group-hover:text-primary">{t('home.s30')}</span>
            </Link>
            <Link href="https://www.51.la/?from=maccms" target="_blank" className="ads-thanks group">
              <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="home_1" transform="translate(-842.000000, -1635.000000)">
                    <g id="2" transform="translate(827.000000, 1628.000000)">
                      <g id="home_btn_ic_Recommended" transform="translate(15.000000, 7.000000)">
                        <rect id="矩形" x="0" y="0" width="20" height="20"></rect>
                        <g className="ads-love-icon" id="ic" transform="translate(2.000000, 2.000000)">
                          <path className="ads-love-icon" d="M9.47617593,0.500473225 C10.1574827,0.517383539 10.7198329,0.774837215 11.0891702,1.26936168 C11.9730765,2.4511755 11.6485982,4.8231157 11.4255957,5.89847238 C11.3897892,6.07113736 11.3430907,6.27551364 11.2846184,6.5 L11.2846184,6.5 L14.5,6.5 C15.1827486,6.5 15.7213885,6.6834055 16.0751058,7.09447927 C16.5740656,7.67378186 16.5125383,8.18096462 16.4586934,8.4955464 C16.3639969,9.05328098 16.0002494,10.8822436 15.6759525,12.5134957 C15.5225007,13.284353 15.3935634,13.9344175 15.3087098,14.3677125 C15.1907112,14.9675555 15.0453892,15.6063745 14.6032852,16.0326708 C14.2953047,16.3296393 13.8385279,16.5 13.1694979,16.5 L13.1694979,16.5 L2,16.5 C1.55681538,16.5 1.17797427,16.3537975 0.912824931,16.0886481 C0.645353117,15.8211763 0.5,15.4396977 0.5,15 L0.5,15 L0.5,8 C0.5,7.60758592 0.668814348,7.21663668 0.954067256,6.93138377 C1.2146361,6.67081492 1.57540642,6.5 2,6.5 L2,6.5 L4,6.5 C4.78647326,6.5 5.5114173,6.27556794 6.10929785,5.8769809 C6.71267636,5.47472857 7.18793378,4.89462615 7.46600563,4.18121465 C7.68988288,3.60549928 7.73268995,3.12538394 7.76599899,2.70442726 C7.85921373,1.83676954 8.05830888,1.31803157 8.38413565,0.967018996 C8.66990731,0.659157715 9.04746702,0.489962012 9.47617593,0.500473225 Z" id="形状" stroke="#4D5366" fillRule="nonzero"></path>
                          <rect className="ads-love-icon" id="矩形" fill="#4D5366" x="4" y="6" width="1" height="10"></rect>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="group-hover:text-primary">{t('home.s31')}</span>
            </Link>
          </div>
        </div>
      </section>
     <Footer />
    </Base>
  );
}