"use client";

import { cn } from "@/components/ui/cn";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-lg shadow-black/30">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className={cn(
              "rounded-md px-2 py-1 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            )}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
