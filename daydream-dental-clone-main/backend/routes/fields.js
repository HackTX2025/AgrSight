const fieldsData = require('../data/fieldsData');

module.exports = (req, res) => {
  res.json({
    success: true,
    data: fieldsData.farm,
    timestamp: new Date().toISOString()
  });
};
