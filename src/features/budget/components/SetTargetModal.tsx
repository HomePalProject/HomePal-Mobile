import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { TextField } from '@/src/components/ui/text-field';
import { Button } from '@/src/components/ui/button';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
interface SetTargetModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (targetAmount: number, notes: string | null) => Promise<void>;
  initialAmount?: number;
  initialNotes?: string | null;
  isLoading?: boolean;
}

export function SetTargetModal({
  visible,
  onClose,
  onSave,
  initialAmount,
  initialNotes,
  isLoading = false,
}: SetTargetModalProps) {
  const { t } = useTranslation('budget');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>(undefined);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      setAmount(initialAmount && initialAmount > 0 ? initialAmount.toString() : '');
      setNotes(initialNotes || '');
      setValidationError(undefined);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, initialAmount, initialNotes]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount.trim());
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError(t('invalidAmount', 'Please enter a valid amount greater than 0.'));
      return;
    }
    setValidationError(undefined);
    try {
      await onSave(parsedAmount, notes.trim() || null);
      onClose();
    } catch (err) {
      // Error handled by Redux state
    }
  };

  return (
    <AppBottomSheet
      ref={bottomSheetRef}
      onDismiss={onClose}
      enablePanDownToClose
      snapPoints={['55%']}>
      <View className="px-spacing-24 pb-spacing-32">
        <Text className="mb-spacing-16 text-center font-cairo text-lg font-bold text-text-primary">
          {t('setMonthlyBudget', 'Set Monthly Budget')}
        </Text>

        <View className="gap-spacing-16">
          <TextField
            label={t('targetAmountEgp', 'Target Amount (EGP)')}
            value={amount}
            onChangeText={(val) => {
              setAmount(val);
              if (validationError) setValidationError(undefined);
            }}
            keyboardType="numeric"
            placeholder={t('amountPlaceholder', 'e.g. 5000')}
            error={validationError}
            editable={!isLoading}
          />

          <TextField
            label={t('notesOptional', 'Notes (Optional)')}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('notesPlaceholder', 'e.g. Grocery limit, electric bills...')}
            multiline
            numberOfLines={3}
            inputClassName="h-[80px] py-spacing-8 text-start"
            style={{ textAlignVertical: 'top' }}
            editable={!isLoading}
          />
        </View>

        <View className="mt-spacing-16 gap-spacing-16">
          <Button onPress={handleSave} isLoading={isLoading}>
            <Text className="text-white">{t('saveTarget', 'Save Target')}</Text>
          </Button>
          <Button
            variant="outline"
            onPress={() => bottomSheetRef.current?.dismiss()}
            disabled={isLoading}>
            <Text className="text-text-primary">{t('cancel', 'Cancel')}</Text>
          </Button>
        </View>
      </View>
    </AppBottomSheet>
  );
}
