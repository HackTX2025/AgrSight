import Image from "next/image";

const PromisesSection = () => {
  const promises = [
    {
      title: "Collect 100% of what you are owed",
      imageSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/019e367c-b6f9-41df-be92-41a3ff56718b-daydream-dental/assets/images/683794720699ec379e1649f3_promise-1-7.webp?",
      alt: "AgriSight interface mockup showing a collected payment of $2,000 for Composite Fillings.",
    },
    {
      title: "Your account manager is a US-based expert with 8+ years of in-office experience",
      imageSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/019e367c-b6f9-41df-be92-41a3ff56718b-daydream-dental/assets/images/68379472e61e773e433082ab_promise-2-8.webp?",
      alt: "Mockup of payment status rows showing Dental Exam and Cleaning marked as PAID.",
    },
    {
      title: "Get 90+ day insurance aging to $0 (and keep it there)",
      imageSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/019e367c-b6f9-41df-be92-41a3ff56718b-daydream-dental/assets/images/6837947223231c2097bc5af0_promise-3-9.webp?",
      alt: "Mockup of a task completion interface showing a task as 'Finished'.",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <h2 className="text-center text-[40px] leading-tight md:text-5xl font-bold text-[#1a4d4d] mb-12 lg:mb-16">
          Our Promise to You
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {promises.map((promise, index) => (
            <div key={index} className="bg-primary rounded-[20px] p-8 text-center flex flex-col">
              <h3 className="text-xl font-semibold text-[#1a4d4d] mb-8 min-h-[4rem] flex items-center justify-center">
                {promise.title}
              </h3>
              <div className="mt-auto">
                <Image
                  src={promise.imageSrc}
                  alt={promise.alt}
                  width={344}
                  height={220}
                  className="w-full h-auto rounded-xl shadow-md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromisesSection;