import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section id="hero" className="py-24 md:py-40">
      <div className="container text-center">
        <div className="mx-auto max-w-4xl">
           <div className="text-sm uppercase text-foreground/60 tracking-widest mb-4">
            Architect & Web3 Developer
           </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 font-headline">
            Building bridges between physical and digital worlds.
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-12">
            My work explores the intersection of architecture, decentralized technology, and community to create more equitable and beautiful futures.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/work">Explore My Work <MoveRight className="ml-2" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/#contact">Get In Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
