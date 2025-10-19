const axios = require('axios');

async function getWeatherForecast(lat, lon) {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'imperial',
        cnt: 40  // 5 days * 8 intervals per day
      }
    });

    // Group forecasts by day to get 5 full days
    const dailyForecasts = {};
    
    response.data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          temps: [],
          humidity: [],
          conditions: [],
          rain: 0,
          icons: []
        };
      }
      
      dailyForecasts[date].temps.push(Math.round(item.main.temp));
      dailyForecasts[date].humidity.push(item.main.humidity);
      dailyForecasts[date].conditions.push(item.weather[0].main);
      dailyForecasts[date].rain += item.rain ? item.rain['3h'] || 0 : 0;
      dailyForecasts[date].icons.push(item.weather[0].icon);
    });

    // Convert to array and take first 5 days
    const forecasts = Object.values(dailyForecasts)
      .slice(0, 5)
      .map(day => ({
        date: day.date,
        temp: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length), // Average temp
        humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length), // Average humidity
        conditions: day.conditions[Math.floor(day.conditions.length / 2)], // Most common condition
        description: day.conditions[Math.floor(day.conditions.length / 2)].toLowerCase(),
        rain: day.rain,
        icon: day.icons[Math.floor(day.icons.length / 2)] // Most common icon
      }));

    const avgTemp = forecasts.reduce((sum, f) => sum + f.temp, 0) / forecasts.length;
    const totalRain = forecasts.reduce((sum, f) => sum + f.rain, 0);

    let weatherRisk = 'low';
    let riskReason = 'Weather conditions favorable for crops';

    if (avgTemp > 95) {
      weatherRisk = 'high';
      riskReason = 'Extreme heat expected - irrigation critical';
    } else if (totalRain < 0.1) {
      weatherRisk = 'medium';
      riskReason = 'Low rainfall forecast - monitor soil moisture';
    } else if (totalRain > 2) {
      weatherRisk = 'medium';
      riskReason = 'Heavy rainfall expected - watch for flooding';
    }

    return {
      success: true,
      location: { lat, lon },
      forecast: forecasts,
      summary: {
        avg_temp: Math.round(avgTemp),
        total_rain_inches: (totalRain / 25.4).toFixed(2),
        risk_level: weatherRisk,
        risk_reason: riskReason
      }
    };

  } catch (error) {
    console.error('Weather API error:', error);

    // Return 5 days with ISO dates to avoid Invalid Date on client
    const today = new Date();
    const presets = [
      { temp: 78, humidity: 65, conditions: 'Clear', rain: 0, icon: '01d' },
      { temp: 82, humidity: 70, conditions: 'Clouds', rain: 3 / 25.4, icon: '02d' }, // ~3mm
      { temp: 75, humidity: 60, conditions: 'Rain', rain: 8 / 25.4, icon: '10d' },
      { temp: 70, humidity: 55, conditions: 'Clear', rain: 0, icon: '01d' },
      { temp: 72, humidity: 68, conditions: 'Clouds', rain: 2 / 25.4, icon: '04d' }
    ];
    const fallbackDays = presets.map((p, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        date: d.toISOString(),
        temp: p.temp,
        humidity: p.humidity,
        conditions: p.conditions,
        description: p.conditions.toLowerCase(),
        rain: p.rain,
        icon: p.icon
      };
    });

    const avgTemp = Math.round(
      fallbackDays.reduce((sum, f) => sum + f.temp, 0) / fallbackDays.length
    );
    const totalRainInches = (
      fallbackDays.reduce((sum, f) => sum + (f.rain || 0), 0)
    ).toFixed(2);

    return {
      success: false,
      fallback: true,
      forecast: fallbackDays,
      summary: {
        avg_temp: avgTemp,
        total_rain_inches: totalRainInches,
        risk_level: 'low',
        risk_reason: 'Using fallback weather due to API error (missing/invalid key)'
      }
    };
  }
}

module.exports = { getWeatherForecast };
