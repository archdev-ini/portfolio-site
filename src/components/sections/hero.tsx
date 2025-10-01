import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import type { SiteSettings } from '@/lib/data';

export const Hero = ({ hero }: { hero: SiteSettings['hero'] }) => {
  return (
    <section id="hero" className="py-24 md:py-40">
      <div className="container text-center">
        <div className="mx-auto max-w-4xl">
           <div className="text-sm uppercase text-foreground/60 tracking-widest mb-4">
            {hero.tagline}
           </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 font-headline">
            {hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-12">
            {hero.intro}
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/work">View My Work</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/journal">Read My Journal</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
