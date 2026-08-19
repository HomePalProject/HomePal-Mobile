import React, { useState } from 'react';
import { View, Pressable, Modal, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { getMonthNames, getWeekdayNames } from '@/src/utils/dateNames';

interface DatePickerProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
}

// Generate years from 1950 to current year - 13
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 13 - 1950 + 1 }, (_, i) => CURRENT_YEAR - 13 - i);

export function DatePicker({
  label,
  value,
  onChange,
  error,
  placeholder = 'Select date (YYYY-MM-DD)',
}: DatePickerProps) {
  const { i18n } = useTranslation();

  const MONTHS = getMonthNames(i18n.language);
  const DAYS_OF_WEEK = getWeekdayNames(i18n.language);

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<'calendar' | 'years' | 'months'>('calendar');

  // Parse existing date or default to 2000-01-01
  const parsedDate = value ? new Date(value) : new Date(2000, 0, 1);
  const [selectedYear, setSelectedYear] = useState(
    isNaN(parsedDate.getFullYear()) ? 2000 : parsedDate.getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    isNaN(parsedDate.getMonth()) ? 0 : parsedDate.getMonth()
  );
  const [selectedDay, setSelectedDay] = useState(
    isNaN(parsedDate.getDate()) ? 1 : parsedDate.getDate()
  );

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    const yyyy = selectedYear;
    const mm = String(selectedMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setModalVisible(false);
    setMode('calendar');
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
    <View className="w-full flex-col gap-1.5">
      {label && (
        <Text className="font-cairo text-[14px] font-semibold text-text-primary">{label}</Text>
      )}

      <Pressable
        onPress={() => {
          setMode('calendar');
          setModalVisible(true);
        }}
        className={`h-[52px] w-full flex-row items-center justify-between rounded-[12px] border bg-surface-surface px-4 ${
          error ? 'border-status-error' : 'border-surface-border'
        }`}>
        <Text
          className={`font-cairo text-[15px] ${
            value ? 'font-medium text-text-primary' : 'text-text-disabled'
          }`}>
          {value || placeholder}
        </Text>
        <Icon as={Calendar} size={20} className="text-brand-primary" />
      </Pressable>

      {error && <Text className="font-cairo text-[12px] text-status-error">{error}</Text>}

      {/* Calendar Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-[360px] rounded-[20px] bg-surface-surface p-5 shadow-lg">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between border-b border-surface-border pb-4">
              <Text className="font-cairo text-[18px] font-bold text-text-primary">
                {mode === 'years'
                  ? 'Select Year'
                  : mode === 'months'
                    ? 'Select Month'
                    : 'Select Birth Date'}
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-surface-surface-variant">
                <Icon as={X} size={18} className="text-text-secondary" />
              </Pressable>
            </View>

            {/* Quick Year & Month Toggle Buttons */}
            {mode === 'calendar' && (
              <View className="flex-row items-center justify-between py-4">
                <Pressable onPress={handlePrevMonth} className="p-2">
                  <Icon as={ChevronLeft} directional size={22} className="text-text-primary" />
                </Pressable>

                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setMode('months')}
                    className="rounded-lg bg-surface-surface-variant px-3 py-1.5">
                    <Text className="font-cairo text-[15px] font-bold text-brand-primary">
                      {MONTHS[selectedMonth]}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setMode('years')}
                    className="rounded-lg bg-surface-surface-variant px-3 py-1.5">
                    <Text className="font-cairo text-[15px] font-bold text-brand-primary">
                      {selectedYear}
                    </Text>
                  </Pressable>
                </View>

                <Pressable onPress={handleNextMonth} className="p-2">
                  <Icon as={ChevronRight} directional size={22} className="text-text-primary" />
                </Pressable>
              </View>
            )}

            {/* Mode 1: Years Picker */}
            {mode === 'years' && (
              <View className="h-[280px] py-2">
                <ScrollView showsVerticalScrollIndicator={true}>
                  <View className="flex-row flex-wrap justify-between gap-2 py-2">
                    {YEARS.map((yr) => (
                      <Pressable
                        key={yr}
                        onPress={() => {
                          setSelectedYear(yr);
                          setMode('calendar');
                        }}
                        className={`w-[30%] items-center justify-center rounded-xl py-3 ${
                          selectedYear === yr ? 'bg-brand-primary' : 'bg-surface-surface-variant'
                        }`}>
                        <Text
                          className={`font-cairo text-[15px] font-bold ${
                            selectedYear === yr ? 'text-white' : 'text-text-primary'
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
                        selectedMonth === idx ? 'bg-brand-primary' : 'bg-surface-surface-variant'
                      }`}>
                      <Text
                        className={`font-cairo text-[13px] font-bold ${
                          selectedMonth === idx ? 'text-white' : 'text-text-primary'
                        }`}>
                        {m.slice(0, 3)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Mode 3: Calendar Days Grid */}
            {mode === 'calendar' && (
              <View className="pb-2">
                {/* Day of Week Headers */}
                <View className="mb-2 flex-row justify-between">
                  {DAYS_OF_WEEK.map((d) => (
                    <View key={d} className="w-10 items-center">
                      <Text className="font-cairo text-[13px] font-bold text-text-disabled">
                        {d}
                      </Text>
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
                    const isSelected =
                      selectedDay === dayNum &&
                      value ===
                        `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

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
                              isSelected ? 'font-bold text-white' : 'text-text-primary'
                            }`}>
                            {dayNum}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Back to Calendar Button when in Year/Month mode */}
            {mode !== 'calendar' && (
              <Pressable
                onPress={() => setMode('calendar')}
                className="mt-2 w-full items-center justify-center rounded-full bg-surface-surface-variant py-3">
                <Text className="font-cairo text-[14px] font-bold text-text-primary">
                  Back to Days View
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
