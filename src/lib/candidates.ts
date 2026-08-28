import "server-only";

import { cache } from "react";
import {
  MAX_LIST_PAGE,
  PAGE_SIZE,
  type CandidateListParams,
  type CandidateListResult,
  type CandidateProfile,
} from "@/lib/candidates-shared";
import { importCandidateUploads } from "@/lib/candidates-import";
import { isDatabaseReady } from "@/lib/db";
import {
  createCandidatesPg,
  deleteCandidatePg,
  getAllPublicSlugsPg,
  getCandidateByIdPg,
  getCandidateBySlugPg,
  listCandidatesPg,
  listMatchedCandidatesPg,
  markCandidateViewedPg,
} from "@/lib/postgres/candidates";

export * from "@/lib/candidates-shared";
export { importCandidateUploads };

function emptyList(pageSize = PAGE_SIZE): CandidateListResult {
  return {
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
    pageSize,
    source: "db",
  };
}

export async function listCandidates(
  params: CandidateListParams = {}
): Promise<CandidateListResult> {
  try {
    if (await isDatabaseReady()) return await listCandidatesPg(params);
    console.warn(
      "[candidates] Postgres/PGlite chưa sẵn sàng (USE_PGLITE=1 hoặc DATABASE_URL)."
    );
  } catch (err) {
    console.error("[candidates] list failed", err);
  }
  return emptyList(params.limit ?? PAGE_SIZE);
}

export const getCandidateBySlug = cache(async function getCandidateBySlug(
  slug: string,
  options?: { employerId?: string }
): Promise<CandidateProfile | null> {
  try {
    if (await isDatabaseReady()) return await getCandidateBySlugPg(slug, options);
  } catch (err) {
    console.error("[candidates] getBySlug failed", err);
  }
  return null;
});

export async function getCandidateById(id: string): Promise<CandidateProfile | null> {
  try {
    if (await isDatabaseReady()) return await getCandidateByIdPg(id);
  } catch (err) {
    console.error("[candidates] getById failed", err);
  }
  return null;
}

export async function getAllPublicSlugs(limit = 5000): Promise<string[]> {
  try {
    if (await isDatabaseReady()) return await getAllPublicSlugsPg(limit);
  } catch (err) {
    console.error("[candidates] getAllPublicSlugs failed", err);
  }
  return [];
}

export async function listRecentCandidates(limit = 5): Promise<CandidateProfile[]> {
  try {
    const result = await listCandidates({ page: 1, sort: "updated", limit });
    return result.data.slice(0, limit);
  } catch {
    return [];
  }
}

export async function listMatchedCandidates(
  skills: string[],
  limit = 5
): Promise<CandidateProfile[]> {
  try {
    if (await isDatabaseReady()) return await listMatchedCandidatesPg(skills, limit);
  } catch (err) {
    console.error("[candidates] matched failed", err);
  }
  return [];
}

export async function markCandidateViewed(employerId: string, candidateId: string): Promise<void> {
  try {
    if (await isDatabaseReady()) {
      await markCandidateViewedPg(employerId, candidateId);
    }
  } catch (err) {
    console.error("[candidates] markViewed failed", err);
  }
}

export async function createCandidates(
  profiles: CandidateProfile[],
  options?: { originalFileUrls?: Record<string, string> }
): Promise<number> {
  if (!(await isDatabaseReady())) {
    throw new Error("Postgres/PGlite chưa sẵn sàng.");
  }
  return createCandidatesPg(profiles, options);
}

export async function deleteCandidate(candidateId: string): Promise<boolean> {
  try {
    if (await isDatabaseReady()) return await deleteCandidatePg(candidateId);
  } catch (err) {
    console.error("[candidates] delete failed", err);
  }
  return false;
}

/** Alias tương thích script cũ */
export const createCandidatesBatch = createCandidates;

export { MAX_LIST_PAGE };
