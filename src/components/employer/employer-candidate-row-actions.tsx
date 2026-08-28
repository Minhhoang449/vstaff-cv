"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bookmark,
  BookmarkX,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CandidateProfile } from "@/lib/candidates-shared";

type Mode = "saved" | "opened" | "list";

type Props = {
  candidate: CandidateProfile;
  mode: Mode;
  /** Bỏ lưu / gỡ khỏi danh sách (nếu có) */
  onRemove?: () => void | Promise<void>;
  removing?: boolean;
};

async function copyText(text: string) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* ignore */
  }
}

export function EmployerCandidateRowActions({
  candidate,
  mode,
  onRemove,
  removing,
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const detailHref = `/dashboard/employer/ung-vien/${candidate.slug}`;

  async function toggleSave(save: boolean) {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(
        save
          ? "/api/employer/saved"
          : `/api/employer/saved?candidateId=${encodeURIComponent(candidate.id)}`,
        save
          ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug: candidate.slug }),
            }
          : { method: "DELETE" }
      );
      if (res.ok) router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex shrink-0 items-center justify-end gap-1.5 whitespace-nowrap">
      <Link
        href={detailHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-lg border border-[var(--primary)] px-2.5 text-xs font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/5"
      >
        Xem&nbsp;CV
      </Link>

      {mode === "saved" && onRemove ? (
        <button
          type="button"
          disabled={removing}
          onClick={() => void onRemove()}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-800 disabled:opacity-50"
          title="Bỏ lưu"
          aria-label={`Bỏ lưu ${candidate.fullName}`}
        >
          {removing ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <BookmarkX className="h-4 w-4" aria-hidden />
          )}
        </button>
      ) : null}

      {mode === "list" && onRemove ? (
        <button
          type="button"
          disabled={removing}
          onClick={() => void onRemove()}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-800 disabled:opacity-50"
          title="Gỡ khỏi lệnh lọc"
          aria-label={`Gỡ ${candidate.fullName}`}
        >
          {removing ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden />
          )}
        </button>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-800"
            aria-label={`Thêm thao tác: ${candidate.fullName}`}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[12rem]">
          <DropdownMenuItem asChild>
            <a href={detailHref} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4 text-zinc-500" aria-hidden />
              Mở tab mới
            </a>
          </DropdownMenuItem>
          {candidate.phone ? (
            <DropdownMenuItem onSelect={() => void copyText(candidate.phone)}>
              <Phone className="mr-2 h-4 w-4 text-zinc-500" aria-hidden />
              Sao chép SĐT
            </DropdownMenuItem>
          ) : null}
          {candidate.email ? (
            <DropdownMenuItem onSelect={() => void copyText(candidate.email)}>
              <Copy className="mr-2 h-4 w-4 text-zinc-500" aria-hidden />
              Sao chép email
            </DropdownMenuItem>
          ) : null}
          {candidate.email ? (
            <DropdownMenuItem asChild>
              <a href={`mailto:${candidate.email}`}>
                <Mail className="mr-2 h-4 w-4 text-zinc-500" aria-hidden />
                Gửi email
              </a>
            </DropdownMenuItem>
          ) : null}
          {candidate.phone ? (
            <DropdownMenuItem asChild>
              <a href={`tel:${candidate.phone}`}>
                <Phone className="mr-2 h-4 w-4 text-zinc-500" aria-hidden />
                Gọi điện
              </a>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />

          {mode === "saved" ? (
            <DropdownMenuItem
              className="text-red-700 focus:bg-red-50 focus:text-red-800"
              disabled={removing || saving}
              onSelect={() => {
                if (onRemove) void onRemove();
                else void toggleSave(false);
              }}
            >
              <BookmarkX className="mr-2 h-4 w-4" aria-hidden />
              Bỏ lưu hồ sơ
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled={saving} onSelect={() => void toggleSave(true)}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Bookmark className="mr-2 h-4 w-4 text-zinc-500" aria-hidden />
              )}
              Lưu hồ sơ
            </DropdownMenuItem>
          )}

          {mode === "list" && onRemove ? (
            <DropdownMenuItem
              className="text-red-700 focus:bg-red-50 focus:text-red-800"
              disabled={removing}
              onSelect={() => void onRemove()}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden />
              Gỡ khỏi lệnh lọc
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
