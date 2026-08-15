/**
 * HouseholdMembersList.tsx
 * Dumb UI component for the detailed Household Members management section.
 * All logic is managed by useHouseholdMembers.ts.
 */
import React, { useState, useEffect } from 'react';
import { View, Pressable, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import {
  Users,
  CheckCircle,
  Circle,
  ChevronDown,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import {
  DetailedMember,
  AddOfflineMemberPayload,
} from '@/src/features/households/hooks/useHouseholdMembers';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface HouseholdMembersListProps {
  members: DetailedMember[];
  isAddFormOpen?: boolean;
  onToggleAddForm?: () => void;
  onAddOfflineMember: (payload: AddOfflineMemberPayload) => void;
  onPreferences: (id: string) => void;
  onEdit: (id: string) => void;
  onPromote: (id: string) => void;
  onDemote?: (id: string) => void;
  onLeave: (id: string) => void;
  onRemove: (id: string) => void;
  editingMemberId?: string | null;
  onCancelEdit?: () => void;
  onSaveEdit?: (id: string, payload: { fullName: string; gender: string; dob: string }) => void;
}

// ─── Date Picker Modal Component ─────────────────────────────────────────────
interface CustomDatePickerProps {
  visible: boolean;
  initialDateStr: string; // e.g. "06/19/2003"
  onClose: () => void;
  onConfirmDate: (dateStr: string) => void;
}

function CustomDatePicker({
  visible,
  initialDateStr,
  onClose,
  onConfirmDate,
}: CustomDatePickerProps) {
  const parseDateStr = (str: string) => {
    if (!str) return new Date();
    const parts = str.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return new Date();
  };

  const initialDate = parseDateStr(initialDateStr);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [viewMode, setViewMode] = useState<'calendar' | 'year' | 'month'>('calendar');

  useEffect(() => {
    if (visible) {
      const d = parseDateStr(initialDateStr);
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
      setSelectedDay(d.getDate());
      setViewMode('calendar');
    }
  }, [visible, initialDateStr]);

  if (!visible) return null;

  const months = [
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

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startDayOffset = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleApplySet = () => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(selectedDay).padStart(2, '0');
    const resultStr = `${formattedMonth}/${formattedDay}/${currentYear}`;
    onConfirmDate(resultStr);
    onClose();
  };

  const currentYearNum = new Date().getFullYear();
  const yearList = Array.from({ length: 80 }, (_, i) => currentYearNum - i);

  return (
    <View
      className="mt-2 w-full rounded-2xl border border-surface-border bg-surface-surface p-4 shadow-md"
      style={{ elevation: 4 }}>
      {/* Top Header Controls: Month/Year Dropdowns & Prev/Next Nav */}
      <View className="flex-row items-center justify-between border-b border-surface-border pb-3">
        {/* Left: View mode toggles */}
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => setViewMode((m) => (m === 'month' ? 'calendar' : 'month'))}
            className="bg-surface-variant flex-row items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1.5 active:opacity-80">
            <Text className="font-cairo text-[14px] font-bold text-brand-primary">
              {months[currentMonth]}
            </Text>
            <Icon as={ChevronDown} size={14} className="text-brand-primary" />
          </Pressable>

          <Pressable
            onPress={() => setViewMode((m) => (m === 'year' ? 'calendar' : 'year'))}
            className="bg-surface-variant flex-row items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1.5 active:opacity-80">
            <Text className="font-cairo text-[14px] font-bold text-brand-primary">
              {currentYear}
            </Text>
            <Icon as={ChevronDown} size={14} className="text-brand-primary" />
          </Pressable>
        </View>

        {/* Right: Month Prev/Next Arrows */}
        {viewMode === 'calendar' && (
          <View className="flex-row items-center gap-1">
            <Pressable
              onPress={prevMonth}
              className="active:bg-surface-surfaceVariant rounded-full p-1.5">
              <Icon as={ChevronLeft} directional size={20} className="text-text-primary" />
            </Pressable>
            <Pressable
              onPress={nextMonth}
              className="active:bg-surface-surfaceVariant rounded-full p-1.5">
              <Icon as={ChevronRight} directional size={20} className="text-text-primary" />
            </Pressable>
          </View>
        )}
      </View>

      {/* Main View Area */}
      {viewMode === 'calendar' && (
        <View className="mt-3">
          {/* Day Names Header */}
          <View className="mb-2 flex-row justify-between">
            {daysOfWeek.map((day) => (
              <View key={day} className="w-[38px] items-center justify-center">
                <Text className="font-cairo text-[12px] font-bold text-text-secondary">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days Grid */}
          <View className="flex-row flex-wrap justify-start">
            {/* Blank slots before start of month */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <View key={`empty-${i}`} className="my-1 h-[38px] w-[38px]" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = dayNum === selectedDay;

              return (
                <Pressable
                  key={dayNum}
                  onPress={() => setSelectedDay(dayNum)}
                  className={`my-1 h-[38px] w-[38px] items-center justify-center rounded-full active:opacity-80 ${
                    isSelected ? 'bg-brand-primary' : 'bg-transparent'
                  }`}>
                  <Text
                    className={`font-cairo text-[14px] ${
                      isSelected ? 'font-bold text-text-inverse' : 'font-medium text-text-primary'
                    }`}>
                    {dayNum}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Year Grid List */}
      {viewMode === 'year' && (
        <ScrollView style={{ maxHeight: 200 }} className="mt-3">
          <View className="flex-row flex-wrap justify-between gap-2">
            {yearList.map((y) => (
              <Pressable
                key={y}
                onPress={() => {
                  setCurrentYear(y);
                  setViewMode('calendar');
                }}
                className={`w-[70px] items-center justify-center rounded-xl border py-2 active:opacity-80 ${
                  y === currentYear
                    ? 'border-brand-primary bg-brand-primary'
                    : 'bg-surface-variant border-surface-border'
                }`}>
                <Text
                  className={`font-cairo text-[13px] ${
                    y === currentYear
                      ? 'font-bold text-text-inverse'
                      : 'font-normal text-text-primary'
                  }`}>
                  {y}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Month Grid List */}
      {viewMode === 'month' && (
        <View className="mt-3 flex-row flex-wrap items-center justify-center gap-2.5">
          {months.map((mName, idx) => (
            <Pressable
              key={mName}
              onPress={() => {
                setCurrentMonth(idx);
                setViewMode('calendar');
              }}
              className={`w-[90px] items-center justify-center rounded-xl border py-2.5 active:opacity-80 ${
                idx === currentMonth
                  ? 'border-brand-primary bg-brand-primary'
                  : 'bg-surface-variant border-surface-border'
              }`}>
              <Text
                className={`font-cairo text-[13px] ${
                  idx === currentMonth
                    ? 'font-bold text-text-inverse'
                    : 'font-normal text-text-primary'
                }`}>
                {mName}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Bottom Actions Bar */}
      <View className="mt-3 flex-row items-center justify-between border-t border-surface-border pt-3">
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => {
              const today = new Date();
              setCurrentYear(today.getFullYear());
              setCurrentMonth(today.getMonth());
              setSelectedDay(today.getDate());
              setViewMode('calendar');
            }}
            className="px-2 py-1">
            <Text className="font-cairo text-[14px] font-bold text-brand-primary">Today</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={onClose}
            className="active:bg-surface-surfaceVariant rounded-xl px-3 py-1.5">
            <Text className="font-cairo text-[14px] font-semibold text-text-secondary">Close</Text>
          </Pressable>
          <Pressable
            onPress={handleApplySet}
            className="rounded-xl bg-brand-primary px-4 py-2 shadow-sm active:opacity-90">
            <Text className="font-cairo text-[14px] font-bold text-white">Set Date</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Add Offline Member Form ─────────────────────────────────────────────────
interface AddOfflineMemberFormProps {
  onSubmit: (payload: AddOfflineMemberPayload) => void;
}

function AddOfflineMemberForm({ onSubmit }: AddOfflineMemberFormProps) {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const toggleGenderPicker = () => {
    setIsGenderPickerOpen((prev) => {
      if (!prev) setIsDatePickerOpen(false);
      return !prev;
    });
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen((prev) => {
      if (!prev) setIsGenderPickerOpen(false);
      return !prev;
    });
  };

  const handleSubmit = () => {
    onSubmit({ fullName, gender, dob });
  };

  return (
    <View
      className="bg-surface-surfaceVariant/40 rounded-2xl border border-surface-border p-4"
      style={{ gap: 14 }}>
      {/* Field 1: Full Name */}
      <View style={{ gap: 6 }}>
        <Text className="font-cairo text-[14px] font-bold text-text-primary">Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
          placeholderClassName="text-text-disabled"
          className="bg-surface-variant rounded-xl border border-surface-border px-3.5 py-2.5 font-cairo text-[15px] text-text-primary"
        />
      </View>

      {/* Field 2 & 3: Gender & DOB side by side */}
      <View className="flex-row gap-3">
        {/* Gender Select */}
        <View className="flex-1" style={{ gap: 6 }}>
          <Text className="font-cairo text-[14px] font-bold text-text-primary">Gender</Text>
          <Pressable
            onPress={toggleGenderPicker}
            className="bg-surface-variant flex-row items-center justify-between rounded-xl border border-surface-border px-3.5 py-2.5 active:opacity-80">
            <Text
              className={`font-cairo text-[14px] ${gender ? 'text-text-primary' : 'text-text-disabled'}`}>
              {gender || 'Select'}
            </Text>
            <Icon as={ChevronDown} size={18} className="text-text-primary" />
          </Pressable>
        </View>

        {/* DOB Input */}
        <View className="flex-1" style={{ gap: 6 }}>
          <Text className="font-cairo text-[14px] font-bold text-text-primary">DOB</Text>
          <View className="bg-surface-variant flex-row items-center justify-between rounded-xl border border-surface-border px-3 py-1.5">
            <TextInput
              value={dob}
              onChangeText={setDob}
              placeholder="MM/DD/YYYY"
              placeholderClassName="text-text-disabled"
              keyboardType="numbers-and-punctuation"
              className="flex-1 py-0.5 font-cairo text-[14px] text-text-primary"
            />
            <Pressable
              onPress={toggleDatePicker}
              className="active:bg-surface-surfaceVariant rounded-lg p-1.5"
              accessibilityRole="button"
              accessibilityLabel="Open Calendar">
              <Icon as={Calendar} size={18} className="text-brand-primary" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Inline Gender Picker Options Accordion */}
      {isGenderPickerOpen && (
        <View className="mt-1 w-full rounded-xl border border-surface-border bg-surface-surface p-1 shadow-sm">
          {['Male', 'Female'].map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                setGender(option);
                setIsGenderPickerOpen(false);
              }}
              className="active:bg-surface-surfaceVariant rounded-lg px-4 py-2.5">
              <Text className="font-cairo text-[14px] font-semibold text-text-primary">
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Inline Custom Date Picker Accordion */}
      <CustomDatePicker
        visible={isDatePickerOpen}
        initialDateStr={dob}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirmDate={(newDate) => setDob(newDate)}
      />

      {/* Action Button: Save Member */}
      <Pressable
        onPress={handleSubmit}
        className="mt-2 flex-row items-center justify-center rounded-xl bg-brand-primary py-3 active:opacity-90"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}>
        <Text className="font-cairo text-[14px] font-bold text-text-inverse">Save Member</Text>
      </Pressable>
    </View>
  );
}

// ─── Member Card ─────────────────────────────────────────────────────────────
interface MemberCardProps {
  member: DetailedMember;
  isCurrentUserAdmin?: boolean;
  isEditing?: boolean;
  onPreferences: (id: string) => void;
  onEdit: (id: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (id: string, payload: { fullName: string; gender: string; dob: string }) => void;
  onPromote: (id: string) => void;
  onDemote?: (id: string) => void;
  onLeave: (id: string) => void;
  onRemove: (id: string) => void;
}

function MemberCard({
  member,
  isCurrentUserAdmin = false,
  isEditing = false,
  onPreferences,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onPromote,
  onDemote,
  onLeave,
  onRemove,
}: MemberCardProps) {
  const isManager = member.role === 'Household Manager';
  const isCurrentUser = member.isCurrentUser;
  const isRegistered = member.type === 'Registered';

  const [editName, setEditName] = useState(member.fullName);
  const [editGender, setEditGender] = useState(member.gender || 'Male');
  const [editDob, setEditDob] = useState(member.dob || '');

  const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setEditName(member.fullName);
      setEditGender(member.gender || 'Male');
      setEditDob(member.dob || '');
    }
  }, [isEditing, member]);

  // ── Inline Edit Mode UI ──
  if (isEditing) {
    return (
      <View
        className="bg-surface-surfaceVariant/40 rounded-2xl border border-brand-primary/40 p-4"
        style={{ gap: 14 }}>
        <Text className="font-cairo text-[15px] font-bold text-text-primary">
          Edit Member: {member.fullName}
        </Text>

        {/* Field 1: Full Name */}
        <View style={{ gap: 6 }}>
          <Text className="font-cairo text-[14px] font-bold text-text-primary">Full Name</Text>
          <TextInput
            value={editName}
            onChangeText={setEditName}
            placeholder="Enter full name"
            placeholderClassName="text-text-disabled"
            className="bg-surface-variant rounded-xl border border-surface-border px-3.5 py-2.5 font-cairo text-[15px] text-text-primary"
          />
        </View>

        {/* Field 2 & 3: Gender & DOB side by side */}
        <View className="flex-row gap-3">
          {/* Gender Select */}
          <View className="flex-1" style={{ gap: 6 }}>
            <Text className="font-cairo text-[14px] font-bold text-text-primary">Gender</Text>
            <Pressable
              onPress={() => {
                setIsGenderPickerOpen((prev) => {
                  if (!prev) setIsDatePickerOpen(false);
                  return !prev;
                });
              }}
              className="bg-surface-variant flex-row items-center justify-between rounded-xl border border-surface-border px-3.5 py-2.5 active:opacity-80">
              <Text className="font-cairo text-[14px] text-text-primary">{editGender}</Text>
              <Icon as={ChevronDown} size={18} className="text-text-primary" />
            </Pressable>
          </View>

          {/* DOB Input */}
          <View className="flex-1" style={{ gap: 6 }}>
            <Text className="font-cairo text-[14px] font-bold text-text-primary">DOB</Text>
            <View className="bg-surface-variant flex-row items-center justify-between rounded-xl border border-surface-border px-3 py-1.5">
              <TextInput
                value={editDob}
                onChangeText={setEditDob}
                placeholder="MM/DD/YYYY"
                placeholderClassName="text-text-disabled"
                keyboardType="numbers-and-punctuation"
                className="flex-1 py-0.5 font-cairo text-[14px] text-text-primary"
              />
              <Pressable
                onPress={() => {
                  setIsDatePickerOpen((prev) => {
                    if (!prev) setIsGenderPickerOpen(false);
                    return !prev;
                  });
                }}
                className="active:bg-surface-surfaceVariant rounded-lg p-1.5"
                accessibilityRole="button"
                accessibilityLabel="Open Calendar">
                <Icon as={Calendar} size={18} className="text-brand-primary" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Inline Gender Picker Options Accordion */}
        {isGenderPickerOpen && (
          <View className="mt-1 w-full rounded-xl border border-surface-border bg-surface-surface p-1 shadow-sm">
            {['Male', 'Female'].map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  setEditGender(option);
                  setIsGenderPickerOpen(false);
                }}
                className="active:bg-surface-surfaceVariant rounded-lg px-4 py-2.5">
                <Text className="font-cairo text-[14px] font-semibold text-text-primary">
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Inline Custom Date Picker Accordion */}
        <CustomDatePicker
          visible={isDatePickerOpen}
          initialDateStr={editDob}
          onClose={() => setIsDatePickerOpen(false)}
          onConfirmDate={(newDate) => setEditDob(newDate)}
        />

        {/* Action Controls: Cancel & Save Changes */}
        <View className="mt-2 flex-row items-center justify-end gap-3 border-t border-surface-border pt-3">
          <Pressable
            onPress={onCancelEdit}
            disabled={isSubmitting}
            className="rounded-xl border border-surface-border bg-surface-surface px-4 py-2.5 active:opacity-80">
            <Text className="font-cairo text-[14px] font-bold text-text-secondary">Cancel</Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              if (onSaveEdit) {
                setIsSubmitting(true);
                await onSaveEdit(member.id, {
                  fullName: editName,
                  gender: editGender,
                  dob: editDob,
                });
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="flex-row items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 shadow-sm active:opacity-90">
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="font-cairo text-[14px] font-bold text-white">Save Changes</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Standard Read Mode UI ──
  return (
    <View
      className="bg-surface-surfaceVariant/40 rounded-2xl border border-surface-border"
      style={{ padding: 16, gap: 12 }}>
      {/* ── Row 1: Name + (You) ── */}
      <View className="flex-row items-center gap-3">
        {/* Avatar */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#C8D5D0',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          {member.avatarUri ? (
            <Image
              source={{ uri: member.avatarUri }}
              style={{ width: 44, height: 44 }}
              resizeMode="cover"
            />
          ) : (
            <Text className="font-cairo text-[18px] font-bold text-brand-primary">
              {member.initial}
            </Text>
          )}
        </View>
        <Text className="font-cairo text-[16px] font-bold text-text-primary">
          {member.fullName}
          {isCurrentUser && (
            <Text className="font-cairo text-[16px] font-normal text-text-secondary">
              {' (You)'}
            </Text>
          )}
        </Text>
      </View>

      {/* ── Row 2: Role + Type Badges ── */}
      <View className="flex-row flex-wrap items-center gap-2">
        {/* Role Badge */}
        {isManager ? (
          <View className="rounded-full bg-brand-primary px-3.5 py-1">
            <Text className="font-cairo text-[12px] font-bold text-white">Manager</Text>
          </View>
        ) : (
          <View className="rounded-full bg-brand-amber-300 px-3.5 py-1">
            <Text className="font-cairo text-[12px] font-bold text-text-primary">Member</Text>
          </View>
        )}

        {/* Type Badge */}
        {isRegistered ? (
          <View className="flex-row items-center gap-1 rounded-full bg-brand-primary-container px-3 py-1">
            <Icon as={CheckCircle} size={13} className="text-brand-primary" />
            <Text className="font-cairo text-[12px] font-semibold text-brand-primary">
              Registered User
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-1 rounded-full border border-surface-border bg-transparent px-3 py-1">
            <Icon as={Circle} size={13} className="text-text-secondary" />
            <Text className="font-cairo text-[12px] font-semibold text-text-secondary">
              Offline Member
            </Text>
          </View>
        )}
      </View>

      {/* ── Row 3: Action Buttons (right-aligned) ── */}
      <View className="mt-1 flex-row flex-wrap items-center justify-end gap-2">
        {/* Preferences — outline */}
        <Pressable
          onPress={() => onPreferences(member.id)}
          className="rounded-full border border-surface-border bg-surface-surface px-3 py-1.5 active:opacity-70">
          <Text className="font-cairo text-[12px] font-semibold text-text-primary">
            Preferences
          </Text>
        </Pressable>

        {/* Edit — solid amber */}
        {isCurrentUserAdmin && (
          <Pressable
            onPress={() => onEdit(member.id)}
            className="rounded-full bg-brand-amber-300 px-3.5 py-1.5 active:opacity-70">
            <Text className="font-cairo text-[12px] font-bold text-text-primary">Edit</Text>
          </Pressable>
        )}

        {/* Conditional: Leave (only if current user is NOT Manager), Remove, or Promote */}
        {isCurrentUser && !isManager ? (
          <Pressable
            onPress={() => onLeave(member.id)}
            className="rounded-full bg-status-error px-3.5 py-1.5 active:opacity-70">
            <Text className="font-cairo text-[12px] font-bold text-white">Leave</Text>
          </Pressable>
        ) : !isCurrentUser && isCurrentUserAdmin ? (
          <>
            {isManager ? (
              <Pressable
                onPress={() => onDemote && onDemote(member.id)}
                className="rounded-full bg-brand-amber-300 px-3.5 py-1.5 active:opacity-70">
                <Text className="font-cairo text-[12px] font-bold text-text-primary">Demote</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => onPromote(member.id)}
                className="rounded-full bg-brand-amber-300 px-3.5 py-1.5 active:opacity-70">
                <Text className="font-cairo text-[12px] font-bold text-text-primary">Promote</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => onRemove(member.id)}
              className="rounded-full bg-status-error px-3.5 py-1.5 active:opacity-70">
              <Text className="font-cairo text-[12px] font-bold text-white">Remove</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function HouseholdMembersList({
  members,
  isAddFormOpen = false,
  onToggleAddForm,
  onAddOfflineMember,
  onPreferences,
  onEdit,
  onPromote,
  onDemote,
  onLeave,
  onRemove,
  editingMemberId,
  onCancelEdit,
  onSaveEdit,
}: HouseholdMembersListProps) {
  const [internalFormOpen, setInternalFormOpen] = useState(false);
  const showForm = onToggleAddForm ? isAddFormOpen : internalFormOpen;
  const toggleForm = onToggleAddForm || (() => setInternalFormOpen((prev) => !prev));

  const currentUserMember = members.find((m) => m.isCurrentUser);
  const isCurrentUserAdmin = currentUserMember
    ? currentUserMember.role === 'Household Manager'
    : false;

  return (
    <View style={{ gap: 16 }}>
      {/* ── Section Header ── */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon as={Users} size={20} className="text-brand-primary" />
          <Text className="font-cairo text-[18px] font-bold leading-[26px] text-brand-primary">
            Household Members
          </Text>
        </View>
        {isCurrentUserAdmin && (
          <Pressable
            onPress={toggleForm}
            className="rounded-full active:opacity-80"
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              backgroundColor: '#356859',
            }}>
            <Text style={{ fontFamily: 'Cairo', fontSize: 13, fontWeight: '700', color: '#fff' }}>
              + Offline Member
            </Text>
          </Pressable>
        )}
      </View>

      {/* ── Add Offline Member Form (Shown when toggled) ── */}
      {showForm && <AddOfflineMemberForm onSubmit={onAddOfflineMember} />}

      {/* ── Member Cards ── */}
      <View style={{ gap: 12 }}>
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isCurrentUserAdmin={isCurrentUserAdmin}
            isEditing={member.id === editingMemberId}
            onPreferences={onPreferences}
            onEdit={onEdit}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            onPromote={onPromote}
            onDemote={onDemote}
            onLeave={onLeave}
            onRemove={onRemove}
          />
        ))}
      </View>
    </View>
  );
}
