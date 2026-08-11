import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { MeasuringUnitResponse } from '@/src/types/api';
import { UnitRow } from './UnitRow';

export interface UnitSelectorSheetProps {
  visible: boolean;
  units: MeasuringUnitResponse[];
  selectedId?: string | null;
  onSelect: (unit: MeasuringUnitResponse) => void;
  onClose: () => void;
}

export function UnitSelectorSheet({
  visible,
  units,
  selectedId,
  onSelect,
  onClose,
}: UnitSelectorSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) {
      return units;
    }

    const normalizedQuery = searchQuery.toLowerCase();

    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(normalizedQuery) ||
        (unit.symbol && unit.symbol.toLowerCase().includes(normalizedQuery))
    );
  }, [units, searchQuery]);

  const handleSelect = (unit: MeasuringUnitResponse) => {
    onSelect(unit);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        {/* Backdrop — tap to dismiss */}
        <Pressable
          className="absolute inset-0 bg-surface-background py-2"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close unit selector"
        />

        {/* Bottom Sheet Container */}
        <SafeAreaView
          edges={['bottom']}
          className="h-[80%] w-full overflow-hidden rounded-t-radius-large bg-surface-surface pt-3">
          {/* Drag Handle */}
          <View className="pt-spacing-12 items-center pb-spacing-4">
            <View className="h-1.5 w-10 rounded-radius-full bg-surface-border" />
          </View>

          {/* Header */}
          <View className="py-spacing-12 flex-row items-center justify-between px-spacing-16">
            <Text className="text-heading-3 font-cairo font-bold text-text-primary">
              Select Unit
            </Text>

            <Pressable
              onPress={onClose}
              className="bg-surface-surfaceVariant h-8 w-8 items-center justify-center rounded-radius-full active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Close">
              <Icon as={X} size={16} className="text-text-secondary" />
            </Pressable>
          </View>

          {/* Search */}
          <View className="bg-surface-surfaceVariant px-spacing-12 py-spacing-10 mx-spacing-16 mb-spacing-16 flex-row items-center gap-spacing-8 rounded-radius-large border border-surface-border">
            <Icon as={Search} size={16} className="text-text-secondary" />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search units..."
              className="text-body flex-1 font-cairo text-text-primary"
              placeholderTextColor="#9E9E9E"
              autoCorrect={false}
            />
          </View>

          {/* Unit List — pill cards, no flat separators */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 48,
            }}
            renderItem={({ item }) => (
              <UnitRow
                item={item}
                isSelected={item.id === selectedId}
                onPress={() => handleSelect(item)}
              />
            )}
            ListEmptyComponent={() => (
              <View className="items-center py-spacing-48">
                <Text className="text-body font-cairo text-text-secondary">No units found</Text>
              </View>
            )}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}
