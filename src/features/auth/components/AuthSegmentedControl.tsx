import React from 'react';
import { View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Text } from '@/src/components/ui/text';
import { AnimatedPressable } from '@/src/components/ui/animated-pressable';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { clearError } from '@/src/store/slices/authSlice';

type AuthSegment = {
  href: '/login' | '/register';
  label: string;
};

/**
 * Sign-in / Create-account switcher.
 *
 * Lives in the `(forms)` layout rather than inside either screen, so it is declared once
 * and stays mounted across the switch. The active segment is derived from the current
 * route instead of a prop, which keeps it honest — there is no way for the highlight and
 * the rendered form to disagree.
 */
export function AuthSegmentedControl() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['auth']);
  const authError = useAppSelector((state) => state.auth.error);

  const segments: AuthSegment[] = [
    { href: '/login', label: t('auth:login.signInBtn') },
    { href: '/register', label: t('auth:login.createAccount') },
  ];

  // `usePathname()` omits group segments, so this is normally "/login" — but matching on
  // the suffix keeps the highlight correct even if the route ever gains a parent segment.
  const isActiveHref = (href: AuthSegment['href']) => pathname.endsWith(href);

  const handlePress = (href: AuthSegment['href']) => {
    if (isActiveHref(href)) return;
    // A stale error from one form shouldn't greet you on the other.
    if (authError) dispatch(clearError());
    router.replace(href);
  };

  return (
    <View className="flex-row rounded-[12px] bg-surface-surface-variant p-1">
      {segments.map((segment) => {
        const isActive = isActiveHref(segment.href);

        return (
          <AnimatedPressable
            key={segment.href}
            onPress={() => handlePress(segment.href)}
            hapticStyle="light"
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className={[
              'flex-1 items-center justify-center rounded-[8px] py-2.5',
              isActive ? 'border border-surface-border bg-surface-surface' : '',
            ]
              .filter(Boolean)
              .join(' ')}>
            <Text
              className={[
                'font-cairo text-[14px]',
                isActive ? 'font-bold text-text-primary' : 'font-medium text-text-secondary',
              ].join(' ')}>
              {segment.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}
