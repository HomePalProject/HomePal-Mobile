import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Box, Ruler, Calendar, Trash2, Plus } from 'lucide-react-native';
import { getCategoryIconConfig } from '../components/CategorySelectorSheet';
import { Icon } from '@/src/components/ui/icon';
import { usePantry } from '../hooks/usePantry';
import {
  PantryImagePicker,
  QuantityStepper,
  FormDropdown,
  CategorySelectorSheet,
  UnitSelectorSheet,
  AISuggestionCard,
} from '../components';
import { ProductCategoryResponse, MeasuringUnitResponse } from '@/src/types/api';

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  quantity: number;
  expireDate: string;
  imageUri: string | null;
  selectedCategory: ProductCategoryResponse | null;
  selectedUnit: MeasuringUnitResponse | null;
}

const INITIAL_FORM: FormState = {
  name: '',
  quantity: 1,
  expireDate: '',
  imageUri: null,
  selectedCategory: null,
  selectedUnit: null,
};

// ─── Form Field Label ─────────────────────────────────────────────────────────

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

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AddEditPantryItemScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId?: string }>();
  const isEditMode = Boolean(itemId);

  const { categories, measuringUnits, isLoading, addItem, editItem, removeItem } = usePantry();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isUnitSheetOpen, setIsUnitSheetOpen] = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  const isFormValid =
    form.name.trim().length > 0 && form.selectedCategory !== null && form.selectedUnit !== null;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const updateField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleImagePickerPress = () => {
    Alert.alert('Pick Image', 'Image picker will be integrated in a future update.');
  };

  const handleScanPress = () => {
    Alert.alert('Scan Items', 'AI scanner will be integrated in a future update.');
  };

  const handleCategorySelect = (category: ProductCategoryResponse) => {
    updateField('selectedCategory', category);
  };

  const handleUnitSelect = (unit: MeasuringUnitResponse) => {
    updateField('selectedUnit', unit);
  };

  const handleSubmit = async () => {
    if (!isFormValid || !form.selectedCategory || !form.selectedUnit) return;

    const payload = {
      name: form.name.trim(),
      quantity: form.quantity,
      measuringUnitId: form.selectedUnit.id,
      categoryId: form.selectedCategory.id,
      expireDate: form.expireDate.trim() || null,
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View className="py-spacing-12 flex-row items-center justify-between border-b border-surface-border bg-surface-surface px-spacing-16">
          <Pressable
            onPress={() => router.back()}
            className="bg-surface-surfaceVariant h-10 w-10 items-center justify-center rounded-radius-full active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Icon as={ArrowLeft} size={20} className="text-text-primary" />
          </Pressable>

          <Text className="text-heading-3 font-cairo font-bold text-text-primary">
            {isEditMode ? 'Edit Item' : 'Add Item'}
          </Text>

          {/* Save pill — shown on both Add and Edit; disabled until form is valid */}
          <Pressable
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
            className={`rounded-radius-full px-spacing-16 py-spacing-8 ${isFormValid && !isLoading ? 'bg-brand-primary' : 'bg-surface-surfaceVariant'}`}
            accessibilityRole="button"
            accessibilityLabel="Save item">
            <Text
              className={`text-body font-cairo font-bold ${isFormValid && !isLoading ? 'text-brand-onPrimary' : 'text-text-disabled'}`}>
              Save
            </Text>
          </Pressable>
        </View>

        {/* ── Scrollable Form ─────────────────────────────────────────── */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Image Picker */}
          <PantryImagePicker
            imageUri={form.imageUri}
            onPickerPress={handleImagePickerPress}
            onScanPress={handleScanPress}
          />

          {/* Item Name */}
          <View>
            <FieldLabel label="Item Name" required />
            <TextInput
              value={form.name}
              onChangeText={(text) => updateField('name', text)}
              placeholder="e.g. Olive Oil"
              returnKeyType="next"
              className="text-body h-14 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16 font-cairo text-text-primary"
              placeholderTextColor="#9E9E9E"
              accessibilityLabel="Item name"
            />
          </View>

          {/* Quantity + Unit row */}
          <View className="flex-row gap-spacing-8">
            <View className="flex-1">
              <FieldLabel label="Quantity" required />
              <QuantityStepper
                value={form.quantity}
                onChange={(val) => updateField('quantity', val)}
                unitSymbol={form.selectedUnit?.symbol ?? undefined}
                min={0}
              />
            </View>

            <View className="flex-1">
              <FormDropdown
                label="Unit"
                value={form.selectedUnit?.name}
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
            value={form.selectedCategory?.name}
            placeholder="Select a category"
            leadingIcon={Box}
            activeIcon={
              form.selectedCategory
                ? getCategoryIconConfig(form.selectedCategory.name).icon
                : undefined
            }
            activeIconColor={
              form.selectedCategory
                ? getCategoryIconConfig(form.selectedCategory.name).color
                : undefined
            }
            onPress={() => setIsCategorySheetOpen(true)}
            accessibilityLabel="Select category"
          />

          {/* Expiration Date */}
          <View>
            <View className="mb-spacing-8 flex-row items-center justify-between">
              <FieldLabel label="Expiration Date" />
              {/* Expiring Soon badge — shown in edit mode when applicable */}
            </View>
            <View className="h-14 flex-row items-center gap-spacing-8 rounded-radius-medium border border-surface-border bg-surface-surface px-spacing-16">
              <Icon as={Calendar} size={18} className="text-text-secondary" />
              <TextInput
                value={form.expireDate}
                onChangeText={(text) => updateField('expireDate', text)}
                placeholder="mm/dd/yyyy"
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
                className="text-body flex-1 font-cairo text-text-primary"
                placeholderTextColor="#9E9E9E"
                accessibilityLabel="Expiration date"
              />
            </View>
            <Text className="text-caption mt-spacing-4 font-cairo text-text-secondary">
              Optional. We'll remind you before it expires.
            </Text>
          </View>

          {/* AI Suggestion Card */}
          <AISuggestionCard />

          {/* Remove Item (Edit mode only) */}
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

        {/* ── Sticky Bottom Button ─────────────────────────────────────── */}
        {!isEditMode ? (
          <View className="border-t border-surface-border bg-surface-surface px-spacing-16 py-spacing-16">
            <Pressable
              onPress={handleSubmit}
              disabled={!isFormValid || isLoading}
              className={`flex-row items-center justify-center gap-spacing-8 rounded-radius-full py-spacing-16 ${isFormValid && !isLoading ? 'bg-brand-primary' : 'bg-surface-surfaceVariant'}`}
              accessibilityRole="button"
              accessibilityLabel="Add item to pantry">
              <Icon
                as={Plus}
                size={18}
                className={
                  isFormValid && !isLoading ? 'text-brand-onPrimary' : 'text-text-disabled'
                }
              />
              <Text
                className={`text-body font-cairo font-bold ${isFormValid && !isLoading ? 'text-brand-onPrimary' : 'text-text-disabled'}`}>
                {isLoading ? 'Saving...' : 'Add to Pantry'}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>

      {/* ── Bottom Sheet Modals ──────────────────────────────────────────── */}
      <CategorySelectorSheet
        visible={isCategorySheetOpen}
        categories={categories}
        selectedId={form.selectedCategory?.id}
        onSelect={handleCategorySelect}
        onClose={() => setIsCategorySheetOpen(false)}
      />

      <UnitSelectorSheet
        visible={isUnitSheetOpen}
        units={measuringUnits}
        selectedId={form.selectedUnit?.id}
        onSelect={handleUnitSelect}
        onClose={() => setIsUnitSheetOpen(false)}
      />
    </SafeAreaView>
  );
}
