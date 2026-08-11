import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePantry } from '../hooks/usePantry';
import {
  PantryHeader,
  PantryCategoryFilters,
  PantrySearchBar,
  PantryRecommendationCard,
  PantrySkeleton,
  PantryErrorView,
  PantryEmptyView,
  PantryList,
  PantryFAB,
} from '../components';

export default function PantryScreen() {
  const router = useRouter();
  const { items, categories, isLoading, error, loadPantry, clearError } = usePantry();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadPantry();
  }, [loadPantry]);

  const handleRetry = () => {
    clearError();
    loadPantry();
  };

  const handleAddItem = () => {
    router.push('/add-pantry-item');
  };

  const handleScanItem = () => {
    router.push('/add-pantry-item');
  };

  const renderContent = () => {
    if (isLoading) {
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
        <PantryRecommendationCard />
        <PantryList items={filteredItems} />
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
    </SafeAreaView>
  );
}
