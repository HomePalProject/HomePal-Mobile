import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { darkColors, lightColors } from '@/src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

export interface AppBottomSheetProps extends Omit<BottomSheetModalProps, 'ref'> {
  children: React.ReactNode;
  useSafeArea?: boolean;
}

export const AppBottomSheet = forwardRef<BottomSheetModal, AppBottomSheetProps>(
  (
    {
      children,
      snapPoints,
      enableDynamicSizing: enableDynamicSizingProp,
      backdropComponent,
      backgroundStyle,
      handleIndicatorStyle,
      useSafeArea = true,
      ...props
    },
    ref
  ) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    const enableDynamicSizing = enableDynamicSizingProp ?? snapPoints === undefined;

    const Wrapper = enableDynamicSizing ? BottomSheetView : View;
    const wrapperStyle = {
      ...(enableDynamicSizing ? null : { flex: 1 }),
      paddingBottom: useSafeArea ? insets.bottom : 0,
    };

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.6}
        />
      ),
      []
    );

    const themeBgColor = isDark ? darkColors.surface.surface : lightColors.surface.surface;
    const themeIndicatorColor = isDark ? darkColors.surface.border : lightColors.surface.border;

    const flatBgStyle = useMemo(
      () =>
        StyleSheet.flatten([{ backgroundColor: themeBgColor, borderRadius: 24 }, backgroundStyle]),
      [themeBgColor, backgroundStyle]
    );

    const flatIndicatorStyle = useMemo(
      () =>
        StyleSheet.flatten([
          { backgroundColor: themeIndicatorColor, width: 48, height: 6 },
          handleIndicatorStyle,
        ]),
      [themeIndicatorColor, handleIndicatorStyle]
    );

    return (
      <BottomSheetModal
        ref={ref}
        stackBehavior="push"
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        backdropComponent={backdropComponent || renderBackdrop}
        backgroundStyle={flatBgStyle}
        handleIndicatorStyle={flatIndicatorStyle}
        {...props}>
        <Wrapper style={wrapperStyle}>{children}</Wrapper>
      </BottomSheetModal>
    );
  }
);

AppBottomSheet.displayName = 'AppBottomSheet';
