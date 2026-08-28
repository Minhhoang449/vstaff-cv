"use client";

import { useRef, useState, type DragEvent } from "react";
import { Check, Copy, FileJson, FileUp, Link2, Loader2, Upload } from "lucide-react";
import {
  CANDIDATE_UPLOAD_EXAMPLE,
  parseCandidateUploadJson,
  type CandidateUploadItem,
} from "@/data/candidate-upload-schema";
import { cn } from "@/lib/utils";

const EXAMPLE_JSON = JSON.stringify(CANDIDATE_UPLOAD_EXAMPLE, null, 2);

const ACCEPT =
  ".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx,.zip,image/png,image/jpeg,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip";

function parseUrlLines(text: string) {
  return text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((u) => /^https?:\/\//i.test(u))
    .slice(0, 40);
}

export function AdminCandidateUploadForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const [raw, setRaw] = useState(EXAMPLE_JSON);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<CandidateUploadItem[]>([]);
  const [imported, setImported] = useState(false);
  const [copied, setCopied] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractMessage, setExtractMessage] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [urlText, setUrlText] = useState("");

  function validate(text: string) {
    const result = parseCandidateUploadJson(text);
    setErrors(result.errors);
    setPreview(result.ok ? result.items : []);
    return result;
  }

  function onJsonFileChange(file: File | null) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json") && file.type !== "application/json") {
      setErrors(["Chỉ chấp nhận file .json"]);
      setPreview([]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setRaw(text);
      validate(text);
    };
    reader.readAsText(file, "utf-8");
  }

  function onValidate() {
    validate(raw);
    setImported(false);
  }

  async function onImport() {
    const result = validate(raw);
    if (!result.ok || result.items.length === 0) return;
    setExtractMessage("Đang import…");
    try {
      const res = await fetch("/api/admin/cv/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        imported?: number;
        source?: string;
      } | null;
      if (!res.ok) {
        setExtractMessage(data?.error || "Import thất bại.");
        setImported(false);
        return;
      }
      setImported(true);
      setExtractMessage(
        `Đã import ${data?.imported ?? result.items.length} hồ sơ vào Postgres. Xem tại Tìm ứng viên.`
      );
      window.setTimeout(() => setImported(false), 4000);
    } catch {
      setExtractMessage("Không kết nối được máy chủ khi import.");
      setImported(false);
    }
  }

  async function copyExample() {
    try {
      await navigator.clipboard.writeText(EXAMPLE_JSON);
    } catch {
      /* ignore */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function applyExtractResult(
    data: {
      error?: string;
      candidates?: CandidateUploadItem[];
      errors?: { file: string; error: string }[];
      imported?: number;
      importSource?: string;
    } | null,
    resOk: boolean,
    sourceLabel: string
  ) {
    if (!resOk) {
      setExtractMessage(data?.error || "Trích xuất thất bại.");
      return;
    }

    const list = data?.candidates ?? [];
    if (list.length === 0) {
      const detail = data?.errors?.map((e) => `${e.file}: ${e.error}`).join("; ");
      setExtractMessage(detail || "Không trích xuất được hồ sơ nào.");
      return;
    }

    const text = JSON.stringify({ candidates: list }, null, 2);
    setRaw(text);
    validate(text);

    const failCount = data?.errors?.length ?? 0;
    const importedCount = data?.imported ?? 0;
    if (importedCount > 0) setImported(true);

    const parts = [
      `Đã trích ${list.length} hồ sơ từ ${sourceLabel}`,
      importedCount > 0
        ? `tự import ${importedCount} hồ sơ${data?.importSource ? ` (${data.importSource})` : ""}`
        : null,
      failCount > 0 ? `${failCount} mục lỗi` : null,
    ].filter(Boolean);
    setExtractMessage(`${parts.join("; ")}.`);
    if (importedCount > 0) window.setTimeout(() => setImported(false), 5000);
  }

  async function onExtractFiles(fileList: FileList | File[] | null) {
    if (!fileList || extracting) return;
    const files = Array.from(fileList).slice(0, 40);
    if (!files.length) return;

    setFileNames(files.map((f) => f.name));
    setExtracting(true);
    setExtractMessage(`Đang xử lý ${files.length} file…`);
    setImported(false);

    try {
      const form = new FormData();
      for (const f of files) form.append("files", f);

      const res = await fetch("/api/admin/cv/extract", {
        method: "POST",
        body: form,
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        candidates?: CandidateUploadItem[];
        errors?: { file: string; error: string }[];
        imported?: number;
        importSource?: string;
      } | null;

      await applyExtractResult(data, res.ok, `${files.length} file`);
    } catch {
      setExtractMessage("Không kết nối được máy chủ.");
    } finally {
      setExtracting(false);
      if (cvRef.current) cvRef.current.value = "";
    }
  }

  async function onExtractUrls() {
    if (extracting) return;
    const urls = parseUrlLines(urlText);
    if (!urls.length) {
      setExtractMessage("Dán ít nhất một link http(s) tới ảnh/PDF CV.");
      return;
    }

    setFileNames(urls.map((u) => (u.length > 60 ? `${u.slice(0, 57)}…` : u)));
    setExtracting(true);
    setExtractMessage(`Đang tải & trích ${urls.length} link…`);
    setImported(false);

    try {
      const res = await fetch("/api/admin/cv/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        candidates?: CandidateUploadItem[];
        errors?: { file: string; error: string }[];
        imported?: number;
        importSource?: string;
      } | null;

      await applyExtractResult(data, res.ok, `${urls.length} link`);
    } catch {
      setExtractMessage("Không kết nối được máy chủ.");
    } finally {
      setExtracting(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    void onExtractFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[var(--border)] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <FileUp className="h-4 w-4 text-[var(--primary)]" aria-hidden />
              Upload hàng loạt CV
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Dán link ảnh CV (Timviec365…) hoặc upload file{" "}
              <strong className="font-medium text-zinc-700">PNG/JPG/PDF/DOC/DOCX/ZIP</strong>. Hệ
              thống tự trích rồi import — không cần tải về máy.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
          <label
            htmlFor="cv-urls"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-800"
          >
            <Link2 className="h-4 w-4 text-[var(--primary)]" aria-hidden />
            Link ảnh / PDF CV
          </label>
          <p className="mt-1 text-xs text-zinc-500">
            Mỗi dòng một URL. Ví dụ: https://storage1.timviec365.vn/.../u_cv_….png
          </p>
          <textarea
            id="cv-urls"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            rows={4}
            spellCheck={false}
            placeholder={"https://storage1.timviec365.vn/timviec365/pictures/cv/....png"}
            className="mt-2 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-zinc-800 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          />
          <button
            type="button"
            disabled={extracting || !urlText.trim()}
            onClick={() => void onExtractUrls()}
            className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {extracting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Link2 className="h-4 w-4" aria-hidden />
            )}
            {extracting ? "Đang trích từ link…" : "Trích xuất từ link"}
          </button>
        </div>

        <input
          ref={cvRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(e) => void onExtractFiles(e.target.files)}
        />

        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={onDrop}
          className={cn(
            "mt-4 flex min-h-[7rem] flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition",
            dragOver
              ? "border-[var(--primary)] bg-[var(--primary)]/5"
              : "border-zinc-200 bg-zinc-50/60 hover:border-zinc-300"
          )}
        >
          <FileUp className="h-7 w-7 text-zinc-400" aria-hidden />
          <p className="mt-2 text-sm font-medium text-zinc-800">
            Hoặc kéo thả / chọn file CV
          </p>
          <button
            type="button"
            disabled={extracting}
            onClick={() => cvRef.current?.click()}
            className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {extracting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            {extracting ? "Đang xử lý…" : "Chọn file / ZIP"}
          </button>
          {fileNames.length > 0 ? (
            <p className="mt-3 max-w-lg text-xs text-zinc-500">
              {fileNames.length} mục: {fileNames.slice(0, 3).join(", ")}
              {fileNames.length > 3 ? "…" : ""}
            </p>
          ) : null}
        </div>

        {extractMessage ? (
          <p className="mt-3 text-sm font-medium text-zinc-700">{extractMessage}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <FileJson className="h-4 w-4 text-[var(--primary)]" aria-hidden />
              Cấu trúc JSON
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Upload CV sẽ tự import. Chỉnh JSON tại đây rồi bấm Import lại nếu cần cập nhật.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void copyExample()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Đã copy" : "Copy mẫu"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            onChange={(e) => onJsonFileChange(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Chọn file .json
          </button>
          <button
            type="button"
            onClick={() => {
              setRaw(EXAMPLE_JSON);
              validate(EXAMPLE_JSON);
              setImported(false);
            }}
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            Khôi phục mẫu
          </button>
        </div>

        <label htmlFor="upload-json" className="mt-4 block text-sm font-medium text-zinc-800">
          Nội dung JSON
        </label>
        <textarea
          id="upload-json"
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setImported(false);
          }}
          spellCheck={false}
          rows={16}
          className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-800 outline-none transition focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/20"
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onValidate}
            className="inline-flex h-10 items-center rounded-lg border border-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/5"
          >
            Kiểm tra JSON
          </button>
          <button
            type="button"
            onClick={() => void onImport()}
            disabled={preview.length === 0 || errors.length > 0}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Import {preview.length > 0 ? `(${preview.length})` : ""}
          </button>
          {imported ? (
            <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" aria-hidden />
              Đã import vào kho ứng viên
            </p>
          ) : null}
        </div>

        {errors.length > 0 ? (
          <ul className="mt-4 space-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
            {errors.map((err) => (
              <li key={err}>• {err}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {preview.length > 0 && errors.length === 0 ? (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          <div className="border-b border-zinc-100 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-zinc-800">
              Xem trước ({preview.length} hồ sơ)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                  <th className="px-4 py-3 font-semibold sm:px-5">Họ tên</th>
                  <th className="px-3 py-3 font-semibold">CV</th>
                  <th className="px-3 py-3 font-semibold">Vị trí</th>
                  <th className="px-3 py-3 font-semibold">Liên hệ</th>
                  <th className="px-3 py-3 font-semibold">Học vấn / KN</th>
                  <th className="px-4 py-3 font-semibold sm:px-5">Tóm tắt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {preview.slice(0, 20).map((c, i) => (
                  <tr key={`${c.email}-${c.fullName}-${i}`} className="bg-white align-top">
                    <td className="px-4 py-3 sm:px-5">
                      <p className="font-semibold text-zinc-900">{c.fullName}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {[c.gender === "female" ? "Nữ" : c.gender === "male" ? "Nam" : null, c.age, c.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold tabular-nums text-zinc-800">
                        {c.cvScore != null ? c.cvScore : "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">{c.cvScoreLabel || c.cvGrade || ""}</p>
                    </td>
                    <td className="px-3 py-3 text-zinc-700">
                      <p>{c.desiredPosition}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{c.industryId}</p>
                    </td>
                    <td className="px-3 py-3 text-zinc-600">
                      <p>{c.phone || "—"}</p>
                      <p className="text-xs">{c.email || "—"}</p>
                    </td>
                    <td className="px-3 py-3 text-zinc-600">
                      <p>{c.education || "—"}</p>
                      <p className="text-xs">
                        {c.experienceYears ? `${c.experienceYears} năm KN` : "—"}
                        {c.experiences?.length ? ` · ${c.experiences.length} vị trí` : ""}
                      </p>
                    </td>
                    <td className="max-w-[16rem] px-4 py-3 text-xs leading-relaxed text-zinc-500 sm:px-5">
                      <p className="line-clamp-3">
                        {c.careerObjective || c.summary || c.skills?.slice(0, 5).join(", ") || "—"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length > 20 ? (
            <p className="border-t border-zinc-100 px-4 py-2 text-xs text-zinc-500 sm:px-5">
              Đang hiện 20 / {preview.length} hồ sơ.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
