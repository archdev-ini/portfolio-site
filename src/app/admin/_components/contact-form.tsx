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
import { updateContactContentAction } from '@/app/actions';
import type { ContactContent } from '@/lib/data';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  introText: z.string().min(1, 'Intro text is required'),
  ctaLine: z.string().min(1, 'CTA line is required'),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  content: ContactContent;
}

export function ContactForm({ content }: ContactFormProps) {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      introText: content.introText || '',
      ctaLine: content.ctaLine || '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    const result = await updateContactContentAction(content.id, values);

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
            <h3 className="text-xl font-semibold">Contact Section Content</h3>
            <FormField control={form.control} name="introText" render={({ field }) => (
                <FormItem><FormLabel>Intro Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="ctaLine" render={({ field }) => (
                <FormItem><FormLabel>Call to Action Line</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
