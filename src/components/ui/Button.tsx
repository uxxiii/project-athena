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
    "inline-flex items-center justify-center gap-2 font-bold tracking-wider uppercase transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
    {
      "bg-gold text-[#0b0714] border-2 border-black hover:bg-[#e5c158] shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#000000]":
        variant === "primary",
      "bg-purple-dark text-cream border-2 border-white/20 hover:border-gold hover:text-gold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#000000]":
        variant === "secondary",
      "bg-transparent text-cream border-2 border-white/30 hover:border-white hover:bg-white/5 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5":
        variant === "outline",
      "text-cream/80 hover:text-cream hover:bg-white/10 border-2 border-transparent hover:border-white/20":
        variant === "ghost",
      "px-4 py-2 text-xs": size === "sm",
      "px-6 py-2.5 text-xs sm:text-sm": size === "md",
      "px-8 py-3.5 text-sm sm:text-base": size === "lg",
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
    <button className={classes} suppressHydrationWarning {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
