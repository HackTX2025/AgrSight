import Image from 'next/image';

const ServicesGrid = () => {
  return (
    <section className="bg-[#1a4d4d] py-16 md:py-24">
      <div className="container mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="flex flex-col items-center">
          <p className="text-white text-lg md:text-xl leading-relaxed text-center max-w-[900px]">
            Agrisight is an innovative AI-powered platform that uses satellite imagery and advanced data analysis to provide real-time insights into crop health. By delivering objective, up-to-date information, Agrisight helps farmers and lenders make smarter decisions, improving access to financing and reducing risks. Our solution combines Sentinel-2 satellite monitoring with AI-driven evaluations to optimize resource allocation and financial planning for farms of all sizes.
          </p>
          <p className="text-white text-lg md:text-xl leading-relaxed text-center max-w-[900px] mt-6">
            Designed to provide an early warning system and reduce uncertainty in the agricultural supply chain, Agrisight empowers farmers with the tools they need to maximize profitability and secure the funding they deserve. With cost-effective, data-driven solutions, we're transforming farm finance from orbit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;