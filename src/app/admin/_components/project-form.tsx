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
import { createProject, updateProject, generateProjectDetailsAction, uploadFileAction } from '@/app/actions';
import type { Project } from '@/lib/data';
import { useEffect, useTransition, useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.enum(['Architecture', 'Web3', 'Writing', 'Community']),
  description: z.string(),
  imageId: z.any(),
  galleryImageIds: z.any(),
  link: z.string().url().optional().or(z.literal('')),
  role: z.string(),
  duration: z.string(),
  technologies: z.string(),
overview: z.string(),
  process: z.string(),
  outcomes: z.string(),
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
  const [isUploading, setIsUploading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const form = useForm<ProjectFormValues>({
    defaultValues: {
        slug: '',
        title: '',
        category: 'Architecture',
        description: '',
        imageId: null,
        galleryImageIds: [],
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
        imageId: null, // Don't prepopulate file inputs
        galleryImageIds: [], // Don't prepopulate file inputs
      });
      setMainImagePreview(project.imageId);
      setGalleryPreviews(project.galleryImageIds || []);
    } else {
      form.reset({
        slug: '',
        title: '',
        category: 'Architecture',
        description: '',
        imageId: null,
        galleryImageIds: [],
        link: '',
        role: '',
        duration: '',
        technologies: '',
        overview: '',
        process: '',
        outcomes: '',
        featured: false,
      });
      setMainImagePreview(null);
      setGalleryPreviews([]);
    }
  }, [project, isEditing, form]);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: ProjectFormValues) {
    setIsUploading(true);
    let mainImageUrl = project?.imageId; // Keep existing image if not changed
    let galleryImageUrls = project?.galleryImageIds || [];

    try {
      // Upload Main Image
      if (values.imageId && values.imageId[0]) {
        const dataUri = await fileToDataUri(values.imageId[0]);
        const result = await uploadFileAction(dataUri);
        if ('url' in result) {
          mainImageUrl = result.url;
        } else {
          throw new Error(result.error);
        }
      }

      // Upload Gallery Images
      if (values.galleryImageIds && values.galleryImageIds.length > 0) {
        const uploadedUrls = await Promise.all(
          Array.from(values.galleryImageIds as FileList).map(async (file) => {
            const dataUri = await fileToDataUri(file);
            const result = await uploadFileAction(dataUri);
            if ('url' in result) {
              return result.url;
            } else {
              throw new Error(result.error);
            }
          })
        );
        galleryImageUrls = [...galleryImageUrls, ...uploadedUrls];
      }

      const dataToSubmit = {
        ...values,
        technologies: values.technologies.split(',').map(s => s.trim()),
        imageId: mainImageUrl ? [{ url: mainImageUrl }] : undefined,
        galleryImageIds: galleryImageUrls.length > 0 ? galleryImageUrls.map(url => ({ url })) : undefined,
      };
    
      const result = isEditing
        ? await updateProject(project.id, dataToSubmit)
        : await createProject(dataToSubmit);

      if (result.success) {
        toast({ title: 'Success!', description: result.message });
        onClose();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Failed to save project.',
      });
    } finally {
        setIsUploading(false);
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
                <FormField control={form.control} name="imageId" render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Main Image</FormLabel>
                    {mainImagePreview && <div className="relative w-full h-32"><Image src={mainImagePreview} alt="Main image preview" fill className="object-contain rounded-md border" /></div>}
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={e => onChange(e.target.files)} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="galleryImageIds" render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Gallery Images</FormLabel>
                     <div className="flex flex-wrap gap-2">
                        {galleryPreviews.map((url) => <div key={url} className="relative w-20 h-20"><Image src={url} alt="Gallery image preview" fill className="object-cover rounded-md border" /></div>)}
                    </div>
                    <FormControl>
                      <Input type="file" accept="image/*" multiple onChange={e => onChange(e.target.files)} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
                <Button type="submit" disabled={form.formState.isSubmitting || isAiPending || isUploading}>
                    {(form.formState.isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isUploading ? 'Uploading...' : form.formState.isSubmitting ? 'Saving...' : 'Save Project'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
