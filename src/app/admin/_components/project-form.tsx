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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { createProject, updateProject, generateProjectDetailsAction } from '@/app/actions';
import type { Project } from '@/lib/data';
import { useEffect, useTransition } from 'react';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['Architecture', 'Web3', 'Writing', 'Community']),
  description: z.string().min(1, 'Description is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  galleryImageIds: z.string().optional(),
  link: z.string().url().optional().or(z.literal('')),
  role: z.string().min(1, 'Role is required'),
  duration: z.string().min(1, 'Duration is required'),
  technologies: z.string().min(1, 'Technologies are required'),
  overview: z.string().min(1, 'Overview is required'),
  process: z.string().min(1, 'Process is required'),
  outcomes: z.string().min(1, 'Outcomes are required'),
  featured: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof formSchema>;

export const GenerateProjectDetailsInputSchema = z.object({
  title: z.string().describe('The title of the project.'),
  description: z.string().describe('A short description of the project.'),
  section: z.enum(['overview', 'process', 'outcomes']).describe('The specific section to generate content for.'),
});
export type GenerateProjectDetailsInput = z.infer<
  typeof GenerateProjectDetailsInputSchema
>;

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function ProjectForm({ isOpen, onClose, project }: ProjectFormProps) {
  const { toast } = useToast();
  const isEditing = !!project;
  const [isAiPending, startAiTransition] = useTransition();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        slug: '',
        title: '',
        category: 'Architecture',
        description: '',
        imageId: '',
        galleryImageIds: '',
        link: '',
        role: '',
        duration: '',
        technologies: '',
        overview: '',
        process: '',
        outcomes: '',
        featured: false,
    },
  });

  const { title, description } = useWatch({ control: form.control });

  useEffect(() => {
    if (isEditing && project) {
      form.reset({
        ...project,
        technologies: project.technologies.join(','),
        galleryImageIds: project.galleryImageIds?.join(','),
      });
    } else {
      form.reset({
        slug: '',
        title: '',
        category: 'Architecture',
        description: '',
        imageId: '',
        galleryImageIds: '',
        link: '',
        role: '',
        duration: '',
        technologies: '',
        overview: '',
        process: '',
        outcomes: '',
        featured: false,
      });
    }
  }, [project, isEditing, form]);

  async function onSubmit(values: ProjectFormValues) {
    const dataToSubmit = {
      ...values,
      technologies: values.technologies.split(',').map(s => s.trim()),
      galleryImageIds: values.galleryImageIds?.split(',').map(s => s.trim()) || [],
    };
    
    const result = isEditing
      ? await updateProject(project.id, dataToSubmit)
      : await createProject(dataToSubmit);

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

  const handleGenerateContent = (section: 'overview' | 'process' | 'outcomes') => {
    if (!title || !description) {
        toast({
            variant: 'destructive',
            title: 'Missing Context',
            description: 'Please provide a title and description before generating content.',
        });
        return;
    }

    startAiTransition(async () => {
        try {
            const content = await generateProjectDetailsAction({ title, description, section });
            form.setValue(section, content, { shouldValidate: true });
            toast({
                title: 'Content Generated!',
                description: `The ${section} has been filled in with AI-generated content.`,
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
  };

  const AiButton = ({ section }: { section: 'overview' | 'process' | 'outcomes' }) => (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => handleGenerateContent(section)}
      disabled={isAiPending || !title || !description}
    >
      {isAiPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
      Generate with AI
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your project here.' : 'Add a new project to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
             <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Architecture">Architecture</SelectItem>
                            <SelectItem value="Web3">Web3</SelectItem>
                            <SelectItem value="Writing">Writing</SelectItem>
                            <SelectItem value="Community">Community</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Short Description (for cards)</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="overview" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center justify-between w-full">Overview <AiButton section="overview" /></FormLabel>
                    <FormControl><Textarea rows={5} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="process" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center justify-between w-full">Process <AiButton section="process" /></FormLabel>
                    <FormControl><Textarea rows={5} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="outcomes" render={({ field }) => (
                <FormItem>
                     <FormLabel className="flex items-center justify-between w-full">Outcomes <AiButton section="outcomes" /></FormLabel>
                    <FormControl><Textarea rows={5} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="imageId" render={({ field }) => (
                    <FormItem><FormLabel>Main Image ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="galleryImageIds" render={({ field }) => (
                    <FormItem><FormLabel>Gallery Image IDs (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="duration" render={({ field }) => (
                    <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="technologies" render={({ field }) => (
                <FormItem><FormLabel>Technologies (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="link" render={({ field }) => (
                <FormItem><FormLabel>Project Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="featured" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Feature on homepage</FormLabel>
                    </div>
                </FormItem>
            )}/>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting || isAiPending}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Project'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
