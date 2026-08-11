import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm text-cream/70">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-sm border border-white/10 bg-navy-light/50 px-4 py-2.5 text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/30",
          error && "border-red-400/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
