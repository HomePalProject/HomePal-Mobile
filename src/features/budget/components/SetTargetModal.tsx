import React, { useState, useEffect } from 'react';
import { Modal, View, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { TextField } from '@/src/components/ui/text-field';
import { Button } from '@/src/components/ui/button';

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
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      setAmount(initialAmount && initialAmount > 0 ? initialAmount.toString() : '');
      setNotes(initialNotes || '');
      setValidationError(undefined);
    }
  }, [visible, initialAmount, initialNotes]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount.trim());
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Please enter a valid amount greater than 0.');
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
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center bg-black/50 px-spacing-16">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full max-w-[340px] rounded-radius-large border border-surface-border bg-surface-surface p-spacing-24 shadow-xl">
          <Text className="mb-spacing-16 text-center font-cairo text-lg font-bold text-text-primary">
            Set Monthly Budget
          </Text>

          <View className="gap-spacing-16">
            <TextField
              label="Target Amount (EGP)"
              value={amount}
              onChangeText={(val) => {
                setAmount(val);
                if (validationError) setValidationError(undefined);
              }}
              keyboardType="numeric"
              placeholder="e.g. 5000"
              error={validationError}
              editable={!isLoading}
            />

            <TextField
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Grocery limit, electric bills..."
              multiline
              numberOfLines={3}
              inputClassName="h-[80px] py-spacing-8 text-start"
              style={{ textAlignVertical: 'top' }}
              editable={!isLoading}
            />
          </View>

          <View className="mt-spacing-16 gap-spacing-16">
            <Button onPress={handleSave} isLoading={isLoading}>
              <Text className="text-white">Save Target</Text>
            </Button>
            <Button variant="outline" onPress={onClose} disabled={isLoading}>
              <Text className="text-text-primary">Cancel</Text>
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
