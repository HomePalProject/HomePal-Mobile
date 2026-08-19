import React, { forwardRef, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { MeasuringUnitResponse } from '@/src/types/api';
import { UnitRow } from './UnitRow';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import { BottomSheetModal, BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';

export interface UnitSelectorSheetProps {
  units: MeasuringUnitResponse[];
  selectedId?: string | null;
  onSelect: (unit: MeasuringUnitResponse) => void;
  onClose?: () => void;
}

export const UnitSelectorSheet = forwardRef<BottomSheetModal, UnitSelectorSheetProps>(
  ({ units, selectedId, onSelect, onClose }, ref) => {
    const { t } = useTranslation('pantry');
    const [searchQuery, setSearchQuery] = useState('');

    const dismiss = () => {
      if (ref && typeof ref === 'object') {
        ref.current?.dismiss();
      }
    };

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
      dismiss();
    };

    return (
      <AppBottomSheet ref={ref} onDismiss={onClose} enablePanDownToClose snapPoints={['80%']}>
        {/* Header */}
        <View className="py-spacing-12 flex-row items-center justify-between px-spacing-16">
          <Text className="text-heading-3 font-cairo font-bold text-text-primary">
            {t('selectUnit', 'Select Unit')}
          </Text>

          <Pressable
            onPress={dismiss}
            className="bg-surface-surfaceVariant h-8 w-8 items-center justify-center rounded-radius-full active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Close">
            <Icon as={X} size={16} className="text-text-secondary" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="bg-surface-surfaceVariant px-spacing-12 py-spacing-10 mx-spacing-16 mb-spacing-16 flex-row items-center gap-spacing-8 rounded-radius-large border border-surface-border">
          <Icon as={Search} size={16} className="text-text-secondary" />

          <BottomSheetTextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchUnits', 'Search units...')}
            className="text-body flex-1 font-cairo text-text-primary"
            placeholderTextColor="#9E9E9E"
            autoCorrect={false}
          />
        </View>

        {/* Unit List — pill cards, no flat separators */}
        <BottomSheetFlatList
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
              <Text className="text-body font-cairo text-text-secondary">
                {t('noUnitsFound', 'No units found')}
              </Text>
            </View>
          )}
        />
      </AppBottomSheet>
    );
  }
);

UnitSelectorSheet.displayName = 'UnitSelectorSheet';
