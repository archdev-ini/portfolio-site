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
import { useToast } from '@/hooks/use-toast';
import { createCVItem, updateCVItem } from '@/app/actions';
import type { CVItem } from '@/lib/data';
import { useEffect } from 'react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
});

type CVFormValues = z.infer<typeof formSchema>;

interface CVFormProps {
  type: 'Experience' | 'Education';
  isOpen: boolean;
  onClose: () => void;
  item: CVItem | null;
}

export function CVForm({ type, isOpen, onClose, item }: CVFormProps) {
  const { toast } = useToast();
  const isEditing = !!item;

  const form = useForm<CVFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      date: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isEditing && item) {
      form.reset(item);
    } else {
      form.reset({
        title: '',
        subtitle: '',
        date: '',
        description: '',
      });
    }
  }, [item, isEditing, form]);

  async function onSubmit(values: CVFormValues) {
    const table = type === 'Experience' ? 'CV_Experience' : 'CV_Education';
    const result = isEditing
      ? await updateCVItem(table, item.id, values)
      : await createCVItem(table, values);

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
          <DialogTitle>{isEditing ? `Edit ${type}` : `Add New ${type}`}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to this CV item.' : `Add a new item to your ${type.toLowerCase()}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>{type === 'Experience' ? 'Role' : 'Degree / Qualification'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="subtitle" render={({ field }) => (
              <FormItem><FormLabel>{type === 'Experience' ? 'Company' : 'Institution'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem><FormLabel>Date</FormLabel><FormControl><Input {...field} placeholder="e.g., 2022 - Present" /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Item'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
