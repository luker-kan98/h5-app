import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './i18n/en.json';
import zhCN from './i18n/zh-CN.json';
import zh from './i18n/zh.json';

const resources = {
  en: {translation: en},
  'zh-CN': { translation: zhCN },
  zh: { translation: zh},
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-CN',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
