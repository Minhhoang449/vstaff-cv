import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"select"> & {
  wrapperClassName?: string;
};

/** Select với mũi tên custom, ẩn arrow mặc định của trình duyệt. */
export function ProSelect({ className, wrapperClassName, children, ...props }: Props) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <select
        {...props}
        className={cn(
          "h-10 w-full appearance-none rounded-md border border-zinc-200/90 bg-zinc-50/80 py-2 pl-3 pr-9 text-sm text-zinc-800 outline-none transition",
          "hover:border-zinc-300 hover:bg-white",
          "focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/15",
          "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-55",
          className
        )}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        strokeWidth={1.75}
        aria-hidden
      />
    </div>
  );
}
