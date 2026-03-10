import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { extractSearchResults } from '../costco-api.js';
import { searchResultSchema } from './schemas.js';

export const searchProducts = defineTool({
  name: 'search_products',
  displayName: 'Search Products',
  description:
    'Search for products on Costco. First navigates to the search page, then extracts results from the DOM and fetches full product details via the API. The browser tab will navigate to the search results page.',
  summary: 'Search for Costco products by keyword',
  icon: 'search',
  group: 'Products',
  input: z.object({
    keyword: z.string().describe('Search keyword (e.g., "laptop", "kirkland olive oil")'),
    max_results: z
      .number()
      .int()
      .min(1)
      .max(24)
      .optional()
      .describe('Maximum number of results to return (default 10, max 24)'),
  }),
  output: z.object({
    results: z.array(searchResultSchema).describe('Product search results with item numbers and names'),
    total_found: z.number().int().describe('Number of products found on the search page'),
  }),
  handle: async params => {
    const max = params.max_results ?? 10;
    // Navigate to the search page
    window.location.href = `https://www.costco.com/s?keyword=${encodeURIComponent(params.keyword)}`;

    // Wait for the page to load and product links to appear
    await new Promise<void>(resolve => {
      const check = () => {
        const links = document.querySelectorAll('a[href*=".product."]');
        if (links.length > 0) {
          resolve();
          return;
        }
        setTimeout(check, 500);
      };
      setTimeout(check, 2000);
    });

    // Give a bit more time for all results to render
    await new Promise(r => setTimeout(r, 1000));

    const searchResults = extractSearchResults();
    const limited = searchResults.slice(0, max);

    return {
      results: limited.map(r => ({
        item_number: r.itemNumber,
        name: r.name,
        url: r.href,
      })),
      total_found: searchResults.length,
    };
  },
});
