import { Role } from "../types/roles";

export type ApiKeyConfig = {
  role: Role;
};

export const API_KEYS: Record<string, ApiKeyConfig> = {
  "admin-key-123": { role: "ADMIN" },
  "fintech-key-456": { role: "FINTECH_PARTNER" },
};
