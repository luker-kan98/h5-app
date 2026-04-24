import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const Footer = () => {
  const {t} = useTranslation();

  return (
    <footer className="relative w-full pt-[30px] md:pt-[10px] bg-footer">
      <div className="container">
        <div className="w-full flex flex-col md:flex-row justify-between items-center lg:pl-[170px]">
          {/* More */}
          <div className="flex flex-wrap items-center justify-center w-full gap-3">
            <Link href="https://magicblack.github.io/" target="_blank" className="footer-link">{t("footer.s1")}</Link>
            <div className="h-[14px] min-w-[2px] bg-[#D9E6E7]" />
            <Link href="https://github.com/magicblack/maccms8" target="_blank" className="footer-link">{t("footer.s2")}</Link>
            <div className="h-[14px] min-w-[2px] bg-[#D9E6E7]" />
            <Link href="https://github.com/magicblack/maccms10" target="_blank" className="footer-link">{t("footer.s3")}</Link>
            <div className="h-[14px] min-w-[2px] bg-[#D9E6E7]" />
            <Link href="https://github.com/magicblack/maccms_down" target="_blank" className="footer-link">{t("footer.s4")}</Link>
            <div className="h-[14px] min-w-[2px] bg-[#D9E6E7]" />
            <Link href="https://www.maccms.plus/" target="_blank" className="footer-link">{t("footer.s5")}</Link>
          </div>
          <Link href="https://www.51.la/?from=maccms" target="_blank" className="relative flex flex-row items-center justify-center gap-1 w-full md:w-[200px]">
            <Image alt="5.1-logo" src="/images/home/51-la.png" width={74} height={74} />
            <label className="cursor-pointer break-keep">{t("footer.s6")}</label>
          </Link>
        </div>
        <div className="w-full justify-center flex flex-col items-center py-[20px] md:py-[60px] gap-4">
          <p>© 2020-{new Date().getFullYear()} MacCMS MIT license</p>
          <p>{t("footer.s7")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
