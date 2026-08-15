import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Plus, X, ScanLine, Package } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';

interface PantryFABProps {
  onAddPress: () => void;
  onScanPress: () => void;
}

export function PantryFAB({ onAddPress, onScanPress }: PantryFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleAddPress = () => {
    setIsOpen(false);
    Animated.spring(animation, { toValue: 0, useNativeDriver: true }).start();
    onAddPress();
  };

  const handleScanPress = () => {
    setIsOpen(false);
    Animated.spring(animation, { toValue: 0, useNativeDriver: true }).start();
    onScanPress();
  };

  const scanItemStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const addItemStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  return (
    <View className="absolute bottom-6 end-4 items-end gap-spacing-8">
      {/* Speed-dial: Scan Items or Receipt */}
      <Animated.View style={scanItemStyle} pointerEvents={isOpen ? 'auto' : 'none'}>
        <Pressable
          onPress={handleScanPress}
          className="flex-row items-center gap-spacing-4 active:scale-95 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Scan Items or Receipt">
          {/* Pill Label */}
          <View className="rounded-radius-full border border-surface-border bg-surface-surface px-spacing-16 py-spacing-8 shadow-md">
            <Text className="text-body font-cairo font-bold text-text-primary">
              Scan Items or Receipt
            </Text>
          </View>
          {/* Amber Icon Button */}
          <View className="h-12 w-12 items-center justify-center rounded-radius-full bg-brand-primary shadow-md">
            <Icon as={ScanLine} size={22} className="text-text-inverse" />
          </View>
        </Pressable>
      </Animated.View>

      {/* Speed-dial: Add Item */}
      <Animated.View style={addItemStyle} pointerEvents={isOpen ? 'auto' : 'none'}>
        <Pressable
          onPress={handleAddPress}
          className="flex-row items-center gap-spacing-4 active:scale-95 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Add Item">
          {/* Pill Label */}
          <View className="rounded-radius-full border border-surface-border bg-surface-surface px-spacing-16 py-spacing-8 shadow-md">
            <Text className="text-body font-cairo font-bold text-text-primary">Add Item</Text>
          </View>
          {/* Green Icon Button */}
          <View className="h-12 w-12 items-center justify-center rounded-radius-full bg-brand-primary shadow-md">
            <Icon as={Package} size={22} className="text-text-inverse" />
          </View>
        </Pressable>
      </Animated.View>

      {/* Main FAB */}
      <Pressable
        onPress={toggleMenu}
        className="h-14 w-14 items-center justify-center rounded-radius-full bg-brand-primary shadow-lg active:scale-90 active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={isOpen ? 'Close menu' : 'Open add item menu'}>
        {isOpen ? (
          <Icon as={X} size={24} className="text-text-inverse" />
        ) : (
          <Icon as={Plus} size={24} className="text-text-inverse" />
        )}
      </Pressable>
    </View>
  );
}
