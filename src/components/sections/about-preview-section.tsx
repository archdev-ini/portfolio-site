import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const AboutPreview = () => {
    const aboutImage = PlaceHolderImages.find(img => img.id === 'about-portrait');

  return (
    <section id="about" className="py-24 md:py-32">
        <div className="container">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
                        Designing Futures — in Space, Code, and Community
                    </h2>
                    <p className="text-lg text-foreground/70">
                        I’m Inioluwa Oladipupo, an architecture student and Web3 developer passionate about shaping environments — both physical and digital — that empower people.
                    </p>
                    <p className="text-lg text-foreground/70">
                        My work spans multiple disciplines but stays rooted in one mission: to build intentional ecosystems where creativity, culture, and innovation thrive together.
                    </p>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/about">
                            Learn More About Me <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-sm">
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
        </div>
    </section>
  );
};
