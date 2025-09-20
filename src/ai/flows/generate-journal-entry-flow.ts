'use server';
/**
 * @fileOverview A flow for generating a journal entry draft.
 *
 * - generateJournalEntry - A function that generates content for a journal entry.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';
import type {GenerateJournalInput} from '@/app/admin/_components/journal-form';

const GenerateJournalInputSchema = z.object({
  title: z.string().describe('The title of the journal entry.'),
});

const GenerateJournalOutputSchema = z.string().describe('The generated content for the journal entry.');

export async function generateJournalEntry(
  input: GenerateJournalInput
): Promise<string> {
  return generateJournalEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJournalEntryPrompt',
  input: {schema: GenerateJournalInputSchema},
  output: {format: 'text'},
  prompt: `You are an expert writer and thinker. The user is writing a journal entry for their personal blog.

  Based on the provided title, generate a thoughtful and engaging journal entry of about 3-4 paragraphs.
  The tone should be reflective, insightful, and personal.

  Journal Entry Title: {{{title}}}
  
  Generated Entry:
  `,
});

const generateJournalEntryFlow = ai.defineFlow(
  {
    name: 'generateJournalEntryFlow',
    inputSchema: GenerateJournalInputSchema,
    outputSchema: GenerateJournalOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
