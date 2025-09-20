'use server';
/**
 * @fileOverview A flow for generating content for project sections (Overview, Process, Outcomes).
 *
 * - generateProjectDetails - A function that handles the content generation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {GenerateProjectDetailsInput} from '@/app/admin/_components/project-form';

const GenerateProjectDetailsInputSchema = z.object({
  title: z.string().describe('The title of the project.'),
  description: z.string().describe('A short description of the project.'),
  section: z.enum(['overview', 'process', 'outcomes']).describe('The specific section to generate content for.'),
});

const GenerateProjectDetailsOutputSchema = z.string().describe('The generated content for the specified project section.');

export async function generateProjectDetails(
  input: GenerateProjectDetailsInput
): Promise<string> {
  return generateProjectDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectDetailsPrompt',
  input: {schema: GenerateProjectDetailsInputSchema},
  output: {format: 'text'},
  prompt: `You are a professional portfolio writer. Your task is to expand on a project's title and short description to create content for a specific section of a case study.

  Project Title: {{{title}}}
  Project Description: {{{description}}}
  Section to Generate: {{{section}}}

  Based on the information above, write a detailed paragraph (around 150-200 words) for the "{{{section}}}" section of the case study.

  - If the section is "overview", provide a comprehensive summary of the project's goals, context, and purpose.
  - If the section is "process", describe the key phases of the project, from research and ideation to development and execution. Imagine a typical but effective workflow.
  - If the section is "outcomes", detail the results and impact of the project. This could include final deliverables, key learnings, and reflections on success.

  Generated Content:
  `,
});

const generateProjectDetailsFlow = ai.defineFlow(
  {
    name: 'generateProjectDetailsFlow',
    inputSchema: GenerateProjectDetailsInputSchema,
    outputSchema: GenerateProjectDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
