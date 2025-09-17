import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline mb-8 text-center">{children}</h2>
);

export const About = () => {
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-portrait');

  return (
    <section id="about" className="bg-card py-20 md:py-32">
      <div className="container">
        <SectionTitle>About Me</SectionTitle>
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-3 md:gap-12">
          <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-2xl mx-auto max-w-xs md:max-w-none">
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
          <div className="md:col-span-2 space-y-4 text-foreground/80 text-lg">
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
