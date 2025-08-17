'use server';

/**
 * @fileOverview Optimizes product descriptions for better SEO using AI.
 *
 * - optimizeProductDescription - A function that handles the product description optimization process.
 * - OptimizeProductDescriptionInput - The input type for the optimizeProductDescription function.
 * - OptimizeProductDescriptionOutput - The return type for the optimizeProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeProductDescriptionInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The current description of the product.'),
  productName: z.string().describe('The name of the product.'),
  keywords: z
    .string()
    .describe(
      'A comma-separated list of keywords related to the product, for SEO purposes.'
    ),
});
export type OptimizeProductDescriptionInput = z.infer<
  typeof OptimizeProductDescriptionInputSchema
>;

const OptimizeProductDescriptionOutputSchema = z.object({
  optimizedDescription: z
    .string()
    .describe('The optimized product description for better SEO.'),
});
export type OptimizeProductDescriptionOutput = z.infer<
  typeof OptimizeProductDescriptionOutputSchema
>;

export async function optimizeProductDescription(
  input: OptimizeProductDescriptionInput
): Promise<OptimizeProductDescriptionOutput> {
  return optimizeProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeProductDescriptionPrompt',
  input: {schema: OptimizeProductDescriptionInputSchema},
  output: {schema: OptimizeProductDescriptionOutputSchema},
  prompt: `You are an SEO expert specializing in e-commerce product descriptions.

  Optimize the following product description to improve its search engine ranking, using the provided keywords. Make sure to keep the tone of the description engaging and informative.

  Product Name: {{{productName}}}
  Current Description: {{{productDescription}}}
  Keywords: {{{keywords}}}

  Provide an optimized product description that is both SEO-friendly and appealing to potential customers.`,
});

const optimizeProductDescriptionFlow = ai.defineFlow(
  {
    name: 'optimizeProductDescriptionFlow',
    inputSchema: OptimizeProductDescriptionInputSchema,
    outputSchema: OptimizeProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
