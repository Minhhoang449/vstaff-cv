import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminCandidateUploadForm } from "@/components/admin/admin-candidate-upload-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload ứng viên",
  robots: { index: false, follow: false },
};

export default function AdminUploadCandidatesPage() {
  return (
    <AdminPageShell>
      <div className="space-y-6">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Quản lý
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Upload ứng viên
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Dán link ảnh CV (Timviec365…) hoặc upload PNG/JPG/PDF/DOC/DOCX/ZIP — hệ thống tự tải từ
            link (nếu có), trích xuất hồ sơ và import. Không cần tải về máy rồi upload lại.
          </p>
        </div>

        <AdminCandidateUploadForm />
      </div>
    </AdminPageShell>
  );
}
