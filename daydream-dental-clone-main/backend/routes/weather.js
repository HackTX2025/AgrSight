const { getWeatherForecast } = require('../services/weatherService');

module.exports = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const latitude = parseFloat(lat) || 38.358;
    const longitude = parseFloat(lon) || -98.957;

    const weather = await getWeatherForecast(latitude, longitude);

    res.json({
      ...weather,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
