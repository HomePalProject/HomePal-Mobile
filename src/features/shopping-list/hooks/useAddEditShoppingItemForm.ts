import { useState, useEffect } from 'react';
import { ShoppingListItemResponse } from '@/src/types/api';

export function useAddEditShoppingItemForm(editItem?: ShoppingListItemResponse | null) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [portionCount, setPortionCount] = useState('1');
  const [price, setPrice] = useState('');
  const [unitId, setUnitId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setName('');
    setQuantity('1');
    setPortionCount('1');
    setPrice('');
    setUnitId(null);
    setCategoryId(null);
    setNotes('');
  };

  useEffect(() => {
    if (editItem) {
      setName(editItem.name || '');
      setQuantity(String(editItem.quantity || 1));
      setPortionCount(String(editItem.portionCount || 1));
      setPrice(
        editItem.price ? editItem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
      );
      setUnitId(editItem.unitId || null);
      setCategoryId(editItem.categoryId || null);
      setNotes(editItem.notes || '');
    } else {
      resetForm();
    }
  }, [editItem]);

  const handlePriceChange = (text: string) => {
    let cleaned = text.replace(/[^0-9.]/g, '');
    if (!cleaned) {
      setPrice('');
      return;
    }

    const parts = cleaned.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts.slice(1).join('').slice(0, 2) : '';

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setPrice(formattedInteger + decimalPart);
  };

  return {
    name,
    setName,
    quantity,
    setQuantity,
    portionCount,
    setPortionCount,
    price,
    handlePriceChange,
    unitId,
    setUnitId,
    categoryId,
    setCategoryId,
    notes,
    setNotes,
    resetForm,
  };
}
