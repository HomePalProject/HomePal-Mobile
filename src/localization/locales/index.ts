import { SupportedLanguage } from '../config';

type LoaderFn = () => Promise<{ default: Record<string, unknown> }>;

export const localeLoaders: Record<SupportedLanguage, Record<string, LoaderFn>> = {
  en: {
    common: () => import('./en/common.json'),
    auth: () => import('./en/auth.json'),
    onboarding: () => import('./en/onboarding.json'),
    pantry: () => import('./en/pantry.json'),
    meals: () => import('./en/meals.json'),
    offers: () => import('./en/offers.json'),
    households: () => import('./en/households.json'),
    shopping: () => import('./en/shopping.json'),
    budget: () => import('./en/budget.json'),
    profile: () => import('./en/profile.json'),
    home: () => import('./en/home.json'),
  },
  ar: {
    common: () => import('./ar/common.json'),
    auth: () => import('./ar/auth.json'),
    onboarding: () => import('./ar/onboarding.json'),
    pantry: () => import('./ar/pantry.json'),
    meals: () => import('./ar/meals.json'),
    offers: () => import('./ar/offers.json'),
    households: () => import('./ar/households.json'),
    shopping: () => import('./ar/shopping.json'),
    budget: () => import('./ar/budget.json'),
    profile: () => import('./ar/profile.json'),
    home: () => import('./ar/home.json'),
  },
};

/**
 * Custom i18next backend plugin for dynamic lazy loading of namespaces
 */
export const dynamicBackendPlugin = {
  type: 'backend' as const,
  init() {},
  read(language: string, namespace: string, callback: (err: any, data: any) => void) {
    const lang = language as SupportedLanguage;
    const loader = localeLoaders[lang]?.[namespace];
    if (!loader) {
      return callback(new Error(`[i18n] No loader found for namespace: ${language}/${namespace}`), null);
    }

    loader()
      .then((module) => {
        const bundle = module.default || module;
        callback(null, bundle);
      })
      .catch((err) => {
        console.error(`[i18n] Error lazy loading namespace ${language}/${namespace}:`, err);
        callback(err, null);
      });
  },
};
