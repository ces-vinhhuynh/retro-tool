import { z } from "https://esm.sh/zod";

const EnvSchema = z.object({
  // Application
  APP_URL: z.string().url(),
  FROM_EMAIL: z.string().email(),
  APP_NAME: z.string().default("Retro Tool"),

  // Authentication
  TOKEN_EXPIRY_DAYS: z.number().default(3),

  // External Services
  SENDGRID_API_KEY: z.string(),
  SENDGRID_API_URL: z
    .string()
    .url()
    .default("https://api.sendgrid.com/v3/mail/send"),

  // Database
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
});

export const CONFIG = {
  // Application
  APP_URL: Deno.env.get("APP_URL"),
  FROM_EMAIL: Deno.env.get("FROM_EMAIL") ?? "retrotoolteam@gmail.com",
  APP_NAME: Deno.env.get("APP_NAME") ?? "Retro Tool",

  // Authentication
  TOKEN_EXPIRY_DAYS: Number(Deno.env.get("TOKEN_EXPIRY_DAYS") ?? 3),

  // External Services
  SENDGRID_API_KEY: Deno.env.get("SENDGRID_API_KEY"),
  SENDGRID_API_URL:
    Deno.env.get("SENDGRID_API_URL") ?? "https://api.sendgrid.com/v3/mail/send",

  // Database
  SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
} as const;

export function validateConfig() {
  const result = EnvSchema.safeParse(CONFIG);
  if (!result.success) {
    throw new Error(
      `Invalid environment configuration:\n${result.error.errors
        .map((err) => `- ${err.path.join(".")}: ${err.message}`)
        .join("\n")}`
    );
  }
  return result.data;
}
