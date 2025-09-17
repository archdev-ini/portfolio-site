import { skills } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline mb-12 text-center">{children}</h2>
);

export const Skills = () => {
  return (
    <section id="skills" className="py-20 md:py-32">
      <div className="container">
        <SectionTitle>Skills &amp; Tools</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skillCategory) => {
            const Icon = skillCategory.icon;
            return (
              <Card key={skillCategory.category} className="border-2 border-transparent hover:border-primary transition-colors duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-accent/50 p-3 rounded-lg text-primary">
                      <Icon />
                    </div>
                    <CardTitle className="font-headline">{skillCategory.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-foreground/80">
                    {skillCategory.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
