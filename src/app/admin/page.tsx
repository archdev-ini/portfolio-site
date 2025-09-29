import { db } from '@/lib/data';
import { AdminForm } from './_components/admin-form';
import { AboutForm } from './_components/about-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectsList } from './_components/projects-list';
import { SkillsList } from './_components/skills-list';
import { ContactForm as ContactContentForm } from './_components/contact-form';
import { EducationList } from './_components/education-list';
import { ExperienceList } from './_components/experience-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';


export default async function AdminPage() {
  const siteSettings = await db.getSiteSettings();
  const aboutContent = await db.getAboutContent();
  const projects = await db.getProjects();
  const allSkills = await db.getAllSkills();
  const experience = await db.getCVExperience();
  const education = await db.getCVEducation();
  const contactContent = await db.getContactContent();


  return (
    <main className="py-24 md:py-32">
        <div className="container">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-12">
                Admin Panel
            </h1>
            <Tabs defaultValue="siteSettings" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8">
                    <TabsTrigger value="siteSettings">Site Settings</TabsTrigger>
                    <TabsTrigger value="about">About Page</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="journal">Journal</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="cv">CV</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>
                
                <TabsContent value="siteSettings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Site Settings</CardTitle>
                            <CardDescription>
                                Update the global settings for your website. This includes hero text, footer content, and social media links.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminForm siteSettings={siteSettings} />
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="about">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Page</CardTitle>
                            <CardDescription>
                                Edit the content of your "About" page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <AboutForm aboutContent={aboutContent} />
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="projects">
                     <Card>
                        <CardHeader>
                            <CardTitle>Manage Projects</CardTitle>
                            <CardDescription>
                                Add, edit, or delete portfolio projects.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ProjectsList projects={projects} />
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="journal">
                     <Card>
                        <CardHeader>
                            <CardTitle>Manage Journal</CardTitle>
                            <CardDescription>
                                Journal entries are now pulled automatically from your Substack RSS feed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Alert>
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>
                              To manage your journal, simply publish new posts on Substack with the appropriate tags (`Studio Notes`, `Building Futures`, `IO Lab`). Your website will update automatically.
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="skills">
                     <Card>
                        <CardHeader>
                            <CardTitle>Manage Skills</CardTitle>
                            <CardDescription>
                                Add, edit, or delete skills.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <SkillsList skills={allSkills} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cv">
                     <Card>
                        <CardHeader>
                            <CardTitle>Manage CV</CardTitle>
                            <CardDescription>
                                Add, edit, or delete experience and education entries.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                           <div>
                                <h3 className="text-2xl font-bold font-headline mb-4">Experience</h3>
                                <ExperienceList items={experience} />
                           </div>
                           <div>
                                <h3 className="text-2xl font-bold font-headline mb-4">Education</h3>
                                <EducationList items={education} />
                           </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="contact">
                     <Card>
                        <CardHeader>
                            <CardTitle>Contact Page</CardTitle>
                            <CardDescription>
                                Update the content for the contact section.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ContactContentForm content={contactContent} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </main>
  );
}
