import Image from 'next/image';
import { Star, Play } from 'lucide-react';

const Highlight = ({ children, color }: { children: React.ReactNode; color: 'green' | 'yellow' }) => {
  const bgColorClass = color === 'green' ? 'bg-[#D4F1A8]' : 'bg-[#F4E66D]';
  return <strong className={`font-bold ${bgColorClass}`}>{children}</strong>;
};

const testimonials = [
  {
    id: 1,
    type: 'video' as const,
    image: 'https://cdn.prod.website-files.com/68362d58021f1b602d042278/68383f94747c34d0b17b2b88_Abbey.avif',
    name: 'Abbey Elson',
    title: 'Pediatric Dentist and Owner of Mini Molars Pediatric Dentistry',
  },
  {
    id: 2,
    type: 'text' as const,
    avatar: 'https://cdn.prod.website-files.com/68362d58021f1b602d042278/6838423f46f4995c69784df0_Frame%201597881829.avif',
    name: 'Maura McQuade',
    title: 'Practice Administrator',
    quote: (
      <>
        AgriSight has been a game changer for our practice. We are a longstanding community practice with new ownership as of 2022, and inherited years of less-than-optimal financial systems. AgriSight took over our Insurance A/R and Patient A/R so we could focus on the more patient facing aspects of the practice while rebuilding our systems. It's been such a game changer they have stayed on with our Insurance A/R so we can continue to focus on providing 5-star service to our patients. Highly recommend!
      </>
    ),
    date: 'Dec 18, 2024',
  },
  {
    id: 3,
    type: 'text' as const,
    avatar: 'https://cdn.prod.website-files.com/68362d58021f1b602d042278/68384260a92f8efddc6d56d5_Fatehi%2C%20Dr.%20Sharo.avif',
    name: 'Dr. Sharo Fatehi, DDS',
    title: 'Fatehi Oral Surgery',
    quote: (
      <>
        I just wanted to thank each and every one of you for the wonderful work you have done so far, prompting my staff to rave about you every single day! <Highlight color="yellow">The accuracy in your work, gentle and kind demeanor, and most importantly the ease of communication with you has made my staff, including my wife, fall in love with you!</Highlight>
      </>
    ),
    date: 'Nov 25, 2024', // Note: date inferred from similar cards, not visible in screenshot
  },
  {
    id: 4,
    type: 'text' as const,
    avatar: null, // Thi Nguyen has no avatar image
    name: 'Thi Nguyen',
    title: 'First Dental - Orange County, CA',
    quote: (
      <>
        AgriSight is amazing. I have been helped with insurance A/R suit and insurance verification services and have been very satisfied. My account manager is supper helpful and she responds very quickly when being in need. With this service, I can focus more on my clinical works since the insurance part is well taken care. <Highlight color="green">I would definitely recommend AgriSight to my fellow dentist friends.</Highlight>
      </>
    ),
    date: 'Nov 25, 2024',
  },
  {
    id: 5,
    type: 'text' as const,
    avatar: 'https://cdn.prod.website-files.com/68362d58021f1b602d042278/68384282a92f8efddc6d7a6e_prab.avif',
    name: 'Dr. Susmita Parab, DDS',
    title: 'Dream Smile Dental - PA',
    quote: (
      <>
       <Highlight color="green">AgriSight has completely transformed our dental billing.</Highlight> We used to struggle with payment posting and reconciliation, but now it's all handled easily and accurately by AgriSight's accounting team! The best part is that I have full visibility into the work they're doing and how much time/money they're saving my practice.
      </>
    ),
    date: 'Nov 18, 2024',
  },
  {
    id: 6,
    type: 'text' as const,
    avatar: 'https://cdn.prod.website-files.com/68362d58021f1b602d042278/683842a27546419f864627d3_Rectangle%20138.avif',
    name: 'Dr. Chia-Hung Lin, DDS',
    title: 'Fellow Orthodontist - NYC',
    quote: (
      <>
        AgriSight was able to connect me with an experienced insurance coordinator with years of experience in ortho and <Highlight color="yellow">they have been an amazing remote addition to our team!</Highlight>
      </>
    ),
    date: 'Nov 20, 2024',
  },
];

const FiveStars = () => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="w-5 h-5 text-[#FFD700]" fill="#FFD700" />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => {
  if (testimonial.type === 'video') {
    return (
      <div className="group relative bg-white rounded-xl border-[3px] border-[#1A4D4D] shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden cursor-pointer">
        <Image
          src={testimonial.image}
          alt={`Video testimonial from ${testimonial.name}`}
          width={400}
          height={300}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-10 h-10 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <FiveStars />
          <p className="font-semibold text-white mt-2 text-lg">{testimonial.name}</p>
          <p className="text-white/90 text-sm">{testimonial.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-xl border-[3px] border-[#1A4D4D] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-4">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar}
            alt={`Avatar of ${testimonial.name}`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#E8E8E8]" />
        )}
        <div>
          <p className="font-semibold text-lg text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
        </div>
      </div>
      <div className="mt-4">
        <FiveStars />
      </div>
      <p className="mt-4 text-base text-foreground leading-relaxed flex-grow">
        {testimonial.quote}
      </p>
      {testimonial.date && (
        <p className="mt-4 text-sm text-muted-foreground">{testimonial.date}</p>
      )}
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1A4D4D] tracking-tight">
            Don't Take it From Us, Take it From Our Clients
          </h2>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="break-inside-avoid">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}