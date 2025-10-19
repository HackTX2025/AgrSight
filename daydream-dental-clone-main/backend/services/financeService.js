const { getFinancialData } = require('./nessieService');
const { getWeatherForecast } = require('./weatherService');

// Budget categories for farm operations
const BUDGET_CATEGORIES = [
  { id: 'seed', name: 'Seed & Planting', monthlyCap: 2500, color: '#10b981' },
  { id: 'fertilizer', name: 'Fertilizer', monthlyCap: 1800, color: '#8b5cf6' },
  { id: 'fuel', name: 'Fuel & Energy', monthlyCap: 1200, color: '#f59e0b' },
  { id: 'irrigation', name: 'Irrigation', monthlyCap: 800, color: '#3b82f6' },
  { id: 'labor', name: 'Labor', monthlyCap: 3000, color: '#ec4899' },
  { id: 'repairs', name: 'Equipment Repairs', monthlyCap: 1500, color: '#ef4444' },
  { id: 'debt', name: 'Debt Service', monthlyCap: 2000, color: '#6366f1' },
  { id: 'other', name: 'Other Expenses', monthlyCap: 800, color: '#64748b' }
];

// Categorize transactions based on description
function categorizeTransaction(description) {
  const desc = description.toLowerCase();

  if (desc.includes('seed') || desc.includes('plant')) return 'seed';
  if (desc.includes('fertilizer') || desc.includes('supply')) return 'fertilizer';
  if (desc.includes('fuel') || desc.includes('gas') || desc.includes('energy')) return 'fuel';
  if (desc.includes('irrigation') || desc.includes('water')) return 'irrigation';
  if (desc.includes('labor') || desc.includes('payroll') || desc.includes('wage')) return 'labor';
  if (desc.includes('repair') || desc.includes('equipment') || desc.includes('maintenance')) return 'repairs';
  if (desc.includes('loan') || desc.includes('debt') || desc.includes('payment')) return 'debt';
  if (desc.includes('sales') || desc.includes('deposit') || desc.includes('revenue')) return 'revenue';

  return 'other';
}

// Calculate cash flow forecast
async function calculateCashFlowForecast(currentBalance, transactions) {
  // Analyze historical transactions
  const expenses = transactions.filter(t => t.amount < 0);
  const income = transactions.filter(t => t.amount > 0);

  const avgDailyExpense = expenses.length > 0
    ? Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0)) / 30
    : 50;

  const avgDailyIncome = income.length > 0
    ? income.reduce((sum, t) => sum + t.amount, 0) / 30
    : 100;

  const netDailyFlow = avgDailyIncome - avgDailyExpense;

  // Project 30/60/90 days
  const projections = [
    { days: 30, balance: currentBalance + (netDailyFlow * 30), flow: netDailyFlow * 30 },
    { days: 60, balance: currentBalance + (netDailyFlow * 60), flow: netDailyFlow * 60 },
    { days: 90, balance: currentBalance + (netDailyFlow * 90), flow: netDailyFlow * 90 }
  ];

  // Calculate runway (days until negative)
  const runway = netDailyFlow < 0
    ? Math.floor(currentBalance / Math.abs(netDailyFlow))
    : 999; // Positive cash flow = infinite runway

  return {
    current_balance: currentBalance,
    avg_daily_expense: avgDailyExpense,
    avg_daily_income: avgDailyIncome,
    net_daily_flow: netDailyFlow,
    projections,
    runway_days: runway,
    status: runway < 60 ? 'critical' : runway < 120 ? 'warning' : 'healthy'
  };
}

// Calculate budget vs actual
function calculateBudgetActuals(transactions) {
  const currentMonth = new Date().getMonth();
  const monthTransactions = transactions.filter(t => {
    const txDate = new Date(t.date);
    return txDate.getMonth() === currentMonth;
  });

  const budgetActuals = BUDGET_CATEGORIES.map(category => {
    const categoryTransactions = monthTransactions.filter(t => {
      const cat = categorizeTransaction(t.description);
      return cat === category.id;
    });

    const spent = Math.abs(
      categoryTransactions.reduce((sum, t) => sum + (t.amount < 0 ? t.amount : 0), 0)
    );

    const percentUsed = (spent / category.monthlyCap) * 100;
    const remaining = Math.max(0, category.monthlyCap - spent);

    return {
      ...category,
      spent,
      remaining,
      percentUsed: Math.round(percentUsed),
      status: percentUsed > 100 ? 'over' : percentUsed > 80 ? 'warning' : 'good',
      transactions: categoryTransactions.length
    };
  });

  const totalBudget = BUDGET_CATEGORIES.reduce((sum, c) => sum + c.monthlyCap, 0);
  const totalSpent = budgetActuals.reduce((sum, c) => sum + c.spent, 0);

  return {
    categories: budgetActuals,
    summary: {
      total_budget: totalBudget,
      total_spent: totalSpent,
      remaining: totalBudget - totalSpent,
      percent_used: Math.round((totalSpent / totalBudget) * 100)
    }
  };
}

// Simulate loan scenarios
function simulateLoan(amount, termMonths, annualRate) {
  const monthlyRate = annualRate / 12 / 100;
  const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                        (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - amount;

  return {
    loan_amount: amount,
    term_months: termMonths,
    annual_rate: annualRate,
    monthly_payment: Math.round(monthlyPayment * 100) / 100,
    total_payment: Math.round(totalPayment * 100) / 100,
    total_interest: Math.round(totalInterest * 100) / 100,
    impact_on_monthly_cashflow: -monthlyPayment
  };
}

// Calculate DSCR and lending readiness
async function calculateLendingReadiness(currentBalance, transactions, revenueProjection = 50000) {
  const annualExpenses = Math.abs(
    transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
  ) * 12 / transactions.length * 30; // Extrapolate to annual

  const annualDebtService = 2000 * 12; // Current monthly debt * 12
  const netOperatingIncome = revenueProjection - annualExpenses;

  // DSCR = Net Operating Income / Total Debt Service
  const dscr = annualDebtService > 0 ? netOperatingIncome / annualDebtService : 0;

  // Cash coverage ratio = Available Cash / Monthly Expenses
  const monthlyExpenses = annualExpenses / 12;
  const cashCoverage = currentBalance / monthlyExpenses;

  // Calculate reserve target (2-3 months of expenses)
  const reserveTarget = monthlyExpenses * 2.5;
  const reserveGap = Math.max(0, reserveTarget - currentBalance);

  return {
    dscr: Math.round(dscr * 100) / 100,
    dscr_status: dscr >= 1.25 ? 'excellent' : dscr >= 1.0 ? 'good' : 'needs_improvement',
    cash_coverage_months: Math.round(cashCoverage * 10) / 10,
    reserve_target: Math.round(reserveTarget),
    reserve_gap: Math.round(reserveGap),
    annual_revenue_projection: revenueProjection,
    annual_expenses: Math.round(annualExpenses),
    net_operating_income: Math.round(netOperatingIncome),
    lending_score: Math.min(100, Math.round((dscr * 40) + (cashCoverage * 15) + 45)),
    recommendations: generateLendingRecommendations(dscr, cashCoverage, reserveGap)
  };
}

function generateLendingRecommendations(dscr, cashCoverage, reserveGap) {
  const recommendations = [];

  if (dscr < 1.25) {
    recommendations.push({
      priority: 'high',
      title: 'Improve Debt Service Coverage',
      description: `DSCR of ${dscr.toFixed(2)} is below ideal 1.25. Increase revenue or reduce expenses by $${Math.round((1.25 - dscr) * 2000 * 12)}/year.`,
      action: 'Review budget and identify cost reduction opportunities'
    });
  }

  if (cashCoverage < 2) {
    recommendations.push({
      priority: 'high',
      title: 'Build Cash Reserves',
      description: `Current reserves cover ${cashCoverage.toFixed(1)} months. Target: 2.5+ months for lending readiness.`,
      action: `Increase reserves by $${Math.round(reserveGap)}`
    });
  }

  if (reserveGap > 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Reserve Gap Identified',
      description: `Need $${Math.round(reserveGap)} more to reach recommended reserve level.`,
      action: 'Apply for Capital One operating line of credit'
    });
  }

  if (dscr >= 1.25 && cashCoverage >= 2) {
    recommendations.push({
      priority: 'low',
      title: 'Excellent Lending Position',
      description: 'Strong DSCR and cash reserves. You qualify for favorable loan terms.',
      action: 'Consider growth investments or equipment upgrades'
    });
  }

  return recommendations;
}

module.exports = {
  BUDGET_CATEGORIES,
  categorizeTransaction,
  calculateCashFlowForecast,
  calculateBudgetActuals,
  simulateLoan,
  calculateLendingReadiness
};
