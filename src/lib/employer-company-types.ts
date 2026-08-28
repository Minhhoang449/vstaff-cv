export type EmployerCompanyProfile = {
  companyName: string;
  slug: string;
  logoText: string;
  industry: string;
  province: string;
  address: string;
  companySize: string;
  website: string;
  phone: string;
  email: string;
  about: string;
  isPublic: boolean;
  updatedAt?: string;
};

export const EMPTY_COMPANY_PROFILE: EmployerCompanyProfile = {
  companyName: "",
  slug: "",
  logoText: "",
  industry: "",
  province: "",
  address: "",
  companySize: "11-50",
  website: "",
  phone: "",
  email: "",
  about: "",
  isPublic: true,
};
