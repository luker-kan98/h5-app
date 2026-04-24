import config from "@/config/config.json";
import { plainify } from "@/lib/utils/textConverter";
import Header from "./partials/Header";
import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { gsap } from "@/lib/gsap";

const Base = ({
  title,
  description,
  keywords,
  noindex,
  canonical,
  children,
}) => {
  const { meta_image, meta_author, meta_description, meta_keywords } = config.metadata;
  const { base_url } = config.site;
  const main = useRef();
  const router = useRouter();

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

        {/* keywords */}
        <meta name="keywords"
              content={plainify(keywords ? keywords : meta_keywords)}
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

        <meta name="twitter:image:type" content="image/png" />
        <meta name="twitter:image:width" content="144" />
        <meta name="twitter:image:height" content="144" />
        <meta property="twitter:image:alt" content="MacCMS" />
        <meta name="twitter:card" content="summary" />

        {/* author from config.json */}
        <meta name="author" content={meta_author} />
      </Head>
      <Header />
      {/* main site */}
      <main className="min-h-[calc(100vh-150px)] pt-[50px] md:pt-[60px]" ref={main}>
        {/* Global background */}
        <div className="absolute -z-50 top-0 right-0 w-full aspect-[0.4618] md:aspect-[1.7778] bg-no-repeat bg-contain bg-[url('/images/background/bg.png')] md:bg-[url('/images/background/bg-md.png')]"></div>
        {children}
      </main>
    </>
  );
};

export default Base;
