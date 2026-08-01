/**
 * HouseholdMembersList.tsx
 * Dumb UI component for the detailed Household Members management section.
 * All logic is managed by useHouseholdMembers.ts.
 */
import React, { useState } from 'react';
import { View, Pressable, Image, TextInput, Modal, ScrollView } from 'react-native';
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
  onLeave: (id: string) => void;
  onRemove: (id: string) => void;
}

// ─── Date Picker Modal Component ─────────────────────────────────────────────
interface CustomDatePickerProps {
  visible: boolean;
  initialDateStr: string; // e.g. "06/19/2003"
  onClose: () => void;
  onSelectDate: (dateStr: string) => void;
}

function CustomDatePicker({
  visible,
  initialDateStr,
  onClose,
  onSelectDate,
}: CustomDatePickerProps) {
  const [currentYear, setCurrentYear] = useState(2003);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed (June = 5)
  const [selectedDay, setSelectedDay] = useState(19);

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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleConfirmDate = (day: number) => {
    setSelectedDay(day);
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const result = `${formattedMonth}/${formattedDay}/${currentYear}`;
    onSelectDate(result);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={onClose}>
        <Pressable
          className="w-full max-w-[320px] rounded-xl border border-surface-border bg-white p-4 shadow-xl"
          onPress={(e) => e.stopPropagation()}>
          {/* Header Month / Year controls */}
          <View className="flex-row items-center justify-between border-b border-surface-border pb-3">
            <View className="flex-row items-center gap-1">
              <Text className="text-on-surface font-cairo text-[16px] font-bold">
                {months[currentMonth]} {currentYear}
              </Text>
              <ChevronDown size={18} color="#1e1b17" />
            </View>

            <View className="flex-row items-center gap-2">
              <Pressable onPress={handlePrevMonth} className="p-1 active:opacity-60">
                <ChevronLeft size={20} color="#6D6862" />
              </Pressable>
              <Pressable onPress={handleNextMonth} className="p-1 active:opacity-60">
                <ChevronRight size={20} color="#6D6862" />
              </Pressable>
            </View>
          </View>

          {/* Days Header */}
          <View className="flex-row justify-between pb-2 pt-3">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayStr) => (
              <View key={dayStr} className="w-9 items-center">
                <Text className="font-cairo text-[13px] font-semibold text-text-secondary">
                  {dayStr}
                </Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View className="flex-row flex-wrap">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <View key={`empty-${i}`} className="h-[38px] w-[38px]" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = dayNum === selectedDay;
              return (
                <Pressable
                  key={`day-${dayNum}`}
                  onPress={() => handleConfirmDate(dayNum)}
                  className={`m-[1px] h-[38px] w-[38px] items-center justify-center rounded-lg ${
                    isSelected ? 'bg-[#007AFF]' : 'active:bg-surface-surfaceVariant'
                  }`}>
                  <Text
                    className={`font-cairo text-[14px] ${
                      isSelected ? 'font-bold text-white' : 'text-on-surface'
                    }`}>
                    {dayNum}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Bottom Actions */}
          <View className="mt-2 flex-row justify-between border-t border-surface-border pt-4">
            <Pressable onPress={() => handleConfirmDate(1)} className="p-1">
              <Text className="font-cairo text-[14px] font-bold text-[#007AFF]">Clear</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const today = new Date();
                setCurrentYear(today.getFullYear());
                setCurrentMonth(today.getMonth());
                handleConfirmDate(today.getDate());
              }}
              className="p-1">
              <Text className="font-cairo text-[14px] font-bold text-[#007AFF]">Today</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Add Offline Member Form ─────────────────────────────────────────────────
interface AddOfflineMemberFormProps {
  onSubmit: (payload: AddOfflineMemberPayload) => void;
}

function AddOfflineMemberForm({ onSubmit }: AddOfflineMemberFormProps) {
  const [fullName, setFullName] = useState('Hamada');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('06/19/2003');

  const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSubmit = () => {
    onSubmit({ fullName, gender, dob });
  };

  return (
    <View
      className="bg-surface-surfaceVariant/40 rounded-2xl border border-surface-border p-4"
      style={{ gap: 14 }}>
      {/* Field 1: Full Name */}
      <View style={{ gap: 6 }}>
        <Text className="text-on-surface font-cairo text-[14px] font-bold">Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
          placeholderTextColor="#A8A29B"
          style={{
            fontFamily: 'Cairo',
            fontSize: 15,
            color: '#1e1b17',
            backgroundColor: '#FAF7F2',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E4E0DA',
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        />
      </View>

      {/* Field 2 & 3: Gender & DOB side by side */}
      <View className="flex-row gap-3">
        {/* Gender Select */}
        <View className="flex-1" style={{ gap: 6 }}>
          <Text className="text-on-surface font-cairo text-[14px] font-bold">Gender</Text>
          <Pressable
            onPress={() => setIsGenderPickerOpen(true)}
            className="flex-row items-center justify-between rounded-xl border border-surface-border bg-[#FAF7F2] px-3.5 py-2.5 active:opacity-80">
            <Text className="text-on-surface font-cairo text-[14px]">{gender}</Text>
            <ChevronDown size={18} color="#1e1b17" />
          </Pressable>
        </View>

        {/* DOB Input */}
        <View className="flex-1" style={{ gap: 6 }}>
          <Text className="text-on-surface font-cairo text-[14px] font-bold">DOB</Text>
          <Pressable
            onPress={() => setIsDatePickerOpen(true)}
            className="flex-row items-center justify-between rounded-xl border border-surface-border bg-[#FAF7F2] px-3.5 py-2.5 active:opacity-80">
            <Text className="text-on-surface font-cairo text-[14px]">{dob}</Text>
            <Calendar size={18} color="#1e1b17" />
          </Pressable>
        </View>
      </View>

      {/* Add Member Button */}
      <Pressable
        onPress={handleSubmit}
        className="mt-1 h-12 w-full items-center justify-center rounded-2xl active:opacity-90"
        style={{ backgroundColor: '#FDBA5A' }}>
        <Text style={{ fontFamily: 'Cairo', fontSize: 16, fontWeight: '700', color: '#734a00' }}>
          Add Member
        </Text>
      </Pressable>

      {/* Gender Picker Modal */}
      <Modal
        visible={isGenderPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsGenderPickerOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/30 px-6"
          onPress={() => setIsGenderPickerOpen(false)}>
          <View className="w-full max-w-[260px] rounded-xl border border-surface-border bg-white p-2 shadow-md">
            {['Male', 'Female', 'Other'].map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  setGender(option);
                  setIsGenderPickerOpen(false);
                }}
                className="active:bg-surface-surfaceVariant rounded-lg px-4 py-3">
                <Text className="text-on-surface font-cairo text-[15px] font-semibold">
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Custom Date Picker Modal */}
      <CustomDatePicker
        visible={isDatePickerOpen}
        initialDateStr={dob}
        onClose={() => setIsDatePickerOpen(false)}
        onSelectDate={(newDate) => setDob(newDate)}
      />
    </View>
  );
}

// ─── Member Card ─────────────────────────────────────────────────────────────
interface MemberCardProps {
  member: DetailedMember;
  onPreferences: (id: string) => void;
  onEdit: (id: string) => void;
  onPromote: (id: string) => void;
  onLeave: (id: string) => void;
  onRemove: (id: string) => void;
}

function MemberCard({
  member,
  onPreferences,
  onEdit,
  onPromote,
  onLeave,
  onRemove,
}: MemberCardProps) {
  const isManager = member.role === 'Manager';
  const isCurrentUser = member.isCurrentUser;
  const isRegistered = member.type === 'Registered';

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
            <Text
              style={{
                fontFamily: 'Cairo',
                fontSize: 18,
                fontWeight: '700',
                color: '#1b5042',
              }}>
              {member.initial}
            </Text>
          )}
        </View>
        <Text
          style={{
            fontFamily: 'Cairo',
            fontSize: 16,
            fontWeight: '700',
            color: '#1e1b17',
          }}>
          {member.fullName}
          {isCurrentUser && (
            <Text
              style={{
                fontFamily: 'Cairo',
                fontSize: 16,
                fontWeight: '400',
                color: '#6D6862',
              }}>
              {' (You)'}
            </Text>
          )}
        </Text>
      </View>

      {/* ── Row 2: Role + Type Badges ── */}
      <View className="flex-row flex-wrap items-center gap-2">
        {/* Role Badge */}
        {isManager ? (
          // Manager — solid dark green
          <View
            style={{
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 5,
              backgroundColor: '#356859',
            }}>
            <Text style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '700', color: '#fff' }}>
              Manager
            </Text>
          </View>
        ) : (
          // Member — solid amber
          <View
            style={{
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 5,
              backgroundColor: '#FDBA5A',
            }}>
            <Text
              style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '700', color: '#734a00' }}>
              Member
            </Text>
          </View>
        )}

        {/* Type Badge */}
        {isRegistered ? (
          // Registered User — light green with check icon
          <View
            className="flex-row items-center gap-1"
            style={{
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 5,
              backgroundColor: '#b8eedb',
            }}>
            <Icon as={CheckCircle} size={13} color="#1b5042" />
            <Text
              style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '600', color: '#1b5042' }}>
              Registered User
            </Text>
          </View>
        ) : (
          // Offline Member — outline grey with circle icon
          <View
            className="flex-row items-center gap-1"
            style={{
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderWidth: 1,
              borderColor: '#C0C9C4',
              backgroundColor: 'transparent',
            }}>
            <Icon as={Circle} size={13} color="#6D6862" />
            <Text
              style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '600', color: '#6D6862' }}>
              Offline Member
            </Text>
          </View>
        )}
      </View>

      {/* ── Row 3: Action Buttons (right-aligned) ── */}
      <View className="flex-row items-center justify-end gap-2">
        {/* Preferences — outline */}
        <Pressable
          onPress={() => onPreferences(member.id)}
          className="bg-surface-card rounded-full border border-surface-border active:opacity-70"
          style={{ paddingHorizontal: 12, paddingVertical: 7 }}>
          <Text style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '600', color: '#1e1b17' }}>
            Preferences
          </Text>
        </Pressable>

        {/* Edit — solid amber */}
        <Pressable
          onPress={() => onEdit(member.id)}
          className="rounded-full active:opacity-70"
          style={{ paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#FDBA5A' }}>
          <Text style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '700', color: '#734a00' }}>
            Edit
          </Text>
        </Pressable>

        {/* Conditional: Leave (if current user Manager), Remove, or Promote */}
        {isCurrentUser && isManager ? (
          // Leave — destructive red
          <Pressable
            onPress={() => onLeave(member.id)}
            className="rounded-full active:opacity-70"
            style={{ paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#D32F2F' }}>
            <Text style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '700', color: '#fff' }}>
              Leave
            </Text>
          </Pressable>
        ) : !isCurrentUser && !isManager ? (
          <>
            {/* Promote — solid primary */}
            <Pressable
              onPress={() => onPromote(member.id)}
              className="rounded-full active:opacity-70"
              style={{ paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#FDBA5A' }}>
              <Text
                style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '700', color: '#734a00' }}>
                Promote
              </Text>
            </Pressable>
            {/* Remove — destructive red */}
            <Pressable
              onPress={() => onRemove(member.id)}
              className="rounded-full active:opacity-70"
              style={{ paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#D32F2F' }}>
              <Text style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '700', color: '#fff' }}>
                Remove
              </Text>
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
  onLeave,
  onRemove,
}: HouseholdMembersListProps) {
  const [internalFormOpen, setInternalFormOpen] = useState(false);
  const showForm = onToggleAddForm ? isAddFormOpen : internalFormOpen;
  const toggleForm = onToggleAddForm || (() => setInternalFormOpen((prev) => !prev));

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
        {/* + Offline Member button — solid primary */}
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
      </View>

      {/* ── Add Offline Member Form (Shown when toggled) ── */}
      {showForm && <AddOfflineMemberForm onSubmit={onAddOfflineMember} />}

      {/* ── Member Cards ── */}
      <View style={{ gap: 12 }}>
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onPreferences={onPreferences}
            onEdit={onEdit}
            onPromote={onPromote}
            onLeave={onLeave}
            onRemove={onRemove}
          />
        ))}
      </View>
    </View>
  );
}
