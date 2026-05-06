import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    emoji: z.string().optional(),
    description: z.string(),
    features: z.array(z.string()),
    image: z.string().optional(),
    locale: z.string(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    emoji: z.string().optional(),
    image: z.string().optional(),
    locale: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    emoji: z.string().optional(),
    image: z.string().optional(),
    locale: z.string(),
  }),
});

export const collections = { products, news, blog };
