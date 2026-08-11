import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SharedButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
      "bg-gold text-navy hover:bg-gold-light shadow-lg shadow-gold/20":
        variant === "primary",
      "bg-navy-light text-cream border border-gold/30 hover:border-gold/60":
        variant === "secondary",
      "border border-gold/40 text-gold hover:bg-gold/10": variant === "outline",
      "text-cream/80 hover:text-gold hover:bg-white/5": variant === "ghost",
      "px-4 py-2 text-sm": size === "sm",
      "px-6 py-2.5 text-sm": size === "md",
      "px-8 py-3 text-base": size === "lg",
    },
    className
  );

  if (href) {
    return (
      <a className={classes} href={href} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
