'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState, useRef, useEffect } from 'react';

// Static libraries array to prevent reloading
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places'];

interface Field {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  crop_type: string;
  area_acres: number;
  health?: 'good' | 'fair' | 'poor';
}

interface FarmMapProps {
  fields: Field[];
  onFieldClick: (field: Field) => void;
  selectedFieldId?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px'
};

// Calculate center dynamically based on fields
const calculateCenter = (fields: Field[]) => {
  if (fields.length === 0) {
    return { lat: 38.358, lng: -98.957 }; // Fallback center
  }
  
  const totalLat = fields.reduce((sum, field) => sum + field.coordinates.lat, 0);
  const totalLng = fields.reduce((sum, field) => sum + field.coordinates.lng, 0);
  
  return {
    lat: totalLat / fields.length,
    lng: totalLng / fields.length
  };
};

// Calculate bounds to fit all fields
const calculateBounds = (fields: Field[]) => {
  if (fields.length === 0) {
    return {
      north: 38.37,
      south: 38.33,
      east: -98.92,
      west: -98.98
    };
  }
  
  const lats = fields.map(field => field.coordinates.lat);
  const lngs = fields.map(field => field.coordinates.lng);
  
  const padding = 0.05; // Increased padding for bigger navigation area
  
  return {
    north: Math.max(...lats) + padding,
    south: Math.min(...lats) - padding,
    east: Math.max(...lngs) + padding,
    west: Math.min(...lngs) - padding
  };
};

// Custom map styles for better satellite view
const mapStyles = [
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#1e3a8a' }]
  }
];

const getMarkerIcon = (health?: string, isSelected?: boolean) => {
  if (isSelected) {
    return {
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
      fillColor: '#3b82f6', // Blue color to clearly indicate selection
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
      scale: 1.8,
    };
  }

  let fillColor = '#10b981'; // green (good)
  if (health === 'fair') fillColor = '#f59e0b'; // yellow
  if (health === 'poor') fillColor = '#ef4444'; // red

  return {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
    fillColor,
    fillOpacity: 0.9,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: 1.2,
  };
};

export default function FarmMap({ fields, onFieldClick, selectedFieldId }: FarmMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';
  const mapRef = useRef<google.maps.Map | null>(null);
  const center = calculateCenter(fields);
  const bounds = calculateBounds(fields);

  // Use useJsApiLoader instead of LoadScript to prevent multiple loads
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries // Use static array to prevent reloading
  });

  // Auto-fit map to show all fields when fields change
  useEffect(() => {
    if (mapRef.current && fields.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      fields.forEach(field => {
        bounds.extend(new window.google.maps.LatLng(field.coordinates.lat, field.coordinates.lng));
      });
      
      // Fit bounds with padding
      mapRef.current.fitBounds(bounds);
      
      // Add padding after bounds are set
      setTimeout(() => {
        if (mapRef.current) {
          const currentBounds = mapRef.current.getBounds();
          if (currentBounds) {
            const ne = currentBounds.getNorthEast();
            const sw = currentBounds.getSouthWest();
            const latDiff = ne.lat() - sw.lat();
            const lngDiff = ne.lng() - sw.lng();
            
            // Expand bounds by 10% for padding
            const padding = 0.05;
            const newBounds = new window.google.maps.LatLngBounds(
              new window.google.maps.LatLng(sw.lat() - latDiff * padding, sw.lng() - lngDiff * padding),
              new window.google.maps.LatLng(ne.lat() + latDiff * padding, ne.lng() + lngDiff * padding)
            );
            mapRef.current.fitBounds(newBounds);
          }
        }
      }, 100);
    }
  }, [fields]);

  if (!apiKey) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
        <p className="text-gray-600">Google Maps API key not configured</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
        <p className="text-red-600">Error loading Google Maps: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1a4d4d]">Farm Map</h2>
          <span className="text-sm bg-[#1a4d4d] text-white px-3 py-1 rounded-full">
            📡 Satellite View
          </span>
        </div>
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4d4d] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#1a4d4d]">Farm Map</h2>
        <span className="text-sm bg-[#1a4d4d] text-white px-3 py-1 rounded-full">
          📡 Satellite View
        </span>
      </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          mapTypeId="satellite"
          onLoad={(map) => {
            mapRef.current = map;
            // Ensure satellite mode is set
            map.setMapTypeId('satellite');
            
            // Fit map to show all fields
            if (fields.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              fields.forEach(field => {
                bounds.extend(new window.google.maps.LatLng(field.coordinates.lat, field.coordinates.lng));
              });
              map.fitBounds(bounds);
              
              // Add some padding to ensure fields aren't at the edge
              const listener = window.google.maps.event.addListener(map, 'bounds_changed', () => {
                window.google.maps.event.removeListener(listener);
                const currentBounds = map.getBounds();
                if (currentBounds) {
                  const ne = currentBounds.getNorthEast();
                  const sw = currentBounds.getSouthWest();
                  const latDiff = ne.lat() - sw.lat();
                  const lngDiff = ne.lng() - sw.lng();
                  
                  // Expand bounds by 20% for padding
                  const padding = 0.1;
                  const newBounds = new window.google.maps.LatLngBounds(
                    new window.google.maps.LatLng(sw.lat() - latDiff * padding, sw.lng() - lngDiff * padding),
                    new window.google.maps.LatLng(ne.lat() + latDiff * padding, ne.lng() + lngDiff * padding)
                  );
                  map.fitBounds(newBounds);
                }
              });
            }
          }}
          onMapTypeIdChanged={() => {
            // Force back to satellite if user somehow changes it
            if (mapRef.current && mapRef.current.getMapTypeId() !== 'satellite') {
              mapRef.current.setMapTypeId('satellite');
            }
          }}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false, // Disable map type control (satellite only)
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            styles: mapStyles, // Apply custom styles
            gestureHandling: 'greedy', // Allow single finger/mouse drag
            draggable: true, // Enable dragging
            scrollwheel: true, // Enable mouse wheel zoom
            disableDoubleClickZoom: false, // Allow double-click zoom
            restriction: {
              latLngBounds: bounds,
              strictBounds: false
            },
            minZoom: 8, // Allow much more zoom out for wider area view
            maxZoom: 20
          }}
        >
          {fields.map((field) => (
            <Marker
              key={field.id}
              position={field.coordinates}
              onClick={() => {
                // Just call the field click handler - no map centering
                onFieldClick(field);
              }}
              icon={getMarkerIcon(field.health, field.id === selectedFieldId)}
              title={`${field.name} - ${field.crop_type} (${field.area_acres} acres)`}
              animation={field.id === selectedFieldId ? 2 : undefined} // BOUNCE animation
            />
          ))}
        </GoogleMap>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-700">Good Health</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-700">Fair Health</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-700">Poor Health</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-700">Selected</span>
        </div>
      </div>
    </div>
  );
}
