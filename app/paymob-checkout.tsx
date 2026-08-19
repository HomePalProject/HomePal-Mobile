import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { colors } from '@/src/theme';

export default function PaymobCheckoutScreen() {
  const { t } = useTranslation();
  const { url } = useLocalSearchParams<{ url: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  if (!url) {
    Alert.alert(t('error', 'Error'), t('invalidUrl', 'Invalid payment URL'));
    router.back();
    return null;
  }

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    // Intercept when Paymob redirects back to our backend or frontend success/error URL
    // e.g., if it redirects to our domain
    if (
      navState.url.includes('homepal.runasp.net') &&
      (navState.url.includes('success') || navState.url.includes('transaction'))
    ) {
      const isSuccess = navState.url.includes('success=true');

      if (isSuccess) {
        Alert.alert(
          t('paymentSuccess', 'Payment Successful'),
          t(
            'paymentSuccessDesc',
            'Your subscription has been updated. It might take a moment for the changes to reflect.'
          ),
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          t('paymentFailed', 'Payment Failed'),
          t('paymentFailedDesc', 'There was an issue processing your payment.'),
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.brand.primary} />
        </Pressable>
        <Text style={styles.headerBarTitle}>{t('checkout', 'Secure Checkout')}</Text>
        <View style={styles.backBtn} />
      </View>

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },
  backBtn: {
    padding: 4,
    width: 32,
    alignItems: 'center',
  },
  headerBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.brand.primary,
    fontFamily: 'Cairo_700Bold',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
