import { Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/data';

const socialIconMap: { [key: string]: React.ReactNode } = {
  Github: <Github size={20} />,
  Twitter: <Twitter size={20} />,
  LinkedIn: <Linkedin size={20} />,
};

export const Footer = async () => {
  const { siteTitle, footer, hero } = await db.getSiteSettings();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/journal', label: 'Journal' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <div className="space-y-4">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold text-lg">{siteTitle}</span>
              </Link>
              <p className="text-base text-foreground/70">
                {hero.intro ? `${hero.intro.substring(0, 150)}...` : ''}
              </p>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground/90 mb-4">Navigation</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                   <li key={link.href}>
                     <Link href={link.href} className="text-foreground/70 transition-colors hover:text-primary">
                       {link.label}
                     </Link>
                   </li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-foreground/90 mb-4">Contact</h3>
               <ul className="space-y-3">
                 <li>
                   <Link href="/#contact" className="text-foreground/70 transition-colors hover:text-primary">
                     Get in Touch
                   </Link>
                 </li>
                  <li>
                   <Link href="mailto:inioluwaoladipupostudio@gmail.com" className="text-foreground/70 transition-colors hover:text-primary">
                     inioluwaoladipupostudio@gmail.com
                   </Link>
                 </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-12 pt-8 border-t border-border/40">
          <p className="text-sm text-foreground/60 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} {siteTitle}. {footer.text}
          </p>
          <div className="flex items-center space-x-4">
            {footer.socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 transition-colors hover:text-primary"
              >
                {socialIconMap[social.name] || <span>{social.name}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
