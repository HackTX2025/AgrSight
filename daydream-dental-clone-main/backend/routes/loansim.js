const { simulateLoan } = require('../services/financeService');

module.exports = async (req, res) => {
  try {
    const { amount, term, rate } = req.query;

    const loanAmount = parseFloat(amount) || 10000;
    const termMonths = parseInt(term) || 36;
    const annualRate = parseFloat(rate) || 6.5;

    const simulation = simulateLoan(loanAmount, termMonths, annualRate);

    res.json({
      success: true,
      ...simulation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Loan simulation endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
