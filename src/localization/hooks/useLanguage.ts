import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, DevSettings } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import * as Localization from 'expo-localization';

import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  isRTL as checkIsRTL,
} from '../config';

export type LanguageOption = SupportedLanguage | 'system';

export function useLanguage() {
  const { i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'en'
  );

  const isRTL = checkIsRTL(activeLanguage);

  const changeLanguage = useCallback(
    async (target: LanguageOption) => {
      let nextLang: SupportedLanguage = 'en';

      if (target === 'system') {
        const systemLang = Localization.getLocales()[0]?.languageCode;
        nextLang = systemLang === 'ar' ? 'ar' : 'en';
        await SecureStore.deleteItemAsync(LANGUAGE_STORAGE_KEY);
      } else {
        nextLang = target;
        await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, target);
      }

      const nextIsRTL = checkIsRTL(nextLang);
      const rtlChanged = I18nManager.isRTL !== nextIsRTL;

      await i18n.changeLanguage(nextLang);
      setActiveLanguage(nextLang);

      if (rtlChanged) {
        I18nManager.allowRTL(nextIsRTL);
        I18nManager.forceRTL(nextIsRTL);

        // Dual-path reload strategy:
        if (__DEV__) {
          DevSettings.reload();
        } else {
          try {
            await Updates.reloadAsync();
          } catch (error) {
            console.warn('[useLanguage] Failed to reload app natively via Updates:', error);
            DevSettings.reload();
          }
        }
      }
    },
    [i18n]
  );

  return {
    currentLanguage: activeLanguage,
    isRTL,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
