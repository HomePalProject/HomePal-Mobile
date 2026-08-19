import { SupportedLanguage } from '../config';

import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enOnboarding from './en/onboarding.json';
import enPantry from './en/pantry.json';
import enMeals from './en/meals.json';
import enOffers from './en/offers.json';
import enHouseholds from './en/households.json';
import enShopping from './en/shopping.json';
import enBudget from './en/budget.json';
import enProfile from './en/profile.json';
import enHome from './en/home.json';
import enAgentChat from './en/agentChat.json';

import arCommon from './ar/common.json';
import arAuth from './ar/auth.json';
import arOnboarding from './ar/onboarding.json';
import arPantry from './ar/pantry.json';
import arMeals from './ar/meals.json';
import arOffers from './ar/offers.json';
import arHouseholds from './ar/households.json';
import arShopping from './ar/shopping.json';
import arBudget from './ar/budget.json';
import arProfile from './ar/profile.json';
import arHome from './ar/home.json';
import arAgentChat from './ar/agentChat.json';

/**
 * All translations, bundled statically.
 *
 * These were previously lazy-loaded through a custom i18next backend, but the entire
 * catalogue is only ~35KB across both languages (~15KB per language, largest single
 * namespace ~3KB). Deferring that is not worth the cost: until a namespace resolved,
 * `t()` returned the raw key, so every first visit to a screen flashed untranslated
 * text. Bundling up front removes that flash entirely.
 */
export const resources: Record<SupportedLanguage, Record<string, Record<string, unknown>>> = {
  en: {
    common: enCommon,
    auth: enAuth,
    onboarding: enOnboarding,
    pantry: enPantry,
    meals: enMeals,
    offers: enOffers,
    households: enHouseholds,
    shopping: enShopping,
    budget: enBudget,
    profile: enProfile,
    home: enHome,
    agentChat: enAgentChat,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    onboarding: arOnboarding,
    pantry: arPantry,
    meals: arMeals,
    offers: arOffers,
    households: arHouseholds,
    shopping: arShopping,
    budget: arBudget,
    profile: arProfile,
    home: arHome,
    agentChat: arAgentChat,
  },
};
