// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import macedonianTranslation from './locales/macedonian.json';
import albanianTranslation from './locales/albanian.json';

// Configure i18next
i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'en', // Default language (e.g., English)
        resources: {
            mk: { translation: macedonianTranslation }, // Macedonian
            sq: { translation: albanianTranslation }, // Albanian
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
