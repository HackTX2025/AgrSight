import Link from 'next/link';

const insights = [
  {
    time: '2 hours ago',
    type: 'alert',
    message: 'East Field NDVI dropped below 0.45 threshold',
    color: 'text-orange-600'
  },
  {
    time: '5 hours ago',
    type: 'info',
    message: 'Weather forecast updated: Rain expected Wednesday',
    color: 'text-blue-600'
  },
  {
    time: '1 day ago',
    type: 'success',
    message: 'North Field showing improved health metrics',
    color: 'text-green-600'
  },
  {
    time: '1 day ago',
    type: 'info',
    message: 'Satellite imagery captured for all fields',
    color: 'text-purple-600'
  },
  {
    time: '2 days ago',
    type: 'alert',
    message: 'Central Field irrigation cycle completed',
    color: 'text-blue-600'
  }
];

export default function QuickInsights() {
  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
      <h2 className="text-xl font-bold text-[#1a4d4d] mb-4">Quick Insights</h2>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-snug mb-1">
                {insight.message}
              </p>
              <p className="text-xs text-gray-500">{insight.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <Link href="/dashboard/insights">
        <button className="w-full mt-4 text-sm text-[#1a4d4d] hover:text-[#2a5c58] font-semibold py-2 border border-gray-200 rounded-lg hover:border-[#1a4d4d] transition-colors">
          View All Insights →
        </button>
      </Link>
    </div>
  );
}