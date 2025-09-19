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
import { createJournalPost, updateJournalPost } from '@/app/actions';
import type { JournalPost } from '@/lib/data';
import { useEffect } from 'react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['Reflections', 'Experiments', 'Design Notes']),
  description: z.string().min(1, 'Description is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  link: z.string().url().optional().or(z.literal('')),
});

type JournalFormValues = z.infer<typeof formSchema>;

interface JournalFormProps {
  isOpen: boolean;
  onClose: () => void;
  post: JournalPost | null;
}

export function JournalForm({ isOpen, onClose, post }: JournalFormProps) {
  const { toast } = useToast();
  const isEditing = !!post;

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
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="imageId" render={({ field }) => (
                <FormItem><FormLabel>Image ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             
             <FormField control={form.control} name="link" render={({ field }) => (
                <FormItem><FormLabel>External Link (e.g., Substack)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Post'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
