'use client';

import { } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TopBar() {
  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-blue-100/10 opacity-80"></div>
      
      <div className="relative container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 px-6">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/fleshLogo-1760864685648.png"
              alt="AgriSight Logo"
              width={120}
              height={30}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Farm Info */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a4d4d] tracking-tight">Martinez Family Farm</h1>
          <p className="text-lg md:text-xl text-gray-600 tracking-tight">Garden City, Kansas</p>
        </div>
        
        {/* Top-right navigation */}
        <nav className="flex gap-2 ml-auto">
          <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
            🌾 Dashboard
          </Link>
          <Link href="/finance" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
            💰 Finance Cockpit
          </Link>
        </nav>
      </div>
    </div>
  );
}