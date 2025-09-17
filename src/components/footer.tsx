import { Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { AboutPreview } from '@/components/sections/about-preview';

export const Footer = () => {
  const socialLinks = [
    { icon: <Github size={20} />, href: 'https://github.com/inioluwa-xyz' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com/inioluwa_xyz' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com/in/inioluwa-oladipupo' },
  ];

  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <AboutPreview />
          </div>
          {/* You can add more columns for navigation links or other content later */}
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-12 pt-8 border-t border-border/40">
          <p className="text-sm text-foreground/60 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Inioluwa Oladipupo. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 transition-colors hover:text-primary"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
