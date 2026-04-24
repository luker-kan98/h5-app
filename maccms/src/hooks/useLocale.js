import { useContext } from 'react';

import {
  LanguageContext,
  locales,
} from '../contexts/LanguageContext';

export default function useLocale() {
  const [locale, setLocale] = useContext(LanguageContext);

  return { locale, setLocale, locales };
}
