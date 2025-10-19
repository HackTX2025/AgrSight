const { getFinancialData } = require('../services/nessieService');
const { calculateLendingReadiness } = require('../services/financeService');

module.exports = async (req, res) => {
  try {
    const { customerId, revenue } = req.query;
    const financialData = await getFinancialData(customerId);

    const revenueProjection = parseFloat(revenue) || 50000;

    const lendingData = await calculateLendingReadiness(
      financialData.account.balance,
      financialData.transactions,
      revenueProjection
    );

    res.json({
      success: true,
      ...lendingData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Lending readiness endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
