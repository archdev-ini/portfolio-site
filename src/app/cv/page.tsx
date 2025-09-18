import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Download, Briefcase, GraduationCap } from 'lucide-react';
import { db } from '@/lib/data';
import type { CVItem } from '@/lib/data';

const TimelineItem = ({ item, icon: Icon }: { item: CVItem, icon: React.ElementType }) => (
  <div className="flex gap-8">
    <div className="w-16 text-right text-sm text-foreground/60 pt-1 flex flex-col items-end">
      <div className="font-semibold pb-2">{item.date.split(' ')[0]}</div>
      <div>{item.date.split(' ')[2]}</div>
    </div>
    <div className="relative pl-8">
      <div className="absolute left-[-10px] top-0 h-full w-px bg-border"></div>
      <div className="absolute left-[-16px] top-1 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h3 className="text-xl font-bold font-headline">{item.title}</h3>
      <p className="text-md text-primary font-semibold mt-1">{item.subtitle}</p>
      <p className="mt-2 text-foreground/70">{item.description}</p>
    </div>
  </div>
);

export default function CVPage() {
  const cvExperience = db.cv.experience();
  const cvEducation = db.cv.education();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter font-headline">
                Curriculum Vitae
              </h1>
              <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
                A summary of my professional experience, education, and skills in architecture, technology, and community building.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  {/* In a real app, this would link to a PDF file */}
                  <a href="#" download>
                    <Download className="mr-2" />
                    Download CV
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <h2 className="text-3xl font-bold font-headline mb-8 flex items-center gap-4">
                  <Briefcase className="w-8 h-8 text-primary/80" />
                  Experience
                </h2>
                <div className="space-y-12">
                  {cvExperience.map((item, index) => (
                    <TimelineItem key={`exp-${index}`} item={item} icon={Briefcase} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold font-headline mb-8 flex items-center gap-4">
                  <GraduationCap className="w-8 h-8 text-primary/80" />
                  Education
                </h2>
                <div className="space-y-12">
                  {cvEducation.map((item, index) => (
                    <TimelineItem key={`edu-${index}`} item={item} icon={GraduationCap} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
