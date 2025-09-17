'use server';

import { z } from 'zod';

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export async function submitContactForm(values: z.infer<typeof formSchema>) {
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
