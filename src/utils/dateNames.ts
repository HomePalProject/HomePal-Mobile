/**
 * Localized month and weekday names.
 *
 * These live outside the i18n JSON on purpose: they are ordered arrays indexed by
 * `Date#getMonth()` / `Date#getDay()`, and a flat list is a better fit for that than 19
 * individually-addressed translation keys. Kept in one module so the app's date pickers
 * can't drift apart — previously each one carried its own copy.
 */

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTHS_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const DAYS_OF_WEEK_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DAYS_OF_WEEK_AR = ['أحد', 'إثنين', 'ثلاث', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

const isArabic = (language?: string) => Boolean(language?.startsWith('ar'));

/** Month names for the given language, indexed to match `Date#getMonth()`. */
export const getMonthNames = (language?: string): string[] =>
  isArabic(language) ? MONTHS_AR : MONTHS_EN;

/** Short weekday names for the given language, indexed to match `Date#getDay()`. */
export const getWeekdayNames = (language?: string): string[] =>
  isArabic(language) ? DAYS_OF_WEEK_AR : DAYS_OF_WEEK_EN;
