'use server';
/**
 * @fileOverview A Genkit flow for automatically categorizing financial transactions.
 *
 * - aiCategorizeTransaction - A function that handles the AI-powered transaction categorization process.
 * - AICategorizeTransactionInput - The input type for the aiCategorizeTransaction function.
 * - AICategorizeTransactionOutput - The return type for the aiCategorizeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Represents a past transaction with its assigned category.
 */
const PastTransactionSchema = z.object({
  description: z.string().describe('Description of a past transaction.'),
  category: z.string().describe('Category assigned to the past transaction.'),
});

const AICategorizeTransactionInputSchema = z.object({
  description: z.string().describe('Description of the new transaction to categorize.'),
  amount: z.number().optional().describe('Amount of the new transaction.'),
  merchant: z.string().optional().describe('Merchant of the new transaction.'),
  pastTransactions: z.array(PastTransactionSchema).describe('A list of past transactions with their assigned categories to learn from.'),
});
export type AICategorizeTransactionInput = z.infer<typeof AICategorizeTransactionInputSchema>;

const AICategorizeTransactionOutputSchema = z.object({
  suggestedCategory: z.string().describe('The suggested category for the new transaction.'),
  confidence: z.number().min(0).max(1).optional().describe('Confidence score (0-1) for the suggested category, where 1 is highly confident.'),
});
export type AICategorizeTransactionOutput = z.infer<typeof AICategorizeTransactionOutputSchema>;

export async function aiCategorizeTransaction(input: AICategorizeTransactionInput): Promise<AICategorizeTransactionOutput> {
  return aiCategorizeTransactionFlow(input);
}

const categorizeTransactionPrompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: AICategorizeTransactionInputSchema},
  output: {schema: AICategorizeTransactionOutputSchema},
  prompt: `You are an intelligent financial assistant specialized in categorizing transactions.
Your task is to analyze a new transaction and suggest the most appropriate category based on provided examples of past transactions and their categories.

Here are examples of past transactions and their assigned categories:
{{#if pastTransactions}}
  {{#each pastTransactions}}
    - Description: "{{{this.description}}}", Category: "{{{this.category}}}"
  {{/each}}
{{else}}
  No past transactions provided for learning. Categorize based on common sense.
{{/if}}

Please categorize the following new transaction:
Description: "{{{description}}}"
{{#if amount}}Amount: {{{amount}}}{{/if}}
{{#if merchant}}Merchant: {{{merchant}}}{{/if}}

Provide your suggestion in JSON format with a 'suggestedCategory' field and an optional 'confidence' score (0-1).`,
});

const aiCategorizeTransactionFlow = ai.defineFlow(
  {
    name: 'aiCategorizeTransactionFlow',
    inputSchema: AICategorizeTransactionInputSchema,
    outputSchema: AICategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await categorizeTransactionPrompt(input);
    return output!;
  }
);
