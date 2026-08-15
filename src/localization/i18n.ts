import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import {
  DEFAULT_LANGUAGE,
  DEFAULT_NAMESPACE,
  LANGUAGE_STORAGE_KEY,
  NAMESPACES,
  SupportedLanguage,
  isRTL,
} from './config';
import { resources } from './locales';

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: DEFAULT_NAMESPACE,
  ns: NAMESPACES as unknown as string[],
  resources,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

/**
 * Detect initial language preference based on:
 * 1. Saved preference in SecureStore
 * 2. System locale from expo-localization
 * 3. Default fallback ('en')
 */
export async function getInitialLanguage(): Promise<SupportedLanguage> {
  try {
    const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      return savedLanguage;
    }
  } catch (err) {
    console.warn('[i18n] Error reading stored language preference:', err);
  }

  // Fallback to system locale detection
  try {
    const locales = Localization.getLocales();
    const systemLang = locales[0]?.languageCode;
    if (systemLang === 'ar') {
      return 'ar';
    }
  } catch (err) {
    console.warn('[i18n] Error detecting system locale:', err);
  }

  return DEFAULT_LANGUAGE;
}

let isInitialized = false;

export async function initI18n(): Promise<void> {
  if (isInitialized) return;

  const initialLanguage = await getInitialLanguage();
  const shouldBeRTL = isRTL(initialLanguage);

  // Sync React Native I18nManager with detected language
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
  }

  if (i18n.language !== initialLanguage) {
    await i18n.changeLanguage(initialLanguage);
  }

  isInitialized = true;
}

export default i18n;
