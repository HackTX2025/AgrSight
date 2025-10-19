import Image from "next/image";

const DifferentiationSection = () => {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-y-16 lg:gap-x-24">
          {/* Left Column: Text Content */}
          <div className="flex flex-col gap-12 text-center lg:text-left">
            <div>
              <h3 className="text-[32px]/[1.3] font-bold text-[#1a4d4d] mb-4">
                Why Outsource Billing?
              </h3>
              <p className="text-lg text-[#333333] leading-[1.6] max-w-lg mx-auto lg:mx-0">
                Outsourced billing allows you and your staff to focus on improving the in-office patient experience. By handling the complex billing tasks that often lead to staff burnout and turnover, we enable your front office team to concentrate on the meaningful work that keeps your patients coming back.
              </p>
            </div>
            <div>
              <h3 className="text-[32px]/[1.3] font-bold text-[#1a4d4d] mb-4">
                What Makes Us Different?
              </h3>
              <p className="text-lg text-[#333333] leading-[1.6] max-w-lg mx-auto lg:mx-0">
                We realize that technology alone doesn't solve the entire problem for dentists. Entirely human-based approaches are time consuming and error prone. By combining technology with our in-house dental billing experts, we offer an end-to-end service that gives the best of both worlds.
              </p>
            </div>
          </div>

          {/* Right Column: Image Mockup */}
          <div className="flex justify-center">
            <Image
              src="https://cdn.prod.website-files.com/68362d58021f1b602d042278/683674a93ec5b5224e2cba9f_outsource-billing.avif"
              alt="A dark green side menu with a curved top. At the top, it displays the 'AgriSight' logo and name. Below that are menu items with icons: 'Dental Office' (green Delta logo), 'Postings' (dollar sign icon, highlighted), 'EFTs' (building icon), 'Verifications' (checkmark icon), 'A/R Tracker' (list icon), and 'Uploads' (upload arrow icon)."
              width={496}
              height={550}
              className="w-full max-w-md lg:max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiationSection;