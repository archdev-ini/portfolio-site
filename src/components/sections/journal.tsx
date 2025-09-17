import Image from 'next/image';
import Link from 'next/link';
import { journalPosts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-4 text-center">{children}</h2>
);

export const Journal = () => {
  return (
    <section id="journal" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <SectionTitle>Journal</SectionTitle>
        <p className="max-w-2xl mx-auto text-center text-lg text-foreground/70 mb-12">
          Thoughts, reflections, and experiments from my Substack,{' '}
          <Link href="https://substack.com" target="_blank" className="text-primary underline-offset-4 hover:underline">
            0xSketches
          </Link>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journalPosts.map((post) => {
            const postImage = PlaceHolderImages.find(img => img.id === post.imageId);
            if (!postImage) return null;

            return (
              <Link key={post.id} href={post.link} target="_blank" className="group block">
                <Card className="h-full bg-background transition-shadow hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={postImage.imageUrl}
                        alt={post.title}
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
      </div>
    </section>
  );
};
