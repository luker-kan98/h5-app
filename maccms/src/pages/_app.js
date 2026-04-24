import "@/styles/style.scss";
import "react-medium-image-zoom/dist/styles.css";
import "react-notifications-component/dist/theme.css";

import Head from "next/head";
import { LanguageProvider } from "@/contexts/LanguageContext";
import NextNProgress from "nextjs-progressbar";
import localFont from "next/font/local";
import { ReactNotifications } from "react-notifications-component";
import { useEffect } from "react";

import "../i18n";
import ScrollTopButton from "@/layouts/components/ScrollTopButton";

import { useRouter } from 'next/router';
import ReactGA from 'react-ga';
import Script from "next/script";

const primaryFont = localFont({
  src: [
    {
      path: "../font/PingFang-SC-Regular.ttf",
      style: "normal",
    },
  ],
  variable: "--font-pingfang",
});

export default function App({ Component, pageProps }) {

  return (
    <main
      className={`${primaryFont.variable}`}
    >
      <Head>
        {/* responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <LanguageProvider>
        <NextNProgress color="#40CC92" options={{ showSpinner: false }} />
        <ReactNotifications />
        <Component {...pageProps} />
        <ScrollTopButton />
      </LanguageProvider>
    </main>
  );
}
