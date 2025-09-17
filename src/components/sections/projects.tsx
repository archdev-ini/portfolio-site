'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { projects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline mb-8 text-center">{children}</h2>
);

export const Projects = () => {
  const categories = ['All', 'Architecture', 'Web3', 'Writing', 'Community'];

  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="work" className="py-20 md:py-32">
      <div className="container">
        <SectionTitle>Featured Work</SectionTitle>
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
              <Card key={project.id} className="flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                <CardHeader className="p-0">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={projectImage.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      data-ai-hint={projectImage.imageHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1">
                  <span className="text-xs text-primary font-semibold tracking-wider uppercase">{project.category}</span>
                  <CardTitle className="mt-2 mb-3 font-headline">{project.title}</CardTitle>
                  <p className="text-sm text-foreground/70">{project.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href={project.link} target="_blank">
                      View Project <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )})}
          </div>
        </Tabs>
      </div>
    </section>
  );
};
