"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  /** id cho accessibility */
  id?: string;
};

/** Dropdown custom — menu panel styled, không dùng native select. */
export function ProDropdown({
  value,
  onChange,
  options,
  placeholder = "Chọn",
  disabled,
  className,
  triggerClassName,
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const display = selected?.label || placeholder;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-left text-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition",
          "hover:border-zinc-300 hover:bg-zinc-50/80",
          "focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20",
          open && "border-[var(--primary)] ring-2 ring-[var(--primary)]/20",
          disabled && "cursor-not-allowed bg-zinc-100 text-zinc-400 opacity-70",
          !selected && "text-zinc-400",
          selected && "text-zinc-800",
          triggerClassName
        )}
      >
        <span className="min-w-0 flex-1 truncate">{display}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-400 transition duration-200",
            open && "rotate-180 text-[var(--primary)]"
          )}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-lg border border-zinc-200/90 bg-white py-1.5 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.28)]"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value || "__empty"} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition",
                    active
                      ? "bg-[var(--primary)] font-medium text-[var(--primary-foreground)]"
                      : "text-zinc-700 hover:bg-zinc-50"
                  )}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                  {active ? <Check className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
