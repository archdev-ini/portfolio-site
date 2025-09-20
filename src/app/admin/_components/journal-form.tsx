'use client';

import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createJournalPost, updateJournalPost, generateJournalEntryAction } from '@/app/actions';
import type { JournalPost } from '@/lib/data';
import { useEffect, useTransition } from 'react';
import { Wand2, Loader2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['Reflections', 'Experiments', 'Design Notes']),
  description: z.string().min(1, 'Description is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  link: z.string().url().optional().or(z.literal('')),
});

type JournalFormValues = z.infer<typeof formSchema>;

export const GenerateJournalInputSchema = z.object({
  title: z.string().describe('The title of the journal entry.'),
});
export type GenerateJournalInput = z.infer<typeof GenerateJournalInputSchema>;

interface JournalFormProps {
  isOpen: boolean;
  onClose: () => void;
  post: JournalPost | null;
}

export function JournalForm({ isOpen, onClose, post }: JournalFormProps) {
  const { toast } = useToast();
  const isEditing = !!post;
  const [isAiPending, startAiTransition] = useTransition();

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: '',
        category: 'Reflections',
        description: '',
        imageId: '',
        link: '',
    },
  });

  const titleValue = useWatch({ control: form.control, name: 'title' });

  useEffect(() => {
    if (isEditing && post) {
      form.reset(post);
    } else {
      form.reset({
        title: '',
        category: 'Reflections',
        description: '',
        imageId: '',
        link: '',
      });
    }
  }, [post, isEditing, form]);

  async function onSubmit(values: JournalFormValues) {
    const result = isEditing
      ? await updateJournalPost(post.id, values)
      : await createJournalPost(values);

    if (result.success) {
      toast({ title: 'Success!', description: result.message });
      onClose();
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: result.message,
      });
    }
  }

  const handleGenerateContent = () => {
    if (!titleValue) {
        toast({
            variant: 'destructive',
            title: 'Title is missing',
            description: 'Please provide a title to generate content.',
        });
        return;
    }

    startAiTransition(async () => {
        try {
            const content = await generateJournalEntryAction({ title: titleValue });
            form.setValue('description', content, { shouldValidate: true });
            toast({
                title: 'Content Generated!',
                description: 'The description has been filled in with AI-generated content.',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'AI Generation Failed',
                description: 'There was an error generating content. Please try again.',
            });
        }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Post' : 'Add New Post'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your post here.' : 'Add a new post to your journal.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
             <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Reflections">Reflections</SelectItem>
                            <SelectItem value="Experiments">Experiments</SelectItem>
                            <SelectItem value="Design Notes">Design Notes</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>

            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center justify-between w-full">
                        Description
                        <Button type="button" variant="outline" size="sm" onClick={handleGenerateContent} disabled={isAiPending || !titleValue}>
                            {isAiPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                            Generate with AI
                        </Button>
                    </FormLabel>
                    <FormControl><Textarea rows={4} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            
            <FormField control={form.control} name="imageId" render={({ field }) => (
                <FormItem><FormLabel>Image ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             
             <FormField control={form.control} name="link" render={({ field }) => (
                <FormItem><FormLabel>External Link (e.g., Substack)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting || isAiPending}>
                    {(form.formState.isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Post'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
