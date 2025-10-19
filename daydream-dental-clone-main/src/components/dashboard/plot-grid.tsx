'use client';

import { useState, useEffect } from 'react';
import FieldDetailsModal from './field-details-modal';
import { api } from '@/lib/api';

const getHealthIcon = (health: string) => {
  if (health === 'good') return '🟢';
  if (health === 'fair') return '🟡';
  return '🔴';
};

const getTrendIcon = (trend: string) => {
  if (trend === 'up') return '↑';
  if (trend === 'down') return '↓';
  return '─';
};

interface Field {
  id: string;
  name: string;
  crop_type: string;
  area_acres: number;
  coordinates: { lat: number; lng: number };
  image_path: string;
}

interface PlotData extends Field {
  ndvi?: number;
  health: 'good' | 'fair' | 'poor';
  trend: 'up' | 'down' | 'stable';
  color: string;
  // Additional properties for FieldDetailsModal
  crop: string;
  acres: number;
  irrigation: string;
  soilMoisture: number;
  plantingDate: string;
  expectedHarvest: string;
  growthStage: string;
  notes: string;
  ndviHistory: Array<{ date: string; value: number }>;
}

interface PlotGridProps {
  selectedFieldId?: string;
  onFieldsLoaded?: (fields: PlotData[]) => void;
}

export default function PlotGrid({ selectedFieldId, onFieldsLoaded }: PlotGridProps) {
  const [fields, setFields] = useState<PlotData[]>([]);
  const [selectedField, setSelectedField] = useState<PlotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await api.getFields();
        const fieldsData = response.data.fields.map((field: Field, idx: number) => {
          // Determine health status based on field data or random assignment
          let healthStatus = field.health_condition || (idx % 3 === 0 ? 'good' : idx % 3 === 1 ? 'fair' : 'poor');
          
          // Convert 'medium' to 'fair' for consistency
          if (healthStatus === 'medium') healthStatus = 'fair';
          
          // Assign colors based on health status
          let color = '#10b981'; // green for good
          if (healthStatus === 'fair') color = '#f59e0b'; // yellow for fair
          if (healthStatus === 'poor') color = '#ef4444'; // red for poor
          
          return {
            ...field,
            ndvi: 0.5 + Math.random() * 0.3,
            health: healthStatus,
            trend: idx % 2 === 0 ? 'up' : 'down',
            color: color,
            // Add missing properties for FieldDetailsModal
            crop: field.crop_type,
            acres: field.area_acres,
            irrigation: 'Drip System',
            soilMoisture: 65 + Math.random() * 20,
            plantingDate: '2024-03-15',
            expectedHarvest: '2024-09-20',
            growthStage: 'Vegetative',
            notes: 'Field is showing good growth patterns with adequate moisture levels.',
            ndviHistory: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              value: 0.4 + Math.random() * 0.4
            }))
          };
        });
        setFields(fieldsData);
        if (onFieldsLoaded) {
          onFieldsLoaded(fieldsData);
        }
      } catch (error) {
        console.error('Failed to fetch fields:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [onFieldsLoaded]);

  useEffect(() => {
    if (selectedFieldId) {
      const field = fields.find(f => f.id === selectedFieldId);
      if (field) {
        setSelectedField(field);
      }
    }
  }, [selectedFieldId, fields]);

  const handleAnalyze = async (fieldId: string) => {
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await api.analyzeField(fieldId);
      setAnalysisResult(result);
      console.log('Analysis result:', result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Check console for details.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-[#1a4d4d] mb-4">Field Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/20 backdrop-blur-xl rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-gray-300 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1a4d4d] mb-4">Field Status</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((plot) => (
          <div
            key={plot.id}
            className={`bg-white/20 backdrop-blur-xl rounded-xl shadow-md p-6 hover:shadow-lg transition-all border-2 ${
              plot.id === selectedFieldId ? 'border-[#1a4d4d] ring-2 ring-[#1a4d4d]' : 'border-white/20'
            } border-l-4`}
            style={{ borderLeftColor: plot.color }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#1a4d4d]">{plot.name}</h3>
                <p className="text-sm text-gray-600">{plot.crop_type}</p>
              </div>
              {plot.id === selectedFieldId && (
                <span className="text-xs bg-[#1a4d4d] text-white px-2 py-1 rounded">Selected</span>
              )}
            </div>

            {/* NDVI - Big and Bold */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">NDVI Index</p>
              <div className="flex items-end gap-2">
                <p className="text-5xl font-bold" style={{ color: plot.color }}>
                  {plot.ndvi?.toFixed(2)}
                </p>
                <span className="text-3xl mb-2" style={{ color: plot.color }}>
                  {getTrendIcon(plot.trend)}
                </span>
              </div>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  (plot.ndvi || 0) >= 0.6 
                    ? 'bg-green-100 text-green-800' 
                    : (plot.ndvi || 0) >= 0.3 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {(plot.ndvi || 0) >= 0.6 ? 'Healthy' : (plot.ndvi || 0) >= 0.3 ? 'Moderate' : 'Poor'}
                </span>
                <span className="text-xs text-gray-500 ml-2">Higher = Better</span>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={() => handleAnalyze(plot.id)}
              disabled={analyzing}
              className="w-full bg-[#1a4d4d] hover:bg-[#2a5d5d] text-white font-semibold py-2 px-4 rounded-lg mb-4 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {analyzing && analysisResult?.field_id === plot.id ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Analyzing...
                </span>
              ) : (
                '🔍 Analyze Field'
              )}
            </button>

            {/* Analysis Results */}
            {analysisResult && analysisResult.field_id === plot.id && analysisResult.analysis && (
              <div className="space-y-2 mb-4">
                {/* Financial Impact - MOST PROMINENT */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💰</span>
                    <p className="font-bold text-white text-base">Capital One Financial Impact</p>
                  </div>
                  <p className="text-white text-sm font-medium leading-relaxed">{analysisResult.analysis.financial_impact}</p>
                </div>

                {/* Recommended Actions - SECOND MOST IMPORTANT */}
                {analysisResult.analysis.recommended_actions && analysisResult.analysis.recommended_actions.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-3">
                    <p className="font-bold text-green-900 mb-2 text-sm">💡 Next Steps</p>
                    <ul className="space-y-1.5">
                      {analysisResult.analysis.recommended_actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 font-bold text-sm mt-0.5">{idx + 1}.</span>
                          <span className="text-green-900 text-xs font-medium leading-snug flex-1">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Crop Summary - Compact */}
                <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-700 flex items-center justify-between">
                  <span><strong>Status:</strong> {analysisResult.analysis.health_status}</span>
                  <span><strong>Yield:</strong> {analysisResult.analysis.yield_estimate}</span>
                  <span><strong>Confidence:</strong> {analysisResult.analysis.confidence}%</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#1a4d4d]">{plot.area_acres}</span> acres
              </p>
              <span className={`text-xs px-3 py-1 rounded-full ${
                plot.health === 'good' 
                  ? 'bg-green-100 text-green-800' 
                  : plot.health === 'fair' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {plot.health.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <FieldDetailsModal
        field={selectedField}
        isOpen={!!selectedField}
        onClose={() => setSelectedField(null)}
      />
    </div>
  );
}