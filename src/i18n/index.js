import i18n from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
import { es, en } from './locales/index.js';

i18n.init({
  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  debug: true,

  lng: 'es',

  resources: {
    es: {
      common: es.es,
    },
    en: {
      common: en.en,
    },
  },

  fallbackLng: 'en',

  ns: ['common'],

  defaultNS: 'common',
  react: {
    wait: false,
    bindI18n: 'languageChanged loaded',
    bindStore: 'added removed',
    nsMode: 'default',
    useSuspense: false
  }
});

export default i18n;
