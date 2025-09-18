import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/sections/hero';
import { WorkPreview } from '@/components/sections/work-preview';
import { Journal } from '@/components/sections/journal';
import { Skills } from '@/components/sections/skills';
import { Contact } from '@/components/sections/contact';
import { AboutPreview } from '@/components/sections/about-preview-section';
import { ScrollAnimation } from '@/components/scroll-animation';
import { db } from '@/lib/data';

export default async function Home() {
  const siteSettings = await db.getSiteSettings();
  const aboutContent = await db.getAboutContent();
  const projects = await db.getProjects();
  const journalPosts = await db.getJournalPosts();
  const skills = await db.getSkills();
  const contactContent = await db.getContactContent();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ScrollAnimation>
          <Hero hero={siteSettings.hero} />
        </ScrollAnimation>
        <ScrollAnimation>
          <AboutPreview about={aboutContent} />
        </ScrollAnimation>
        <ScrollAnimation>
          <WorkPreview projects={projects} />
        </ScrollAnimation>
        <ScrollAnimation>
          <Journal posts={journalPosts} />
        </ScrollAnimation>
        <ScrollAnimation>
          <Skills skills={skills} />
        </ScrollAnimation>
        <ScrollAnimation>
          <Contact contact={contactContent} site={siteSettings} />
        </ScrollAnimation>
      </main>
      <Footer />
    </div>
  );
}
