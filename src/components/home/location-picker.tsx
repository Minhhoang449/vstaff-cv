"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Search } from "lucide-react";
import {
  ADMIN_META,
  PROVINCES,
  getWards,
  shortProvinceName,
  type District,
  type Province,
} from "@/data/vietnam-locations";
import { cn } from "@/lib/utils";

export type LocationSelection = {
  province: Province | null;
  /** Rỗng = toàn tỉnh; có mã = các phường/xã đã chọn */
  areas: District[];
  allAreas: boolean;
};

type Props = {
  value: LocationSelection;
  onApply: (next: LocationSelection) => void;
  onClose?: () => void;
};

function filterByQuery<T extends { name: string }>(items: T[], q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) => item.name.toLowerCase().includes(needle));
}

export function LocationPickerPanel({ value, onApply, onClose }: Props) {
  const [province, setProvince] = useState<Province | null>(value.province);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(
    () => new Set(value.areas.map((a) => a.code))
  );
  const [allAreas, setAllAreas] = useState(value.allAreas || (!value.areas.length && !!value.province));
  const [provinceQuery, setProvinceQuery] = useState("");
  const [areaQuery, setAreaQuery] = useState("");

  useEffect(() => {
    setProvince(value.province);
    setSelectedCodes(new Set(value.areas.map((a) => a.code)));
    setAllAreas(value.allAreas || (!value.areas.length && !!value.province));
  }, [value]);

  const areas = useMemo(() => getWards(province?.code), [province?.code]);

  const filteredProvinces = useMemo(
    () => filterByQuery(PROVINCES, provinceQuery),
    [provinceQuery]
  );
  const filteredAreas = useMemo(() => filterByQuery(areas, areaQuery), [areas, areaQuery]);

  function selectProvince(next: Province) {
    setProvince(next);
    setAllAreas(true);
    setSelectedCodes(new Set());
    setAreaQuery("");
  }

  function toggleAllAreas() {
    if (allAreas) {
      setAllAreas(false);
      setSelectedCodes(new Set());
    } else {
      setAllAreas(true);
      setSelectedCodes(new Set());
    }
  }

  function toggleArea(area: District) {
    setAllAreas(false);
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(area.code)) next.delete(area.code);
      else next.add(area.code);
      return next;
    });
  }

  function clearAll() {
    setProvince(null);
    setSelectedCodes(new Set());
    setAllAreas(false);
    setProvinceQuery("");
    setAreaQuery("");
  }

  function apply() {
    const selectedAreas =
      !province || allAreas ? [] : areas.filter((a) => selectedCodes.has(a.code));

    onApply({
      province,
      areas: selectedAreas,
      allAreas: !!province && (allAreas || selectedAreas.length === 0),
    });
    onClose?.();
  }

  return (
    <div className="flex w-[min(92vw,40rem)] flex-col overflow-hidden">
      <div className="border-b border-zinc-100 px-4 py-3">
        <p className="text-sm font-medium text-[var(--foreground)]">
          Tỉnh / thành &amp; phường/xã (sau 1/7/2025)
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          {ADMIN_META.provinceCount} tỉnh/thành ·{" "}
          {province ? `${areas.length} phường/xã tại ${shortProvinceName(province.name)}` : `${ADMIN_META.wardCount.toLocaleString("vi-VN")} phường/xã`}{" "}
          — không còn cấp quận/huyện
        </p>
      </div>

      <div className="grid min-h-[18rem] sm:grid-cols-2">
        <div className="flex flex-col border-b border-zinc-100 sm:border-b-0 sm:border-r">
          <div className="relative border-b border-zinc-100 p-2.5">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={provinceQuery}
              onChange={(e) => setProvinceQuery(e.target.value)}
              placeholder="Nhập Tỉnh/Thành phố"
              className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none focus:border-[var(--primary)] focus:bg-white"
            />
          </div>
          <ul className="max-h-64 flex-1 overflow-y-auto p-1.5">
            {filteredProvinces.map((p) => {
              const active = province?.code === p.code;
              return (
                <li key={p.code}>
                  <button
                    type="button"
                    onClick={() => selectProvince(p)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-sm transition",
                      active
                        ? "bg-[var(--secondary)] font-medium text-[var(--primary)]"
                        : "hover:bg-zinc-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        active
                          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "border-zinc-300"
                      )}
                    >
                      {active && <Check className="h-3 w-3" />}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {shortProvinceName(p.name)}
                      {active && allAreas ? " Tất cả" : ""}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col">
          <div className="relative border-b border-zinc-100 p-2.5">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={areaQuery}
              onChange={(e) => setAreaQuery(e.target.value)}
              placeholder="Nhập Phường/Xã"
              disabled={!province}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none focus:border-[var(--primary)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {!province ? (
            <p className="px-4 py-8 text-center text-sm text-zinc-400">
              Chọn tỉnh/thành phố bên trái
            </p>
          ) : (
            <ul className="max-h-64 flex-1 overflow-y-auto p-1.5">
              <li>
                <button
                  type="button"
                  onClick={toggleAllAreas}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-sm transition",
                    allAreas
                      ? "bg-[var(--secondary)] font-medium text-[var(--primary)]"
                      : "hover:bg-zinc-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      allAreas
                        ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "border-zinc-300"
                    )}
                  >
                    {allAreas && <Check className="h-3 w-3" />}
                  </span>
                  Tất cả
                </button>
              </li>
              {filteredAreas.map((area) => {
                const checked = !allAreas && selectedCodes.has(area.code);
                return (
                  <li key={area.code}>
                    <button
                      type="button"
                      onClick={() => toggleArea(area)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-sm transition",
                        checked
                          ? "bg-[var(--secondary)] font-medium text-[var(--primary)]"
                          : "hover:bg-zinc-50"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          checked
                            ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                            : "border-zinc-300"
                        )}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </span>
                      <span className="truncate">{area.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3">
        <button
          type="button"
          onClick={clearAll}
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Bỏ chọn tất cả
        </button>
        <button
          type="button"
          onClick={apply}
          className="inline-flex h-10 items-center rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
}

export function formatLocationLabel(selection: LocationSelection) {
  if (!selection.province) return "Địa điểm";
  const name = shortProvinceName(selection.province.name);
  if (selection.allAreas || selection.areas.length === 0) return name;
  if (selection.areas.length === 1) return `${name} · ${selection.areas[0].name}`;
  return `${name} · ${selection.areas.length} khu vực`;
}
