import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import type { SiteSettings } from '@/lib/data';

export const Hero = ({ hero }: { hero: SiteSettings['hero'] }) => {
  return (
    <section id="hero" className="py-24 md:py-40">
      <div className="container text-center">
        <div className="mx-auto max-w-4xl">
           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 font-headline">
            {hero.headline}
           </h1>
           <div className="text-lg md:text-xl text-foreground/80 tracking-wide mb-6">
            {hero.subline}
           </div>
          <p className="text-lg md:text-xl text-foreground/70 mb-12">
            {hero.tagline}
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/work">View My Work</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
