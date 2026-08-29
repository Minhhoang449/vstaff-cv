import type {
  CandidateUploadItem,
  CvEducationDetail,
  CvExperienceDetail,
} from "@/data/candidate-upload-schema";

/** Chi tiết CV trích xuất — lưu JSON trên CandidateProfile. */
export type CandidateCvDetails = {
  careerObjective?: string;
  interests?: string[];
  activities?: string;
  educationDetails?: CvEducationDetail[];
  experiences?: CvExperienceDetail[];
  extraNotes?: string;
  dateOfBirth?: string;
  address?: string;
  itSkills?: string[];
};

export function cvDetailsFromUpload(item: CandidateUploadItem): CandidateCvDetails | undefined {
  const details: CandidateCvDetails = {
    careerObjective: item.careerObjective?.trim() || undefined,
    interests: item.interests?.length ? item.interests : undefined,
    activities: item.activities?.trim() || undefined,
    educationDetails: item.educationDetails?.length ? item.educationDetails : undefined,
    experiences: item.experiences?.length ? item.experiences : undefined,
    extraNotes: item.extraNotes?.trim() || undefined,
    dateOfBirth: item.dateOfBirth?.trim() || undefined,
    address: item.address?.trim() || undefined,
    itSkills: item.itSkills?.length ? item.itSkills : undefined,
  };

  const hasData = Object.values(details).some((v) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v)
  );
  return hasData ? details : undefined;
}

/** Bỏ key undefined trước khi ghi Prisma Json — tránh lỗi validation. */
export function cvDetailsToDbJson(
  details: CandidateCvDetails | undefined
): Record<string, unknown> | undefined {
  if (!details) return undefined;
  const clean = JSON.parse(JSON.stringify(details)) as Record<string, unknown>;
  return Object.keys(clean).length > 0 ? clean : undefined;
}

export function parseCvDetails(raw: unknown): CandidateCvDetails | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;

  const educationDetails = Array.isArray(o.educationDetails)
    ? (o.educationDetails as CvEducationDetail[])
    : undefined;
  const experiences = Array.isArray(o.experiences)
    ? (o.experiences as CvExperienceDetail[])
    : undefined;
  const interests = Array.isArray(o.interests) ? o.interests.map(String) : undefined;
  const itSkills = Array.isArray(o.itSkills) ? o.itSkills.map(String) : undefined;

  return cvDetailsFromUpload({
    fullName: "",
    title: "",
    desiredPosition: "",
    location: "",
    provinceCode: "",
    industryId: "",
    careerObjective: o.careerObjective != null ? String(o.careerObjective) : undefined,
    interests,
    activities: o.activities != null ? String(o.activities) : undefined,
    educationDetails,
    experiences,
    extraNotes: o.extraNotes != null ? String(o.extraNotes) : undefined,
    dateOfBirth: o.dateOfBirth != null ? String(o.dateOfBirth) : undefined,
    address: o.address != null ? String(o.address) : undefined,
    itSkills,
  });
}
