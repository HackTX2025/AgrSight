'use client';

import { useState } from 'react';

const recommendations = [
  {
    id: 1,
    severity: 'medium' as const,
    confidence: 87,
    title: 'Prioritize irrigation for East Field',
    description: 'Based on satellite imagery analysis, the East Field (Winter Wheat) is showing declining NDVI values (0.44) and exhibiting stress indicators. Combined with the current rainfall deficit of 35mm and upcoming weather patterns, we recommend immediate irrigation to prevent yield loss. This field has the highest financial exposure ($18,750 estimated crop value) and is most vulnerable to the current drought conditions.',
    timestamp: 'Updated 2 hours ago',
  },
  {
    id: 2,
    severity: 'low' as const,
    confidence: 92,
    title: 'Apply nitrogen fertilizer to North Field',
    description: 'NDVI analysis indicates early signs of nitrogen deficiency in the North Field (Corn). Current levels are at 0.71 but trending downward. Recommended action: Apply 40 lbs/acre of nitrogen fertilizer within the next week to maintain optimal growth during the critical V6 stage. Historical data shows similar interventions resulted in 15% yield improvements.',
    timestamp: 'Updated 4 hours ago',
  },
  {
    id: 3,
    severity: 'high' as const,
    confidence: 94,
    title: 'Inspect South Field for pest activity',
    description: 'Satellite imagery shows irregular patterns in the South Field (Soybeans) with NDVI dropping to 0.52 in concentrated zones. Weather conditions and regional reports suggest potential aphid infestation. Immediate field inspection recommended. Early intervention could prevent estimated losses of $12,000-$15,000.',
    timestamp: 'Updated 1 hour ago',
  },
];

export default function AIRecommendation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNoMore, setShowNoMore] = useState(false);

  const handleAccept = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowNoMore(false);
    } else {
      setShowNoMore(true);
    }
  };

  const currentRec = recommendations[currentIndex];

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    if (severity === 'high') return { icon: '🔴', bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800' };
    if (severity === 'medium') return { icon: '🟡', bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800' };
    return { icon: '🟢', bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800' };
  };

  const colors = getSeverityColor(currentRec.severity);

  if (showNoMore) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border-2 border-[#d4f1a8]/30">
        <div className="text-center py-8">
          <h3 className="text-xl font-bold text-[#1a4d4d] mb-2">All Caught Up!</h3>
          <p className="text-sm text-gray-700">
            No more recommendations for now. Check back again later for new insights.
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setShowNoMore(false);
            }}
            className="mt-4 text-sm text-[#1a4d4d] hover:underline font-semibold"
          >
            Review Previous Recommendations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border-2 border-[#d4f1a8]/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-[#1a4d4d]">AI Recommendation</h2>
          <span className="text-xs text-gray-500">({currentIndex + 1}/{recommendations.length})</span>
        </div>
        <div className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} text-xs font-semibold flex items-center gap-1`}>
          <span>{colors.icon}</span>
          {currentRec.severity.toUpperCase()}
        </div>
      </div>
      
      {/* Action Text */}
      <div className="mb-4">
        <p className="text-lg font-bold text-[#1a4d4d] mb-2">
          {currentRec.title}
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {currentRec.description}
        </p>
      </div>
      
      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-gray-600">Confidence Level</p>
          <p className="text-sm font-bold text-[#1a4d4d]">{currentRec.confidence}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#5fb574] h-full rounded-full transition-all"
            style={{ width: `${currentRec.confidence}%` }}
          />
        </div>
      </div>
      
      {/* Accept Button */}
      <button 
        onClick={handleAccept}
        className="w-full bg-[#1a4d4d] hover:bg-[#2a5c58] text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3"
      >
        ✓ Accept Recommendation
      </button>
      
      {/* Timestamp */}
      <p className="text-xs text-gray-500 text-center">{currentRec.timestamp}</p>
    </div>
  );
}