import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SkillCategory } from '@/lib/data';
import { DraftingCompass, CodeXml, Users } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-12 text-center">{children}</h2>
);

export const Skills = ({ skills }: { skills: SkillCategory[] }) => {
  const hardcodedSkills: SkillCategory[] = [
    {
      category: 'Architecture & Design',
      icon: DraftingCompass,
      items: [
        'Climate-responsive, conceptual design',
        'BIM-driven workflows (Revit, AutoCAD)',
        'Systems thinking for built environments',
      ],
    },
    {
      category: 'Web3 Community Building',
      icon: Users,
      items: [
        'Decentralized collaboration frameworks',
        'Engagement and growth strategies',
        'Designing communities as living ecosystems',
      ],
    },
    {
      category: 'Creative Systems',
      icon: CodeXml,
      items: [
        'Writing & publishing (Substack, 0xSketches)',
        'Open learning platforms',
        'Cross-disciplinary innovation',
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="container">
        <SectionTitle>Skills &amp; Tools</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hardcodedSkills.map((skillCategory) => {
            const Icon = skillCategory.icon;
            return (
              <Card key={skillCategory.category} className="bg-secondary/30">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-background p-3 rounded-lg text-primary">
                      <Icon size={28} />
                    </div>
                    <CardTitle className="font-headline text-xl">{skillCategory.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 gap-y-3 text-foreground/80">
                    {skillCategory.items.map((item, index) => (
                      <li key={`${skillCategory.category}-${item}-${index}`} className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
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
