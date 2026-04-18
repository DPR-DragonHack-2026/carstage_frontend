interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div
      className={
        isCenter
          ? "mx-auto max-w-2xl space-y-3 text-center"
          : "max-w-2xl space-y-3"
      }
    >
      {eyebrow && (
        <p
          className={
            "inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-200"
          }
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-medium uppercase leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="text-base text-slate-300">{subtitle}</p>}
    </div>
  );
}
