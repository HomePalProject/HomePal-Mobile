import React, { useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import { lightColors, darkColors } from '@/src/theme/colors';

export interface SkeletonProps extends ViewProps {}

export function Skeleton({ style, ...props }: SkeletonProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const layoutWidth = useSharedValue(0);
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 0 }) // reset immediately
      ),
      -1,
      false
    );
  }, [shimmerProgress]);

  const animatedGradientStyle = useAnimatedStyle(() => {
    const w = layoutWidth.value;
    if (w === 0) return { transform: [{ translateX: 0 }] };
    // Move from -width to +width
    const translateX = -w + shimmerProgress.value * (w * 2);
    return {
      transform: [{ translateX }],
    };
  });

  const baseColor = isDark ? darkColors.surface.surfaceVariant : lightColors.surface.surfaceVariant;
  // A subtle highlight color based on the theme
  const highlightColor = isDark ? '#363D3A' : '#FFFFFF';

  return (
    <View
      onLayout={(e) => {
        layoutWidth.value = e.nativeEvent.layout.width;
      }}
      style={[styles.container, { backgroundColor: baseColor }, style]}
      {...props}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedGradientStyle]}>
        <LinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});
