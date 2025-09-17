import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/sections/hero';
import { WorkPreview } from '@/components/sections/work-preview';
import { Journal } from '@/components/sections/journal';
import { Skills } from '@/components/sections/skills';
import { Contact } from '@/components/sections/contact';
import { AboutPreview } from '@/components/sections/about-preview-section';
import { ScrollAnimation } from '@/components/scroll-animation';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ScrollAnimation>
          <Hero />
        </ScrollAnimation>
        <ScrollAnimation>
          <AboutPreview />
        </ScrollAnimation>
        <ScrollAnimation>
          <WorkPreview />
        </ScrollAnimation>
        <ScrollAnimation>
          <Journal />
        </ScrollAnimation>
        <ScrollAnimation>
          <Skills />
        </ScrollAnimation>
        <ScrollAnimation>
          <Contact />
        </ScrollAnimation>
      </main>
      <Footer />
    </div>
  );
}
