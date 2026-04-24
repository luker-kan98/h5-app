import { createContext, useEffect, useState } from "react";

export const locales = ["en", "zh-CN", "zh"];
export const LanguageContext = createContext([]);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState("zh-CN");
  const [browserLang, setBrowserLang] = useState(null);

  useEffect(() => {
    if (browserLang === null) {
      setBrowserLang(navigator.language);
    }
  });

  useEffect(() => {
    // set language
    if (browserLang != null && browserLang.startsWith("en")) setLocale("en");
    else if (browserLang === "zh") setLocale("zh");
    else setLocale("zh-CN");
  }, [browserLang]);


  return (
    <LanguageContext.Provider value={[locale, setLocale]}>
      {children}
    </LanguageContext.Provider>
  );
}
