/**
 * HouseholdMembersList.tsx
 * Dumb UI component for the detailed Household Members management section.
 * All logic is managed by useHouseholdMembers.ts.
 */
import React, { useState } from 'react';
import { View, Pressable, Image, TextInput, ScrollView } from 'react-native';
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
  onConfirmDate: (dateStr: string) => void;
}

function CustomDatePicker({
  visible,
  initialDateStr,
  onClose,
  onConfirmDate,
}: CustomDatePickerProps) {
  // Parse initial date string "MM/DD/YYYY"
  const parseInitialDate = () => {
    if (initialDateStr && initialDateStr.includes('/')) {
      const parts = initialDateStr.split('/');
      if (parts.length === 3) {
        const m = parseInt(parts[0], 10) - 1;
        const d = parseInt(parts[1], 10);
        const y = parseInt(parts[2], 10);
        if (!isNaN(m) && !isNaN(d) && !isNaN(y)) {
          return { y, m, d };
        }
      }
    }
    return { y: 2003, m: 5, d: 19 };
  };

  const initialParsed = parseInitialDate();
  const [currentYear, setCurrentYear] = useState(initialParsed.y);
  const [currentMonth, setCurrentMonth] = useState(initialParsed.m); // 0-indexed (June = 5)
  const [selectedDay, setSelectedDay] = useState(initialParsed.d);
  const [viewMode, setViewMode] = useState<'calendar' | 'year' | 'month'>('calendar');

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

  const shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Years range 1950 to 2026
  const years = Array.from({ length: 77 }, (_, i) => 2026 - i);

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

  const handleApplySet = () => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(selectedDay).padStart(2, '0');
    const result = `${formattedMonth}/${formattedDay}/${currentYear}`;
    onConfirmDate(result);
    onClose();
  };

  if (!visible) return null;

  return (
    <View className="mt-2 w-full rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
      {/* Header Month / Year controls */}
      <View className="flex-row items-center justify-between border-b border-surface-border pb-3">
        <Pressable
          onPress={() => setViewMode(viewMode === 'calendar' ? 'year' : 'calendar')}
          className="active:bg-surface-surfaceVariant flex-row items-center gap-1.5 rounded-lg px-2 py-1">
          <Text className="font-cairo text-[17px] font-bold text-brand-primary">
            {months[currentMonth]} {currentYear}
          </Text>
          <ChevronDown size={18} color="#1b5042" />
        </Pressable>

        {viewMode === 'calendar' && (
          <View className="flex-row items-center gap-1">
            <Pressable
              onPress={handlePrevMonth}
              className="active:bg-surface-surfaceVariant rounded-lg p-1.5">
              <ChevronLeft size={20} color="#1e1b17" />
            </Pressable>
            <Pressable
              onPress={handleNextMonth}
              className="active:bg-surface-surfaceVariant rounded-lg p-1.5">
              <ChevronRight size={20} color="#1e1b17" />
            </Pressable>
          </View>
        )}
      </View>

      {/* VIEW 1: Calendar View */}
      {viewMode === 'calendar' && (
        <>
          {/* Days Header */}
          <View className="flex-row justify-between pb-2 pt-3">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayStr) => (
              <View key={dayStr} className="w-10 items-center">
                <Text className="font-cairo text-[13px] font-semibold text-text-secondary">
                  {dayStr}
                </Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View className="flex-row flex-wrap justify-start">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <View key={`empty-${i}`} className="h-[40px] w-[41px]" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = dayNum === selectedDay;
              return (
                <Pressable
                  key={`day-${dayNum}`}
                  onPress={() => setSelectedDay(dayNum)}
                  className="m-[1px] h-[38px] w-[39px] items-center justify-center rounded-xl active:opacity-70"
                  style={{
                    backgroundColor: isSelected ? '#356859' : undefined,
                  }}>
                  <Text
                    className="font-cairo text-[14px]"
                    style={{
                      color: isSelected ? '#ffffff' : '#1e1b17',
                      fontWeight: isSelected ? '700' : '500',
                    }}>
                    {dayNum}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      {/* VIEW 2: Quick Year & Month Selector Grid */}
      {viewMode !== 'calendar' && (
        <View style={{ height: 260 }} className="pt-2">
          {/* Selector Tabs: Year vs Month */}
          <View className="bg-surface-surfaceVariant mb-3 flex-row rounded-xl p-1">
            <Pressable
              onPress={() => setViewMode('year')}
              className="flex-1 items-center rounded-lg py-1.5 active:opacity-80"
              style={{
                backgroundColor: viewMode === 'year' ? '#ffffff' : 'transparent',
              }}>
              <Text
                className="font-cairo text-[13px]"
                style={{
                  color: viewMode === 'year' ? '#356859' : '#6D6862',
                  fontWeight: viewMode === 'year' ? '700' : '400',
                }}>
                Select Year ({currentYear})
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode('month')}
              className="flex-1 items-center rounded-lg py-1.5 active:opacity-80"
              style={{
                backgroundColor: viewMode === 'month' ? '#ffffff' : 'transparent',
              }}>
              <Text
                className="font-cairo text-[13px]"
                style={{
                  color: viewMode === 'month' ? '#356859' : '#6D6862',
                  fontWeight: viewMode === 'month' ? '700' : '400',
                }}>
                Select Month ({shortMonths[currentMonth]})
              </Text>
            </Pressable>
          </View>

          {/* Year Grid List */}
          {viewMode === 'year' && (
            <ScrollView showsVerticalScrollIndicator={true} className="flex-1">
              <View className="flex-row flex-wrap justify-center gap-2 pb-2">
                {years.map((y) => (
                  <Pressable
                    key={y}
                    onPress={() => {
                      setCurrentYear(y);
                      setViewMode('month');
                    }}
                    className="w-[70px] items-center justify-center rounded-xl border py-2 active:opacity-80"
                    style={{
                      backgroundColor: y === currentYear ? '#356859' : '#FAF7F2',
                      borderColor: y === currentYear ? '#356859' : '#E4E0DA',
                    }}>
                    <Text
                      className="font-cairo text-[14px]"
                      style={{
                        color: y === currentYear ? '#ffffff' : '#1e1b17',
                        fontWeight: y === currentYear ? '700' : '400',
                      }}>
                      {y}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Month Grid List */}
          {viewMode === 'month' && (
            <View className="flex-1 flex-row flex-wrap items-center justify-center gap-2.5">
              {months.map((mName, idx) => (
                <Pressable
                  key={mName}
                  onPress={() => {
                    setCurrentMonth(idx);
                    setViewMode('calendar');
                  }}
                  className="w-[90px] items-center justify-center rounded-xl border py-2.5 active:opacity-80"
                  style={{
                    backgroundColor: idx === currentMonth ? '#356859' : '#FAF7F2',
                    borderColor: idx === currentMonth ? '#356859' : '#E4E0DA',
                  }}>
                  <Text
                    className="font-cairo text-[13px]"
                    style={{
                      color: idx === currentMonth ? '#ffffff' : '#1e1b17',
                      fontWeight: idx === currentMonth ? '700' : '400',
                    }}>
                    {mName}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Bottom Actions Bar */}
      <View className="mt-3 flex-row items-center justify-between border-t border-surface-border pt-3">
        {/* Left: Quick Actions (Today) */}
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

        {/* Right: Confirmation Controls (Close & Set Date) */}
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
  const [fullName, setFullName] = useState('Hamada');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('06/19/2003');

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
            onPress={toggleGenderPicker}
            className="flex-row items-center justify-between rounded-xl border border-surface-border bg-[#FAF7F2] px-3.5 py-2.5 active:opacity-80">
            <Text className="text-on-surface font-cairo text-[14px]">{gender}</Text>
            <ChevronDown size={18} color="#1e1b17" />
          </Pressable>
        </View>

        {/* DOB Input (Editable Type OR Calendar Icon Select) */}
        <View className="flex-1" style={{ gap: 6 }}>
          <Text className="text-on-surface font-cairo text-[14px] font-bold">DOB</Text>
          <View className="flex-row items-center justify-between rounded-xl border border-surface-border bg-[#FAF7F2] px-3 py-1.5">
            <TextInput
              value={dob}
              onChangeText={setDob}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#A8A29B"
              keyboardType="numbers-and-punctuation"
              style={{
                flex: 1,
                fontFamily: 'Cairo',
                fontSize: 14,
                color: '#1e1b17',
                paddingVertical: 2,
              }}
            />
            <Pressable
              onPress={toggleDatePicker}
              className="active:bg-surface-surfaceVariant rounded-lg p-1.5"
              accessibilityRole="button"
              accessibilityLabel="Open Calendar">
              <Calendar size={18} color="#1b5042" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Inline Gender Picker Options Accordion */}
      {isGenderPickerOpen && (
        <View className="mt-1 w-full rounded-xl border border-surface-border bg-white p-1 shadow-sm">
          {['Male', 'Female', 'Other'].map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                setGender(option);
                setIsGenderPickerOpen(false);
              }}
              className="active:bg-surface-surfaceVariant rounded-lg px-4 py-2.5">
              <Text className="text-on-surface font-cairo text-[14px] font-semibold">{option}</Text>
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

      {/* Add Member Button */}
      <Pressable
        onPress={handleSubmit}
        className="mt-1 h-12 w-full items-center justify-center rounded-2xl active:opacity-90"
        style={{ backgroundColor: '#FDBA5A' }}>
        <Text style={{ fontFamily: 'Cairo', fontSize: 16, fontWeight: '700', color: '#734a00' }}>
          Add Member
        </Text>
      </Pressable>
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

        {/* Conditional: Leave (only if current user is NOT Manager), Remove, or Promote */}
        {isCurrentUser && !isManager ? (
          // Regular Member (non-manager) — can Leave household
          <Pressable
            onPress={() => onLeave(member.id)}
            className="rounded-full active:opacity-70"
            style={{ paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#D32F2F' }}>
            <Text style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: '700', color: '#fff' }}>
              Leave
            </Text>
          </Pressable>
        ) : !isCurrentUser ? (
          <>
            {/* Promote (if target member is not already a manager) */}
            {!isManager && (
              <Pressable
                onPress={() => onPromote(member.id)}
                className="rounded-full active:opacity-70"
                style={{ paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#FDBA5A' }}>
                <Text
                  style={{
                    fontFamily: 'Cairo',
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#734a00',
                  }}>
                  Promote
                </Text>
              </Pressable>
            )}
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
