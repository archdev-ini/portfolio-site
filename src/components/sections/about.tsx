import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-10 text-center">{children}</h2>
);

export const About = () => {
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-portrait');

  return (
    <section id="about" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-md lg:max-w-none">
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                fill
                className="object-cover"
                data-ai-hint={aboutImage.imageHint}
              />
            )}
          </div>
          <div className="space-y-6 text-foreground/80 text-lg">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">About Me</h2>
            <p>
              I am a multidisciplinary creative driven by a passion for building resonant experiences, whether in the physical or digital realm. As an architecture student, I explore how space shapes human interaction. As a Web3 developer, I build decentralized systems that empower communities.
            </p>
            <p>
              My work lives at the intersection of these fields. I believe the principles of good design—balance, rhythm, and harmony—are universal. I apply an architectural lens to my code and a systems-thinking approach to my designs.
            </p>
            <p>
              Beyond building, I am a writer and community builder dedicated to fostering collaboration and sharing knowledge. My goal is to create work that is not only functional and beautiful but also culturally significant and future-forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
