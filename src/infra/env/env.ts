import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  ADMIN_SHOPIFY: z.string(),
  API_KEY: z.string(),
  API_SECRET_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  SHOPIFY_SHOP_NAME: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
});

export type EnvSchemaType = z.infer<typeof envSchema>;
