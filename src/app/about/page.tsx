import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/data';

export default async function AboutPage() {
  const aboutContent = await db.getAboutContent();
  const aboutImage = PlaceHolderImages.find(img => img.id === aboutContent.profileImageId);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section id="about" className="py-24 md:py-32">
          <div className="container">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div className="lg:col-span-1 space-y-8">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
                  {aboutContent.headline}
                </h1>
                <div className="space-y-6 text-foreground/80 text-lg">
                    {aboutContent.fullText.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
              </div>
              <div className="lg:col-span-1 relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-md lg:max-w-none">
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

            <div className="text-center mt-24 max-w-3xl mx-auto bg-secondary/30 p-10 rounded-2xl">
                <h3 className="text-3xl font-bold font-headline mb-4">Let's Connect</h3>
                <p className="text-lg text-foreground/80 mb-6">
                    I’m always open to conversations, collaborations, and opportunities around architecture, technology, and community building.
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
