'use server';
/**
 * @fileOverview A chatbot flow for Inioluwa's portfolio.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { db } from '@/lib/data';

async function getPortfolioContext() {
  const projects = await db.getProjects();
  const journalPosts = await db.getJournalPosts();
  const skills = await db.getSkills();
  const cvExperience = await db.getCVExperience();
  const cvEducation = await db.getCVEducation();

  return `
    PROJECTS:
    ${projects
      .map(
        (p) =>
          `- ${p.title} (${p.category}): ${p.description}. Key details: ${p.overview}`
      )
      .join('\n')}

    JOURNAL POSTS:
    ${journalPosts.map((p) => `- ${p.title}: ${p.description}`).join('\n')}

    SKILLS:
    ${skills
      .map((s) => `- ${s.category}: ${s.items.join(', ')}`)
      .join('\n')}

    CV / EXPERIENCE:
    ${cvExperience
      .map((item) => `- ${item.title} at ${item.subtitle} (${item.date}): ${item.description}`)
      .join('\n')}

    EDUCATION:
    ${cvEducation
      .map((item) => `- ${item.title} at ${item.subtitle} (${item.date}).`)
      .join('\n')}
  `;
}

const ChatInputSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;
type ChatOutput = string;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}


const sendMessageTool = ai.defineTool(
  {
    name: 'sendMessage',
    description: 'Sends a message to Inioluwa Oladipupo. Use this when a user wants to get in touch or leave a message.',
    inputSchema: z.object({
      name: z.string().describe("The user's name."),
      email: z.string().describe("The user's email address."),
      message: z.string().describe('The message content.'),
    }),
    outputSchema: z.string(),
  },
  async ({ name, email, message }) => {
    // In a real application, you would use a service like Resend or Nodemailer here.
    console.log(`Simulating sending email:
      From: ${name} <${email}>
      Message: ${message}
    `);
    return `I've passed your message along to Inioluwa. He'll get back to you soon!`;
  }
);

const checkAvailabilityTool = ai.defineTool(
    {
      name: 'checkAvailability',
      description: 'Checks Inioluwa\'s calendar for available meeting times. Use this if a user asks to schedule a meeting or call.',
      inputSchema: z.object({}),
      outputSchema: z.array(z.string()).describe('A list of available time slots.'),
    },
    async () => {
      // In a real application, you would connect to a calendar API like Google Calendar.
      console.log('Simulating checking calendar availability...');
      return [
        'Monday at 3:00 PM GMT',
        'Wednesday at 11:00 AM GMT',
        'Friday at 4:30 PM GMT',
      ];
    }
);


const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const portfolioContext = await getPortfolioContext();

    const prompt = ai.definePrompt({
      name: 'chatPrompt',
      input: {schema: ChatInputSchema},
      output: {format: 'text'},
      tools: [sendMessageTool, checkAvailabilityTool],
      prompt: `You are a friendly and helpful AI assistant for Inioluwa Oladipupo's personal portfolio website. Your name is "Inio-Bot".

      Your goal is to answer questions from visitors about Inioluwa's work, skills, and experience in a concise and conversational manner. You can also make friendly conversation.

      If a user wants to contact Inioluwa, ask for their name, email, and message. Then, use the \`sendMessage\` tool to forward the message. Do not ask for information you already have.

      If a user wants to schedule a meeting or call, use the \`checkAvailability\` tool to see when Inioluwa is free and present the options to the user.

      Use the following context about Inioluwa's portfolio to answer questions. Do not make up information. If you don't know the answer, say that you don't have that information but can pass the message along to Inioluwa.

      Keep your answers to a maximum of 3-4 sentences.

      CONTEXT:
      ---
      ${portfolioContext}
      ---

      CONVERSATION HISTORY:
      {{#each messages}}
        {{role}}: {{content}}
      {{/each}}
      
      ASSISTANT:`,
    });

    const {output} = await prompt(input);
    return output!;
  }
);
