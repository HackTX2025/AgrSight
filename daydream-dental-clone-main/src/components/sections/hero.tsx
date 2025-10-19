import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center overflow-hidden pt-36">
      <div className="absolute top-0 left-0 right-0 bottom-0 -z-10 h-full w-full">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/wp5330614-1760864609419.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
      
      <div className="w-full px-6 pt-16 pb-[12rem] sm:pb-[15rem] md:px-12 lg:pt-24 lg:pb-[25rem]">
        <div className="relative mx-auto w-full max-w-[53rem] flex flex-col items-center justify-center gap-4">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/fleshLogo-1760864685648.png"
            alt="Logo"
            width={600}
            height={150}
            className="w-full max-w-[500px] h-auto md:max-w-[600px]"
            priority
          />
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-tight tracking-tight drop-shadow-2xl bg-black/20 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/20">
            Farming Finance from Orbit
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;