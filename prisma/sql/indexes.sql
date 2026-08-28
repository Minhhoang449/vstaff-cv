-- Extra indexes for keyword search at ~100k scale (run after schema push).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS candidate_fullname_trgm_idx
  ON "CandidateProfile" USING gin ("fullName" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS candidate_title_trgm_idx
  ON "CandidateProfile" USING gin ("title" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS candidate_desired_position_trgm_idx
  ON "CandidateProfile" USING gin ("desiredPosition" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS candidate_summary_trgm_idx
  ON "CandidateProfile" USING gin ("summary" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS candidate_skills_gin_idx
  ON "CandidateProfile" USING gin ("skills");

CREATE INDEX IF NOT EXISTS candidate_languages_gin_idx
  ON "CandidateProfile" USING gin ("languages");
