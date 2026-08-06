import { useState, useEffect, useCallback } from 'react';
import { offersService } from '@/src/services/api/offers.service';
import { Offer, OfferSearchParams, PaginatedList } from '../types';

export const useOffers = (initialParams: OfferSearchParams = {}) => {
  const [params, setParams] = useState<OfferSearchParams>({ pageSize: 5, ...initialParams });
  const [data, setData] = useState<PaginatedList<Offer> | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOffers = useCallback(
    async (currentParams: OfferSearchParams, append = false, refresh = false) => {
      try {
        if (refresh) {
          setIsRefreshing(true);
        } else if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const response = await offersService.searchOffers(currentParams);
        const resultData = response.data;

        if (resultData) {
          setData(resultData);
          setOffers((prev) => (append ? [...prev, ...resultData.items] : resultData.items));
        } else {
          setData(null);
          setOffers(append ? offers : []);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [offers]
  );

  // Initial load or parameter changes (excluding page changes unless reset)
  useEffect(() => {
    fetchOffers(params, false, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.query, params.categoryId, params.supermarketId, params.activeOnly]);

  const updateFilters = (newParams: Partial<OfferSearchParams>) => {
    setParams((prev) => ({ ...prev, ...newParams, pageNumber: 1 }));
  };

  const loadMore = () => {
    if (data?.hasNextPage && !isLoadingMore && !isLoading && !isRefreshing) {
      const nextPage = (params.pageNumber || 1) + 1;
      setParams((prev) => ({ ...prev, pageNumber: nextPage }));
      fetchOffers({ ...params, pageNumber: nextPage }, true, false);
    }
  };

  const refresh = () => {
    setParams((prev) => ({ ...prev, pageNumber: 1 }));
    fetchOffers({ ...params, pageNumber: 1 }, false, true);
  };

  return {
    offers,
    data,
    params,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    updateFilters,
    loadMore,
    refresh,
  };
};
