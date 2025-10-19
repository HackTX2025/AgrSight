"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    value: "item-1",
    question: "How soon can we get started?",
    answer:
      "Our current waitlist for new clients is two weeks. We typically schedule our clients to begin on Mondays. Each new client goes through a one-week onboarding process, where we review your system, set up any necessary clearinghouses, and establish our workflows. After onboarding is complete, we begin working claims, posting payments, and managing your verifications!",
  },
  {
    value: "item-2",
    question: "How will you access my software, insurance portals and PMS?",
    answer:
      "We'll work with you to gain remote access to your systems. For web-based software, we require a dedicated-user log-in. For server-based software, we will set up a remote connection to a workstation in your office.",
  },
  {
    value: "item-3",
    question:
      "Who will be my point of contact? How often can I expect communicating with them?",
    answer:
      "You'll be assigned a dedicated Account Manager. Your Account Manager is a dental billing expert with years of experience. We'll meet with them weekly during the first 90 days. After that, you can schedule meetings as needed. Otherwise, we communicate in a shared Slack channel.",
  },
  {
    question: "Is AgriSight right for me?",
    answer:
      "We work with all practice types from FFS to PPO, single provider to multi-location DSOs. The best way to know if AgriSight is right for you is by scheduling a free consultation with our team. We'll be able to tell you if and how we can help your practice.",
  },
];

const FaqSection = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[900px] px-6">
        <h2 className="mb-12 text-center text-[48px] font-bold text-[#1a4d4d] lg:text-[56px]">
          FAQs
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item) => (
            <AccordionItem
              value={item.value}
              key={item.value}
              className="border-b border-[#e5e5e5]"
            >
              <AccordionTrigger className="py-6 text-left text-lg font-semibold text-[#1a4d4d] transition-colors duration-300 ease-in-out hover:bg-[#f9f9f9] hover:no-underline md:text-xl [&>svg]:h-6 [&>svg]:w-6 [&>svg]:shrink-0">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-4 pr-6">
                <p
                  className="text-base text-[#555555]"
                  style={{ lineHeight: 1.6 }}
                >
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;