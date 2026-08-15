import React, { forwardRef, useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { AppBottomSheet } from '@/src/components/ui/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats a YYYY-MM-DD date string into MM/DD/YYYY display format.
 */
export const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${month}/${day}/${year}`;
  }
  return dateStr;
};

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

const CURRENT_YEAR = new Date().getFullYear();
// Generate years from current year up to 10 years in the future (expiration date)
const FUTURE_YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR + i);

// ─── Props ────────────────────────────────────────────────────────────────────

interface ExpirationDatePickerModalProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  onClose?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ExpirationDatePickerModal = forwardRef<
  BottomSheetModal,
  ExpirationDatePickerModalProps
>(({ value, onChange, onClose }, ref) => {
  const [mode, setMode] = useState<'calendar' | 'years' | 'months'>('calendar');

  const dismiss = () => {
    if (ref && typeof ref === 'object') {
      ref.current?.dismiss();
    }
  };

  const parsedDate = useMemo(() => {
    if (!value) return new Date();
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [value]);

  const [selectedYear, setSelectedYear] = useState(parsedDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(parsedDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(parsedDate.getDate());

  // Re-sync the calendar to the incoming value. The parent sets `value` before
  // presenting the sheet, so this leaves it on the right month/day each time it opens.
  useEffect(() => {
    const d = value ? new Date(value) : new Date();
    const validDate = isNaN(d.getTime()) ? new Date() : d;
    setSelectedYear(validDate.getFullYear());
    setSelectedMonth(validDate.getMonth());
    setSelectedDay(validDate.getDate());
    setMode('calendar');
  }, [value]);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
  };

  const handleConfirmDate = () => {
    const yyyy = selectedYear;
    const mm = String(selectedMonth + 1).padStart(2, '0');
    const dd = String(selectedDay).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    dismiss();
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  return (
    <AppBottomSheet ref={ref} onDismiss={onClose} enablePanDownToClose snapPoints={['55%']}>
      <View className="px-5 pb-5">
        {/* Modal Header */}
        <View className="flex-row items-center justify-between border-b border-surface-border pb-4">
          <Text className="font-cairo text-[18px] font-bold text-text-primary">
            {mode === 'years'
              ? 'Select Year'
              : mode === 'months'
                ? 'Select Month'
                : 'Select Expiration Date'}
          </Text>
          <Pressable
            onPress={dismiss}
            className="bg-surface-surfaceVariant h-8 w-8 items-center justify-center rounded-full active:opacity-75">
            <Icon as={X} size={18} className="text-text-secondary" />
          </Pressable>
        </View>

        {/* Quick Year & Month Toggles */}
        {mode === 'calendar' && (
          <View className="flex-row items-center justify-between py-4">
            <Pressable onPress={handlePrevMonth} className="p-2 active:opacity-60">
              <Icon as={ChevronLeft} directional size={22} className="text-text-primary" />
            </Pressable>

            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setMode('months')}
                className="bg-surface-surfaceVariant rounded-lg px-3 py-1.5 active:opacity-70">
                <Text className="font-cairo text-[15px] font-bold text-brand-primary">
                  {MONTHS[selectedMonth]}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMode('years')}
                className="bg-surface-surfaceVariant rounded-lg px-3 py-1.5 active:opacity-70">
                <Text className="font-cairo text-[15px] font-bold text-brand-primary">
                  {selectedYear}
                </Text>
              </Pressable>
            </View>

            <Pressable onPress={handleNextMonth} className="p-2 active:opacity-60">
              <Icon as={ChevronRight} directional size={22} className="text-text-primary" />
            </Pressable>
          </View>
        )}

        {/* Mode 1: Years Picker */}
        {mode === 'years' && (
          <View className="h-[240px] py-2">
            <ScrollView showsVerticalScrollIndicator={true}>
              <View className="flex-row flex-wrap justify-between gap-2 py-2">
                {FUTURE_YEARS.map((yr) => (
                  <Pressable
                    key={yr}
                    onPress={() => {
                      setSelectedYear(yr);
                      setMode('calendar');
                    }}
                    className={`w-[30%] items-center justify-center rounded-xl py-3 ${
                      selectedYear === yr ? 'bg-brand-primary' : 'bg-surface-surfaceVariant'
                    }`}>
                    <Text
                      className={`font-cairo text-[15px] font-bold ${
                        selectedYear === yr ? 'text-brand-primary-container' : 'text-text-primary'
                      }`}>
                      {yr}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Mode 2: Months Picker */}
        {mode === 'months' && (
          <View className="py-4">
            <View className="flex-row flex-wrap justify-between gap-2.5">
              {MONTHS.map((m, idx) => (
                <Pressable
                  key={m}
                  onPress={() => {
                    setSelectedMonth(idx);
                    setMode('calendar');
                  }}
                  className={`w-[30%] items-center justify-center rounded-xl py-3 ${
                    selectedMonth === idx ? 'bg-brand-primary' : 'bg-surface-surfaceVariant'
                  }`}>
                  <Text
                    className={`font-cairo text-[13px] font-bold ${
                      selectedMonth === idx ? 'text-brand-primary-container' : 'text-text-primary'
                    }`}>
                    {m.slice(0, 3)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Mode 3: Days Grid */}
        {mode === 'calendar' && (
          <View className="pb-2">
            {/* Day of Week Headers */}
            <View className="mb-2 flex-row justify-between">
              {DAYS_OF_WEEK.map((d) => (
                <View key={d} className="w-10 items-center">
                  <Text className="font-cairo text-[13px] font-bold text-text-disabled">{d}</Text>
                </View>
              ))}
            </View>

            {/* Days Grid */}
            <View className="flex-row flex-wrap">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <View key={`empty-${i}`} className="h-10 w-10" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = selectedDay === dayNum;

                return (
                  <Pressable
                    key={dayNum}
                    onPress={() => handleSelectDay(dayNum)}
                    className="h-10 w-10 items-center justify-center">
                    <View
                      className={`h-8 w-8 items-center justify-center rounded-full ${
                        isSelected ? 'bg-brand-primary' : ''
                      }`}>
                      <Text
                        className={`font-cairo text-[14px] font-medium ${
                          isSelected
                            ? 'font-bold text-brand-primary-container'
                            : 'text-text-primary'
                        }`}>
                        {dayNum}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Set Date Button */}
            <Pressable
              onPress={handleConfirmDate}
              className="mt-4 w-full items-center justify-center rounded-radius-full bg-brand-primary py-3 active:opacity-85">
              <Text className="font-cairo text-[15px] font-bold text-brand-primary-container">
                Set Date
              </Text>
            </Pressable>
          </View>
        )}

        {/* Back Button */}
        {mode !== 'calendar' && (
          <Pressable
            onPress={() => setMode('calendar')}
            className="bg-surface-surfaceVariant mt-2 w-full items-center justify-center rounded-full py-3">
            <Text className="font-cairo text-[14px] font-bold text-text-primary">
              Back to Days View
            </Text>
          </Pressable>
        )}
      </View>
    </AppBottomSheet>
  );
});

ExpirationDatePickerModal.displayName = 'ExpirationDatePickerModal';
