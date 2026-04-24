import { useTranslation } from "react-i18next";
import { markdownify } from "@/lib/utils/textConverter";
import Base from "@/layouts/BaseLayout";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Advertise from "@/layouts/components/check/Advertise";

export default function Check() {
  const { t } = useTranslation();

  /// state
  const [isModalShow, setModalShow] = useState(false);
  const [checkState, setCheckState] = useState('detect');
  const [checkUrl, setCheckUrl] = useState('https://baidu.com');
  const [progMessage, setProgMessage] = useState("");

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleCheck = async () => {
    if (checkUrl == '') {
      alert(t('check.s15'));
      return;
    }
    if (document.location.protocol == 'http' && checkUrl.indexOf('http') != -1 ) {
      alert(t('check.s16'));
      return;
    }

    setProgMessage(t("check.p1"));
    setCheckState('detect');
    setModalShow(true);

    await sleep(2000);
    setProgMessage(t("check.p2"));

    await sleep(2000);
    setProgMessage(t("check.p3"));

    await sleep(2000);
    setProgMessage(t("check.p4"));
    setCheckState('fail');
  }

  return (
    <Base>
      <section>
        <div className="container pt-[80px] md:pt-[90px] xl:pt-[150px]">
          {/* banner title */}
          <div className="flex flex-wrap items-start w-full md:items-center md:justify-center">
            {markdownify(t("check.s1"), "h1", "keep-all")}
            {markdownify(t("check.s2"), "h1", "keep-all")}
          </div>

          {/* Search bar */}
          <div className="w-full flex items-center justify-center my-[35px] md:my-[90px]">
            <div className="search-bar">
              <div className="mx-[10px] md:mx-[22px]">
                <svg width="22px" height="22px" viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="盗版检测" transform="translate(-649.000000, -431.000000)" stroke="#4D5366" strokeWidth="3">
                      <g id="输入框" transform="translate(625.000000, 411.000000)">
                        <g id="pirate_ic_search" transform="translate(24.000000, 20.000000)">
                          <circle id="椭圆形" cx="9.5" cy="9.5" r="8"></circle>
                          <line x1="15" y1="15" x2="20.5" y2="21" id="路径-6"></line>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <input value={checkUrl} onChange={(e)=>setCheckUrl(e.target.value)} className="input" type="search" placeholder="http://baidu.com"></input>
              <button onClick={handleCheck} className="button">{t("check.s3")}</button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container mb-[60px] md:mb-[150px]">
          {/* Ads */}
          <Advertise />
        </div>
      </section>
      <div className={clsx("modal", !isModalShow && "hidden")}>
        <div className="modal-container">
          <div className="modal-header">
            <button onClick={() => setModalShow(false)} hidden={checkState == "detect"}>
              <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <title>关闭</title>
                <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="盗版检测_正在检测_1" transform="translate(-1101.000000, -385.000000)" className="stroke-[#C3C5CC] hover:stroke-[#b3b5bC]" strokeWidth="2">
                    <g id="pop" transform="translate(775.000000, 365.000000)">
                      <g id="popup_del" transform="translate(324.186292, 18.686292)">
                        <g id="编组-2" transform="translate(13.313708, 13.313708) rotate(-315.000000) translate(-13.313708, -13.313708) translate(3.899495, 3.899495)">
                          <line x1="-3.63797881e-12" y1="9.41421356" x2="18.8284271" y2="9.41421356" id="路径-3"></line>
                          <line x1="9.41421356" y1="3.63797881e-12" x2="9.41421356" y2="18.8284271" id="路径-3"></line>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </div>
          <div className="modal-inner">
            <Image alt="check-detection" src="/images/gifs/detect.gif" width={110} height={110} className={clsx(checkState=="fail" && "hidden")}/>
            <Image alt="heck-detection-lose" src="/images/check/check-detection-lose.svg" width={110} height={110} className={clsx(checkState !="fail" && "hidden")}/>
            <p className={clsx("text-4 text-dark", checkState=="fail" && "text-danger" )}>{progMessage}</p>
            {markdownify(t("check.s14"), "p", "text-base text-center")}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="relative w-full pt-[30px] md:pt-[10px] bg-footer">
      <div className="container">
        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-[20px] md:mt-0">          
          {/* More */}
          <div className="flex flex-wrap items-center justify-center w-full gap-3 md:pl-[170px]">
            <Link href="https://www.bt.cn/?from=maccms" target="_blank" className="footer-link">{t("footer.s8")}</Link>
            <div className="h-[14px] min-w-[2px] bg-[#D9E6E7]" />
            <Link href="https://www.51.la/?from=maccms" target="_blank" className="footer-link">{t("footer.s9")}</Link>
            <div className="h-[14px] min-w-[2px] bg-[#D9E6E7]" />
            <Link href="http://e22a.com/h.r6orQ3" target="_blank" className="footer-link">{t("footer.s10")}</Link>
            <div className="h-[14px] min-w-[2px] bg-[#D9E6E7]" />
            <Link href="https://www.cloudopt.net/?from=maccms" target="_blank" className="footer-link">{"Cloudopt"}</Link>
          </div>
          <Link href="https://www.51.la/?from=maccms" target="_blank" className="relative flex flex-row items-center justify-center gap-1 w-full md:w-[200px]">
            <Image alt="5.1-logo" src="/images/home/51-la.png" width={74} height={74} />
            <label className="cursor-pointer break-keep">{t("footer.s6")}</label>
          </Link>
        </div>
        <div className="w-full justify-center flex flex-col items-center my-[20px] md:my-[60px] gap-4">
          <p>© 2020-{new Date().getFullYear()} MacCMS MIT license</p>
          <p>{t("footer.s7")}</p>
        </div>
      </div>
    </footer>
    </Base>
  );
}