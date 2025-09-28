'use server';

import { z } from 'zod';
import { chat } from '@/ai/flows/chat-flow';
import type { ChatInput } from '@/ai/flows/chat-flow';
import { generateProjectDetails } from '@/ai/flows/generate-project-details-flow';
import type { GenerateProjectDetailsInput } from '@/app/admin/_components/project-form';
import { generateJournalEntry } from '@/ai/flows/generate-journal-entry-flow';
import type { GenerateJournalInput } from '@/app/admin/_components/journal-form';


import { revalidatePath } from 'next/cache';
import {
  updateSiteSettings,
  createRecord,
  updateRecord,
  deleteRecord,
  updateAboutContent,
  updateContactContent,
} from '@/lib/airtable';
import type { SiteSettings, Project, JournalPost, AboutContent, Skill, CVItem, ContactContent } from '@/lib/data';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export async function submitContactForm(values: z.infer<typeof contactFormSchema>) {
  // Here you would typically send an email, save to a database, etc.
  // For this example, we'll just log the data and simulate a successful submission.
  console.log('Form submitted:', values);

  await new Promise(resolve => setTimeout(resolve, 1000));

  // You can add error handling here, e.g., if an email service fails.
  // For now, we'll always return success.
  return {
    success: true,
    message: 'Message sent successfully!',
  };
}


export async function submitChatMessage(values: ChatInput) {
    const result = await chat(values);
    return result;
}

export async function generateProjectDetailsAction(values: GenerateProjectDetailsInput): Promise<string> {
    return await generateProjectDetails(values);
}

export async function generateJournalEntryAction(values: GenerateJournalInput): Promise<string> {
    return await generateJournalEntry(values);
}


export async function updateSiteSettingsAction(id: string, values: SiteSettings) {
  try {
    await updateSiteSettings(id, values);
    revalidatePath('/'); // Revalidate the homepage to show new settings
    revalidatePath('/admin'); // Revalidate the admin page
    return {
      success: true,
      message: 'Site settings updated successfully!',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to update site settings.',
    };
  }
}

export async function updateAboutContentAction(id: string, values: AboutContent) {
    try {
      await updateAboutContent(id, values);
      revalidatePath('/about');
      revalidatePath('/');
      revalidatePath('/admin');
      return {
        success: true,
        message: 'About page content updated successfully!',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Failed to update about page content.',
      };
    }
  }

  export async function updateContactContentAction(id: string, values: ContactContent) {
    try {
      await updateContactContent(id, values);
      revalidatePath('/#contact');
      revalidatePath('/admin');
      return {
        success: true,
        message: 'Contact section updated successfully!',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Failed to update contact section.',
      };
    }
  }

// Project Actions
export async function createProject(data: Partial<Project>) {
  try {
    await createRecord('Projects', data);
    revalidatePath('/work');
    revalidatePath('/admin');
    return { success: true, message: 'Project created successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create project.' };
  }
}

export async function updateProject(id: string, data: Partial<Project>) {
  try {
    await updateRecord('Projects', id, data);
    revalidatePath(`/work/${data.slug}`);
    revalidatePath('/work');
    revalidatePath('/admin');
    return { success: true, message: 'Project updated successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update project.' };
  }
}

export async function deleteProject(id: string) {
  try {
    await deleteRecord('Projects', id);
    revalidatePath('/work');
    revalidatePath('/admin');
    return { success: true, message: 'Project deleted successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete project.' };
  }
}

// Journal Actions
export async function createJournalPost(data: Omit<JournalPost, 'id'>) {
    try {
      await createRecord('Journal', data);
      revalidatePath('/journal');
      revalidatePath('/admin');
      return { success: true, message: 'Journal post created successfully.' };
    } catch (error)
{
      console.error(error);
      return { success: false, message: 'Failed to create journal post.' };
    }
  }
  
  export async function updateJournalPost(id: string, data: Partial<Omit<JournalPost, 'id'>>) {
    try {
      await updateRecord('Journal', id, data);
      revalidatePath('/journal');
      revalidatePath('/admin');
      return { success: true, message: 'Journal post updated successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to update journal post.' };
    }
  }
  
  export async function deleteJournalPost(id: string) {
    try {
      await deleteRecord('Journal', id);
      revalidatePath('/journal');
      revalidatePath('/admin');
      return { success: true, message: 'Journal post deleted successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to delete journal post.' };
    }
  }

  // Skill Actions
export async function createSkill(data: Omit<Skill, 'id'>) {
    try {
      await createRecord('Skills', { name: data.name, category: data.category });
      revalidatePath('/');
      revalidatePath('/admin');
      return { success: true, message: 'Skill created successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to create skill.' };
    }
  }
  
  export async function updateSkill(id: string, data: Partial<Omit<Skill, 'id'>>) {
    try {
      await updateRecord('Skills', id, { name: data.name, category: data.category });
      revalidatePath('/');
      revalidatePath('/admin');
      return { success: true, message: 'Skill updated successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to update skill.' };
    }
  }
  
  export async function deleteSkill(id: string) {
    try {
      await deleteRecord('Skills', id);
      revalidatePath('/');
      revalidatePath('/admin');
      return { success: true, message: 'Skill deleted successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to delete skill.' };
    }
  }

  // CV Actions
  const revalidateCVPaths = () => {
    revalidatePath('/cv');
    revalidatePath('/admin');
  }

  export async function createCVItem(table: 'CV_Experience' | 'CV_Education', data: Omit<CVItem, 'id'>) {
    try {
      await createRecord(table, data);
      revalidateCVPaths();
      return { success: true, message: 'CV item created successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to create CV item.' };
    }
  }

  export async function updateCVItem(table: 'CV_Experience' | 'CV_Education', id: string, data: Partial<Omit<CVItem, 'id'>>) {
    try {
      await updateRecord(table, id, data);
      revalidateCVPaths();
      return { success: true, message: 'CV item updated successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to update CV item.' };
    }
  }

  export async function deleteCVItem(table: 'CV_Experience' | 'CV_Education', id: string) {
    try {
      await deleteRecord(table, id);
      revalidateCVPaths();
      return { success: true, message: 'CV item deleted successfully.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to delete CV item.' };
    }
  }

  export async function uploadFileAction(fileDataUri: string): Promise<{url: string} | {error: string}> {
    try {
      const imgbbApiKey = process.env.IMGBB_API_KEY;
      if (!imgbbApiKey) {
        throw new Error('IMGBB_API_KEY is not set in environment variables.');
      }
      
      const formData = new FormData();
      // The Data URI needs to be stripped of the prefix
      formData.append('image', fileDataUri.substring(fileDataUri.indexOf(',') + 1));
  
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
  
      if (result.success) {
        return { url: result.data.url };
      } else {
        throw new Error(result.error.message || 'Image upload failed');
      }
    } catch (error: any) {
      console.error('File upload failed:', error);
      return { error: error.message };
    }
  }