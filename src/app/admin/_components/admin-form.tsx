'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateSiteSettingsAction } from '@/app/actions';
import type { SiteSettings } from '@/lib/data';

const formSchema = z.object({
  siteTitle: z.string(),
  heroHeadline: z.string(),
  heroTagline: z.string(),
  heroIntro: z.string(),
  footerText: z.string(),
  socialGithub: z.string().url().optional().or(z.literal('')),
  socialTwitter: z.string().url().optional().or(z.literal('')),
  socialLinkedIn: z.string().url().optional().or(z.literal('')),
  socialSubstack: z.string().url().optional().or(z.literal('')),
  socialEmail: z.string().email().optional().or(z.literal('')),
});

type AdminFormValues = z.infer<typeof formSchema>;

export function AdminForm({ siteSettings }: { siteSettings: SiteSettings }) {
  const { toast } = useToast();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteTitle: siteSettings.siteTitle || '',
      heroHeadline: siteSettings.hero.headline || '',
      heroTagline: siteSettings.hero.tagline || '',
      heroIntro: siteSettings.hero.intro || '',
      footerText: siteSettings.footer.text || '',
      socialGithub: siteSettings.footer.socialLinks.find(l => l.name === 'Github')?.href || '',
      socialTwitter: siteSettings.footer.socialLinks.find(l => l.name === 'Twitter')?.href || '',
      socialLinkedIn: siteSettings.footer.socialLinks.find(l => l.name === 'LinkedIn')?.href || '',
      socialSubstack: siteSettings.footer.socialLinks.find(l => l.name === 'Substack')?.href || '',
      socialEmail: siteSettings.footer.socialLinks.find(l => l.name === 'Email')?.href.replace('mailto:', '') || '',
    },
  });

  async function onSubmit(values: AdminFormValues) {
    const dataToUpdate: SiteSettings = {
        id: siteSettings.id,
        siteTitle: values.siteTitle,
        hero: {
            headline: values.heroHeadline,
            tagline: values.heroTagline,
            intro: values.heroIntro,
        },
        footer: {
            text: values.footerText,
            socialLinks: [
                { name: 'Github', href: values.socialGithub || '' },
                { name: 'Twitter', href: values.socialTwitter || '' },
                { name: 'LinkedIn', href: values.socialLinkedIn || '' },
                { name: 'Substack', href: values.socialSubstack || '' },
                { name: 'Email', href: values.socialEmail ? `mailto:${values.socialEmail}` : '' },
            ]
        }
    };

    const result = await updateSiteSettingsAction(siteSettings.id, dataToUpdate);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
      form.reset(values);
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">General</h3>
            <FormField control={form.control} name="siteTitle" render={({ field }) => (
                <FormItem><FormLabel>Site Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Hero Section</h3>
            <FormField control={form.control} name="heroTagline" render={({ field }) => (
                <FormItem><FormLabel>Tagline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="heroHeadline" render={({ field }) => (
                <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="heroIntro" render={({ field }) => (
                <FormItem><FormLabel>Intro Text</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Footer & Socials</h3>
            <FormField control={form.control} name="footerText" render={({ field }) => (
                <FormItem><FormLabel>Footer Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="socialGithub" render={({ field }) => (
                <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="socialTwitter" render={({ field }) => (
                <FormItem><FormLabel>Twitter/X URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="socialLinkedIn" render={({ field }) => (
                <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="socialSubstack" render={({ field }) => (
                <FormItem><FormLabel>Substack URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="socialEmail" render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
          {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
