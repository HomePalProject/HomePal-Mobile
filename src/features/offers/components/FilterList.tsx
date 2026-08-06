import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Store, Tag } from 'lucide-react-native';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterListProps {
  options: FilterOption[];
  selectedId?: string | null;
  onSelect: (id: string | null) => void;
  title?: string;
  type?: 'category' | 'supermarket';
}

export const FilterList: React.FC<FilterListProps> = ({
  options,
  selectedId,
  onSelect,
  title,
  type = 'category',
}) => {
  return (
    <View className="mb-4">
      {title && (
        <Text className="mb-2 px-4 font-cairo text-[13px] font-bold uppercase tracking-wider text-brand-primary">
          {title}
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelect(null)}
          className={`flex-row items-center justify-center gap-2 rounded-full px-5 py-2.5 ${
            !selectedId
              ? 'bg-brand-primary shadow-sm'
              : 'bg-surface-surfaceVariant border border-surface-border'
          }`}>
          {!selectedId && type === 'supermarket' && <Store size={16} className="text-white" />}
          <Text
            className={`font-cairo text-[14px] font-bold ${
              !selectedId ? 'text-white' : 'text-text-secondary'
            }`}>
            All {title || (type === 'category' ? 'Categories' : 'Supermarkets')}
          </Text>
        </TouchableOpacity>

        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.7}
              onPress={() => onSelect(option.id)}
              className={`flex-row items-center justify-center gap-2 rounded-full px-5 py-2.5 ${
                isSelected
                  ? 'bg-brand-primary shadow-sm'
                  : 'bg-surface-surfaceVariant border border-surface-border'
              }`}>
              {isSelected && type === 'supermarket' && <Store size={16} className="text-white" />}
              {isSelected && type === 'category' && <Tag size={16} className="text-white" />}
              <Text
                className={`font-cairo text-[14px] font-medium ${
                  isSelected ? 'font-bold text-white' : 'text-text-primary'
                }`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
