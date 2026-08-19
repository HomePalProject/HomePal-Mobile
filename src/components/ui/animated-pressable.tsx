import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(require('react-native').Pressable);

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none';

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  /** Scale factor on press-in (default: 0.97) */
  pressScale?: number;
  /** Haptic feedback style on press (default: 'light') */
  hapticStyle?: HapticStyle;
  /** Optional style prop */
  style?: PressableProps['style'];
}

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 300,
  mass: 0.8,
};

function fireHaptic(style: HapticStyle) {
  'worklet';
  if (style === 'none') return;

  const map: Record<Exclude<HapticStyle, 'none'>, Haptics.ImpactFeedbackStyle> = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  };

  Haptics.impactAsync(map[style]);
}

/**
 * A drop-in replacement for Pressable that adds:
 * - Smooth Reanimated spring scale animation on press
 * - Optional haptic feedback
 *
 * Use this for all interactive elements that need to feel "physical".
 */
export function AnimatedPressable({
  pressScale = 0.97,
  hapticStyle = 'light',
  children,
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  style,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (e: any) => {
      scale.value = withSpring(pressScale, SPRING_CONFIG);
      if (hapticStyle !== 'none') {
        fireHaptic(hapticStyle);
      }
      onPressIn?.(e);
    },
    [pressScale, hapticStyle, onPressIn, scale]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      scale.value = withSpring(1, SPRING_CONFIG);
      onPressOut?.(e);
    },
    [onPressOut, scale]
  );

  return (
    <AnimatedPressableBase
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      style={
        typeof style === 'function'
          ? (state: any) => [animatedStyle, style(state)]
          : [animatedStyle, style]
      }
      {...props}>
      {children}
    </AnimatedPressableBase>
  );
}
