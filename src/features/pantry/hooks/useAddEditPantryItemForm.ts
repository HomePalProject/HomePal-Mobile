import { useState, useEffect } from 'react';
import { ProductCategoryResponse, MeasuringUnitResponse } from '@/src/types/api';

export function useAddEditPantryItemForm(
  isEditMode: boolean,
  currentItem: any,
  categories: ProductCategoryResponse[],
  measuringUnits: MeasuringUnitResponse[]
) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expireDate, setExpireDate] = useState(''); // Stores YYYY-MM-DD
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryResponse | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<MeasuringUnitResponse | null>(null);

  useEffect(() => {
    if (isEditMode && currentItem) {
      setName(currentItem.name);
      setQuantity(currentItem.quantity);
      if (currentItem.expireDate) {
        setExpireDate(currentItem.expireDate.split('T')[0]);
      }

      const matchedCategory = categories.find((c) => c.id === currentItem.categoryId);
      if (matchedCategory) setSelectedCategory(matchedCategory);

      const matchedUnit = measuringUnits.find((u) => u.id === currentItem.measuringUnitId);
      if (matchedUnit) setSelectedUnit(matchedUnit);
    }
  }, [isEditMode, currentItem, categories, measuringUnits]);

  const isFormValid =
    name.trim().length > 0 && quantity > 0 && selectedCategory !== null && selectedUnit !== null;

  return {
    name,
    setName,
    quantity,
    setQuantity,
    expireDate,
    setExpireDate,
    selectedCategory,
    setSelectedCategory,
    selectedUnit,
    setSelectedUnit,
    isFormValid,
  };
}
