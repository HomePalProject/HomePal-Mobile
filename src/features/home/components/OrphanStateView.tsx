import React from 'react';
import { View, ScrollView } from 'react-native';
import { Home, PlusCircle, Mail } from 'lucide-react-native';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import { ProTipCard } from '@/src/components/ui/pro-tip-card';

export interface OrphanStateViewProps {
  onCreateHousehold: () => void;
  onViewInvitations: () => void;
}

export function OrphanStateView({ onCreateHousehold, onViewInvitations }: OrphanStateViewProps) {
  return (
    <ScrollView
      className="flex-1 bg-surface-background px-spacing-24"
      contentContainerStyle={{ paddingVertical: 32, gap: 32 }}
      showsVerticalScrollIndicator={false}>
      {/* Welcome Title */}
      <View className="items-start gap-spacing-8">
        <Text className="text-h2 font-cairo font-bold text-brand-primary">Welcome to HomePal!</Text>
        {/* Accent Underline */}
        <View className="h-[4px] w-[56px] rounded-radius-full bg-brand-accent" />
      </View>

      {/* Central Empty State */}
      <View className="items-center gap-spacing-24 py-spacing-16">
        {/* Circular Icon Container */}
        <View className="border-brand-primary/10 bg-brand-primary-container/20 h-32 w-32 items-center justify-center rounded-radius-full border">
          <Icon as={Home} size={48} className="text-brand-primary" />
        </View>

        {/* Text Details */}
        <View className="items-center gap-spacing-8 px-spacing-8">
          <Text className="text-bodyLarge text-center font-cairo font-bold text-text-primary">
            You don't belong to any household yet
          </Text>
          <Text className="text-bodySmall text-center font-cairo leading-[20px] text-text-secondary">
            Create your own household to start managing your groceries and meals, or check if you
            have pending invitations
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-spacing-16">
        <Button
          onPress={onCreateHousehold}
          className="h-14 w-full flex-row items-center justify-center gap-spacing-8 rounded-radius-full bg-brand-primary shadow-md active:bg-brand-primary-pressed">
          <Icon as={PlusCircle} size={20} className="text-text-inverse" />
          <Text className="text-body font-cairo font-bold text-text-inverse">
            Create a New Household
          </Text>
        </Button>

        <Button
          onPress={onViewInvitations}
          variant="outline"
          className="border-brand-primary/40 active:bg-brand-primary-container/10 h-14 w-full flex-row items-center justify-center gap-spacing-8 rounded-radius-full">
          <Icon as={Mail} size={20} className="text-brand-primary" />
          <Text className="text-body font-cairo font-bold text-brand-primary">
            View Pending Invitations
          </Text>
        </Button>
      </View>

      {/* Bottom Pro Tip */}
      <ProTipCard
        description="Households allow you to sync shopping lists and meal plans with family or roommates in real-time."
        className="mt-spacing-8"
      />
    </ScrollView>
  );
}
