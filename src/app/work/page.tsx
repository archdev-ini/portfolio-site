import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Projects } from '@/components/sections/projects';
import { db } from '@/lib/data';
import type { JournalPost } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const JournalSection = ({ posts }: { posts: JournalPost[] }) => (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-12 text-center">Project Journals & Sketches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0,3).map((post) => {
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
                         <div className="flex gap-2 mb-2">
                           {post.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                         </div>
                         <CardTitle className="mt-2 mb-2 font-headline text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                         <p className="text-sm text-foreground/70 line-clamp-3">{post.description}</p>
                         <div className="mt-4 text-sm font-semibold text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                           Read on Substack <ArrowRight className="ml-2 h-4 w-4" />
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


export default async function WorkPage() {
  const projects = await db.getProjects();
  const projectPosts = await db.getProjectPosts();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {projectPosts.length > 0 && <JournalSection posts={projectPosts} />}
        <Projects projects={projects} isPage={true} />
      </main>
      <Footer />
    </div>
  );
}
