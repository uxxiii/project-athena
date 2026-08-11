import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gold/15 text-gold border border-gold/30": variant === "default",
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30":
            variant === "success",
          "bg-amber-500/15 text-amber-400 border border-amber-500/30":
            variant === "warning",
          "bg-red-500/15 text-red-400 border border-red-500/30":
            variant === "danger",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
