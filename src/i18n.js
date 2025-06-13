import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      reservar: 'Book now'
    }
  },
  es: {
    translation: {
      reservar: 'Reservar'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.startsWith('es') ? 'es' : 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;