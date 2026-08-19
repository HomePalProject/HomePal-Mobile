import { useCallback, useState } from 'react';
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
  const [isReloading, setIsReloading] = useState(false);

  const activeLanguage = (i18n.language as SupportedLanguage) || 'en';
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

      if (rtlChanged) {
        setIsReloading(true);
        I18nManager.allowRTL(nextIsRTL);
        I18nManager.forceRTL(nextIsRTL);

        await new Promise((resolve) => setTimeout(resolve, 50));

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
    isReloading,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
