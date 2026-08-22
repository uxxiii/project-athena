import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export function Select({
  label,
  error,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm text-cream/70">
          {label}
        </label>
      )}
      <select
        id={selectId}
        suppressHydrationWarning
        className={cn(
          "w-full rounded-sm border border-white/10 bg-navy-light/50 px-4 py-2.5 text-cream outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/30 appearance-none cursor-pointer",
          error && "border-red-400/50",
          className
        )}
        {...props}
      >
        <option value="" className="bg-navy">
          Select...
        </option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className="bg-navy"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
