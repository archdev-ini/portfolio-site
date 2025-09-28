'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Linkedin, Twitter, Instagram, Mail, Send, Github } from 'lucide-react';
import Link from 'next/link';

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
import { submitContactForm } from '@/app/actions';
import type { ContactContent, SiteSettings } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

const socialIconMap = {
    LinkedIn: <Linkedin />,
    Twitter: <Twitter />,
    Instagram: <Instagram />,
    Github: <Github />,
    Substack:  (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 12.97l-9.45 6.49a1.5 1.5 0 01-2-.03l-9.39-6.49a1.5 1.5 0 010-2.93l9.4-6.52a1.5 1.5 0 012 0l9.45 6.52a1.5 1.5 0 010 2.96z"></path>
        <path d="M2.61 9.87l9.4 6.52a1.5 1.5 0 002 0l9.45-6.52"></path>
      </svg>
    ), 
    Email: <Mail />,
} as const;


export const Contact = ({ contact, site }: { contact: ContactContent, site: SiteSettings }) => {
  const { toast } = useToast();
  const socialLinks = site.footer.socialLinks;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await submitContactForm(values);
    if (result.success) {
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request. Please try again.',
      });
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-lg">
                I’m building toward futures where design, technology, and community align. If you’re working on something visionary—or want to co-create the systems of tomorrow—let’s connect.
            </p>
            <div className="flex items-center gap-4">
                <Button asChild size="lg">
                    <Link href="mailto:hello@inioluwa.xyz">
                        hello@inioluwa.xyz
                    </Link>
                </Button>
                <div className="flex space-x-1">
                {socialLinks.map((social) => (
                    social.name !== 'Email' &&
                    <Button key={social.name} variant="outline" size="icon" asChild>
                    <Link href={social.href} target="_blank" aria-label={social.name}>
                        {socialIconMap[social.name as keyof typeof socialIconMap]}
                    </Link>
                    </Button>
                ))}
                </div>
            </div>
          </div>
          <div className="bg-secondary/30 p-8 rounded-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell me about your idea..." rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full" size="lg">
                  {form.formState.isSubmitting ? 'Sending...' : <>Get in Touch <Send className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};
