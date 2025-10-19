'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Forecast {
  date: string;
  temp: number;
  humidity: number;
  conditions: string;
  description: string;
  rain: number;
  icon: string;
}

interface WeatherData {
  success: boolean;
  forecast: Forecast[];
  summary: {
    avg_temp: number;
    total_rain_inches: string;
    risk_level: string;
    risk_reason: string;
  };
  fallback?: boolean;
}

export default function WeatherPanel() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await api.getWeather(38.358, -98.957);
        setWeather(response);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading || !weather) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const forecast = weather.forecast || [];
  const totalRainfall = parseFloat(weather.summary.total_rain_inches) * 25.4;
  const deficit = 35; // mm deficit
  const showDroughtAlert = weather.summary.risk_level === 'high';

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-[#1a4d4d] mb-4">Weather Forecast</h2>
      
      {/* Risk Alert */}
      {showDroughtAlert && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="font-semibold text-red-800">Weather Alert</p>
              <p className="text-sm text-red-700">
                {weather.summary.risk_reason}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Forecast */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {forecast.map((day, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-b from-[#b8d8e8] to-[#f4d5b8] rounded-xl p-3 text-center"
          >
            <p className="text-xs font-semibold text-[#1a4d4d] mb-2">
              {(() => {
                const d = new Date(day.date);
                return isNaN(d.getTime())
                  ? `Day ${idx + 1}`
                  : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              })()}
            </p>
            <p className="text-3xl mb-2">
              {day.conditions === 'Clear'
                ? '☀️'
                : (day.conditions === 'Clouds' || day.conditions === 'Partly Cloudy')
                ? '⛅'
                : '🌧️'}
            </p>
            <p className="text-lg font-bold text-[#1a4d4d]">{day.temp}°F</p>
            {day.rain > 0 && (
              <p className="text-xs text-blue-600 mt-1 font-medium">
                💧 {(day.rain * 25.4).toFixed(0)}mm
              </p>
            )}
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="bg-[#f5f5f0] rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Avg Temperature</p>
            <p className="text-2xl font-bold text-[#1a4d4d]">{weather.summary.avg_temp}°F</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Rainfall</p>
            <p className="text-2xl font-bold text-blue-600">{(parseFloat(weather.summary.total_rain_inches) * 25.4).toFixed(0)}mm</p>
          </div>
        </div>
      </div>
    </div>
  );
}