'use server';
/**
 * @fileOverview A flow for summarizing a blog post.
 *
 * - summarizePost - A function that takes post content and returns a summary and category.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SummarizePostInputSchema = z.object({
  content: z.string().describe('The full content of the blog post.'),
});
export type SummarizePostInput = z.infer<typeof SummarizePostInputSchema>;

export const SummarizePostOutputSchema = z.object({
    description: z.string().describe('A short, engaging summary of the blog post (1-2 sentences).'),
    category: z.enum(['Reflections', 'Experiments', 'Design Notes']).describe('The most relevant category for the post.'),
});
export type SummarizePostOutput = z.infer<typeof SummarizePostOutputSchema>;


export async function summarizePost(
  input: SummarizePostInput
): Promise<SummarizePostOutput> {
  return summarizePostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePostPrompt',
  input: {schema: SummarizePostInputSchema},
  output: {schema: SummarizePostOutputSchema},
  prompt: `You are an expert content strategist. Your task is to analyze a blog post and generate a concise summary and assign it a category.

  Categories to choose from:
  - Reflections: Personal thoughts, opinions, and insights.
  - Experiments: Detailing a process of trial, error, and discovery.
  - Design Notes: Focused on design principles, aesthetics, or architectural concepts.

  Analyze the following blog post content and generate a 1-2 sentence summary for a blog post card, and pick the best category.

  Blog Post Content:
  ---
  {{{content}}}
  ---
  `,
});

const summarizePostFlow = ai.defineFlow(
  {
    name: 'summarizePostFlow',
    inputSchema: SummarizePostInputSchema,
    outputSchema: SummarizePostOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
