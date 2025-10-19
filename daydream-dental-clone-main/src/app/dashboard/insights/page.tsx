import Link from 'next/link';

const allInsights = [
  {
    time: '2 hours ago',
    type: 'alert',
    message: 'East Field NDVI dropped below 0.45 threshold',
    color: 'text-orange-600',
    details: 'Normalized Difference Vegetation Index (NDVI) indicates potential stress in the eastern section. Consider checking irrigation or soil conditions.'
  },
  {
    time: '5 hours ago',
    type: 'info',
    message: 'Weather forecast updated: Rain expected Wednesday',
    color: 'text-blue-600',
    details: 'Moderate rainfall (0.5-1 inch) predicted. Adjust irrigation schedule accordingly to avoid overwatering.'
  },
  {
    time: '1 day ago',
    type: 'success',
    message: 'North Field showing improved health metrics',
    color: 'text-green-600',
    details: 'NDVI increased from 0.52 to 0.68 over the past week. Recent fertilizer application appears effective.'
  },
  {
    time: '1 day ago',
    type: 'info',
    message: 'Satellite imagery captured for all fields',
    color: 'text-purple-600',
    details: 'Latest Sentinel-2 imagery processed. High-resolution data available for analysis.'
  },
  {
    time: '2 days ago',
    type: 'alert',
    message: 'Central Field irrigation cycle completed',
    color: 'text-blue-600',
    details: 'Total water applied: 1.2 acre-inches. Next cycle scheduled for 3 days from now.'
  },
  {
    time: '3 days ago',
    type: 'info',
    message: 'Soil moisture levels normal across all fields',
    color: 'text-green-600',
    details: 'Moisture content ranging from 18-24% across monitored areas. Optimal for current crop stage.'
  },
  {
    time: '4 days ago',
    type: 'alert',
    message: 'West Field shows slight nutrient deficiency indicators',
    color: 'text-yellow-600',
    details: 'Chlorophyll content analysis suggests possible nitrogen deficiency. Consider soil testing.'
  },
  {
    time: '5 days ago',
    type: 'success',
    message: 'Pest monitoring: No significant threats detected',
    color: 'text-green-600',
    details: 'Regular monitoring continues. All fields showing healthy growth patterns.'
  },
  {
    time: '6 days ago',
    type: 'info',
    message: 'Temperature forecast: Warmer than average week ahead',
    color: 'text-orange-600',
    details: 'Expected high temperatures 5-8°F above seasonal average. Monitor for heat stress.'
  },
  {
    time: '1 week ago',
    type: 'success',
    message: 'South Field harvest preparation on schedule',
    color: 'text-green-600',
    details: 'Crop maturity at 85%. Estimated harvest window: 10-14 days.'
  }
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4f1a8]/30 via-[#b8d8e8]/20 to-[#f4d5b8]/20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/dashboard"
            className="text-[#1a4d4d] hover:text-[#2a5c58] transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-[#1a4d4d] mb-8">All Insights</h1>
          
          <div className="space-y-4">
            {allInsights.map((insight, index) => (
              <div 
                key={index} 
                className="bg-white/60 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    insight.type === 'alert' ? 'bg-orange-100 text-orange-700' :
                    insight.type === 'success' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {insight.type.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">{insight.time}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {insight.message}
                </h3>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {insight.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}