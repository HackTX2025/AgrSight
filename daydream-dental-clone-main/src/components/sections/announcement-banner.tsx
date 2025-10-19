import Link from 'next/link';

const AnnouncementBanner = () => {
  return (
    <div className="flex h-12 items-center justify-center gap-4 bg-[#1a4d4d] px-6 py-3 font-sans text-white">
      <p className="m-0 text-base">
        Want the chance to win{' '}
        <span className="font-bold text-[#f4e66d]">$5000</span>?
      </p>
      <Link
        href="/crack-the-code-get-a-box"
        className="flex items-center gap-2 rounded-lg bg-[#d4f5a6] px-4 py-2 text-sm font-semibold text-[#1a3d3a] transition-transform duration-200 ease-in-out hover:scale-[1.02]"
      >
        🚀 Crack the code
      </Link>
    </div>
  );
};

export default AnnouncementBanner;