
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Journal } from '@/components/sections/journal';
import { db } from '@/lib/data';

export default async function JournalPage() {
  const posts = await db.getJournalPosts();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Journal posts={posts} isPage />
      </main>
      <Footer />
    </div>
  );
}
