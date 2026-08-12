import React from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/src/components/ui/text';
import { ArrowLeft, Calendar, Tag as TagIcon, ShoppingCart } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { useOfferDetails } from '../hooks/useOfferDetails';
import { env } from '@/src/config/env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OfferDetailsScreenProps {
  offerId: string;
}

export const OfferDetailsScreen: React.FC<OfferDetailsScreenProps> = ({ offerId }) => {
  const router = useRouter();
  const { data: offer, isLoading, error } = useOfferDetails(offerId);
  const insets = useSafeAreaInsets();

  // Format dates nicely
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const baseUrl = env.API_BASE_URL.endsWith('/') ? env.API_BASE_URL : `${env.API_BASE_URL}/`;
  const getFullImageUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}${cleanPath}`;
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-background">
        <ActivityIndicator size="large" className="text-brand-primary" />
      </View>
    );
  }

  if (error || !offer) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-background px-4">
        <Text className="mb-4 text-center font-cairo font-bold text-status-error">
          Error loading offer details
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-full bg-brand-primary px-6 py-2">
          <Text className="font-cairo font-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasDiscount = offer.originalPrice > offer.discountedPrice;
  const discountAmount = hasDiscount ? offer.originalPrice - offer.discountedPrice : 0;
  const discountPercent = hasDiscount
    ? Math.round((discountAmount / offer.originalPrice) * 100)
    : 0;

  const imageUri = getFullImageUrl(offer.imagePath);
  const logoUri = getFullImageUrl(offer.supermarketLogoPath);

  const handleVisitWebsite = () => {
    if (offer.supermarketWebsiteUrl) {
      Linking.openURL(offer.supermarketWebsiteUrl);
    }
  };

  return (
    <View className="flex-1 bg-surface-background">
      {/* Top Header */}
      <View
        className="flex-row items-center justify-between border-b border-surface-border bg-surface-surface px-4 py-4 shadow-sm"
        style={{ paddingTop: Platform.OS === 'ios' ? 50 : 20 }}>
        <TouchableOpacity onPress={() => router.back()} className="-ml-2 flex-row items-center p-2">
          <Icon as={ArrowLeft} size={24} className="text-text-primary" />
          <Text className="ml-1 font-cairo text-[16px] font-bold text-text-primary">
            Back to Offers
          </Text>
        </TouchableOpacity>
        <Text className="font-cairo text-[18px] font-extrabold text-brand-primary">
          Offer Details
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Image Banner */}
        <View className="bg-surface-surfaceVariant relative h-64 w-full">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="font-cairo text-text-secondary opacity-50">No Image Available</Text>
            </View>
          )}

          {hasDiscount && (
            <View className="absolute left-4 top-4 rounded-full bg-status-error px-3 py-1.5 shadow-sm">
              <Text className="font-cairo text-[14px] font-bold text-white">
                -{discountPercent}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* Details Content Container */}
        <View className="px-5 pb-24 pt-6" style={{ gap: 20 }}>
          {/* Header Title & Pills */}
          <View>
            <Text className="mb-3 font-cairo text-[24px] font-extrabold leading-tight text-text-primary">
              {offer.name}
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {offer.categoryName && (
                <View className="bg-surface-surfaceVariant rounded-full border border-surface-border px-4 py-1.5">
                  <Text className="font-cairo text-[13px] font-bold text-text-secondary">
                    {offer.categoryName}
                  </Text>
                </View>
              )}
              {offer.quantity != null && (
                <View className="bg-surface-surfaceVariant rounded-full border border-surface-border px-4 py-1.5">
                  <Text className="font-cairo text-[13px] font-bold text-text-secondary">
                    {offer.quantity} {offer.unitName}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Total Savings Highlight Box */}
          {hasDiscount && (
            <View className="flex-row items-center justify-between rounded-2xl bg-brand-primary p-5 shadow-sm">
              <View>
                <Text className="mb-1 font-cairo text-[14px] font-bold uppercase tracking-wider text-white/90">
                  Total Savings
                </Text>
                <Text className="font-cairo text-[22px] font-extrabold text-white">
                  {discountAmount.toFixed(2)} EGP
                </Text>
              </View>
              <View className="rounded-xl bg-white/20 px-4 py-2">
                <Text className="font-cairo text-[16px] font-extrabold text-white">
                  {discountPercent}% OFF
                </Text>
              </View>
            </View>
          )}

          {/* Pricing Details */}
          <View className="border-brand-primary/20 rounded-2xl border bg-brand-primary-container p-5">
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="mb-1 font-cairo text-[13px] font-bold text-brand-primary opacity-80">
                  SPECIAL DEAL PRICE
                </Text>
                <View className="flex-row items-baseline gap-1">
                  <Text className="font-cairo text-[32px] font-extrabold text-brand-primary">
                    {offer.discountedPrice}
                  </Text>
                  <Text className="font-cairo text-[16px] font-bold text-brand-primary">EGP</Text>
                </View>
              </View>

              {hasDiscount && (
                <View className="items-end">
                  <Text className="mb-1 font-cairo text-[13px] font-bold text-text-secondary">
                    Original Price
                  </Text>
                  <Text className="font-cairo text-[18px] font-bold text-text-disabled line-through">
                    {offer.originalPrice} EGP
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Supermarket Info */}
          <View className="rounded-2xl border border-surface-border bg-surface-surface p-5 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="font-cairo text-[13px] font-bold uppercase tracking-wider text-text-secondary">
                Supermarket
              </Text>
              {offer.isVerified && (
                <View className="bg-brand-primary/10 rounded px-2 py-0.5 text-[10px]">
                  <Text className="font-cairo text-xs font-bold text-brand-primary">Verified</Text>
                </View>
              )}
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center pr-4">
                {logoUri ? (
                  <Image
                    source={{ uri: logoUri }}
                    className="bg-surface-surfaceVariant h-12 w-12 rounded-full border border-surface-border"
                    resizeMode="contain"
                  />
                ) : (
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-primary-container">
                    <Text className="font-cairo text-[18px] font-bold text-brand-primary">
                      {offer.supermarketName.charAt(0)}
                    </Text>
                  </View>
                )}
                <Text className="ml-3 flex-1 font-cairo text-[18px] font-bold text-text-primary">
                  {offer.supermarketName}
                </Text>
              </View>

              {offer.supermarketWebsiteUrl && (
                <TouchableOpacity
                  onPress={handleVisitWebsite}
                  className="bg-surface-surfaceVariant rounded-full border border-surface-border px-4 py-2">
                  <Text className="font-cairo text-[13px] font-bold text-text-primary">
                    Visit Website
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Validity Period */}
          <View className="flex-row items-center rounded-2xl border border-surface-border bg-surface-surface p-5 shadow-sm">
            <View className="bg-brand-primary/10 mr-4 h-10 w-10 items-center justify-center rounded-full">
              <Icon as={Calendar} size={20} className="text-brand-primary" />
            </View>
            <View className="flex-1">
              <Text className="mb-1 font-cairo text-[13px] font-bold uppercase tracking-wider text-text-secondary">
                Validity Period
              </Text>
              <Text className="font-cairo text-[15px] font-bold text-text-primary">
                {formatDate(offer.validFrom) || 'Now'} -{' '}
                {formatDate(offer.validTo) || 'End of Stock'}
              </Text>
            </View>
          </View>

          {/* Description */}
          {offer.description && (
            <View className="mb-4">
              <Text className="mb-2 font-cairo text-[16px] font-extrabold text-text-primary">
                Description
              </Text>
              <Text className="font-cairo text-[15px] leading-6 text-text-secondary">
                {offer.description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-surface-border bg-surface-surface p-4 shadow-lg"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <TouchableOpacity className="h-[56px] w-full flex-row items-center justify-center rounded-full bg-brand-primary">
          <ShoppingCart size={20} color="#FFFFFF" className="mr-2" />
          <Text className="font-cairo text-[16px] font-bold text-white">Add to Shopping List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
