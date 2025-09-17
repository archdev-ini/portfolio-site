import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-portrait');

  const highlights = [
    {
      title: 'Architecture',
      description: 'Climate-responsive, sustainable design with a focus on local materials and community living.',
    },
    {
      title: 'Web3 / Development',
      description: 'Smart contracts, decentralized learning platforms, and experiments at the edge of design + technology.',
    },
    {
      title: 'Writing',
      description: '0xSketches (Substack), essays, and reflections that document my process and explore design futures.',
    },
    {
      title: 'Community',
      description: 'Founder of Aether, Rootos, and Buildbase — platforms empowering learning, collaboration, and resource-sharing.',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section id="about" className="py-24 md:py-32">
          <div className="container">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 lg:grid-cols-5">
              <div className="lg:col-span-3 space-y-8">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Designing Futures — in Space, Code, and Community
                </h1>
                <div className="space-y-6 text-foreground/80 text-lg">
                  <p>
                    I’m Inioluwa Oladipupo, an architecture student and Web3 developer passionate about shaping environments — both physical and digital — that empower people.
                  </p>
                  <p>
                    My journey sits at the crossroads of sustainable architecture, decentralized technology, and creative community building. From sketching a courtyard home for a family in Lagos to experimenting with smart contracts and proof-of-skill platforms, I’ve always been driven by one question:
                  </p>
                  <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/90 my-6">
                    How can design — whether a building, a line of code, or a community — create lasting impact?
                  </blockquote>
                  <p>
                    I believe design isn’t just about form or function; it’s about systems. It’s the way spaces influence behavior, how technologies redistribute power, and how communities spark possibility. That’s why my work spans multiple disciplines but stays rooted in one mission: to build intentional ecosystems where creativity, culture, and innovation thrive together.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-2 relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-md lg:max-w-none">
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
            </div>

            <div className="mt-24">
              <h3 className="text-3xl font-bold font-headline mb-8 text-center">Quick Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {highlights.map((highlight) => (
                  <div key={highlight.title} className="bg-secondary/30 p-6 rounded-lg text-center">
                    <h4 className="font-bold text-xl text-primary mb-2 font-headline">{highlight.title}</h4>
                    <p className="text-foreground/70">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-24 max-w-3xl mx-auto bg-secondary/30 p-10 rounded-2xl">
                <h3 className="text-3xl font-bold font-headline mb-4">Let's Connect</h3>
                <p className="text-lg text-foreground/80 mb-6">
                    This portfolio is a living reflection of my journey. If my work resonates with you, I’d love to explore ideas, collaborate on a project, or simply connect.
                </p>
                 <Button asChild size="lg">
                    <Link href="/#contact">
                       Get in Touch
                    </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
