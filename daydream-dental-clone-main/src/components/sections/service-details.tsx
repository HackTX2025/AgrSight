import React from 'react';

const servicesData = [
  {
    title: "Insurance A/R Suite",
    features: [
      "Clean claim submission with all appropriate attachments and narratives.",
      "Diligently working each outstanding claim every 7 days until paid.",
      "Payment posting with accurate insurance adjustments.",
      "Denials appealed.",
      "Detailed tracking and audit logs to monitor progress.",
    ],
  },
  {
    title: "Insurance Verification",
    features: [
      "Custom breakdowns tailored to your office coding needs.",
      "Saved directly to your PMS.",
      "Verifying ahead on your schedule 5-7 days with accommodations for walk-ins.",
      "PMS updates such as coverage percentages and fee schedule attachments.",
    ],
  },
  {
    title: "Patient Billing",
    features: [
      "Statements sent electronically multiple times per week",
      "Custom 60/90/Final past due statements mailed to patients with your logo and branding.",
      "Letters include payment links and QR codes, making it easy for patients to pay.",
      "3 outreach attempts to patients with outstanding balances done via text, email, and electronic methods.",
      "Detailed contact logs kept.",
    ],
  },
];

interface ServiceCardProps {
  title: string;
  features: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, features }) => {
  return (
    <div className="flex flex-col rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="bg-[#1a4d4d] text-white p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="bg-white p-8 flex-grow">
        <ul className="space-y-4 list-disc list-outside pl-5">
          {features.map((feature, index) => (
            <li key={index} className="text-[#333333] text-[15px] leading-[1.8]">
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ServiceDetails = () => {
  return (
    <section className="bg-[#f5f3ed] py-24">
      <div className="container">
        <h2 className="text-center text-[#1a4d4d] font-bold text-[40px] mb-16">
          Ready to put your billing on autopilot?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {servicesData.map((service, index) => (
            <ServiceCard key={index} title={service.title} features={service.features} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;