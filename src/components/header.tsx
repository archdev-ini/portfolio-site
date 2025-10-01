import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { db } from '@/lib/data';

export const Header = async () => {
  const { siteTitle } = await db.getSiteSettings();
  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Writing' },
    { href: '/cv', label: 'CV' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg">{siteTitle}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-6">
                 {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link href="https://twitter.com/inioluwa_xyz" target="_blank">Say Hello</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
