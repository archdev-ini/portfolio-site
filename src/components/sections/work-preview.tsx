import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import { ArrowRight, MoveRight } from 'lucide-react';
import type { Project } from '@/lib/data';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-4 text-center">{children}</h2>
);

export const WorkPreview = ({ projects }: { projects: Project[] }) => {
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <section id="work" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <SectionTitle>Selected Work</SectionTitle>
        <p className="max-w-2xl mx-auto text-center text-lg text-foreground/70 mb-12">
            Each project I take on is a prototype of the future—an experiment in design, technology, or community. The goal isn’t just to create but to shift what’s possible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => {
            const projectImage = project.imageId ? { imageUrl: project.imageId, description: project.title, imageHint: '' } : PlaceHolderImages.find(img => img.id === 'project-arch-1');
            if (!projectImage) return null;

            return (
              <Card key={project.id} className="group flex flex-col overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-primary/20 bg-background">
                <CardHeader className="p-0">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={projectImage.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={projectImage.imageHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1">
                  <span className="text-xs text-primary/80 font-semibold tracking-wider uppercase">{project.category}</span>
                  <CardTitle className="mt-2 mb-3 font-headline text-xl">{project.title}</CardTitle>
                  <p className="text-sm text-foreground/70">{project.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link href={`/work/${project.slug}`}>
                      View Case Study <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <Link href="/work">View Full Portfolio <MoveRight className="ml-2" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
