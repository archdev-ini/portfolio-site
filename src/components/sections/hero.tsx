import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const Hero = () => {
  return (
    <section id="hero" className="py-20 md:py-32">
      <div className="container text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline">
            Inioluwa Oladipupo
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-6">
            Architect <span className="text-primary">•</span> Web3 Developer <span className="text-primary">•</span> Creative Builder
          </p>
          <p className="text-base md:text-lg text-foreground/60 mb-10">
            Shaping physical spaces and digital futures through design, technology, and community.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="#work">View My Work</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#contact">Let's Connect</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
