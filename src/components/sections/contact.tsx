'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Twitter, Linkedin, Send } from 'lucide-react';
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

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

const socialLinks = [
    { name: 'GitHub', icon: <Github />, href: 'https://github.com/inioluwa-xyz' },
    { name: 'Twitter', icon: <Twitter />, href: 'https://twitter.com/inioluwa_xyz' },
    { name: 'LinkedIn', icon: <Linkedin />, href: 'https://linkedin.com/in/inioluwa-oladipupo' },
];

export const Contact = () => {
  const { toast } = useToast();
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
              Let's build something together.
            </h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-lg">
              Have a project in mind, a question, or just want to connect? My inbox is always open. I'll get back to you as soon as I can.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button key={social.name} variant="outline" size="icon" asChild>
                  <Link href={social.href} target="_blank" aria-label={social.name}>
                    {social.icon}
                  </Link>
                </Button>
              ))}
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
                  {form.formState.isSubmitting ? 'Sending...' : <>Send Message <Send className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};
