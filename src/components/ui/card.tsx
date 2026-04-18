import { cn } from "@/components/ui/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm shadow-black/20",
        className
      )}
      {...props}
    />
  );
}
