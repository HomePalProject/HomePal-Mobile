import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Offer } from '../types';
import { Calendar, Tag as TagIcon } from 'lucide-react-native';
import { env } from '@/src/config/env';

interface OfferCardProps {
  offer: Offer;
  onPress?: (offer: Offer) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onPress }) => {
  // Format dates nicely
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate discount percentage if original price is > discounted price
  const hasDiscount = offer.originalPrice > offer.discountedPrice;
  const discountPercent = hasDiscount
    ? Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)
    : 0;

  const baseUrl = env.API_BASE_URL.endsWith('/') ? env.API_BASE_URL : `${env.API_BASE_URL}/`;
  const getFullImageUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Remove leading slash if present to avoid double slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}${cleanPath}`;
  };

  const imageUri = getFullImageUrl(offer.imagePath);
  const logoUri = getFullImageUrl(offer.supermarketLogoPath);

  return (
    <TouchableOpacity
      onPress={() => onPress?.(offer)}
      activeOpacity={0.8}
      className="mb-4 overflow-hidden rounded-2xl border border-surface-border bg-surface-surface shadow-sm">
      {/* Header section: Supermarket Info + Discount Badge */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          {logoUri ? (
            <Image
              source={{ uri: logoUri }}
              className="bg-surface-surfaceVariant h-8 w-8 rounded-full border border-surface-border"
              resizeMode="contain"
            />
          ) : (
            <View className="h-8 w-8 items-center justify-center rounded-full bg-brand-primary-container">
              <Text className="font-cairo text-xs font-bold text-brand-primary">
                {offer.supermarketName.charAt(0)}
              </Text>
            </View>
          )}
          <Text className="font-cairo text-[14px] font-bold text-text-primary">
            {offer.supermarketName}
          </Text>
        </View>

        {hasDiscount && (
          <View className="rounded-full bg-status-error px-2.5 py-1">
            <Text className="font-cairo text-[12px] font-bold text-white">
              -{discountPercent}% OFF
            </Text>
          </View>
        )}
      </View>

      {/* Main Image Banner */}
      <View className="bg-surface-surfaceVariant h-40 w-full">
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="font-cairo text-text-secondary opacity-50">No Image Available</Text>
          </View>
        )}
      </View>

      {/* Content Details */}
      <View className="p-4" style={{ gap: 8 }}>
        <Text
          className="font-cairo text-[18px] font-bold leading-tight text-text-primary"
          numberOfLines={2}>
          {offer.title}
        </Text>

        <View className="flex-row flex-wrap items-center gap-2">
          {offer.categoryName && (
            <View className="bg-surface-surfaceVariant rounded-full px-3 py-1">
              <Text className="font-cairo text-[12px] font-medium text-text-secondary">
                {offer.categoryName}
              </Text>
            </View>
          )}
          {offer.description && (
            <View className="bg-surface-surfaceVariant rounded-full px-3 py-1">
              <Text className="font-cairo text-[12px] font-medium text-text-secondary">
                {offer.description}
              </Text>
            </View>
          )}
        </View>

        <View className="my-2 h-[1px] w-full bg-surface-divider" />

        {/* Footer: Date & Price */}
        <View className="flex-row items-end justify-between">
          <View className="flex-row items-center gap-1.5 opacity-80">
            <Calendar size={14} className="text-text-secondary" />
            <Text className="font-cairo text-[13px] text-text-secondary">
              Valid until {formatDate(offer.validTo) || 'End of Stock'}
            </Text>
          </View>

          <View className="flex-row items-baseline gap-2">
            <Text className="font-cairo text-[22px] font-bold text-brand-primary">
              {offer.discountedPrice}
              <Text className="text-[14px]"> EGP</Text>
            </Text>
            {hasDiscount && (
              <Text className="font-cairo text-[14px] font-medium text-text-disabled line-through">
                {offer.originalPrice} EGP
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
