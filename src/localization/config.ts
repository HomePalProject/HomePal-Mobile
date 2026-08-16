export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', isRTL: false },
  ar: { code: 'ar', name: 'العربية', isRTL: true },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const NAMESPACES = [
  'common',
  'auth',
  'onboarding',
  'pantry',
  'meals',
  'offers',
  'households',
  'shopping',
  'budget',
  'profile',
  'home',
] as const;

export type Namespace = (typeof NAMESPACES)[number];

export const DEFAULT_NAMESPACE: Namespace = 'common';

export const isRTL = (lang?: string): boolean => {
  if (!lang) return false;
  return lang.startsWith('ar');
};

export const LANGUAGE_STORAGE_KEY = 'HOMEPAL_USER_LANGUAGE_PREFERENCE';
