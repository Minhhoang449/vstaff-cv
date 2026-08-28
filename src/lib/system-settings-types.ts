import { siteConfig } from "@/lib/site";

export type SystemSettings = {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  allowEmployerSignup: boolean;
  maintenance: boolean;
  updatedAt?: string;
};

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  siteName: siteConfig.name,
  supportEmail: siteConfig.email,
  supportPhone: siteConfig.phone,
  allowEmployerSignup: true,
  maintenance: false,
};
