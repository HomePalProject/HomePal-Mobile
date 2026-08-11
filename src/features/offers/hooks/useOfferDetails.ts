import { useState, useEffect } from 'react';
import { offersService } from '@/src/services/api/offers.service';
import { Offer } from '../types';

export const useOfferDetails = (offerId: string | undefined) => {
  const [data, setData] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOffer = async () => {
      if (!offerId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await offersService.getOfferById(offerId);
        if (isMounted) {
          setData(response.data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOffer();

    return () => {
      isMounted = false;
    };
  }, [offerId]);

  return { data, isLoading, error };
};
