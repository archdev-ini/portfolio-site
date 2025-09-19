import { notFound } from 'next/navigation';
import { db } from '@/lib/data';
import { AdminForm } from './_components/admin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const secret = searchParams.secret;

  if (secret !== process.env.ADMIN_SECRET_KEY) {
    notFound();
  }

  const siteSettings = await db.getSiteSettings();

  return (
    <main className="py-24 md:py-32">
        <div className="container">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-12">
                Admin Panel
            </h1>
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
        </div>
    </main>
  );
}
