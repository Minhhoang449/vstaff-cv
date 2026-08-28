"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  LocationPickerPanel,
  formatLocationLabel,
  type LocationSelection,
} from "@/components/home/location-picker";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const EMPTY_LOCATION: LocationSelection = {
  province: null,
  areas: [],
  allAreas: false,
};

export function HomeSearchBar({ className }: Props) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<LocationSelection>(EMPTY_LOCATION);
  const [locationOpen, setLocationOpen] = useState(false);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.province) params.set("province", location.province.code);
    if (!location.allAreas && location.areas.length) {
      params.set("areas", location.areas.map((a) => a.code).join(","));
    }
    window.location.href = `/dang-ky?next=${encodeURIComponent(`/dashboard/employer/tim-ung-vien${params.toString() ? `?${params}` : ""}`)}`;
  }

  function clearLocation(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLocation(EMPTY_LOCATION);
  }

  const hasLocation = !!location.province;

  return (
    <form
      onSubmit={onSearch}
      className={cn(
        "mx-auto flex w-full max-w-4xl items-center gap-1 rounded-full bg-white p-1.5 shadow-lg sm:gap-0",
        className
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Vị trí tuyển dụng, tên công ty"
          className="h-12 border-0 bg-transparent pl-5 pr-3 text-[var(--foreground)] shadow-none placeholder:text-zinc-400 focus-visible:ring-0"
          aria-label="Từ khóa tìm kiếm"
        />
      </div>

      <div className="hidden h-8 w-px shrink-0 bg-zinc-200 sm:block" aria-hidden />

      <Popover open={locationOpen} onOpenChange={setLocationOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-12 min-w-0 max-w-[14rem] shrink-0 items-center gap-2 px-3 text-left text-sm sm:min-w-[12rem] sm:px-4",
              hasLocation ? "text-zinc-800" : "text-zinc-500"
            )}
          >
            <MapPin className="h-4 w-4 shrink-0 text-[var(--primary)]" />
            <span className="min-w-0 flex-1 truncate">{formatLocationLabel(location)}</span>
            {hasLocation ? (
              <span
                role="button"
                tabIndex={0}
                aria-label="Xóa địa điểm"
                className="rounded-full p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                onClick={clearLocation}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    clearLocation(e as unknown as React.MouseEvent);
                  }
                }}
              >
                <X className="h-3.5 w-3.5" />
              </span>
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={12}
          className="w-auto max-w-[calc(100vw-1.5rem)] p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <LocationPickerPanel
            value={location}
            onApply={setLocation}
            onClose={() => setLocationOpen(false)}
          />
        </PopoverContent>
      </Popover>

      <Button type="submit" className="h-11 shrink-0 rounded-full px-5 text-sm font-semibold sm:px-6">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Tìm kiếm</span>
      </Button>
    </form>
  );
}
