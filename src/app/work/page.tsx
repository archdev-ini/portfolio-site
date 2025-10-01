import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Projects } from '@/components/sections/projects';
import { db } from '@/lib/data';

export default async function WorkPage() {
  const projects = await db.getProjects();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Projects projects={projects} isPage={true} />
      </main>
      <Footer />
    </div>
  );
}
