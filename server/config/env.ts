import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),

  DATABASE_URL: required("DATABASE_URL"),

  API_KEYS: {
    ADMIN: required("ADMIN_API_KEY"),
    FINTECH: required("FINTECH_API_KEY"),
  },
};
