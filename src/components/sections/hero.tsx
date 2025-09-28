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
            Designing Futures. Building Communities.
           </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 font-headline">
            Architecture · Web3 · Creative Innovation
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-6">
            I’m Inioluwa Oladipupo—an architect in training and a community builder in Web3, exploring how spaces, systems, and stories can reimagine the way we live, learn, and connect.
          </p>
           <p className="text-lg md:text-xl text-foreground/70 mb-12">
            My work sits at the frontier of sustainable architecture, decentralized communities, and creative systems—building not just projects, but platforms for the future.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/work">Explore My Work</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/#contact">Let’s Connect <MoveRight className="ml-2" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
