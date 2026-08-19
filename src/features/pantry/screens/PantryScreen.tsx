import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { colors } from '@/src/theme/colors';
import { usePantry } from '../hooks/usePantry';
import { usePantryExpiryNotifications } from '../hooks/usePantryExpiryNotifications';
import {
  PantryHeader,
  PantryCategoryFilters,
  PantrySearchBar,
  PantrySkeleton,
  PantryErrorView,
  PantryEmptyView,
  PantryList,
  PantryFAB,
  AIScanModal,
  ImagePickerSheet,
  PantryNotificationModal,
  PantryStockAlertCard,
} from '../components';
import { useTranslation } from 'react-i18next';
import { ScannedItem } from '../components/AIScanItemRow';

export default function PantryScreen() {
  const router = useRouter();
  const { t } = useTranslation('pantry');

  // Sync scheduled expiry alerts on Redux state updates
  usePantryExpiryNotifications();
  const {
    items,
    categories,
    measuringUnits,
    isLoading,
    error,
    loadPantry,
    addItem,
    editItem,
    clearError,
    scanPantryImage,
    isInitialized,
  } = usePantry();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Identify all expiring/expired pantry items sorted by expiration date (within 7 days or past)
  const expiringItems = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return items
      .filter((item) => {
        if (!item.expireDate) return false;
        const expiry = new Date(item.expireDate);
        expiry.setHours(0, 0, 0, 0);
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      })
      .sort((a, b) => {
        const dateA = new Date(a.expireDate!);
        const dateB = new Date(b.expireDate!);
        return dateA.getTime() - dateB.getTime();
      });
  }, [items]);

  // Scan Modal States
  const [isScanModalVisible, setIsScanModalVisible] = useState(false);
  const [scanStatus, setScanStatus] = useState<'loading' | 'success'>('loading');
  const [isSavingScanned, setIsSavingScanned] = useState(false);
  const imagePickerRef = useRef<BottomSheetModal>(null);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [notification, setNotification] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  useEffect(() => {
    loadPantry();
  }, [loadPantry]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadPantry();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRetry = () => {
    clearError();
    loadPantry();
  };

  const handleAddItem = () => {
    router.push('/add-pantry-item' as Href);
  };

  const startRealScan = async (imageUri: string) => {
    setIsScanModalVisible(true);
    setScanStatus('loading');
    setScannedItems([]);
    try {
      const results = await scanPantryImage(imageUri);
      const mapped = results.map((bi) => ({
        name: bi.name,
        quantity: bi.quantity,
        categoryId: bi.categoryId,
        measuringUnitId: bi.measuringUnitId,
        expireDate: bi.suggestedExpireDate ? bi.suggestedExpireDate.split('T')[0] : '',
        selected: true,
      }));
      setScannedItems(mapped);
      setScanStatus('success');
    } catch {
      setIsScanModalVisible(false);
      setNotification({
        visible: true,
        type: 'error',
        title: t('scanErrorTitle'),
        message: t('scanErrorMsg'),
      });
    }
  };

  const handleScanItem = () => {
    imagePickerRef.current?.present();
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      setNotification({
        visible: true,
        type: 'error',
        title: t('permissionDenied'),
        message: t('cameraPermission'),
      });
      return;
    }
    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      startRealScan(pickerResult.assets[0].uri);
    }
  };

  const handleChooseFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setNotification({
        visible: true,
        type: 'error',
        title: t('permissionDenied'),
        message: t('libraryPermission'),
      });
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      startRealScan(pickerResult.assets[0].uri);
    }
  };

  const handleAddScannedItems = async (scannedItems: Omit<ScannedItem, 'selected'>[]) => {
    setIsSavingScanned(true);
    try {
      const promises = scannedItems.map((scanned) => {
        const match = items.find((i) => i.name.toLowerCase() === scanned.name.toLowerCase());
        if (match) {
          return editItem(match.id, {
            name: match.name,
            quantity: match.quantity + scanned.quantity,
            measuringUnitId: match.measuringUnitId,
            categoryId: match.categoryId,
            expireDate: match.expireDate,
          });
        } else {
          return addItem({
            name: scanned.name,
            quantity: scanned.quantity,
            measuringUnitId: scanned.measuringUnitId,
            categoryId: scanned.categoryId,
            expireDate: scanned.expireDate ? new Date(scanned.expireDate).toISOString() : null,
          });
        }
      });

      await Promise.all(promises);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsScanModalVisible(false);
      loadPantry();
      setNotification({
        visible: true,
        type: 'success',
        title: t('success'),
        message: t('itemsAddedSuccess'),
      });
    } catch {
      setNotification({
        visible: true,
        type: 'error',
        title: t('addScannedErrorTitle'),
        message: t('addScannedErrorMsg'),
      });
    } finally {
      setIsSavingScanned(false);
    }
  };

  const renderContent = () => {
    // Show skeleton if we are currently fetching data OR if we have never successfully fetched data yet
    if (!isInitialized || isLoading) {
      return <PantrySkeleton />;
    }

    if (error) {
      return <PantryErrorView onRetry={handleRetry} />;
    }

    if (items.length === 0) {
      return <PantryEmptyView />;
    }

    const filteredItems = items.filter((item) => {
      const matchesCategory =
        selectedCategoryId === 'all' || item.categoryId === selectedCategoryId;
      const matchesSearch =
        !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <View className="flex-1">
        <PantryCategoryFilters
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <PantrySearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <PantryStockAlertCard
          expiringItems={expiringItems}
          onPressCheckDeals={() => {
            const firstItemName = expiringItems[0]?.name || '';
            router.push({
              pathname: '/(tabs)/shop',
              params: { query: firstItemName },
            } as any);
          }}
        />
        <PantryList
          items={filteredItems}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.brand.primary]}
              tintColor={colors.brand.primary}
            />
          }
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="flex-1">
        <PantryHeader />
        {renderContent()}
        <PantryFAB onAddPress={handleAddItem} onScanPress={handleScanItem} />
      </View>

      <AIScanModal
        visible={isScanModalVisible}
        status={scanStatus}
        categories={categories}
        measuringUnits={measuringUnits}
        onClose={() => setIsScanModalVisible(false)}
        onAddSelected={handleAddScannedItems}
        isSaving={isSavingScanned}
        scannedItems={scannedItems}
      />

      <ImagePickerSheet
        ref={imagePickerRef}
        onTakePhoto={handleTakePhoto}
        onChooseFromGallery={handleChooseFromGallery}
      />

      <PantryNotificationModal
        visible={notification.visible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}
