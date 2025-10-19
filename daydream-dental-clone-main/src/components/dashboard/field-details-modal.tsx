'use client';

import { X, ArrowLeft, Droplets, Calendar, Sprout, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface FieldData {
  id: string;
  name: string;
  crop: string;
  ndvi: number;
  health: string;
  trend: string;
  acres: number;
  color: string;
  irrigation: string;
  soilMoisture: number;
  plantingDate: string;
  expectedHarvest: string;
  growthStage: string;
  notes: string;
  ndviHistory: Array<{ date: string; value: number }>;
  coordinates: { lat: number; lng: number };
}

interface FieldDetailsModalProps {
  field: FieldData | null;
  isOpen: boolean;
  onClose: () => void;
}

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

const getTrendText = (trend: string) => {
  if (trend === 'up') return 'Improving';
  if (trend === 'down') return 'Declining';
  return 'Stable';
};

export default function FieldDetailsModal({ field, isOpen, onClose }: FieldDetailsModalProps) {
  if (!isOpen || !field) return null;

  // Ensure field has required properties
  if (!field.coordinates || !field.ndviHistory) {
    console.error('Field data is missing required properties:', field);
    return null;
  }

  const maxNdvi = 0.85;
  const minNdvi = 0.3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#1a4d4d] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Dashboard</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-1">{field.name}</h2>
              <p className="text-white/80 text-lg">Field ID: {field.id}</p>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <p className="text-white/60 text-sm">Crop Type</p>
                <p className="text-xl font-semibold">{field.crop}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Acreage</p>
                <p className="text-xl font-semibold">{field.acres} acres</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Irrigation</p>
                <p className="text-xl font-semibold">{field.irrigation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Status Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-[#1a4d4d] mb-4">Current Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">NDVI Index</p>
                <p className="text-5xl font-bold mb-2" style={{ color: field.color }}>
                  {field.ndvi.toFixed(2)}
                </p>
                <div className="mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    field.ndvi >= 0.6 
                      ? 'bg-green-100 text-green-800' 
                      : field.ndvi >= 0.3 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {field.ndvi >= 0.6 ? 'Healthy' : field.ndvi >= 0.3 ? 'Moderate' : 'Poor'}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl" style={{ color: field.color }}>
                    {getTrendIcon(field.trend)}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: field.color }}>
                    {getTrendText(field.trend)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Higher = Better
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Health Status</p>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl">{getHealthIcon(field.health)}</span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      field.health === 'good' 
                        ? 'bg-green-100 text-green-800' 
                        : field.health === 'fair' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {field.health.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Last Updated</p>
                <p className="text-2xl font-bold text-[#1a4d4d]">
                  {format(new Date(), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(), 'h:mm a')}
                </p>
              </div>
            </div>
          </div>

          {/* NDVI History Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-[#1a4d4d] mb-4">NDVI History (Last 30 Days)</h3>
            <div className="relative h-64">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-600">
                <span>{maxNdvi.toFixed(2)}</span>
                <span>{((maxNdvi + minNdvi) / 2).toFixed(2)}</span>
                <span>{minNdvi.toFixed(2)}</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-12 h-full relative border-l-2 border-b-2 border-gray-300">
                {/* Background zones */}
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 bg-green-100/30 border-b border-green-200"></div>
                  <div className="flex-1 bg-yellow-100/30 border-b border-yellow-200"></div>
                  <div className="flex-1 bg-red-100/30"></div>
                </div>
                
                {/* Line chart */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={field.color}
                    strokeWidth="1"
                    points={field.ndviHistory
                      .map((point, i) => {
                        const x = (i / (field.ndviHistory.length - 1)) * 100;
                        const y = 100 - ((point.value - minNdvi) / (maxNdvi - minNdvi)) * 100;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                  {field.ndviHistory.map((point, i) => {
                    const x = (i / (field.ndviHistory.length - 1)) * 100;
                    const y = 100 - ((point.value - minNdvi) / (maxNdvi - minNdvi)) * 100;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="1.5"
                        fill={field.color}
                        className="hover:r-3 transition-all cursor-pointer"
                      >
                        <title>{`${point.date}: ${point.value.toFixed(2)}`}</title>
                      </circle>
                    );
                  })}
                </svg>
                
                {/* X-axis labels - Show every 5th date to reduce clutter */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-600">
                  {field.ndviHistory.map((point, i) => {
                    // Only show every 5th label to reduce clutter
                    if (i % 5 === 0 || i === field.ndviHistory.length - 1) {
                      return (
                        <span key={i} className="text-center">
                          {format(new Date(point.date), 'MM/dd')}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-8 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200"></div>
                <span className="text-gray-700">Healthy (0.6+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-200"></div>
                <span className="text-gray-700">Moderate (0.3-0.6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-200"></div>
                <span className="text-gray-700">Poor (0-0.3)</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">Higher NDVI values indicate healthier, more vigorous vegetation</p>
            </div>
          </div>

          {/* Field Conditions */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-[#1a4d4d] mb-4">Field Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Soil Moisture</p>
                  <p className="text-2xl font-bold text-[#1a4d4d]">{Math.round(field.soilMoisture)}%</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${field.soilMoisture}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Droplets className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Irrigation Status</p>
                  <p className="text-lg font-semibold text-[#1a4d4d]">{field.irrigation}</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">Active</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Planting Date</p>
                  <p className="text-lg font-semibold text-[#1a4d4d]">
                    {format(new Date(field.plantingDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Harvest</p>
                  <p className="text-lg font-semibold text-[#1a4d4d]">
                    {format(new Date(field.expectedHarvest), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <Sprout className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Growth Stage</p>
                  <p className="text-lg font-semibold text-[#1a4d4d]">{field.growthStage}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Field Notes</p>
                  <p className="text-sm text-[#1a4d4d] mt-1">{field.notes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Satellite Image */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-[#1a4d4d] mb-4">Field Satellite View</h3>
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${field.coordinates.lat},${field.coordinates.lng}&zoom=18&size=800x450&maptype=satellite&markers=color:red%7C${field.coordinates.lat},${field.coordinates.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`}
                alt={`Satellite view of ${field.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              
              {/* Fallback content if image fails to load */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center" style={{ display: 'none' }}>
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">Satellite imagery unavailable</p>
                  <p className="text-sm text-gray-400">Last image: {format(new Date(), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              
              {/* Field info overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <p className="text-sm font-semibold text-gray-700">{field.name}</p>
                <p className="text-xs text-gray-600">{field.crop} • {field.acres} acres</p>
                <p className="text-xs text-gray-500">Zoom: 18x</p>
              </div>
              
              {/* NDVI Scale legend */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <p className="text-xs font-semibold text-gray-700 mb-2">NDVI Scale</p>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="w-4 h-2 bg-red-500"></div>
                    <div className="w-4 h-2 bg-yellow-500"></div>
                    <div className="w-4 h-2 bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>Low</div>
                    <div>Med</div>
                    <div>High</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}