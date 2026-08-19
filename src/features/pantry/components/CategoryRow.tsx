import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Apple,
  Egg,
  Beef,
  Wheat,
  ShoppingBag,
  Cookie,
  Coffee,
  Home,
  Package,
  Leaf,
  UtensilsCrossed,
  Sparkles,
  Droplets,
  LucideIcon,
} from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { ProductCategoryResponse } from '@/src/types/api';
import { useTranslation } from 'react-i18next';

// ─── Category Icon Config ─────────────────────────────────────────────────────

export interface CategoryIconConfig {
  icon: LucideIcon;
  /** Static NativeWind bg token for the icon container */
  bg: string;
  /** Static NativeWind text-color token for the icon */
  color: string;
}

/**
 * Maps known category name keywords to a Lucide icon and static color tokens.
 * Supports both English and Arabic category names returned from the API.
 */
export function getCategoryIconConfig(name: string): CategoryIconConfig {
  const lower = name.toLowerCase();

  // ── Arabic keyword helpers ──────────────────────────────────────────────────
  const hasAr = (...terms: string[]) => terms.some((t) => name.includes(t));

  // ── Produce / Fruits & Vegetables ─────────────────────────────────────────
  if (
    lower.includes('produce') ||
    lower.includes('fruit') ||
    lower.includes('vegetable') ||
    lower.includes('veg') ||
    lower.includes('fresh') ||
    hasAr('خضار', 'خضروات', 'فواكه', 'فاكهة', 'طازج', 'طازجة', 'الخضروات', 'الفواكه')
  ) {
    return { icon: Apple, bg: 'bg-brand-primary-container', color: 'text-brand-primary' };
  }

  // ── Dairy & Eggs ───────────────────────────────────────────────────────────
  if (
    lower.includes('dairy') ||
    lower.includes('egg') ||
    lower.includes('milk') ||
    lower.includes('cheese') ||
    lower.includes('butter') ||
    lower.includes('yogurt') ||
    hasAr('ألبان', 'البان', 'لبن', 'حليب', 'بيض', 'جبن', 'زبدة', 'اجبان')
  ) {
    return { icon: Egg, bg: 'bg-status-error-container', color: 'text-status-error' };
  }

  // ── Meat & Poultry ─────────────────────────────────────────────────────────
  if (
    lower.includes('meat') ||
    lower.includes('poultry') ||
    lower.includes('chicken') ||
    lower.includes('beef') ||
    lower.includes('fish') ||
    lower.includes('seafood') ||
    lower.includes('lamb') ||
    hasAr('لحوم', 'لحم', 'دواجن', 'دجاج', 'أسماك', 'اسماك', 'سمك', 'ديك', 'ديك رومي')
  ) {
    return { icon: Beef, bg: 'bg-status-error-container', color: 'text-status-error' };
  }

  // ── Pasta & Noodles ────────────────────────────────────────────────────────
  // (checked before bakery to avoid 'مكرونة'/'حبوب' false-matching bakery)
  if (
    lower.includes('pasta') ||
    lower.includes('noodle') ||
    lower.includes('macaroni') ||
    lower.includes('spaghetti') ||
    hasAr('معكرونة', 'مكرونة', 'نودلز', 'ماكرونة', 'سباغيتي')
  ) {
    return { icon: Wheat, bg: 'bg-brand-accent-container', color: 'text-brand-accent' };
  }

  // ── Legumes & Beans ────────────────────────────────────────────────────────
  if (
    lower.includes('legume') ||
    lower.includes('bean') ||
    lower.includes('lentil') ||
    lower.includes('chickpea') ||
    lower.includes('pea') ||
    lower.includes('pulse') ||
    hasAr('بقوليات', 'بقولية', 'فاصوليا', 'عدس', 'حمص', 'فول', 'بازلاء')
  ) {
    return { icon: Leaf, bg: 'bg-brand-primary-container', color: 'text-brand-primary' };
  }

  // ── Oils & Fats ────────────────────────────────────────────────────────────
  if (
    lower.includes('oil') ||
    lower.includes('fat') ||
    lower.includes('ghee') ||
    lower.includes('olive') ||
    lower.includes('sunflower') ||
    hasAr('زيوت', 'زيت', 'دهون', 'دهن', 'سمن', 'زبدة صافية', 'شحوم')
  ) {
    return { icon: Droplets, bg: 'bg-brand-accent-container', color: 'text-brand-accent' };
  }

  // ── Ready Meals ────────────────────────────────────────────────────────────
  if (
    lower.includes('ready') ||
    lower.includes('prepared') ||
    lower.includes('instant') ||
    lower.includes('pre-cooked') ||
    lower.includes('meal kit') ||
    hasAr(
      'وجبات جاهزة',
      'وجبة جاهزة',
      'وجبات سريعة',
      'جاهزة للأكل',
      'جاهز للأكل',
      'الوجبات الجاهزة'
    )
  ) {
    return { icon: UtensilsCrossed, bg: 'bg-surface-surfaceVariant', color: 'text-text-secondary' };
  }

  // ── Personal Care & Beauty ─────────────────────────────────────────────────
  if (
    lower.includes('personal care') ||
    lower.includes('beauty') ||
    lower.includes('hygiene') ||
    lower.includes('shampoo') ||
    lower.includes('cosmetic') ||
    lower.includes('grooming') ||
    hasAr('عناية شخصية', 'العناية الشخصية', 'جمال', 'نظافة شخصية', 'شامبو', 'مستحضرات', 'تجميل')
  ) {
    return { icon: Sparkles, bg: 'bg-surface-surfaceVariant', color: 'text-brand-primary' };
  }

  // ── Breakfast Foods ────────────────────────────────────────────────────────
  if (
    lower.includes('breakfast') ||
    lower.includes('jam') ||
    lower.includes('honey') ||
    lower.includes('granola') ||
    lower.includes('oatmeal') ||
    lower.includes('muesli') ||
    hasAr(
      'إفطار',
      'افطار',
      'فطور',
      'فطار',
      'مربى',
      'عسل',
      'غرانولا',
      'حبوب الإفطار',
      'أطعمة الإفطار'
    )
  ) {
    return { icon: Cookie, bg: 'bg-brand-accent-container', color: 'text-brand-accent' };
  }

  // ── Bakery / Grains ────────────────────────────────────────────────────────
  if (
    lower.includes('grain') ||
    lower.includes('bread') ||
    lower.includes('bakery') ||
    lower.includes('rice') ||
    lower.includes('dough') ||
    lower.includes('cereal') ||
    hasAr('مخبوزات', 'خبز', 'أرز', 'ارز', 'حبوب', 'عجين', 'بسكويت', 'كيك', 'معجنات')
  ) {
    return { icon: Wheat, bg: 'bg-brand-accent-container', color: 'text-brand-accent' };
  }

  // ── Beverages ──────────────────────────────────────────────────────────────
  if (
    lower.includes('beverage') ||
    lower.includes('beaverage') || // API typo tolerance
    lower.includes('drink') ||
    lower.includes('juice') ||
    lower.includes('coffee') ||
    lower.includes('tea') ||
    lower.includes('water') ||
    lower.includes('soda') ||
    lower.includes('smoothie') ||
    hasAr('مشروبات', 'مشروب', 'عصير', 'قهوة', 'شاي', 'مياه', 'ماء', 'عصائر')
  ) {
    return { icon: Coffee, bg: 'bg-brand-primary-container', color: 'text-brand-primary' };
  }

  // ── Snacks & Sweets ────────────────────────────────────────────────────────
  if (
    lower.includes('snack') ||
    lower.includes('sweet') ||
    lower.includes('nut') ||
    lower.includes('chip') ||
    lower.includes('cracker') ||
    lower.includes('chocolate') ||
    lower.includes('candy') ||
    lower.includes('cookie') ||
    hasAr('تسالي', 'مكسرات', 'حلويات', 'حلوى', 'شوكولاتة', 'حلو', 'سناك')
  ) {
    return { icon: Cookie, bg: 'bg-brand-accent-container', color: 'text-brand-accent' };
  }

  // ── Sauces, Condiments & Spices ────────────────────────────────────────────
  if (
    lower.includes('sauce') ||
    lower.includes('condiment') ||
    lower.includes('spice') ||
    lower.includes('herb') ||
    lower.includes('seasoning') ||
    lower.includes('ketchup') ||
    lower.includes('vinegar') ||
    hasAr('صلصات', 'صلصة', 'توابل', 'بهارات', 'تابل', 'أعشاب', 'خل', 'كاتشب')
  ) {
    return { icon: ShoppingBag, bg: 'bg-surface-surfaceVariant', color: 'text-text-secondary' };
  }

  // ── Canned & Preserved / Pantry Staples ───────────────────────────────────
  if (
    lower.includes('canned') ||
    lower.includes('preserved') ||
    lower.includes('pantry') ||
    lower.includes('staple') ||
    lower.includes('essential') ||
    lower.includes('pickle') ||
    hasAr('معلبات', 'معلب', 'محفوظ', 'محفوظة', 'مخلل', 'مخللات', 'أساسيات', 'الأطعمة المعلبة')
  ) {
    return { icon: ShoppingBag, bg: 'bg-surface-surfaceVariant', color: 'text-text-secondary' };
  }

  // ── Household & Cleaning ───────────────────────────────────────────────────
  if (
    lower.includes('household') ||
    lower.includes('clean') ||
    lower.includes('laundry') ||
    lower.includes('detergent') ||
    lower.includes('soap') ||
    hasAr('منزلي', 'منزلية', 'منظفات', 'غسيل', 'صابون', 'تنظيف', 'لوازم منزلية')
  ) {
    return { icon: Home, bg: 'bg-surface-surfaceVariant', color: 'text-text-secondary' };
  }

  // ── Frozen Food ────────────────────────────────────────────────────────────
  if (
    lower.includes('frozen') ||
    lower.includes('freeze') ||
    hasAr('مجمد', 'مجمدة', 'مجمدات', 'تجميد')
  ) {
    return { icon: Package, bg: 'bg-surface-surfaceVariant', color: 'text-brand-primary' };
  }

  return { icon: Package, bg: 'bg-surface-surfaceVariant', color: 'text-text-secondary' };
}

/**
 * Maps a category name (English or Arabic) to its i18n description key
 * inside pantry.categoryDescriptions.
 * Returns null if no key can be determined (use API description as fallback).
 */
export function getCategoryDescriptionKey(name: string): string | null {
  const lower = name.toLowerCase();
  const hasAr = (...terms: string[]) => terms.some((t) => name.includes(t));

  if (
    lower.includes('dairy') ||
    lower.includes('egg') ||
    lower.includes('milk') ||
    lower.includes('cheese') ||
    lower.includes('butter') ||
    lower.includes('yogurt') ||
    hasAr('ألبان', 'البان', 'لبن', 'حليب', 'بيض', 'جبن', 'زبدة')
  )
    return 'categoryDescriptions.dairy';
  if (
    lower.includes('produce') ||
    lower.includes('fruit') ||
    lower.includes('vegetable') ||
    lower.includes('veg') ||
    lower.includes('fresh') ||
    hasAr('خضار', 'خضروات', 'فواكه', 'فاكهة', 'طازج', 'طازجة', 'الخضروات')
  )
    return 'categoryDescriptions.produce';
  if (
    lower.includes('meat') ||
    lower.includes('poultry') ||
    lower.includes('chicken') ||
    lower.includes('beef') ||
    lower.includes('fish') ||
    lower.includes('seafood') ||
    lower.includes('lamb') ||
    hasAr('لحوم', 'لحم', 'دواجن', 'دجاج', 'أسماك', 'اسماك', 'سمك', 'ديك')
  )
    return 'categoryDescriptions.meat';
  // ── Pasta & Noodles ────────────────────────────────────────────────────────
  if (
    lower.includes('pasta') ||
    lower.includes('noodle') ||
    lower.includes('macaroni') ||
    lower.includes('spaghetti') ||
    hasAr('معكرونة', 'مكرونة', 'نودلز', 'ماكرونة', 'سباغيتي')
  )
    return 'categoryDescriptions.pasta';

  // ── Legumes & Beans ────────────────────────────────────────────────────────
  if (
    lower.includes('legume') ||
    lower.includes('bean') ||
    lower.includes('lentil') ||
    lower.includes('chickpea') ||
    lower.includes('pea') ||
    lower.includes('pulse') ||
    hasAr('بقوليات', 'بقولية', 'فاصوليا', 'عدس', 'حمص', 'فول', 'بازلاء')
  )
    return 'categoryDescriptions.legumes';

  // ── Oils & Fats ────────────────────────────────────────────────────────────
  if (
    lower.includes('oil') ||
    lower.includes('fat') ||
    lower.includes('ghee') ||
    lower.includes('olive') ||
    lower.includes('sunflower') ||
    hasAr('زيوت', 'زيت', 'دهون', 'دهن', 'سمن', 'شحوم')
  )
    return 'categoryDescriptions.oils';

  // ── Ready Meals ────────────────────────────────────────────────────────────
  if (
    lower.includes('ready') ||
    lower.includes('prepared') ||
    lower.includes('instant') ||
    lower.includes('pre-cooked') ||
    hasAr('وجبات جاهزة', 'وجبة جاهزة', 'وجبات سريعة', 'جاهزة للأكل', 'الوجبات الجاهزة')
  )
    return 'categoryDescriptions.readyMeals';

  // ── Personal Care & Beauty ─────────────────────────────────────────────────
  if (
    lower.includes('personal care') ||
    lower.includes('beauty') ||
    lower.includes('hygiene') ||
    lower.includes('shampoo') ||
    lower.includes('cosmetic') ||
    lower.includes('grooming') ||
    hasAr('عناية شخصية', 'العناية الشخصية', 'جمال', 'نظافة شخصية', 'شامبو', 'مستحضرات', 'تجميل')
  )
    return 'categoryDescriptions.personalCare';

  // ── Breakfast Foods ────────────────────────────────────────────────────────
  if (
    lower.includes('breakfast') ||
    lower.includes('jam') ||
    lower.includes('honey') ||
    lower.includes('granola') ||
    lower.includes('oatmeal') ||
    lower.includes('muesli') ||
    hasAr(
      'إفطار',
      'افطار',
      'فطور',
      'فطار',
      'مربى',
      'عسل',
      'غرانولا',
      'حبوب الإفطار',
      'أطعمة الإفطار'
    )
  )
    return 'categoryDescriptions.breakfast';

  // ── Grains / Bakery ────────────────────────────────────────────────────────
  if (
    lower.includes('bakery') ||
    lower.includes('bread') ||
    lower.includes('grain') ||
    lower.includes('rice') ||
    lower.includes('dough') ||
    lower.includes('cereal') ||
    hasAr('مخبوزات', 'خبز', 'أرز', 'ارز', 'حبوب', 'عجين', 'معجنات')
  )
    return 'categoryDescriptions.bakery';
  if (
    lower.includes('beverage') ||
    lower.includes('beaverage') ||
    lower.includes('drink') ||
    lower.includes('juice') ||
    lower.includes('coffee') ||
    lower.includes('tea') ||
    lower.includes('water') ||
    lower.includes('soda') ||
    hasAr('مشروبات', 'مشروب', 'عصير', 'قهوة', 'شاي', 'مياه', 'ماء')
  )
    return 'categoryDescriptions.beverages';
  if (
    lower.includes('snack') ||
    lower.includes('sweet') ||
    lower.includes('nut') ||
    lower.includes('chip') ||
    lower.includes('cracker') ||
    lower.includes('chocolate') ||
    lower.includes('candy') ||
    hasAr('تسالي', 'مكسرات', 'حلويات', 'حلوى', 'شوكولاتة', 'سناك')
  )
    return 'categoryDescriptions.snacks';
  if (
    lower.includes('sauce') ||
    lower.includes('condiment') ||
    lower.includes('ketchup') ||
    lower.includes('vinegar') ||
    lower.includes('mayonnaise') ||
    hasAr('صلصات', 'صلصة', 'كاتشب', 'خل', 'مايونيز')
  )
    return 'categoryDescriptions.sauces';
  if (
    lower.includes('spice') ||
    lower.includes('herb') ||
    lower.includes('seasoning') ||
    hasAr('توابل', 'بهارات', 'تابل', 'أعشاب', 'التوابل')
  )
    return 'categoryDescriptions.spices';
  if (
    lower.includes('canned') ||
    lower.includes('preserved') ||
    lower.includes('pickle') ||
    lower.includes('pantry') ||
    lower.includes('staple') ||
    lower.includes('essential') ||
    lower.includes('dry good') ||
    hasAr(
      'معلبات',
      'معلب',
      'محفوظ',
      'محفوظة',
      'مخلل',
      'مخللات',
      'مؤن',
      'بضائع',
      'جافة',
      'الأطعمة المعلبة'
    )
  )
    return 'categoryDescriptions.canned';
  if (
    lower.includes('frozen') ||
    lower.includes('freeze') ||
    hasAr('مجمد', 'مجمدة', 'مجمدات', 'تجميد')
  )
    return 'categoryDescriptions.frozen';
  if (
    lower.includes('household') ||
    lower.includes('clean') ||
    lower.includes('laundry') ||
    lower.includes('detergent') ||
    lower.includes('soap') ||
    hasAr('منزلي', 'منزلية', 'منظفات', 'غسيل', 'صابون', 'لوازم منزلية')
  )
    return 'categoryDescriptions.household';

  return null;
}

// ─── Category Row Component ───────────────────────────────────────────────────

export interface CategoryRowProps {
  item: ProductCategoryResponse;
  isSelected: boolean;
  onPress: () => void;
}

export function CategoryRow({ item, isSelected, onPress }: CategoryRowProps) {
  const { icon, bg, color } = getCategoryIconConfig(item.name);
  const { t } = useTranslation('pantry');

  // Resolve description from i18n catalog first; fall back to raw API description
  const descriptionKey = getCategoryDescriptionKey(item.name);
  const localizedDescription = descriptionKey ? t(descriptionKey) : (item.description ?? null);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-spacing-16 px-spacing-16 py-spacing-16 active:opacity-70"
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}>
      {/* Category Icon with soft tinted background */}
      {/* <View className={`h-10 w-10 items-center justify-center rounded-radius-full ${bg}`}> */}
      <View className="h-12 w-12 items-center justify-center rounded-s-radius-medium bg-surface-background">
        <Icon as={icon} size={26} className={color} />
      </View>

      {/* Name + Optional Description */}
      <View className="flex-1">
        <Text className="text-body font-cairo font-bold text-text-primary">{item.name}</Text>
        {localizedDescription ? (
          <Text numberOfLines={1} className="text-caption font-cairo text-text-secondary">
            {localizedDescription}
          </Text>
        ) : null}
      </View>

      {/* Selection Indicator: solid circle (selected) vs empty border (unselected) */}
      {isSelected ? (
        <View className="h-6 w-6 rounded-radius-full bg-brand-primary" />
      ) : (
        <View className="h-6 w-6 rounded-radius-full border-2 border-surface-border" />
      )}
    </Pressable>
  );
}
