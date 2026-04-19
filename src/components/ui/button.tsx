import { cn } from "@/components/ui/cn";

type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "accentOutline"
  | "accentSolid";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-orange-400/70 bg-orange-500 text-slate-950 shadow-[0_0_0_1px_rgba(34,211,238,0.25)] hover:bg-orange-400 focus-visible:ring-cyan-300",
  outline:
    "border border-cyan-300/45 bg-slate-900 text-cyan-100 hover:bg-cyan-400/10 focus-visible:ring-cyan-300",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-800/70 focus-visible:ring-cyan-300",
  accentOutline:
    "border border-orange-500 bg-transparent text-orange-400 hover:bg-orange-500 hover:text-slate-950 active:bg-orange-700 active:text-white focus-visible:ring-orange-300",
  accentSolid:
    "border border-orange-500 bg-orange-500 text-slate-950 hover:bg-orange-400 active:bg-orange-700 active:text-white focus-visible:ring-orange-300",
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        className
      )}
      type={type}
      {...props}
    />
  );
}
