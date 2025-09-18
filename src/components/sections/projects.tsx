'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import { ArrowRight, Search } from 'lucide-react';
import { Input } from '../ui/input';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-12 text-center">{children}</h2>
);

export const Projects = ({ isPage = false }: { isPage?: boolean }) => {
  const categories = ['All', 'Architecture', 'Web3', 'Writing', 'Community'];

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const projects = db.projects.all();

  const filteredProjects = useMemo(() => {
    let categoryFiltered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

    if (!searchTerm) {
      return categoryFiltered;
    }

    return categoryFiltered.filter((project) => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const searchIn = [
        project.title,
        project.description,
        project.overview,
        ...project.technologies,
      ].join(' ').toLowerCase();

      return searchIn.includes(lowerCaseSearch);
    });

  }, [filter, searchTerm, projects]);


  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container">
        <SectionTitle>{isPage ? "Work" : "Featured Work"}</SectionTitle>

        <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by title, technology, etc..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mx-auto max-w-2xl mb-12">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const projectImage = PlaceHolderImages.find(img => img.id === project.imageId);
              if (!projectImage) return null;

              return (
              <Card key={project.id} className="group flex flex-col overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-primary/20">
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
            )})}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No projects found.</p>
                <p>Try adjusting your search or filter.</p>
            </div>
          )}

        </Tabs>
      </div>
    </section>
  );
};
