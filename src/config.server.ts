import { z } from "zod";
import fs from "fs";

// Runtime config type
type RuntimeConfig = {
  NEXT_PUBLIC_API_ENDPOINT?: string;
  NEXT_PUBLIC_URL?: string;
  NEXT_PUBLIC_ENABLE_LOGGING?: string;
};

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_ENABLE_LOGGING: z.string(),
});

export function getConfig() {
  // Load server config (server side only)
  let runtimeConfig: RuntimeConfig = {};
  if (fs.existsSync("/app/runtime-config.json")) {
    runtimeConfig = JSON.parse(
      fs.readFileSync("/app/runtime-config.json", "utf-8")
    );
  }

  const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT:
      runtimeConfig.NEXT_PUBLIC_API_ENDPOINT ||
      process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL:
      runtimeConfig.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_ENABLE_LOGGING:
      runtimeConfig.NEXT_PUBLIC_ENABLE_LOGGING ||
      process.env.NEXT_PUBLIC_ENABLE_LOGGING,
  });

  if (!configProject.success) {
    console.error(
      "❌ Invalid environment configuration:",
      configProject.error.issues
    );
    // throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
  }

  const envConfig = configProject.data;

  return envConfig;
}
