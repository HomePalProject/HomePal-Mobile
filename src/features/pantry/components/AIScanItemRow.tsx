import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Check, Calendar, ChevronDown } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { formatDisplayDate } from './ExpirationDatePickerModal';

export interface ScannedItem {
  name: string;
  quantity: number;
  categoryId: string;
  measuringUnitId: string;
  expireDate: string;
  selected: boolean;
}

interface AIScanItemRowProps {
  item: ScannedItem;
  index: number;
  onToggleSelect: (idx: number) => void;
  onUpdateField: (idx: number, field: keyof ScannedItem, val: any) => void;
  onOpenPicker: (idx: number, picker: 'category' | 'unit' | 'date') => void;
  getCategoryName: (id: string) => string;
  getUnitName: (id: string) => string;
}

export function AIScanItemRow({
  item,
  index,
  onToggleSelect,
  onUpdateField,
  onOpenPicker,
  getCategoryName,
  getUnitName,
}: AIScanItemRowProps) {
  const isSelected = item.selected;

  return (
    <View className="bg-surface-surfaceVariant mb-spacing-16 rounded-radius-large border border-surface-border p-spacing-16">
      {/* Row 1: Checkbox and Name Input */}
      <View className="my-2 flex-row items-center gap-spacing-8">
        <Pressable
          onPress={() => onToggleSelect(index)}
          className={[
            'mx-2 h-6 w-6 items-center justify-center rounded-radius-small border',
            isSelected
              ? 'border-brand-primary bg-brand-primary'
              : 'border-surface-border bg-transparent',
          ].join(' ')}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}>
          {isSelected && <Icon as={Check} size={14} className="text-text-inverse" />}
        </Pressable>

        <TextInput
          value={item.name}
          onChangeText={(t) => onUpdateField(index, 'name', t)}
          className="text-body h-12 flex-1 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 font-cairo text-text-primary"
          placeholder="Item Name"
        />
      </View>

      {/* Row 2: Quantity & Unit */}
      <View className="mt-spacing-12 flex-row gap-spacing-8">
        <TextInput
          value={String(item.quantity)}
          onChangeText={(t) =>
            onUpdateField(index, 'quantity', Number(t.replace(/[^0-9]/g, '')) || 0)
          }
          keyboardType="numeric"
          className="text-body h-12 w-16 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-8 text-center font-cairo text-text-primary"
        />

        <Pressable
          onPress={() => onOpenPicker(index, 'unit')}
          className="h-12 flex-1 flex-row items-center justify-between rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 active:opacity-85">
          <Text numberOfLines={1} className="text-body flex-1 font-cairo text-text-primary">
            {getUnitName(item.measuringUnitId)}
          </Text>
          <Icon as={ChevronDown} size={16} className="ml-1 text-text-secondary" />
        </Pressable>
      </View>

      {/* Row 3: Category & Expiry */}
      <View className="mt-spacing-8 flex-row gap-spacing-8">
        <Pressable
          onPress={() => onOpenPicker(index, 'category')}
          className="h-12 flex-1 flex-row items-center justify-between rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 active:opacity-85">
          <Text numberOfLines={1} className="text-body flex-1 font-cairo text-text-primary">
            {getCategoryName(item.categoryId)}
          </Text>
          <Icon as={ChevronDown} size={16} className="ml-1 text-text-secondary" />
        </Pressable>

        <Pressable
          onPress={() => onOpenPicker(index, 'date')}
          className="h-12 flex-1 flex-row items-center justify-between rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 active:opacity-85">
          <Icon as={Calendar} size={16} className="mr-2 text-text-secondary" />
          <Text numberOfLines={1} className="text-body flex-1 font-cairo text-text-primary">
            {item.expireDate ? formatDisplayDate(item.expireDate) : 'Date'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
