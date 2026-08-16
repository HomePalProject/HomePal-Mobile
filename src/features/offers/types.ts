export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string | null;
  imagePath?: string | null;
  createdAt: string;
}

export interface Supermarket {
  id: string;
  name: string;
  logoPath?: string | null;
  address?: string | null;
  websiteUrl?: string | null;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  name?: string;
  description?: string | null;
  originalPrice: number;
  discountedPrice: number;
  quantity?: number | null;
  unitName?: string | null;
  isVerified?: boolean;
  validFrom?: string | null;
  validTo?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  imagePath?: string | null;
  supermarketId: string;
  supermarketName: string;
  supermarketLogoPath?: string | null;
  supermarketWebsiteUrl?: string | null;
  canonicalProductId?: string | null;
  canonicalProductName?: string | null;
  createdAt: string;
}

export interface OfferSearchParams {
  query?: string;
  categoryId?: string;
  supermarketId?: string;
  activeOnly?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
