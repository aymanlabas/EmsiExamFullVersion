import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';
import es from './es.json';
import de from './de.json';

const resources = {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
    es: { translation: es },
    de: { translation: de }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('appLanguage') || 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;
