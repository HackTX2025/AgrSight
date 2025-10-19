'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on scroll position
  const opacity = Math.min(scrollY / 100, 1); // 0 to 1 over 100px scroll
  const backgroundOpacity = 0.1 + (opacity * 0.85); // Start at 10%, max at 95%
  const blurAmount = 8 - (opacity * 3); // Start with more blur, reduce as scrolling

  return (
    <header 
      className="sticky top-0 z-50 w-full transition-all duration-300 ease-out"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
        backdropFilter: `blur(${blurAmount}px)`,
        boxShadow: opacity > 0.1 ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      {/* Subtle gradient background with cloud-like shapes */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-blue-100/20 transition-opacity duration-300"
        style={{ opacity: 0.6 - (opacity * 0.4) }} // Fade out gradient as scrolling
      ></div>
      
      <div className="relative container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/fleshLogo-1760864685648.png"
            alt="Agrisight Logo"
            width={200}
            height={44}
            className="h-11 w-auto"
          />
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 border-2 border-[#1a4d4d] text-[#1a4d4d] rounded-lg font-semibold hover:bg-[#1a4d4d] hover:text-white transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-[#e0ff80] text-[#1a4d4d] rounded-lg font-semibold hover:bg-[#d4f1a8] transition-all shadow-sm border border-[#1a4d4d]/10"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}