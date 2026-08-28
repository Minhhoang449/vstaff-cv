export type CvCompletenessGrade = "A" | "B" | "C" | "D";

export type CvCompletenessResult = {
  /** 0–100 */
  cvScore: number;
  cvGrade: CvCompletenessGrade;
  /** Nhãn hiển thị ngắn */
  cvScoreLabel: string;
  /** Gợi ý thiếu gì (nội bộ / preview) */
  missingHints: string[];
};

type ScoreableCv = {
  fullName?: string | null;
  title?: string | null;
  desiredPosition?: string | null;
  location?: string | null;
  address?: string | null;
  provinceCode?: string | null;
  wardCode?: string | null;
  wardName?: string | null;
  industryId?: string | null;
  gender?: string | null;
  languages?: string[] | null;
  education?: string | null;
  educationDetails?: Array<{
    school?: string;
    major?: string;
    degree?: string;
    period?: string;
  }> | null;
  experienceYears?: number | null;
  experiences?: Array<{
    company?: string;
    position?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }> | null;
  skills?: string[] | null;
  itSkills?: string[] | null;
  interests?: string[] | null;
  summary?: string | null;
  careerObjective?: string | null;
  activities?: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  workType?: string | null;
  phone?: string | null;
  email?: string | null;
  extraNotes?: string | null;
};

function filled(s?: string | null) {
  return Boolean(s && String(s).trim() && !/^chưa rõ/i.test(String(s).trim()));
}

function arrFilled(a?: unknown[] | null, min = 1) {
  return Array.isArray(a) && a.filter(Boolean).length >= min;
}

function gradeFromScore(score: number): {
  grade: CvCompletenessGrade;
  label: string;
} {
  if (score >= 85) return { grade: "A", label: "Rất đầy đủ" };
  if (score >= 70) return { grade: "B", label: "Đầy đủ" };
  if (score >= 50) return { grade: "C", label: "Cơ bản" };
  return { grade: "D", label: "Thiếu thông tin" };
}

/**
 * Đánh giá độ đầy đủ hồ sơ CV theo trọng số các nhóm thông tin.
 * Dùng chung cho extract upload và thẻ NTD.
 */
export function evaluateCvCompleteness(cv: ScoreableCv): CvCompletenessResult {
  const missingHints: string[] = [];
  let earned = 0;
  let total = 0;

  const add = (max: number, got: number, hint?: string) => {
    total += max;
    earned += Math.min(max, Math.max(0, got));
    if (hint && got < max * 0.5) missingHints.push(hint);
  };

  // Liên hệ — 12
  {
    let got = 0;
    if (filled(cv.phone)) got += 6;
    else missingHints.push("Số điện thoại");
    if (filled(cv.email)) got += 6;
    else missingHints.push("Email");
    add(12, got);
  }

  // Định danh — 10
  {
    let got = 0;
    if (filled(cv.fullName)) got += 4;
    if (cv.gender && cv.gender !== "other") got += 2;
    if ((cv.age && cv.age > 0) || filled(cv.dateOfBirth)) got += 4;
    else missingHints.push("Tuổi / ngày sinh");
    add(10, got);
  }

  // Địa điểm — 10
  {
    let got = 0;
    if (filled(cv.location) || filled(cv.provinceCode)) got += 5;
    if (filled(cv.wardName) || filled(cv.wardCode) || filled(cv.address)) got += 5;
    else missingHints.push("Địa chỉ / phường-xã");
    add(10, got);
  }

  // Hướng nghề — 14
  {
    let got = 0;
    if (filled(cv.title) || filled(cv.desiredPosition)) got += 6;
    else missingHints.push("Vị trí mong muốn");
    if (filled(cv.industryId) && cv.industryId !== "other") got += 5;
    else missingHints.push("Ngành nghề");
    if (filled(cv.workType)) got += 3;
    add(14, got);
  }

  // Tóm tắt / mục tiêu — 12
  {
    const summaryLen = (cv.summary || "").trim().length;
    const objLen = (cv.careerObjective || "").trim().length;
    let got = 0;
    if (summaryLen >= 40 || objLen >= 40) got += 12;
    else if (summaryLen >= 15 || objLen >= 15) got += 7;
    else {
      got += summaryLen > 0 || objLen > 0 ? 3 : 0;
      missingHints.push("Mục tiêu / tóm tắt hồ sơ");
    }
    add(12, got);
  }

  // Học vấn — 12
  {
    const details = cv.educationDetails || [];
    const rich = details.some(
      (d) => filled(d.school) && (filled(d.major) || filled(d.degree))
    );
    let got = 0;
    if (rich) got += 12;
    else if (details.length > 0 || filled(cv.education)) got += 7;
    else missingHints.push("Học vấn chi tiết");
    add(12, got);
  }

  // Kinh nghiệm — 16
  {
    const exps = cv.experiences || [];
    const richCount = exps.filter(
      (e) =>
        filled(e.company) &&
        filled(e.position) &&
        ((e.description || "").trim().length >= 20 || filled(e.startDate))
    ).length;
    let got = 0;
    if (richCount >= 2) got += 16;
    else if (richCount === 1) got += 11;
    else if (exps.length > 0 || (cv.experienceYears && cv.experienceYears > 0)) got += 6;
    else missingHints.push("Kinh nghiệm làm việc");
    add(16, got);
  }

  // Kỹ năng — 10
  {
    const skillN = (cv.skills || []).filter(Boolean).length;
    const itN = (cv.itSkills || []).filter(Boolean).length;
    let got = 0;
    if (skillN + itN >= 5) got += 10;
    else if (skillN + itN >= 2) got += 6;
    else if (skillN + itN >= 1) got += 3;
    else missingHints.push("Kỹ năng");
    add(10, got);
  }

  // Ngoại ngữ & phụ — 4
  {
    const langs = (cv.languages || []).filter(
      (l) => l && !/^tiếng việt$/i.test(String(l).trim())
    );
    let got = 0;
    if (langs.length > 0) got += 2;
    if (arrFilled(cv.interests) || filled(cv.activities) || filled(cv.extraNotes)) got += 2;
    add(4, got);
  }

  const cvScore = total > 0 ? Math.round((earned / total) * 100) : 0;
  const { grade, label } = gradeFromScore(cvScore);

  return {
    cvScore,
    cvGrade: grade,
    cvScoreLabel: label,
    missingHints: [...new Set(missingHints)].slice(0, 6),
  };
}
