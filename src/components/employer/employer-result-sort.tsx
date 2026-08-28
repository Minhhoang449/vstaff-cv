"use client";

import { useRouter } from "next/navigation";
import { ProDropdown } from "@/components/ui/pro-dropdown";

type Props = {
  current: string;
  filters: Record<string, string | undefined>;
  basePath?: string;
};

const OPTIONS = [
  { value: "relevant", label: "Phù hợp nhất" },
  { value: "cvScore", label: "CV đầy đủ nhất" },
  { value: "updated", label: "Mới cập nhật" },
  { value: "active", label: "Tích cực tìm việc" },
];

export function EmployerResultSort({
  current,
  filters,
  basePath = "/dashboard/employer/tim-ung-vien",
}: Props) {
  const router = useRouter();

  function onChange(sort: string) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v && k !== "sort") params.set(k, v);
    });
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <div className="inline-flex items-center gap-2 text-sm text-zinc-600">
      <span className="shrink-0">Sắp xếp</span>
      <ProDropdown
        className="min-w-[10.5rem]"
        value={current || "relevant"}
        onChange={onChange}
        options={OPTIONS}
        triggerClassName="h-9 shadow-none"
      />
    </div>
  );
}
