const axios = require('axios');

const NESSIE_BASE_URL = 'http://api.nessieisreal.com';
const API_KEY = process.env.NESSIE_API_KEY;

// In-memory state for demo (persists across requests during session)
let accountState = {
  balance: 12750.85,
  transactions: [
    { id: 'tx-1', date: '2025-10-15', description: 'Crop Sales - Wheat Harvest', amount: 2400.00, type: 'credit' },
    { id: 'tx-2', date: '2025-10-13', description: 'Fertilizer Supply Co.', amount: -345.00, type: 'debit' },
    { id: 'tx-3', date: '2025-10-10', description: 'Equipment Rental', amount: -180.00, type: 'debit' },
    { id: 'tx-4', date: '2025-10-08', description: 'Seed Purchase - Spring Stock', amount: -890.00, type: 'debit' },
    { id: 'tx-5', date: '2025-10-05', description: 'Fuel & Diesel', amount: -225.50, type: 'debit' }
  ],
  loans: [
    {
      id: 'loan-1',
      type: 'Operating Loan',
      amount: 5000,
      interestRate: 4.5,
      term: 12,
      monthlyPayment: 425.32,
      balance: 2300,
      status: 'active',
      startDate: '2025-04-01'
    }
  ]
};

async function getFinancialData(customerId = '6751b68b9683f20dd518c0fb') {
  // Try live API first
  try {
    if (API_KEY && API_KEY !== 'your_key_here') {
      const accountsResponse = await axios.get(
        `${NESSIE_BASE_URL}/customers/${customerId}/accounts?key=${API_KEY}`
      );

      if (accountsResponse.data && accountsResponse.data.length > 0) {
        const account = accountsResponse.data[0];

        const purchasesResponse = await axios.get(
          `${NESSIE_BASE_URL}/accounts/${account._id}/purchases?key=${API_KEY}`
        );

        const transactions = (purchasesResponse.data || []).slice(0, 5).map(t => ({
          id: t._id,
          date: t.purchase_date,
          description: t.description,
          amount: t.amount,
          type: t.amount > 0 ? 'credit' : 'debit',
          status: t.status
        }));

        return {
          success: true,
          live_api: true,
          account: {
            id: account._id,
            type: account.type,
            nickname: account.nickname || 'Farm Operating Account',
            balance: account.balance
          },
          transactions,
          loans: accountState.loans,
          customer_id: customerId
        };
      }
    }
  } catch (error) {
    console.log('Nessie API unavailable, using enhanced mock data');
  }

  // Return stateful mock data (changes persist across requests)
  return {
    success: true,
    fallback: true,
    account: {
      id: 'mock-account-farm-01',
      type: 'Checking',
      nickname: 'Farm Operating Account',
      balance: accountState.balance,
      accountNumber: '****7842'
    },
    transactions: accountState.transactions.slice(0, 8),
    loans: accountState.loans,
    customer_id: customerId,
    financial_health: calculateFinancialHealth(accountState)
  };
}

// Interactive financial actions
async function applyForLoan(loanDetails) {
  const { amount, purpose, term = 12 } = loanDetails;

  // Calculate loan terms
  const interestRate = amount > 10000 ? 5.2 : 4.5; // Lower rate for smaller loans
  const monthlyPayment = calculateMonthlyPayment(amount, interestRate, term);

  const newLoan = {
    id: `loan-${Date.now()}`,
    type: purpose || 'Operating Loan',
    amount: parseFloat(amount),
    interestRate,
    term,
    monthlyPayment,
    balance: parseFloat(amount),
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    approvalTime: new Date().toISOString()
  };

  accountState.loans.push(newLoan);

  // Add loan deposit transaction
  accountState.balance += parseFloat(amount);
  accountState.transactions.unshift({
    id: `tx-loan-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    description: `Loan Deposit - ${purpose || 'Operating Loan'}`,
    amount: parseFloat(amount),
    type: 'credit'
  });

  return {
    success: true,
    loan: newLoan,
    new_balance: accountState.balance,
    message: `Loan approved! $${amount.toLocaleString()} deposited to your account.`
  };
}

async function makePayment(paymentDetails) {
  const { loanId, amount } = paymentDetails;

  const loan = accountState.loans.find(l => l.id === loanId);
  if (!loan) {
    return { success: false, error: 'Loan not found' };
  }

  if (amount > accountState.balance) {
    return { success: false, error: 'Insufficient funds' };
  }

  // Update loan balance
  loan.balance = Math.max(0, loan.balance - parseFloat(amount));
  if (loan.balance === 0) {
    loan.status = 'paid_off';
  }

  // Deduct from account
  accountState.balance -= parseFloat(amount);
  accountState.transactions.unshift({
    id: `tx-payment-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    description: `Loan Payment - ${loan.type}`,
    amount: -parseFloat(amount),
    type: 'debit'
  });

  return {
    success: true,
    remaining_balance: loan.balance,
    account_balance: accountState.balance,
    message: loan.balance === 0 ? 'Congratulations! Loan paid off!' : `Payment successful. Remaining: $${loan.balance.toLocaleString()}`
  };
}

async function recordTransaction(transactionDetails) {
  const { description, amount, type } = transactionDetails;

  const txAmount = type === 'credit' ? Math.abs(amount) : -Math.abs(amount);
  accountState.balance += txAmount;

  accountState.transactions.unshift({
    id: `tx-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    description,
    amount: txAmount,
    type
  });

  return {
    success: true,
    new_balance: accountState.balance,
    transaction: accountState.transactions[0]
  };
}

// Helper functions
function calculateMonthlyPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                  (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment * 100) / 100;
}

function calculateFinancialHealth(state) {
  const totalLoanBalance = state.loans.reduce((sum, loan) => sum + loan.balance, 0);
  const monthlyLoanPayments = state.loans
    .filter(l => l.status === 'active')
    .reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  const debtToAssetRatio = totalLoanBalance / (state.balance + 50000); // Assuming $50k in farm assets

  let healthScore = 100;
  if (debtToAssetRatio > 0.5) healthScore -= 30;
  if (state.balance < monthlyLoanPayments * 3) healthScore -= 20;
  if (state.balance < 5000) healthScore -= 20;

  return {
    score: Math.max(0, healthScore),
    total_debt: totalLoanBalance,
    monthly_obligations: monthlyLoanPayments,
    debt_to_asset_ratio: Math.round(debtToAssetRatio * 100),
    emergency_fund_months: Math.floor(state.balance / (monthlyLoanPayments || 500))
  };
}

module.exports = {
  getFinancialData,
  applyForLoan,
  makePayment,
  recordTransaction
};
