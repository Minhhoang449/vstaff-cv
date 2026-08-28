"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, ExternalLink, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
type Row = {
  id: string;
  subject: string;
  fromName: string;
  recipientCount: number;
  previewUrls?: string[];
};

type Props = {
  row: Row;
};

export function EmployerEmailRowActions({ row }: Props) {
  const router = useRouter();
  const [detailOpen, setDetailOpen] = useState(false);
  const [body, setBody] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openDetail() {
    setDetailOpen(true);
    setError(null);
    if (body != null) return;
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/emails/campaigns/${row.id}`);
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        campaign?: { body?: string };
      } | null;
      if (!res.ok) {
        setError(data?.error || "Không tải được chi tiết.");
        return;
      }
      setBody(data?.campaign?.body ?? "");
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function copySubject() {
    try {
      await navigator.clipboard.writeText(row.subject);
    } catch {
      /* ignore */
    }
  }

  async function remove() {
    if (deleting) return;
    const ok = window.confirm(`Xóa chiến dịch «${row.subject}»?`);
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/emails/campaigns/${row.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        window.alert(data?.error || "Không xóa được.");
        return;
      }
      router.refresh();
    } catch {
      window.alert("Không kết nối được máy chủ.");
    } finally {
      setDeleting(false);
    }
  }

  const previewUrl = row.previewUrls?.[0];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-800"
            aria-label={`Thao tác: ${row.subject}`}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => void openDetail()}>
            <Eye className="mr-2 h-4 w-4 text-zinc-500" aria-hidden />
            Xem nội dung
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void copySubject()}>
            <Copy className="mr-2 h-4 w-4 text-zinc-500" aria-hidden />
            Sao chép tiêu đề
          </DropdownMenuItem>
          {previewUrl ? (
            <DropdownMenuItem asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4 text-zinc-500" aria-hidden />
                Xem bản gửi
              </a>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            className="text-red-700 focus:bg-red-50 focus:text-red-800"
            disabled={deleting}
            onSelect={() => void remove()}
          >
            <Trash2 className="mr-2 h-4 w-4" aria-hidden />
            Xóa chiến dịch
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent size="lg" className="max-h-[min(85vh,40rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{row.subject}</DialogTitle>
            <DialogDescription>
              Từ: {row.fromName || "—"} · {row.recipientCount.toLocaleString("vi-VN")} người nhận
            </DialogDescription>
          </DialogHeader>
          {loadingDetail ? (
            <p className="text-sm text-zinc-500">Đang tải…</p>
          ) : error ? (
            <p className="text-sm text-red-700">{error}</p>
          ) : (
            <pre className="whitespace-pre-wrap rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 font-sans text-sm leading-relaxed text-zinc-800">
              {body || "—"}
            </pre>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
