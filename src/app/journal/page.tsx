
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Journal } from '@/components/sections/journal';

export default function JournalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Journal isPage />
      </main>
      <Footer />
    </div>
  );
}
