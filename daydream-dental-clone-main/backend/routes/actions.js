const { applyForLoan, makePayment, recordTransaction } = require('../services/nessieService');

module.exports = async (req, res) => {
  try {
    const { action, ...details } = req.body;

    let result;

    switch (action) {
      case 'apply_loan':
        result = await applyForLoan(details);
        break;

      case 'make_payment':
        result = await makePayment(details);
        break;

      case 'record_transaction':
        result = await recordTransaction(details);
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${action}. Valid actions: apply_loan, make_payment, record_transaction`
        });
    }

    res.json({
      ...result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Financial action error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
