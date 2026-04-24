import config from "@/config/config.json";
import { plainify } from "@/lib/utils/textConverter";
import clsx from "clsx";
import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import HeaderWithSubMenu from "./partials/HeaderSubMenu";
import FooterDoc from "./partials/FooterDoc";

const DocLayout = ({
  title,
  mobile_title,
  description,
  noindex,
  canonical,
  version,
  children,
}) => {
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url } = config.site;
  const main = useRef();
  const router = useRouter();
  const {t} = useTranslation();

  //gsap fade animation
  useEffect(() => {

    const ctx = gsap.context(() => {
      //fade
      const fadeElements = document.querySelectorAll(".fade");
      fadeElements.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          scrollTrigger: el,
          duration: 0.3,
        });
      });

      //gsap animation
      const elements = document.querySelectorAll(".animate");
      elements.forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            // markers: true,
          },
        });

        if (el.classList.contains("from-left")) {
          tl.from(el, {
            opacity: 0,
            x: -100,
          });
        } else if (el.classList.contains("from-right")) {
          tl.from(el, {
            opacity: 0,
            x: 100,
          });
        } else {
          tl.from(el, {
            opacity: 0,
            y: 100,
          });
        }
      });

      //background animation
      const animatedBgs = document.querySelectorAll(".bg-theme");
      animatedBgs.forEach((bg) => {
        gsap.to(bg, {
          scrollTrigger: {
            trigger: bg,
            toggleClass: "bg-animate",
            once: true,
          },
        });
      });
    }, main);

    return()=>ctx.revert();
  }, [router.events]);

  return (
    <>
      <Head>
        {/* title */}
        <title>
          {plainify(
            title ? title : config.site.title
          )}
        </title>

        {/* canonical url */}
        {canonical && <link rel="canonical" href={canonical} itemProp="url" />}

        {/* noindex robots */}
        {noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* meta-description */}
        <meta
          name="description"
          content={plainify(description ? description : meta_description)}
        />

        {/* og-title */}
        <meta
          property="og:title"
          content={plainify(
            title ? title : config.site.title
          )}
        />

        {/* og-description */}
        <meta
          property="og:description"
          content={plainify(description ? description : meta_description)}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${base_url}${router.asPath.replace("/", "")}`}
        />

        {/* twitter-title */}
        <meta
          name="twitter:title"
          content={plainify(
            title ? title : config.site.title
          )}
        />

        {/* twitter-description */}
        <meta
          name="twitter:description"
          content={plainify(description ? description : meta_description)}
        />

        {/* og-image */}
        <meta property="og:image" content={`${base_url}${meta_image}`} />

        {/* twitter-image */}
        <meta
          name="twitter:image"
          content={`${base_url}twitter-image.png`}
        />
        <meta
          property="twitter:image"
          content={`${base_url}twitter-image.png`}
        />

        <meta name="twitter:image:type" content="image/png" />
        <meta name="twitter:image:width" content="144" />
        <meta name="twitter:image:height" content="144" />
        <meta property="twitter:image:alt" content="MacCMS" />
        <meta name="twitter:card" content="summary" />

        {/* author from config.json */}
        <meta name="author" content={meta_author} />
      </Head>
      <HeaderWithSubMenu mobile_title={mobile_title} version={version}>
      <div
          className="container flex justify-center pt-[70px] pb-[40px]"
          id="mobile-menu"
        >
          <div className="w-full flex flex-col items-start gap-[10px]">
            {/* Version Select */}
            <div className="flex flex-row items-center gap-2">
              <Link href="/doc/v10">
                <div className={clsx("w-[54px] h-[30px] flex items-center justify-center rounded-[4px]", version == "v10" && "bg-primary text-white", version != "v10" && "border bg-white text-black")}>V10</div>
              </Link>
              <Link href="/doc/v8">
              <div className={clsx("w-[54px] h-[30px] flex items-center justify-center rounded-[4px]", version == "v8" && "bg-primary text-white", version != "v8" && "border bg-white text-black")}>V8</div>
              </Link>            
            </div>
            {/* End of Version select */}
            <label className="text-black text-[20px] font-primary">{t("doc.s1")}</label>
            <ul className="doc-menu">
              <li className={clsx("doc-menu-item group", router.pathname.endsWith(`/doc/${version}`) && "active")}>
                <Link href={`/doc/${version.toLowerCase()}`}>{t("doc.s2")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.endsWith(`/doc/${version}/faq`) && "active")}>
                <Link href={`/doc/${version.toLowerCase()}/faq`}>{t("doc.s3")}</Link>
              </li>
              <li className={clsx("doc-menu-item group", router.pathname.endsWith(`/doc/${version}/label`) && "active")}>
                <Link href={`/doc/${version.toLowerCase()}/label`}>{t("doc.s4")}</Link>
              </li>
            </ul>
          </div>
        </div>
      </HeaderWithSubMenu>
      {/* main site */}
      <main className="doc min-h-[calc(100vh-150px)] pt-[50px] md:pt-[60px]" ref={main}>
        {/* Global background */}
        <div className="absolute -z-50 top-0 right-0 w-full aspect-[0.4618] md:aspect-[1.7778] bg-no-repeat bg-contain bg-[url('/images/background/bg.png')] md:bg-[url('/images/background/bg-md.png')]"></div>
        {children}
      </main>
      <FooterDoc />
    </>
  );
};

export default DocLayout;
