import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Icon } from '@/src/components/ui/icon';
import { Check, X, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { locationsService } from '@/src/services/api/locations.service';
import { GovernorateResponse, CityResponse } from '@/src/types/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface LocationSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'governorate' | 'city';
  governorateId?: string | null;
  selectedId: string | null;
  onSelect: (id: string, name: string) => void;
  title?: string;
}

export function LocationSelectorModal({
  visible,
  onClose,
  type,
  governorateId,
  selectedId,
  onSelect,
  title,
}: LocationSelectorModalProps) {
  const { t } = useTranslation('common');
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setSearchQuery(''); // Reset search on open

    const fetchData = async () => {
      try {
        if (type === 'governorate') {
          const data = await locationsService.getGovernorates();
          if (isMounted) setItems(data);
        } else if (type === 'city') {
          if (!governorateId) {
            if (isMounted) {
              setItems([]);
              setError(
                t('locationSelector.selectGovernorateFirst', 'Please select a governorate first.')
              );
            }
            return;
          }
          const data = await locationsService.getCities(governorateId);
          if (isMounted) setItems(data);
        }
      } catch (err: any) {
        if (isMounted)
          setError(err.message || t('locationSelector.fetchError', 'Failed to load data.'));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [visible, type, governorateId, t]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [items, searchQuery]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        className="flex-1 justify-center bg-black/50 px-spacing-24"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View className="max-h-[80%] w-full overflow-hidden rounded-3xl bg-surface-surface">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
            <Text className="font-cairo text-[18px] font-bold text-text-primary">
              {title ||
                (type === 'governorate'
                  ? t('locationSelector.governorate', 'Governorate')
                  : t('locationSelector.city', 'City'))}
            </Text>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-surface-surface-variant active:opacity-70">
              <Icon as={X} size={16} className="text-text-primary" />
            </Pressable>
          </View>

          {/* Search Bar (Only for cities as there can be many) */}
          {type === 'city' && !error && (
            <View className="border-b border-surface-border px-6 py-4">
              <View className="px-spacing-12 h-[44px] flex-row items-center rounded-radius-medium border border-surface-border bg-surface-background">
                <Icon as={Search} size={18} className="mr-2 text-text-secondary" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={t('locationSelector.searchPlaceholder', 'Search...')}
                  placeholderTextColor="#A8A29B"
                  className="flex-1 font-cairo text-sm text-text-primary"
                  autoCorrect={false}
                />
              </View>
            </View>
          )}

          {/* Content */}
          <View className="min-h-[200px] flex-1">
            {loading ? (
              <View className="flex-1 items-center justify-center py-8">
                <ActivityIndicator size="large" color="#356859" />
              </View>
            ) : error ? (
              <View className="flex-1 items-center justify-center px-6 py-8">
                <Text className="text-center font-cairo text-sm text-status-error">{error}</Text>
              </View>
            ) : filteredItems.length === 0 ? (
              <View className="flex-1 items-center justify-center px-6 py-8">
                <Text className="text-center font-cairo text-sm text-text-secondary">
                  {t('locationSelector.noResults', 'No results found.')}
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 20 }}>
                {filteredItems.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        onSelect(item.id, item.name);
                        onClose();
                      }}
                      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                      className="flex-row items-center justify-between border-b border-surface-border px-6 py-4">
                      <Text
                        className={`font-cairo text-[15px] ${
                          isSelected ? 'font-bold text-brand-primary' : 'text-text-primary'
                        }`}>
                        {item.name}
                      </Text>
                      {isSelected && <Icon as={Check} size={18} className="text-brand-primary" />}
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
