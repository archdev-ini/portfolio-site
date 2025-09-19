'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateAboutContentAction } from '@/app/actions';
import type { AboutContent } from '@/lib/data';

const formSchema = z.object({
  headline: z.string(),
  shortText: z.string(),
  fullText: z.string(),
  highlightArchitecture: z.string(),
  highlightWeb3: z.string(),
  highlightWriting: z.string(),
  highlightCommunity: z.string(),
  profileImageId: z.string(),
});

type AboutFormValues = z.infer<typeof formSchema>;

export function AboutForm({ aboutContent }: { aboutContent: AboutContent }) {
  const { toast } = useToast();

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headline: aboutContent.headline || '',
      shortText: aboutContent.shortText || '',
      fullText: aboutContent.fullText.join('\\n') || '',
      highlightArchitecture: aboutContent.highlights.find(h => h.title === 'Architecture')?.description || '',
      highlightWeb3: aboutContent.highlights.find(h => h.title === 'Web3 / Development')?.description || '',
      highlightWriting: aboutContent.highlights.find(h => h.title === 'Writing')?.description || '',
      highlightCommunity: aboutContent.highlights.find(h => h.title === 'Community')?.description || '',
      profileImageId: aboutContent.profileImageId || '',
    },
  });

  async function onSubmit(values: AboutFormValues) {
    const dataToUpdate: AboutContent = {
        id: aboutContent.id,
        headline: values.headline,
        shortText: values.shortText,
        fullText: values.fullText.split('\\n'),
        highlights: [
            { title: 'Architecture', description: values.highlightArchitecture },
            { title: 'Web3 / Development', description: values.highlightWeb3 },
            { title: 'Writing', description: values.highlightWriting },
            { title: 'Community', description: values.highlightCommunity },
        ],
        profileImageId: values.profileImageId,
    };

    const result = await updateAboutContentAction(aboutContent.id, dataToUpdate);

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
            <h3 className="text-xl font-semibold">Page Content</h3>
            <FormField control={form.control} name="headline" render={({ field }) => (
                <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="shortText" render={({ field }) => (
                <FormItem><FormLabel>Short Text (for homepage)</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="fullText" render={({ field }) => (
                <FormItem><FormLabel>Full Text (use \n for new paragraphs)</FormLabel><FormControl><Textarea rows={8} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="profileImageId" render={({ field }) => (
                <FormItem><FormLabel>Profile Image ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Highlight Sections</h3>
            <FormField control={form.control} name="highlightArchitecture" render={({ field }) => (
                <FormItem><FormLabel>Architecture Highlight</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="highlightWeb3" render={({ field }) => (
                <FormItem><FormLabel>Web3/Development Highlight</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="highlightWriting" render={({ field }) => (
                <FormItem><FormLabel>Writing Highlight</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="highlightCommunity" render={({ field }) => (
                <FormItem><FormLabel>Community Highlight</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
          {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
