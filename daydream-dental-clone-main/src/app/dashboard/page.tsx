'use client';

import { useState } from 'react';
import TopBar from '@/components/dashboard/top-bar';
import FarmSummaryCard from '@/components/dashboard/farm-summary-card';
import PlotGrid from '@/components/dashboard/plot-grid';
import FarmMap from '@/components/dashboard/farm-map';
import WeatherPanel from '@/components/dashboard/weather-panel';
import FinancialPanel from '@/components/dashboard/financial-panel';
import AIRecommendation from '@/components/dashboard/ai-recommendation';
import QuickInsights from '@/components/dashboard/quick-insights';
import Image from 'next/image';

export default function DashboardPage() {
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>();
  const [fields, setFields] = useState<any[]>([]);

  const handleFieldSelect = (field: any) => {
    setSelectedFieldId(field.id);
    // Don't scroll - just show the modal centered on screen
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sky Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/skybg-1760864083256.avif"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Transparent White Overlay */}
      <div className="fixed inset-0 bg-white/40 z-[1]" />

      {/* Content */}
      <div className="relative z-10">
        <TopBar />

        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Farm Summary */}
          <FarmSummaryCard />

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Map, Plots and Weather */}
            <div className="xl:col-span-2 space-y-6">
              <FarmMap
                fields={fields}
                onFieldClick={handleFieldSelect}
                selectedFieldId={selectedFieldId}
              />
              <div id="plot-grid">
                <PlotGrid
                  selectedFieldId={selectedFieldId}
                  onFieldsLoaded={setFields}
                />
              </div>
              <WeatherPanel />
            </div>

            {/* Right Column - Financial and AI */}
            <div className="space-y-6">
              <FinancialPanel />
              <AIRecommendation />
              <QuickInsights />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}