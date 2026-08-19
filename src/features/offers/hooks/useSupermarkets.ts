import { useState, useEffect } from 'react';
import { supermarketsService } from '@/src/services/api/supermarkets.service';
import { Supermarket } from '../types';

export const useSupermarkets = () => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSupermarkets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await supermarketsService.getSupermarkets();
        setSupermarkets(response.data?.items || []);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupermarkets();
  }, []);

  return { supermarkets, isLoading, error };
};
