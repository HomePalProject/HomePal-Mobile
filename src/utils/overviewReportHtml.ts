import { HouseholdOverviewReportDto, LocalizedItem } from '@/src/features/overview/types';

const formatCurrency = (value: number | string | undefined) => {
  if (value === undefined || value === null) return '0.00 EGP';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return String(value) + ' EGP';
  const fixed = num.toFixed(2);
  const [integer, decimal] = fixed.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formattedInteger}.${decimal} EGP`;
};

const getCategoryName = (categoryName?: LocalizedItem[]) => {
  if (!categoryName || categoryName.length === 0) return 'Other';
  const engItem = categoryName.find((item) => item.culture?.toLowerCase().startsWith('en'));
  return engItem?.value || categoryName[0]?.value || 'Other';
};

const formatValue = (value: number | string | undefined) => {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return String(value);
  const fixed = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
  const [integer, decimal] = fixed.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export function generateOverviewReportHtml(data: HouseholdOverviewReportDto): string {
  const kpis = data.kpis;
  const expensesOverTime = data.expensesOverTime || [];
  const inventoryDistribution = data.inventoryDistribution;
  const budgetOverview = data.budgetOverview;

  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const MONTHS_FULL = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const expensesRows = expensesOverTime
    .map((item) => {
      const m = typeof item.month === 'number' ? item.month : parseInt(item.month || '1', 10);
      const monthName = MONTHS_FULL[m - 1] || 'Month ' + m;
      return `
      <tr>
        <td>${monthName} ${item.year || ''}</td>
        <td style="text-align: right; font-weight: bold; color: #356859;">${formatCurrency(item.amount)}</td>
      </tr>
    `;
    })
    .join('');

  const inventoryRows = (inventoryDistribution?.categories || [])
    .map((item) => {
      const pct =
        typeof item.percentage === 'number' ? item.percentage : parseFloat(item.percentage || '0');
      return `
      <tr>
        <td>${getCategoryName(item.categoryName)}</td>
        <td style="text-align: right;">${formatValue(item.count)}</td>
        <td style="text-align: right; color: #D99A3D; font-weight: 600;">${pct.toFixed(1)}%</td>
      </tr>
    `;
    })
    .join('');

  const remaining =
    typeof budgetOverview?.remaining === 'number'
      ? budgetOverview.remaining
      : parseFloat(budgetOverview?.remaining || '0');
  const spentPct =
    typeof budgetOverview?.spentPercentage === 'number'
      ? budgetOverview.spentPercentage
      : parseFloat(budgetOverview?.spentPercentage || '0');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>HomePal Household Overview Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        body {
          font-family: 'Cairo', sans-serif;
          color: #2D2A26;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          border-bottom: 3px solid #356859;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        .brand {
          font-size: 28px;
          font-weight: 700;
          color: #356859;
        }
        .subtitle {
          font-size: 14px;
          color: #6D6862;
          margin-top: 5px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #356859;
          margin-top: 30px;
          margin-bottom: 15px;
          border-bottom: 1px solid #E4E0DA;
          padding-bottom: 5px;
        }
        .kpi-table, .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .kpi-table td {
          width: 50%;
          padding: 12px;
          border: 1px solid #E4E0DA;
          background-color: #F4F2EE;
        }
        .kpi-label {
          font-size: 12px;
          color: #6D6862;
          font-weight: 600;
          text-transform: uppercase;
        }
        .kpi-value {
          font-size: 20px;
          font-weight: 700;
          color: #356859;
          margin-top: 5px;
        }
        .data-table th {
          background-color: #356859;
          color: #ffffff;
          font-weight: 700;
          padding: 10px;
          text-align: left;
          font-size: 13px;
        }
        .data-table td {
          padding: 10px;
          border-bottom: 1px solid #E4E0DA;
          font-size: 14px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #A8A29B;
          border-top: 1px solid #E4E0DA;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">HomePal</div>
        <div class="subtitle">Household Overview & Analytics Report</div>
        <div class="subtitle" style="font-weight: 600;">Generated on: ${generatedDate}</div>
      </div>

      <div class="section-title">Key Performance Indicators</div>
      <table class="kpi-table">
        <tr>
          <td>
            <div class="kpi-label">Items in Inventory</div>
            <div class="kpi-value">${formatValue(kpis?.itemsInInventory)}</div>
          </td>
          <td>
            <div class="kpi-label">Household Members</div>
            <div class="kpi-value">${formatValue(kpis?.householdMembers)}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="kpi-label">Monthly Budget</div>
            <div class="kpi-value">${formatCurrency(kpis?.monthlyBudget)}</div>
          </td>
          <td>
            <div class="kpi-label">Monthly Expenses</div>
            <div class="kpi-value" style="color: ${remaining < 0 ? '#D9534F' : '#356859'};">
              ${formatCurrency(kpis?.monthlyExpenses)}
            </div>
          </td>
        </tr>
      </table>

      <div class="section-title">Budget Overview (Current Month)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 50%;">Metric</th>
            <th style="width: 50%; text-align: right;">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monthly Target Budget</td>
            <td style="text-align: right; font-weight: bold;">${formatCurrency(budgetOverview?.monthlyTarget)}</td>
          </tr>
          <tr>
            <td>Total Spent</td>
            <td style="text-align: right; font-weight: bold; color: ${remaining < 0 ? '#D9534F' : '#2D2A26'}">${formatCurrency(budgetOverview?.totalSpent)}</td>
          </tr>
          <tr>
            <td>Remaining Balance</td>
            <td style="text-align: right; font-weight: bold; color: ${remaining < 0 ? '#D9534F' : '#356859'}">${formatCurrency(budgetOverview?.remaining)}</td>
          </tr>
          <tr>
            <td>Spent Percentage</td>
            <td style="text-align: right; font-weight: bold; color: ${remaining < 0 ? '#D9534F' : '#356859'}">${spentPct.toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">Inventory Category Breakdown</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th style="text-align: right;">Items Count</th>
            <th style="text-align: right;">Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${inventoryRows || '<tr><td colspan="3" style="text-align: center;">No items recorded in inventory</td></tr>'}
        </tbody>
      </table>

      <div class="section-title">Monthly Expense Trends</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Month / Year</th>
            <th style="text-align: right;">Amount Spent</th>
          </tr>
        </thead>
        <tbody>
          ${expensesRows || '<tr><td colspan="2" style="text-align: center;">No expense history available</td></tr>'}
        </tbody>
      </table>

      <div class="footer">
        HomePal — Helping families manage inventories and track budgets together.
      </div>
    </body>
    </html>
  `;
}
