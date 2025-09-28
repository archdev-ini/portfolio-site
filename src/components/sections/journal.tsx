
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, MoveRight } from 'lucide-react';
import { Button } from '../ui/button';
import type { JournalPost } from '@/lib/data';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-4 text-center">{children}</h2>
);

export const Journal = ({ posts, isPage = false }: { posts: JournalPost[], isPage?: boolean }) => {
  const categories = ['All', 'Reflections', 'Experiments', 'Design Notes'];
  const [filter, setFilter] = useState('All');
  
  const allPosts = posts;
  const displayedPosts = isPage ? allPosts : allPosts.slice(0, 3);
  const filteredPosts = filter === 'All' ? displayedPosts : displayedPosts.filter((p) => p.category === filter);

  return (
    <section id="journal" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <SectionTitle>Notes &amp; Sketches</SectionTitle>
        <p className="max-w-2xl mx-auto text-center text-lg text-foreground/70 mb-12">
          0xSketches is my living journal—where I share thoughts on architecture, code, and community as they evolve. It’s not about finished products but about ideas in motion—a glimpse into how the future is being written.
        </p>

        {isPage ? (
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mx-auto max-w-2xl mb-12">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const postImage = PlaceHolderImages.find(img => img.id === post.imageId);
                if (!postImage) return null;

                return (
                  <Link key={post.id} href={post.link} target="_blank" className="group block">
                    <Card className="h-full bg-background transition-shadow hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
                      <CardHeader className="p-0">
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src={postImage.imageUrl}
                            alt={post.title || postImage.description}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={postImage.imageHint}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <span className="text-xs text-primary/80 font-semibold tracking-wider uppercase">{post.category}</span>
                        <CardTitle className="mt-2 mb-2 font-headline text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                        <p className="text-sm text-foreground/70">{post.description}</p>
                        <div className="mt-4 text-sm font-semibold text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </Tabs>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPosts.map((post) => {
                const postImage = PlaceHolderImages.find(img => img.id === post.imageId);
                if (!postImage) return null;

                return (
                  <Link key={post.id} href={post.link} target="_blank" className="group block">
                    <Card className="h-full bg-background transition-shadow hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
                      <CardHeader className="p-0">
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src={postImage.imageUrl}
                            alt={post.title || postImage.description}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={postImage.imageHint}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <CardTitle className="mb-2 font-headline text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                        <p className="text-sm text-foreground/70">{post.description}</p>
                        <div className="mt-4 text-sm font-semibold text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
            <div className="mt-16 text-center">
              <Button size="lg" asChild>
                <Link href="/journal">Read the Journal <MoveRight className="ml-2" /></Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
