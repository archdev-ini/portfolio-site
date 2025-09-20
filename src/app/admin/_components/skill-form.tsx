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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createSkill, updateSkill } from '@/app/actions';
import type { Skill } from '@/lib/data';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['Architecture & Design', 'Web3 & Development', 'Writing & Community']),
});

type SkillFormValues = z.infer<typeof formSchema>;

interface SkillFormProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null;
}

export function SkillForm({ isOpen, onClose, skill }: SkillFormProps) {
  const { toast } = useToast();
  const isEditing = !!skill;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        category: 'Architecture & Design',
    },
  });

  useEffect(() => {
    if (isEditing && skill) {
      form.reset(skill);
    } else {
      form.reset({
        name: '',
        category: 'Architecture & Design',
      });
    }
  }, [skill, isEditing, form]);

  async function onSubmit(values: SkillFormValues) {
    const result = isEditing
      ? await updateSkill(skill.id, values)
      : await createSkill(values);

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your skill here.' : 'Add a new skill to your list.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Skill Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
             <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Architecture & Design">Architecture & Design</SelectItem>
                            <SelectItem value="Web3 & Development">Web3 & Development</SelectItem>
                            <SelectItem value="Writing & Community">Writing & Community</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Skill'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
