import React from 'react';
import Image from 'next/image';

// NOTE: The 'animate-marquee' and 'animate-marquee-reverse' classes with corresponding keyframes
// are assumed to be defined in the project's tailwind.config.js file for this component to work correctly.
//
// tailwind.config.js snippet:
//
// theme: {
//   extend: {
//     animation: {
//       marquee: 'scroll-left var(--duration, 60s) linear infinite',
//       'marquee-reverse': 'scroll-right var(--duration, 60s) linear infinite',
//     },
//     keyframes: {
//       'scroll-left': {
//         '0%': { transform: 'translateX(0)' },
//         '100%': { transform: 'translateX(-100%)' },
//       },
//       'scroll-right': {
//         '0%': { transform: 'translateX(-100%)' },
//         '100%': { transform: 'translateX(0)' },
//       },
//     },
//   },
// }

const logos: { src: string; alt: string }[] = [
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/68377764bc7295fc4725c04f_willard.avif", alt: "Willard Dentistry logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/683777472a21c179a783e886_southboulder.avif", alt: "Southboulder logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/683777361d7993207e7b3edd_pineland.avif", alt: "Pineland Dental logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/6837771cef066428bc4735e4_oaklandpark.avif", alt: "Oakland Park Family Dental logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/683776f9525ecebc093cd261_northwest.avif", alt: "Northwest Dental logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/683776e9a3bc0fb5ae4fe021_minimolars.avif", alt: "Minimolars logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/683776703e8cba865a53108f_imagne.avif", alt: "Imagine Dental Arts logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/683776602341d557616501b8_hutchens.avif", alt: "Hutchens Family Dentistry logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/6837764af1802081a57e7bc5_forestsmiles.avif", alt: "Forest Smiles logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/6837763379c8bedcfa3f7f04_forestlake.avif", alt: "Forest Lake Smiles logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/68377620b39d9e4d82e1a2e5_flowercity.avif", alt: "Flower City Dental logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/6837760da81871723c7899a2_emerald.avif", alt: "Emerald Family Dentistry logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/68375e536319f0fb7b14bad3_clermont.avif", alt: "Clermont Family Dentistry logo" },
  { src: "https://cdn.prod.website-files.com/68375e1ab165515746ef2453/68375e390a044ab3ea709863_brasuell.avif", alt: "Brasuell Family Dentistry logo" },
];

const logosRow2 = [...logos.slice(7), ...logos.slice(0, 7)];
const logosRow3 = [...logos.slice(10), ...logos.slice(0, 10)];

type MarqueeRowProps = {
  logos: typeof logos;
  duration: string;
  reverse?: boolean;
};

const MarqueeRow = ({ logos, duration, reverse = false }: MarqueeRowProps) => {
  const animationClass = reverse ? 'animate-marquee-reverse' : 'animate-marquee';
  
  const logoElements = logos.map((logo, i) => (
    <li key={i} className="mx-8 md:mx-12 shrink-0">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={150}
        height={40}
        className="max-h-10 w-auto object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 filter grayscale hover:filter-none"
      />
    </li>
  ));

  return (
    <div className="flex overflow-hidden">
      <ul style={{ '--duration': duration } as React.CSSProperties} className={`flex shrink-0 items-center py-4 ${animationClass}`}>
        {logoElements}
      </ul>
      <ul style={{ '--duration': duration } as React.CSSProperties} className={`flex shrink-0 items-center py-4 ${animationClass}`} aria-hidden="true">
        {logoElements}
      </ul>
    </div>
  );
};

const ClientLogos = () => {
  return (
    <section className="relative bg-secondary overflow-hidden py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-[28px] font-semibold text-[#1a4d4d] leading-normal">
            Hundreds of dentists trust AgriSight with their dental billing.
          </h2>
        </div>
      </div>
      
      <div className="relative mt-16 w-full space-y-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-secondary z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-secondary z-10" />
        
        <MarqueeRow logos={logos} duration="95s" />
        <MarqueeRow logos={logosRow2} duration="75s" reverse />
        <MarqueeRow logos={logosRow3} duration="105s" />
      </div>
    </section>
  );
};

export default ClientLogos;