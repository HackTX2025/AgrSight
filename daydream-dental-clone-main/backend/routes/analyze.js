const { analyzeFieldWithData } = require('../services/geminiService');
const { getWeatherForecast } = require('../services/weatherService');
const fieldsData = require('../data/fieldsData');

module.exports = async (req, res) => {
  try {
    const { fieldId, ndvi } = req.body;

    if (!fieldId) {
      return res.status(400).json({ error: 'fieldId required' });
    }

    const field = fieldsData.farm.fields.find(f => f.id === fieldId);

    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    console.log(`Analyzing ${field.name} (${field.crop_type}) with NDVI: ${ndvi || 'calculated'}...`);

    // Fetch weather data for the field location
    const weather = await getWeatherForecast(field.coordinates.lat, field.coordinates.lng);

    // Use provided NDVI or calculate from field health condition
    let ndviValue = ndvi;
    if (!ndviValue) {
      // Map health condition to NDVI range
      if (field.health_condition === 'good') {
        ndviValue = 0.65 + Math.random() * 0.2; // 0.65-0.85
      } else if (field.health_condition === 'medium' || field.health_condition === 'fair') {
        ndviValue = 0.4 + Math.random() * 0.2; // 0.4-0.6
      } else {
        ndviValue = 0.15 + Math.random() * 0.15; // 0.15-0.3
      }
    }

    console.log(`Weather risk level: ${weather.summary?.risk_level}, NDVI: ${ndviValue.toFixed(2)}`);

    // Call Gemini with field data, NDVI, and weather for financial analysis
    const result = await analyzeFieldWithData(field, ndviValue, weather);

    res.json({
      success: true,
      field_id: fieldId,
      field_name: field.name,
      crop_type: field.crop_type,
      ndvi: parseFloat(ndviValue.toFixed(2)),
      ...result
    });

  } catch (error) {
    console.error('Analysis endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
