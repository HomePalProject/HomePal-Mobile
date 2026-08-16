export interface LocalizedItem {
  culture?: string;
  value?: string;
}

export interface HouseholdKpisDto {
  itemsInInventory?: number | string;
  householdMembers?: number | string;
  monthlyBudget?: number | string;
  monthlyExpenses?: number | string;
  monthlyRemaining?: number | string;
  totalGeneratedMealPlans?: number | string;
}

export interface MonthlyExpenseTrendDto {
  year?: number | string;
  month?: number | string;
  amount?: number | string;
}

export interface CategoryPurchaseDto {
  categoryName?: LocalizedItem[];
  purchaseCount?: number | string;
}

export interface SupermarketUsageDto {
  supermarketName?: LocalizedItem[];
  purchaseCount?: number | string;
}

export interface InventoryCategoryCountDto {
  categoryName?: LocalizedItem[];
  count?: number | string;
  percentage?: number | string;
}

export interface InventoryUnitBreakdownDto {
  unitName?: LocalizedItem[];
  unitSymbol?: LocalizedItem[];
  totalQuantity?: number | string;
}

export interface InventoryDistributionDto {
  totalItems?: number | string;
  categories?: InventoryCategoryCountDto[];
  unitBreakdown?: InventoryUnitBreakdownDto[];
}

export interface BudgetOverviewReportDto {
  year?: number | string;
  month?: number | string;
  monthlyTarget?: number | string;
  totalSpent?: number | string;
  remaining?: number | string;
  spentPercentage?: number | string;
}

export interface HouseholdOverviewReportDto {
  kpis?: HouseholdKpisDto;
  expensesOverTime?: MonthlyExpenseTrendDto[];
  mostBoughtCategories?: CategoryPurchaseDto[];
  mostUsedSupermarkets?: SupermarketUsageDto[];
  inventoryDistribution?: InventoryDistributionDto;
  budgetOverview?: BudgetOverviewReportDto;
}
