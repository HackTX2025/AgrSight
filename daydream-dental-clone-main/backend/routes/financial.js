const { getFinancialData } = require('../services/nessieService');

module.exports = async (req, res) => {
  try {
    const { customerId } = req.query;

    const financial = await getFinancialData(customerId);

    res.json({
      ...financial,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
