import React, { useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, Modal } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { TextField } from '@/src/components/ui/text-field';
import { Button } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';

interface AddExpenseFormProps {
  onAddExpense: (title: string, amount: number, date: string) => Promise<void>;
  isLoading?: boolean;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Format date as YYYY-MM-DD
const formatDateStr = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Format date for display as MM/DD/YYYY
const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [yyyy, mm, dd] = dateStr.split('-');
  return `${mm}/${dd}/${yyyy}`;
};

export function AddExpenseForm({ onAddExpense, isLoading = false }: AddExpenseFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dateStr, setDateStr] = useState(() => formatDateStr(new Date()));
  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(() => new Date());

  const handleAmountChange = (val: string) => {
    // Strip non-numeric and non-dot characters
    const sanitized = val.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point exists
    const parts = sanitized.split('.');
    const finalVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    setAmount(finalVal);
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handlePrevMonth = () => {
    const prev = new Date(pickerDate);
    prev.setMonth(prev.getMonth() - 1);
    setPickerDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(pickerDate);
    next.setMonth(next.getMonth() + 1);
    setPickerDate(next);
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), day);
    setDateStr(formatDateStr(selected));
    setShowDatePicker(false);
  };

  const handleAddPress = async () => {
    const newErrors: { title?: string; amount?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Expense title is required.';
    }

    const parsedAmount = parseFloat(amount.trim());
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await onAddExpense(title.trim(), parsedAmount, dateStr);
      // Reset form
      setTitle('');
      setAmount('');
      setDateStr(formatDateStr(new Date()));
      setPickerDate(new Date());
    } catch (err) {
      // Error handled by slice/hook
    }
  };

  // Calendar calculations
  const year = pickerDate.getFullYear();
  const month = pickerDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  return (
    <View className="gap-spacing-16 rounded-radius-large border border-surface-border bg-surface-surface p-spacing-16 shadow-sm">
      <Text className="font-cairo text-lg font-bold text-brand-primary">Log Household Expense</Text>

      <View className="h-[1px] bg-surface-divider" />

      {/* Expense Title */}
      <TextField
        label="Expense Title"
        value={title}
        onChangeText={(val) => {
          setTitle(val);
          if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
        }}
        placeholder="e.g. Electricity Bill, Groceries..."
        error={errors.title}
        editable={!isLoading}
      />

      {/* Amount & Date Row */}
      <View className="flex-row gap-spacing-16">
        <View className="flex-1">
          <TextField
            label="Amount (EGP)"
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errors.amount}
            editable={!isLoading}
          />
        </View>

        <View className="flex-1">
          <Text className="mb-1.5 font-cairo text-[13px] font-semibold leading-[18px] text-text-primary">
            Date
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (isLoading) return;
              // Reset picker window to the currently selected date
              setPickerDate(dateStr ? new Date(dateStr) : new Date());
              setShowDatePicker(true);
            }}
            disabled={isLoading}
            className="h-[52px] w-full flex-row items-center justify-between rounded-[8px] border border-surface-border bg-surface-surface px-4"
            style={{ opacity: isLoading ? 0.5 : 1 }}>
            <Text className="font-cairo text-[15px] text-text-primary">
              {formatDisplayDate(dateStr)}
            </Text>
            <Icon as={Calendar} size={20} className="text-brand-primary" />
          </TouchableOpacity>
        </View>
      </View>

      {(() => {
        const parsedAmount = parseFloat(amount.trim());
        const isSubmitDisabled =
          !title.trim() || isNaN(parsedAmount) || parsedAmount <= 0 || isLoading;

        return (
          <Button
            onPress={handleAddPress}
            disabled={isSubmitDisabled}
            isLoading={isLoading}
            className="mt-spacing-4">
            <Text className="font-cairo text-base font-bold text-white">+ Add Expense</Text>
          </Button>
        );
      })()}

      {/* Date Picker Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}>
        {/* Backdrop container that catches outside clicks safely */}
        <Pressable
          onPress={() => setShowDatePicker(false)}
          className="flex-1 items-center justify-center bg-black/50 px-spacing-16">
          {/* Modal Card - Stops touches from closing the modal */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-[340px] rounded-radius-large border border-surface-border bg-surface-surface p-spacing-24 shadow-xl">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between border-b border-surface-border pb-spacing-16">
              <Text className="font-cairo text-lg font-bold text-text-primary">Select Date</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowDatePicker(false)}
                className="bg-surface-surfaceVariant h-8 w-8 items-center justify-center rounded-radius-full">
                <Icon as={X} size={18} className="text-text-secondary" />
              </TouchableOpacity>
            </View>

            {/* Calendar Navigation */}
            {(() => {
              const today = new Date();
              const todayMidnight = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              const isNextMonthInFuture = new Date(year, month + 1, 1) > todayMidnight;

              return (
                <View className="flex-row items-center justify-between py-spacing-16">
                  <TouchableOpacity onPress={handlePrevMonth} activeOpacity={0.7} className="p-2">
                    <Icon as={ChevronLeft} directional size={22} className="text-text-primary" />
                  </TouchableOpacity>

                  <Text className="text-body font-cairo font-bold text-brand-primary">
                    {MONTHS[month]} {year}
                  </Text>

                  {isNextMonthInFuture ? (
                    <View className="p-2 opacity-30">
                      <Icon as={ChevronRight} directional size={22} className="text-text-primary" />
                    </View>
                  ) : (
                    <TouchableOpacity onPress={handleNextMonth} activeOpacity={0.7} className="p-2">
                      <Icon as={ChevronRight} directional size={22} className="text-text-primary" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })()}

            {/* Calendar Days */}
            <View className="pb-spacing-8">
              {/* Days Grid Headers */}
              <View className="mb-spacing-8 flex-row justify-between">
                {DAYS_OF_WEEK.map((day) => (
                  <View key={day} className="w-10 items-center">
                    <Text className="text-caption font-cairo font-bold text-text-disabled">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Grid Body */}
              <View className="flex-row flex-wrap">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <View key={'empty-' + i.toString()} className="h-10 w-10" />
                ))}

                {(() => {
                  const today = new Date();
                  const todayMidnight = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate()
                  );

                  return Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dayDate = new Date(year, month, dayNum);
                    const isFuture = dayDate > todayMidnight;

                    const currentSelectedDate = new Date(dateStr);
                    const isSelected =
                      currentSelectedDate.getDate() === dayNum &&
                      currentSelectedDate.getMonth() === month &&
                      currentSelectedDate.getFullYear() === year;

                    return (
                      <TouchableOpacity
                        key={'day-' + dayNum.toString()}
                        onPress={() => {
                          if (!isFuture) handleSelectDay(dayNum);
                        }}
                        disabled={isFuture}
                        activeOpacity={0.6}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        className="h-10 w-10 items-center justify-center">
                        {/* 100% Static Conditional Rendering (CRASH-PROOF) */}
                        {isSelected ? (
                          <View className="h-8 w-8 items-center justify-center rounded-radius-full bg-brand-primary">
                            <Text className="font-cairo text-[14px] font-bold text-text-inverse">
                              {dayNum}
                            </Text>
                          </View>
                        ) : isFuture ? (
                          <View className="h-8 w-8 items-center justify-center rounded-radius-full opacity-30">
                            <Text className="font-cairo text-[14px] text-text-disabled">
                              {dayNum}
                            </Text>
                          </View>
                        ) : (
                          <View className="h-8 w-8 items-center justify-center rounded-radius-full">
                            <Text className="font-cairo text-[14px] text-text-primary">
                              {dayNum}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  });
                })()}
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
