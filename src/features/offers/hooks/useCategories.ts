import { useState, useEffect } from 'react';
import { productsService } from '@/src/services/api/products.service';
import { ProductCategory } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productsService.getCategories();
        setCategories(response.data || []);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
