const { getFinancialData } = require('../services/nessieService');
const { calculateBudgetActuals } = require('../services/financeService');

module.exports = async (req, res) => {
  try {
    const { customerId } = req.query;
    const financialData = await getFinancialData(customerId);

    const budgetData = calculateBudgetActuals(financialData.transactions);

    res.json({
      success: true,
      ...budgetData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Budget endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
