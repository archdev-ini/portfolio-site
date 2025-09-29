
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';

// Since pages are generated dynamically from the RSS feed, we can't know all slugs at build time.
// This tells Next.js to generate pages on-demand.
export async function generateStaticParams() {
  const projects = await db.getProjects();
  return projects.map((project) => ({
      slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const projects = await db.getProjects();
  const project = projects.find(p => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  // Find a placeholder image. The logic can be improved to be more specific.
  const projectImage = PlaceHolderImages.find(img => img.id.startsWith('project-'));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <article>
          <header className="py-12 md:py-24 bg-secondary/30">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center gap-2 mb-4">
                  {project.tags?.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-headline">
                  {project.title}
                </h1>
                 <p className="mt-4 text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
                  {project.description}
                </p>
              </div>
              {projectImage && (
                <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto mt-12 rounded-xl overflow-hidden shadow-2xl">
                  <Image
                      src={projectImage.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      data-ai-hint={projectImage.imageHint}
                  />
                </div>
              )}
            </div>
          </header>

          <div className="container py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
                 {/* The project content is the full post from Substack */}
                <div className="prose prose-invert max-w-none text-foreground/80 text-lg" dangerouslySetInnerHTML={{ __html: project.content }} />
                
                <div className="mt-16 text-center">
                    <Button asChild className="w-full md:w-auto" size="lg">
                      <Link href={project.link} target="_blank">
                        Read Full Post on Substack <ExternalLink className="ml-2" />
                      </Link>
                    </Button>
                </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
