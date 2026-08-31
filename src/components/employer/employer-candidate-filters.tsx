"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { PROVINCES, getWards, shortProvinceName } from "@/data/vietnam-locations";
import {
  DESIRED_POSITIONS,
  EDUCATION_LEVELS,
  GENDERS,
  LANGUAGE_FILTER_OPTIONS,
} from "@/lib/candidates-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type EmployerSearchFilterValues = {
  q?: string;
  province?: string;
  ward?: string;
  industry?: string;
  gender?: string;
  language?: string;
  position?: string;
  education?: string;
};

type Props = {
  values: EmployerSearchFilterValues;
  basePath?: string;
};

const selectClass =
  "flex h-10 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-50";

export function EmployerCandidateFilters({
  values,
  basePath = "/dashboard/employer/tim-ung-vien",
}: Props) {
  const router = useRouter();
  const [province, setProvince] = useState(values.province ?? "");
  const [ward, setWard] = useState(values.ward ?? "");

  const wards = useMemo(() => getWards(province), [province]);

  function onProvinceChange(code: string) {
    setProvince(code);
    setWard("");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const key of [
      "q",
      "province",
      "ward",
      "industry",
      "gender",
      "language",
      "position",
      "education",
    ] as const) {
      const v = String(fd.get(key) ?? "").trim();
      if (v) params.set(key, v);
    }
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function onReset() {
    setProvince("");
    setWard("");
    router.push(basePath);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-[var(--border)] bg-white p-4 sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="space-y-2 sm:col-span-2 xl:col-span-2">
          <Label htmlFor="q">Từ khóa</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              id="q"
              name="q"
              defaultValue={values.q ?? ""}
              placeholder="Tên, kỹ năng, mô tả..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Tỉnh / thành phố</Label>
          <select
            id="province"
            name="province"
            className={selectClass}
            value={province}
            onChange={(e) => onProvinceChange(e.target.value)}
          >
            <option value="">Tất cả</option>
            {PROVINCES.map((p) => (
              <option key={p.code} value={p.code}>
                {shortProvinceName(p.name)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ward">Quận / huyện (phường/xã)</Label>
          <select
            id="ward"
            name="ward"
            className={selectClass}
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            disabled={!province}
          >
            <option value="">{province ? "Tất cả" : "Chọn tỉnh trước"}</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Ngành nghề</Label>
          <select
            id="industry"
            name="industry"
            className={selectClass}
            defaultValue={values.industry ?? ""}
          >
            <option value="">Tất cả</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Giới tính</Label>
          <select
            id="gender"
            name="gender"
            className={selectClass}
            defaultValue={values.gender ?? ""}
          >
            {GENDERS.map((g) => (
              <option key={g.id || "all"} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Ngôn ngữ</Label>
          <select
            id="language"
            name="language"
            className={selectClass}
            defaultValue={values.language ?? ""}
          >
            <option value="">Tất cả</option>
            {LANGUAGE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Vị trí ứng tuyển</Label>
          <select
            id="position"
            name="position"
            className={selectClass}
            defaultValue={values.position ?? ""}
          >
            <option value="">Tất cả</option>
            {DESIRED_POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="education">Trình độ học vấn</Label>
          <select
            id="education"
            name="education"
            className={selectClass}
            defaultValue={values.education ?? ""}
          >
            <option value="">Tất cả</option>
            {EDUCATION_LEVELS.map((ed) => (
              <option key={ed} value={ed}>
                {ed}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
        <Button type="submit">Áp dụng bộ lọc</Button>
        <Button type="button" variant="outline" onClick={onReset}>
          Xóa lọc
        </Button>
      </div>
    </form>
  );
}
