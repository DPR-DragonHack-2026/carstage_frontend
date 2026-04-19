"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { TrashIcon } from "@/components/ui/icons/trash";
import { Modal } from "@/components/ui/modal";
import { jobService, ShowroomApiError } from "@/lib/api/jobs";

type ButtonVariant = "ghost" | "outline";
type Appearance = "label" | "icon";

interface DeleteJobButtonProps {
  jobId: string;
  jobTitle: string;
  /** Disable the trigger when the job is mid-render. */
  disabled?: boolean;
  /** Tooltip / help copy shown on the trigger when disabled. */
  disabledHint?: string;
  /** "label" renders a normal text Button; "icon" renders just a trash glyph. */
  appearance?: Appearance;
  variant?: ButtonVariant;
  className?: string;
  onDeleted?: (jobId: string) => void;
}

const ICON_TRIGGER_CLASSES =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md " +
  "border border-white/10 bg-slate-900/60 text-slate-400 transition-all " +
  "duration-150 ease-out hover:border-red-500/70 hover:bg-red-500/15 " +
  "hover:text-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

export function DeleteJobButton({
  jobId,
  jobTitle,
  disabled = false,
  disabledHint,
  appearance = "label",
  variant = "ghost",
  className,
  onDeleted,
}: DeleteJobButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const openModal = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) {
      return;
    }
    setError("");
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isDeleting) {
      return;
    }
    setIsOpen(false);
    setError("");
  };

  const confirmDelete = async () => {
    setError("");
    setIsDeleting(true);
    try {
      await jobService.deleteJob(jobId);
      setIsOpen(false);
      onDeleted?.(jobId);
    } catch (deleteError) {
      if (
        deleteError instanceof ShowroomApiError ||
        deleteError instanceof Error
      ) {
        setError(deleteError.message);
      } else {
        setError("Could not delete job.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {appearance === "icon" ? (
        <button
          type="button"
          onClick={openModal}
          disabled={disabled}
          aria-label={`Delete ${jobTitle}`}
          title={disabled ? disabledHint : "Delete job"}
          className={cn(ICON_TRIGGER_CLASSES, className)}
        >
          <TrashIcon size={16} />
        </button>
      ) : (
        <Button
          variant={variant}
          className={className}
          disabled={disabled}
          title={disabled ? disabledHint : undefined}
          onClick={openModal}
        >
          Delete
        </Button>
      )}

      <Modal open={isOpen} title="Delete this job?" onClose={closeModal}>
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-slate-100">{jobTitle}</span> will
            be removed from the renderer and from this device. The generated
            image will no longer be downloadable.
          </p>

          {error && (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={closeModal} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="accentSolid"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete job"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
