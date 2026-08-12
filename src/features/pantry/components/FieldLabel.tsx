import React from 'react';
import { Text } from 'react-native';

interface FieldLabelProps {
  label: string;
  required?: boolean;
}

export function FieldLabel({ label, required }: FieldLabelProps) {
  return (
    <Text className="text-caption mb-spacing-8 font-cairo font-bold text-text-secondary">
      {label}
      {required ? <Text className="text-status-error"> *</Text> : null}
    </Text>
  );
}
