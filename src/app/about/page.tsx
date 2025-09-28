import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/data';

export default async function AboutPage() {
  const { headline, fullText, highlights, profileImageId } = await db.getAboutContent();
  const aboutImage = PlaceHolderImages.find(img => img.id === profileImageId);
  const newHighlights = [
    {
        title: "Architecture",
        description: "Designing sustainable, human-centered spaces with cultural depth and environmental intelligence."
    },
    {
        title: "Web3 / Community",
        description: "Building decentralized communities and open ecosystems that enable people to learn, connect, and grow."
    },
    {
        title: "Writing",
        description: "Publishing essays and reflections on architecture, technology, and creativity through platforms like 0xSketches."
    },
    {
        title: "Initiatives",
        description: "Through projects like Aether Community, Rootos, and Buildbase, I explore new ways to democratize knowledge, empower collaboration, and design systems that matter."
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
                  Shaping Space. Empowering Communities. Reimagining Futures.
                </h1>
                <div className="space-y-6 text-foreground/80 text-lg">
                    <p>I’m Inioluwa Oladipupo—an architecture student and Web3 community builder working at the intersection of design, technology, and storytelling.</p>
                    <p>My journey is about more than projects or platforms—it’s about creating systems that empower people and spark new possibilities.</p>
                    <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/90 my-6">
                        In architecture, I design climate-responsive, culturally rooted spaces that adapt to people’s needs today while anticipating tomorrow’s challenges.
                    </blockquote>
                    <p>In Web3, I focus on building communities—designing ecosystems where collaboration, learning, and creativity thrive beyond borders.</p>
                    <p>Through writing, I connect ideas, document the process, and invite others into the conversation of shaping futures together.</p>
                    <p>Across all of this, my mission is simple: to blend design, community, and innovation into frameworks that don’t just imagine change but make it real.</p>
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
                {newHighlights.map((highlight) => (
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
                    This portfolio is a living reflection of my journey—always evolving, always experimenting. If my work resonates with you, let’s explore ideas, collaborate on projects, or build new communities together.
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
