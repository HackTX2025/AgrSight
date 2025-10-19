const { generateRecommendations } = require('../services/recommendationService');

module.exports = async (req, res) => {
  try {
    const { cropAnalysis, weatherData, financialData, fieldData } = req.body;

    if (!cropAnalysis || !weatherData || !financialData) {
      return res.status(400).json({
        error: 'Missing required data: cropAnalysis, weatherData, financialData'
      });
    }

    // Generate recommendations with optional field-specific data
    const recommendations = generateRecommendations(
      cropAnalysis,
      weatherData,
      financialData,
      fieldData // Pass field data for precise calculations
    );

    res.json({
      success: true,
      ...recommendations,
      field_info: fieldData ? {
        crop: fieldData.crop_type,
        acres: fieldData.area_acres,
        calculated_for: 'specific_field'
      } : {
        calculated_for: 'entire_farm',
        total_acres: 145
      }
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: error.message });
  }
};
