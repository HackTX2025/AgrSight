const { getFinancialData } = require('../services/nessieService');
const { calculateCashFlowForecast } = require('../services/financeService');

module.exports = async (req, res) => {
  try {
    const { customerId } = req.query;
    const financialData = await getFinancialData(customerId);

    const cashflow = await calculateCashFlowForecast(
      financialData.account.balance,
      financialData.transactions
    );

    res.json({
      success: true,
      ...cashflow,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cashflow endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
