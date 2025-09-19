'use server';

import { z } from 'zod';
import { chat } from '@/ai/flows/chat-flow';
import type { ChatInput } from '@/ai/flows/chat-flow';
import { revalidatePath } from 'next/cache';
import {
  updateSiteSettings,
  createRecord,
  updateRecord,
  deleteRecord,
  updateAboutContent,
} from '@/lib/airtable';
import type { SiteSettings, Project, JournalPost, AboutContent } from '@/lib/data';

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

// Project Actions
export async function createProject(data: Omit<Project, 'id'>) {
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

export async function updateProject(id: string, data: Partial<Omit<Project, 'id'>>) {
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
    } catch (error) {
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
