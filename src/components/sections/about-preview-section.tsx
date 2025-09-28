import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { AboutContent } from '@/lib/data';

export const AboutPreview = ({ about }: { about: AboutContent }) => {
    const aboutImage = PlaceHolderImages.find(img => img.id === 'about-portrait');

  return (
    <section id="about" className="py-24 md:py-32">
        <div className="container">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
                        About Me
                    </h2>
                    <p className="text-lg text-foreground/70">
                       I believe architecture isn’t only about structures—it’s about the systems and communities that make them come alive.
                    </p>
                    <p className="text-lg text-foreground/70">
                        I’m shaping a practice where physical spaces, digital networks, and human creativity merge into futures that empower people. From open learning ecosystems to community-driven platforms, my mission is to design scalable systems for collective growth.
                    </p>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/about">
                            Read More <ArrowRight className="ml-2" />
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
