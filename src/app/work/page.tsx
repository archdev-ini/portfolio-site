import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Projects } from '@/components/sections/projects';

export default function WorkPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
