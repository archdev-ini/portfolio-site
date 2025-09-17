import { notFound } from 'next/navigation';
import Image from 'next/image';
import { projects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  const projectImage = PlaceHolderImages.find(img => img.id === project.imageId);
  const galleryImages = project.galleryImageIds?.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <article>
          <header className="py-12 md:py-24 bg-secondary/30">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-primary font-semibold mb-2">{project.category}</p>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-headline">
                  {project.title}
                </h1>
                <p className="mt-4 text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
                  {project.description}
                </p>
              </div>
              <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto mt-12 rounded-xl overflow-hidden shadow-2xl">
                {projectImage && (
                  <Image
                    src={projectImage.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint={projectImage.imageHint}
                  />
                )}
              </div>
            </div>
          </header>

          <div className="container py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <aside className="lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="font-headline text-lg font-semibold mb-6">Project Details</h3>
                  <div className="space-y-5 text-sm">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 mt-1 text-primary/80" />
                      <div>
                        <p className="font-semibold">My Role</p>
                        <p className="text-foreground/70">{project.role}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 mt-1 text-primary/80" />
                      <div>
                        <p className="font-semibold">Duration</p>
                        <p className="text-foreground/70">{project.duration}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-3">
                      <Tag className="w-4 h-4 mt-1 text-primary/80" />
                      <div>
                        <p className="font-semibold">Technologies</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {project.technologies.map(tech => (
                            <Badge key={tech} variant="secondary">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {project.link !== '#' && (
                    <Button asChild className="w-full mt-8">
                      <Link href={project.link} target="_blank">
                        Live Project <ExternalLink className="ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </aside>

              <div className="lg:col-span-3">
                <div className="prose prose-invert max-w-none text-foreground/80 text-lg">
                  <h2 className="font-headline text-3xl font-bold text-foreground">Overview</h2>
                  <p>{project.overview}</p>
                  
                  <h2 className="font-headline text-3xl font-bold text-foreground mt-12">Process</h2>
                  <p>{project.process}</p>

                  <h2 className="font-headline text-3xl font-bold text-foreground mt-12">Outcomes</h2>
                  <p>{project.outcomes}</p>
                </div>

                {galleryImages && galleryImages.length > 0 && (
                  <div className="mt-16">
                    <h3 className="font-headline text-2xl font-bold text-foreground mb-8">Gallery</h3>
                    <Carousel className="w-full max-w-3xl mx-auto">
                      <CarouselContent>
                        {galleryImages.map((image) => image && (
                          <CarouselItem key={image.id}>
                            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                              <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                className="object-cover"
                                data-ai-hint={image.imageHint}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
