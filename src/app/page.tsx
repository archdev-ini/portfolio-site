import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/sections/hero';
import { Projects } from '@/components/sections/projects';
import { Journal } from '@/components/sections/journal';
import { Skills } from '@/components/sections/skills';
import { Contact } from '@/components/sections/contact';
import { AboutPreview } from '@/components/sections/about-preview-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutPreview />
        <Projects />
        <Journal />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
