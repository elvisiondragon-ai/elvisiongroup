import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Define language detection options
const detectionOptions = {
  order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  lookupLocalStorage: 'preferred_language',
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  convertDetectedLanguage: (lng: string) => {
    // Map browser languages to our supported languages
    if (lng.startsWith('id') || lng.includes('ID')) return 'id';
    return 'en';
  }
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: detectionOptions,
    
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;