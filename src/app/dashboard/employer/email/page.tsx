import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import { EmployerEmailComposeButton } from "@/components/employer/employer-email-compose-button";
import {
  EmployerEmailTable,
  type EmailCampaignRow,
} from "@/components/employer/employer-email-table";
import { EmployerEmailToolbar } from "@/components/employer/employer-email-toolbar";
import { Pagination } from "@/components/pagination";
import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PAGE_SIZE } from "@/lib/candidates-shared";
import { auth } from "@/auth";
import { getCampaignsForEmployer, toPublicCampaign } from "@/lib/email/campaigns";
import { getMailPublicStatus } from "@/lib/email/config";

export const metadata: Metadata = {
  title: "Email tự động",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  page?: string;
  q?: string;
  status?: string;
  audience?: string;
}>;

function mapStatus(status: string): EmailCampaignRow["status"] {
  if (status === "sent" || status === "partial" || status === "failed" || status === "draft") {
    return status;
  }
  return "failed";
}

export default async function EmployerAutoEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const filters = {
    q: sp.q,
    status: sp.status,
    audience: sp.audience,
  };

  const smtp = getMailPublicStatus();
  const employerId = session?.user?.id ?? "";
  const stored = employerId
    ? (await getCampaignsForEmployer(employerId).catch(() => [])).map(toPublicCampaign)
    : [];

  let items: EmailCampaignRow[] = stored.map((c) => ({
    id: c.id,
    subject: c.testMode ? `[Thử] ${c.subject}` : c.subject,
    fromName: c.fromName,
    audience: c.audience,
    status: mapStatus(c.status),
    recipientCount: c.recipientCount,
    sentAt: c.sentAt,
    testMode: c.testMode,
    previewUrls: c.previewUrls,
  }));

  const q = filters.q?.trim().toLowerCase() ?? "";
  if (q) items = items.filter((r) => r.subject.toLowerCase().includes(q));
  if (filters.status) items = items.filter((r) => r.status === filters.status);
  if (filters.audience) {
    items = items.filter((r) => r.audience === filters.audience);
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <EmployerPageShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Tự động hóa
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
              Email tự động
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Soạn và gửi email đồng loạt tới ứng viên đã mở — theo dõi lịch sử và trạng thái gửi tại
              đây.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-zinc-500">
              <span className="font-semibold tabular-nums text-[var(--primary)]">
                {total.toLocaleString("vi-VN")}
              </span>{" "}
              chiến dịch
              {totalPages > 1 ? (
                <span className="text-zinc-400">
                  {" "}
                  · trang {safePage}/{totalPages}
                </span>
              ) : null}
            </p>
            <EmployerEmailComposeButton initialSmtp={smtp} />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)]">
          <EmployerEmailToolbar values={filters} total={total} items={items} />
          <EmployerEmailTable items={pageItems} />
          <div className="border-t border-zinc-100 px-2">
            <Pagination
              page={safePage}
              totalPages={totalPages}
              basePath="/dashboard/employer/email"
              query={filters}
            />
          </div>
          <div className="flex items-start gap-2 border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 sm:px-5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
            <p>
              {smtp.configured ? (
                <>
                  Email gửi từ địa chỉ nền tảng
                  {smtp.from ? (
                    <>
                      {" "}
                      (<span className="font-mono text-zinc-600">{smtp.from}</span>)
                    </>
                  ) : null}
                  . Dùng menu <span className="font-medium text-zinc-600">⋯</span> để xem nội dung
                  hoặc xóa chiến dịch.
                </>
              ) : (
                <>
                  Hệ thống chưa sẵn sàng gửi email. Liên hệ quản trị viên Vstaff để kích hoạt.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </EmployerPageShell>
  );
}
