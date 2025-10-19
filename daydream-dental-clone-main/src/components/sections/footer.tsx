import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const Footer = () => {
  const productLinks = [
    { href: 'https://app.daydream.dental/portal-genie', label: 'Portal Genie' },
    { href: '/cdt-codes', label: 'CDT Codes Genie' },
    { href: 'https://app.daydream.dental/dashboard', label: 'Sign In' },
  ];

  const servicesLinks = [
    { href: '/services/insurance-verifications', label: 'Insurance Verification' },
    { href: '/services/insurance-billing', label: 'Insurance Billing' },
    { href: '/services/patient-billing', label: 'Patient Billing' },
  ];

  const legalLinks = [
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/fulfillment-policy', label: 'Fulfillment Policy' },
    { href: '/cookie-policy', label: 'Cookie Policy' },
  ];

  const socialLinks = [
    { href: 'http://facebook.com', src: 'https://cdn.prod.website-files.com/68362d58021f1b602d042278/68379ba17c4613c7490013f9_facebook%20(1).svg', alt: 'Facebook' },
    { href: 'https://twitter.com/daydreamdental', src: 'https://cdn.prod.website-files.com/68362d58021f1b602d042278/68379ba1fccc4630a915b225_Social%20icon.svg', alt: 'X' },
    { href: 'https://www.linkedin.com/company/daydream-inc/', src: 'https://cdn.prod.website-files.com/68362d58021f1b602d042278/68379ba187f433a00f2795a9_linkedin%20(1).svg', alt: 'LinkedIn' },
  ];
  
  const FooterLink = ({ href, children, isExternal = false, className = '' }: { href: string; children: React.ReactNode; isExternal?: boolean; className?: string}) => {
    const commonClasses = "text-sm text-white hover:opacity-80 transition-opacity";
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`${commonClasses} ${className}`}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={`${commonClasses} ${className}`}>
        {children}
      </Link>
    );
  };

  return (
    <footer className="bg-[#1a4d4d] text-white">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-start gap-y-6">
            <Link href="/">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/AgriSight_Logo_Figma-1760859047163.png"
                alt="AgriSight Logo"
                width={177}
                height={35}
                className="brightness-0 invert"
              />
            </Link>
            <Image
              src="https://cdn.prod.website-files.com/68362d58021f1b602d042278/68379c4a45a1f64797003460_hipaa-badge.svg"
              alt="HIPAA compliance badge"
              width={72}
              height={72}
            />
            <div className="flex items-center space-x-4">
              {socialLinks.map(social => (
                <a key={social.alt} href={social.href} target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-80 transition-opacity">
                  <Image src={social.src} alt={social.alt} width={24} height={24} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} isExternal={link.href.startsWith('http')}>
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5">Services</h3>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.label}>
                   <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-5">Company</h3>
            <div className="flex flex-col space-y-3">
              <FooterLink href="/audiences/daydream-for-doctors">Who We Serve</FooterLink>
              <FooterLink href="/audiences/daydream-for-doctors" className="pl-4">Doctors</FooterLink>
              <FooterLink href="/audiences/daydream-for-office-managers" className="pl-4">Office Managers</FooterLink>
              <FooterLink href="/audiences/daydream-for-dso" className="pl-4">DSOs</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/careers/billers">Careers</FooterLink>
              <FooterLink href="/careers/engineering" className="pl-4">Engineering</FooterLink>
              <FooterLink href="/careers/billers" className="pl-4">Billers</FooterLink>
            </div>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-base mb-5">Contact Us</h3>
            <div className="flex flex-col items-start space-y-4">
              <a href="mailto:support@agrisight.com" className="text-sm text-white hover:opacity-80 transition-opacity">
                support@agrisight.com
              </a>
              <Link
                href="/demo-call"
                className="inline-flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <Image
                  src="https://cdn.prod.website-files.com/68362d58021f1b602d042278/6837e3d1796129884c71e21b_plus-icon.svg"
                  alt="Plus icon"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                Schedule a call
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/80 text-center md:text-left">© 2025 AgriSight Technology, Inc. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 text-xs">
            {legalLinks.map((link, index) => (
              <div key={link.label} className="flex items-center gap-x-4">
                <FooterLink href={link.href}>{link.label}</FooterLink>
                {index < legalLinks.length - 1 && <span className="text-white/40 hidden md:inline">|</span>}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;