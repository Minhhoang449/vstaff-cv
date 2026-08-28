import "server-only";

import OpenAI from "openai";
import type { CandidateUploadItem } from "@/data/candidate-upload-schema";
import { getOpenAiConfig } from "@/lib/cv/config";
import { prepareCvImageForVision } from "@/lib/cv/avatar";
import { ingestCvUpload, type IngestedCv } from "@/lib/cv/ingest";
import { enrichLanguages } from "@/lib/cv/normalize-languages";
import { resolveVnLocation } from "@/lib/cv/normalize-location";
import { resolveIndustryId } from "@/lib/cv/normalize-industry";
import { evaluateCvCompleteness } from "@/lib/cv/cv-completeness";

type ExtractRaw = {
  fullName?: string;
  title?: string;
  desiredPosition?: string;
  location?: string;
  address?: string;
  gender?: string;
  phone?: string;
  email?: string;
  education?: string;
  experienceYears?: number;
  skills?: string[];
  itSkills?: string[];
  languages?: string[];
  interests?: string[];
  summary?: string;
  careerObjective?: string;
  activities?: string;
  age?: number;
  dateOfBirth?: string;
  workType?: string;
  /** Gợi ý ngành từ CV (tên tự do) — sẽ map về INDUSTRIES */
  industryHint?: string;
  educationDetails?: CandidateUploadItem["educationDetails"];
  experiences?: CandidateUploadItem["experiences"];
  extraNotes?: string;
};

const EXTRACT_SCHEMA_HINT = `{
  "fullName": string,
  "title": string,
  "desiredPosition": string,
  "location": string,
  "address": string,
  "gender": "male" | "female" | "other",
  "phone": string,
  "email": string,
  "dateOfBirth": string | null,
  "age": number | null,
  "education": string,
  "educationDetails": [{ "school": string, "faculty": string, "major": string, "degree": string, "classification": string, "period": string }],
  "experienceYears": number,
  "experiences": [{ "company": string, "position": string, "startDate": string, "endDate": string, "description": string }],
  "skills": string[],
  "itSkills": string[],
  "languages": string[],
  "interests": string[],
  "careerObjective": string,
  "activities": string,
  "summary": string,
  "workType": string,
  "industryHint": string,
  "extraNotes": string
}`;

const SYSTEM_PROMPT = `Bạn là hệ thống trích xuất CV tiếng Việt. Chỉ trả JSON đúng schema, không markdown.
YÊU CẦU: Trích XUẤT ĐẦY ĐỦ mọi thông tin có trên CV — không bỏ sót.
- Thông tin cá nhân: họ tên, ngày sinh, tuổi, giới tính, SĐT, email, địa chỉ
- location / address: ghi đúng như trên CV (kể cả địa chỉ hành chính cũ có quận/huyện); hệ thống sẽ chuẩn hóa sau
- industryHint: ngành nghề / lĩnh vực ứng viên (theo chức danh, mục tiêu, kinh nghiệm) — viết tên tự do tiếng Việt; hệ thống sẽ map về danh mục nội bộ
- Mục tiêu nghề nghiệp (careerObjective)
- Học vấn đầy đủ (educationDetails): trường, khoa, ngành, bằng cấp, xếp loại
- Toàn bộ kinh nghiệm làm việc (experiences): công ty, chức danh, thời gian, mô tả công việc
- Kỹ năng mềm (skills), tin học (itSkills), sở thích, hoạt động
- languages: TẤT CẢ ngoại ngữ được đề cập bất kỳ đâu trên CV (kể cả khi nằm trong mục kỹ năng / tin học / mô tả, ví dụ "Tiếng Anh giao tiếp" → languages phải có Tiếng Anh). Luôn gồm Tiếng Việt nếu CV tiếng Việt.
- summary: tóm tắt ngắn hồ sơ
- extraNotes: nội dung còn lại chưa map vào field khác. KHÔNG ghi watermark / logo / tên site tuyển dụng (Timviec365, VietnamWorks, TopCV, …)
Không cần ảnh chân dung / tọa độ ảnh. Schema: ${EXTRACT_SCHEMA_HINT}`;

function normalizeGender(g?: string): CandidateUploadItem["gender"] {
  const v = (g || "").toLowerCase();
  if (v === "male" || v === "nam" || v === "m") return "male";
  if (v === "female" || v === "nữ" || v === "nu" || v === "f") return "female";
  return "other";
}

/** Bỏ watermark site tuyển dụng / footer vô nghĩa khỏi extraNotes. */
function sanitizeExtraNotes(raw?: string | null): string | undefined {
  if (!raw?.trim()) return undefined;
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((line) => {
      const n = line
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "");
      if (!n) return false;
      if (/timviec365(\.vn)?/.test(n)) return false;
      if (/vietnamworks(\.com)?/.test(n)) return false;
      if (/topcv(\.vn)?/.test(n)) return false;
      if (/vieclam24h/.test(n)) return false;
      if (/careerbuilder/.test(n)) return false;
      if (/^www\./.test(n) && n.length < 40) return false;
      return true;
    });

  const text = lines.join("\n").trim();
  return text || undefined;
}

function mapToUploadItem(raw: ExtractRaw): CandidateUploadItem {
  const title = (raw.title || raw.desiredPosition || "Ứng viên").trim();
  const desiredPosition = (raw.desiredPosition || raw.title || title).trim();
  const experiences = Array.isArray(raw.experiences) ? raw.experiences : [];
  const educationDetails = Array.isArray(raw.educationDetails) ? raw.educationDetails : [];
  const skills = Array.isArray(raw.skills) ? raw.skills.map(String).filter(Boolean) : [];
  const itSkills = Array.isArray(raw.itSkills) ? raw.itSkills.map(String).filter(Boolean) : [];
  const resolved = resolveVnLocation(raw.location, raw.address);
  const industryId = resolveIndustryId(
    raw.industryHint,
    title,
    desiredPosition,
    raw.summary,
    raw.careerObjective,
    ...skills,
    ...itSkills,
    ...experiences.map((e) => `${e?.company} ${e?.position} ${e?.description}`),
    ...educationDetails.map((e) => `${e?.major} ${e?.faculty}`),
    raw.extraNotes
  );

  const summaryParts = [
    raw.summary?.trim(),
    raw.careerObjective?.trim() ? `Mục tiêu: ${raw.careerObjective.trim()}` : "",
  ].filter(Boolean);

  const languages = enrichLanguages(
    raw.languages?.map(String),
    skills,
    itSkills,
    raw.summary,
    raw.careerObjective,
    raw.activities,
    raw.extraNotes,
    ...experiences.map((e) => e?.description)
  );

  const candidate: CandidateUploadItem = {
    fullName: (raw.fullName || "").trim() || "Chưa rõ tên",
    title,
    desiredPosition,
    location: resolved.location,
    address: resolved.address,
    provinceCode: resolved.provinceCode,
    wardCode: resolved.wardCode,
    wardName: resolved.wardName,
    industryId,
    gender: normalizeGender(raw.gender),
    languages,
    education: raw.education?.trim() || educationDetails[0]?.degree || "Đại học",
    educationDetails: educationDetails.length ? educationDetails : undefined,
    experienceYears:
      Number(raw.experienceYears ?? 0) ||
      Math.max(0, experiences.length > 0 ? experiences.length : 0),
    experiences: experiences.length ? experiences : undefined,
    skills,
    itSkills: itSkills.length ? itSkills : undefined,
    interests: Array.isArray(raw.interests) ? raw.interests.map(String) : undefined,
    activities: raw.activities?.trim() || undefined,
    careerObjective: raw.careerObjective?.trim() || undefined,
    summary: summaryParts.join("\n") || "",
    age: Number(raw.age ?? 0) || 25,
    dateOfBirth: raw.dateOfBirth?.trim() || undefined,
    salaryExpect: 10,
    workType: raw.workType?.trim() || "Toàn thời gian",
    jobSeekingStatus: "open",
    phone: (raw.phone || "").trim(),
    email: (raw.email || "").trim(),
    isPublic: true,
    extraNotes: sanitizeExtraNotes(raw.extraNotes),
  };

  const completeness = evaluateCvCompleteness(candidate);
  candidate.cvScore = completeness.cvScore;
  candidate.cvGrade = completeness.cvGrade;
  candidate.cvScoreLabel = completeness.cvScoreLabel;
  return candidate;
}

function createClient() {
  const { apiKey, model, baseURL } = getOpenAiConfig();
  if (!apiKey) throw new Error("OPENAI_NOT_CONFIGURED");
  const client = new OpenAI({
    apiKey,
    baseURL,
    defaultHeaders: baseURL?.includes("openrouter")
      ? {
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Vstaff.CV",
        }
      : undefined,
  });
  return { client, model };
}

async function parseModelJson(content: string | null | undefined): Promise<ExtractRaw> {
  if (!content) throw new Error("OPENAI_EMPTY_RESPONSE");
  try {
    return JSON.parse(content) as ExtractRaw;
  } catch {
    throw new Error("OPENAI_INVALID_JSON");
  }
}

export async function extractCandidateFromCvImage(opts: {
  imageBuffer: Buffer;
  sourceFile?: string;
}): Promise<{ candidate: CandidateUploadItem; model: string }> {
  const { client, model } = createClient();
  const prepared = await prepareCvImageForVision(opts.imageBuffer);

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Trích xuất ĐẦY ĐỦ mọi thông tin trên ảnh CV này thành JSON (không cần ảnh).",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${prepared.toString("base64")}`,
              detail: "high",
            },
          },
        ],
      },
    ],
  });

  const raw = await parseModelJson(completion.choices[0]?.message?.content);
  return { candidate: mapToUploadItem(raw), model };
}

export async function extractCandidateFromCvText(opts: {
  text: string;
  sourceFile?: string;
}): Promise<{ candidate: CandidateUploadItem; model: string }> {
  const { client, model } = createClient();

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Trích xuất ĐẦY ĐỦ mọi thông tin từ nội dung CV sau thành JSON:\n\n${opts.text}`,
      },
    ],
  });

  const raw = await parseModelJson(completion.choices[0]?.message?.content);
  return { candidate: mapToUploadItem(raw), model };
}

async function extractFromIngested(unit: IngestedCv) {
  if (unit.kind === "image") {
    return extractCandidateFromCvImage({
      imageBuffer: unit.buffer,
      sourceFile: unit.sourceFile,
    });
  }
  return extractCandidateFromCvText({
    text: unit.text,
    sourceFile: unit.sourceFile,
  });
}

/** Full pipeline: ingest file (pdf/doc/image/zip) → extract candidate(s). */
export async function extractCandidatesFromUpload(opts: {
  buffer: Buffer;
  sourceFile: string;
}): Promise<{ candidates: CandidateUploadItem[]; units: number }> {
  const units = await ingestCvUpload(opts.buffer, opts.sourceFile);
  const candidates: CandidateUploadItem[] = [];
  for (const unit of units) {
    const result = await extractFromIngested(unit);
    candidates.push(result.candidate);
  }
  return { candidates, units: units.length };
}
