'use server';

import { z } from 'zod';
import { chat } from '@/ai/flows/chat-flow';
import type { ChatInput } from '@/ai/flows/chat-flow';
import { revalidatePath } from 'next/cache';
import { updateSiteSettings } from '@/lib/airtable';
import type { SiteSettings } from '@/lib/data';

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
