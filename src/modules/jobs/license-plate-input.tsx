"use client";

interface LicensePlateInputProps {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
}

export function LicensePlateInput({
  value,
  onChange,
  maxLength = 8,
}: LicensePlateInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value.toUpperCase().slice(0, maxLength);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
        License plate (optional)
      </p>
      <div className="inline-flex items-center rounded-md border-2 border-slate-800 bg-slate-950 p-1 shadow-[0_2px_0_0_rgba(0,0,0,0.6)]">
        <input
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          spellCheck={false}
          autoCapitalize="characters"
          autoCorrect="off"
          placeholder="ABC 123"
          className="h-10 w-56 rounded-sm bg-slate-950 px-3 text-center font-mono text-2xl font-bold uppercase tracking-[0.35em] text-slate-100 placeholder:font-medium placeholder:tracking-[0.35em] placeholder:text-slate-600 focus-visible:outline-none"
        />
      </div>
      <p className="text-xs text-slate-500">
        Burned into the rendered plate so listings stay consistent.
      </p>
    </div>
  );
}
