import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Box, Ruler, Trash2 } from 'lucide-react-native';
import { getCategoryIconConfig } from '../components/CategorySelectorSheet';
import { Icon } from '@/src/components/ui/icon';
import { usePantry } from '../hooks/usePantry';
import { env } from '@/src/config/env';
import {
  PantryImagePicker,
  QuantityStepper,
  FormDropdown,
  CategorySelectorSheet,
  UnitSelectorSheet,
  ExpirationDatePickerModal,
  ExpirationDateField,
  AddEditPantryItemHeader,
  AddEditPantryItemBottomBar,
  AISuggestionCard,
} from '../components';
import { ProductCategoryResponse, MeasuringUnitResponse } from '@/src/types/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resolveImageUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('file://') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  const baseUrl = env.API_BASE_URL.endsWith('/') ? env.API_BASE_URL : `${env.API_BASE_URL}/`;
  const relativePath = path.startsWith('/') ? path.substring(1) : path;
  return `${baseUrl}${relativePath}`;
};

interface FieldLabelProps {
  label: string;
  required?: boolean;
}

function FieldLabel({ label, required }: FieldLabelProps) {
  return (
    <Text className="text-caption mb-spacing-8 font-cairo font-bold text-text-secondary">
      {label}
      {required ? <Text className="text-status-error"> *</Text> : null}
    </Text>
  );
}

// Custom wrapper to keep standard Label layout
import { Text } from 'react-native';

// ─── Screen Component ──────────────────────────────────────────────────────────

export default function AddEditPantryItemScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId?: string }>();
  const isEditMode = Boolean(itemId);

  const { items, categories, measuringUnits, isLoading, addItem, editItem, removeItem } =
    usePantry();

  const currentItem = items.find((i) => i.id === itemId);

  // ─── States ─────────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expireDate, setExpireDate] = useState(''); // Stores YYYY-MM-DD
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryResponse | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<MeasuringUnitResponse | null>(null);

  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isUnitSheetOpen, setIsUnitSheetOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // Populate Edit Mode Details
  useEffect(() => {
    if (isEditMode && currentItem) {
      setName(currentItem.name);
      setQuantity(currentItem.quantity);
      if (currentItem.expireDate) {
        setExpireDate(currentItem.expireDate.split('T')[0]);
      }

      const matchedCategory = categories.find((c) => c.id === currentItem.categoryId);
      if (matchedCategory) setSelectedCategory(matchedCategory);

      const matchedUnit = measuringUnits.find((u) => u.id === currentItem.measuringUnitId);
      if (matchedUnit) setSelectedUnit(matchedUnit);
    }
  }, [isEditMode, currentItem, categories, measuringUnits]);

  const imageUri = selectedCategory ? resolveImageUrl(selectedCategory.imagePath) : null;

  const isFormValid =
    name.trim().length > 0 && quantity > 0 && selectedCategory !== null && selectedUnit !== null;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!isFormValid || !selectedCategory || !selectedUnit || isLoading) return;

    const payload = {
      name: name.trim(),
      quantity,
      measuringUnitId: selectedUnit.id,
      categoryId: selectedCategory.id,
      expireDate: expireDate ? new Date(expireDate).toISOString() : null,
    };

    try {
      if (isEditMode && itemId) {
        await editItem(itemId, payload);
      } else {
        await addItem(payload);
      }
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save item. Please try again.');
    }
  };

  const handleRemove = () => {
    if (!itemId) return;
    Alert.alert('Remove Item', 'Are you sure you want to remove this item from your pantry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeItem(itemId);
            router.back();
          } catch {
            Alert.alert('Error', 'Failed to remove item. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-surface">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        {/* Header */}
        <AddEditPantryItemHeader
          isEditMode={isEditMode}
          isFormValid={isFormValid}
          isLoading={isLoading}
          onBackPress={() => router.back()}
          onSubmitPress={handleSubmit}
        />

        {/* Scrollable Form */}
        <ScrollView
          className="flex-1 bg-surface-background"
          contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <PantryImagePicker
            imageUri={imageUri}
            onPickerPress={() => Alert.alert('Category Image', 'Linked to the selected category.')}
            onScanPress={() => Alert.alert('Scan Items', 'AI scanner under development.')}
          />

          {/* Item Name */}
          <View>
            <FieldLabel label="Item Name" required />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Olive Oil"
              returnKeyType="next"
              className="text-body h-14 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 font-cairo text-text-primary"
              placeholderTextColor="#9E9E9E"
              accessibilityLabel="Item name"
            />
          </View>

          {/* Quantity + Unit */}
          <View className="flex-row gap-spacing-8">
            <View className="flex-1">
              <FieldLabel label="Quantity" required />
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                unitSymbol={selectedUnit?.symbol ?? undefined}
                min={0}
              />
            </View>

            <View className="flex-1">
              <FormDropdown
                label="Unit"
                value={selectedUnit?.name}
                placeholder="Select"
                leadingIcon={Ruler}
                onPress={() => setIsUnitSheetOpen(true)}
                accessibilityLabel="Select measuring unit"
              />
            </View>
          </View>

          {/* Category */}
          <FormDropdown
            label="Category"
            value={selectedCategory?.name}
            placeholder="Select a category"
            leadingIcon={Box}
            activeIcon={
              selectedCategory ? getCategoryIconConfig(selectedCategory.name).icon : undefined
            }
            activeIconColor={
              selectedCategory ? getCategoryIconConfig(selectedCategory.name).color : undefined
            }
            onPress={() => setIsCategorySheetOpen(true)}
            accessibilityLabel="Select category"
          />

          {/* Expiration Date */}
          <ExpirationDateField value={expireDate} onPress={() => setIsDatePickerVisible(true)} />

          <AISuggestionCard />

          {/* Remove Button */}
          {isEditMode ? (
            <Pressable
              onPress={handleRemove}
              className="py-spacing-14 flex-row items-center justify-center gap-spacing-8 rounded-radius-large border border-status-error active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Remove item from pantry">
              <Icon as={Trash2} size={18} className="text-status-error" />
              <Text className="text-body font-cairo font-bold text-status-error">Remove Item</Text>
            </Pressable>
          ) : null}
        </ScrollView>

        {/* Sticky Bottom Bar */}
        {!isEditMode ? (
          <AddEditPantryItemBottomBar
            isFormValid={isFormValid}
            isLoading={isLoading}
            onSubmitPress={handleSubmit}
          />
        ) : null}
      </KeyboardAvoidingView>

      {/* Sheets & Pickers */}
      <CategorySelectorSheet
        visible={isCategorySheetOpen}
        categories={categories}
        selectedId={selectedCategory?.id}
        onSelect={setSelectedCategory}
        onClose={() => setIsCategorySheetOpen(false)}
      />

      <UnitSelectorSheet
        visible={isUnitSheetOpen}
        units={measuringUnits}
        selectedId={selectedUnit?.id}
        onSelect={setSelectedUnit}
        onClose={() => setIsUnitSheetOpen(false)}
      />

      <ExpirationDatePickerModal
        visible={isDatePickerVisible}
        value={expireDate}
        onChange={setExpireDate}
        onClose={() => setIsDatePickerVisible(false)}
      />
    </SafeAreaView>
  );
}
