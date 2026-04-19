"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressWithPercent } from "@/components/ui/progress-with-percent";
import { SparkleIcon } from "@/components/ui/icons/sparkle";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { formatRendererError } from "@/lib/api/errors";
import { jobService } from "@/lib/api/jobs";
import { useSimulatedProgress } from "@/lib/hooks/use-simulated-progress";
import { wait } from "@/lib/utils";
import { BackgroundPicker } from "@/modules/backgrounds/background-picker";
import { BatchLockedPanel } from "@/modules/jobs/batch-locked-panel";
import { JobModeTabs, type JobMode } from "@/modules/jobs/job-mode-tabs";
import { LicensePlateInput } from "@/modules/jobs/license-plate-input";
import { LogoUploadPanel } from "@/modules/uploads/logo-upload-panel";
import { SingleCarUpload } from "@/modules/uploads/single-car-upload";
import type { BackgroundOption, GenerationJob, StoredImage } from "@/types/carstage";

const PROGRESS_DURATION_MS = 18_000;
const POLL_INTERVAL_MS = 1_500;
const POLL_TIMEOUT_MS = 5 * 60 * 1_000;
const COMPLETION_HOLD_MS = 450;
const TERMINAL_STATUSES: ReadonlyArray<GenerationJob["status"]> = [
  "completed",
  "failed",
];

async function pollUntilTerminal(jobId: string): Promise<GenerationJob> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await wait(POLL_INTERVAL_MS);
    const next = await jobService.getJobById(jobId);
    if (next && TERMINAL_STATUSES.includes(next.status)) {
      return next;
    }
  }
  throw new Error("Timed out waiting for the job to finish.");
}

export default function CreateJobPage() {
  const router = useRouter();
  const [mode, setMode] = useState<JobMode>("single");
  const [title, setTitle] = useState("");
  const [carImage, setCarImage] = useState<StoredImage | undefined>();
  const [selectedBackgroundIds, setSelectedBackgroundIds] = useState<string[]>(
    []
  );
  const [licensePlate, setLicensePlate] = useState("");
  const [logo, setLogo] = useState<StoredImage | undefined>();
  const [backgrounds, setBackgrounds] = useState<BackgroundOption[]>([]);
  const [isLoadingBackgrounds, setIsLoadingBackgrounds] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isMountedRef = useRef(true);

  const progress = useSimulatedProgress({ durationMs: PROGRESS_DURATION_MS });

  useEffect(() => {
    void jobService.listBackgrounds().then((items) => {
      setBackgrounds(items);
      setIsLoadingBackgrounds(false);
    });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const canSubmit = useMemo(() => {
    return Boolean(carImage) && selectedBackgroundIds.length === 1 && !isSubmitting;
  }, [carImage, isSubmitting, selectedBackgroundIds.length]);

  const submitJob = async () => {
    if (!carImage) {
      return;
    }
    setError("");
    setIsSubmitting(true);
    progress.start();
    try {
      const created = await jobService.createJob({
        title,
        carImages: [carImage],
        logo,
        licensePlate: licensePlate || undefined,
        selectedBackgroundIds,
      });

      const final = await pollUntilTerminal(created.id);
      if (!isMountedRef.current) {
        return;
      }

      if (final.status === "failed") {
        progress.reset();
        setError(formatRendererError(final.errorMessage));
        return;
      }

      progress.finish();
      await wait(COMPLETION_HOLD_MS);
      router.push(`/jobs/${created.id}`);
    } catch (submissionError) {
      if (isMountedRef.current) {
        progress.reset();
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Could not submit job."
        );
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative space-y-6">
        <PageHeader />

        <JobModeTabs value={mode} onChange={setMode} />

        {mode === "batch" ? (
          <BatchLockedPanel />
        ) : (
          <SingleImageForm
            title={title}
            onTitleChange={setTitle}
            carImage={carImage}
            onCarImageChange={setCarImage}
            backgrounds={backgrounds}
            isLoadingBackgrounds={isLoadingBackgrounds}
            selectedBackgroundIds={selectedBackgroundIds}
            onBackgroundChange={setSelectedBackgroundIds}
            licensePlate={licensePlate}
            onLicensePlateChange={setLicensePlate}
            logo={logo}
            onLogoChange={setLogo}
            isSubmitting={isSubmitting}
            progressValue={progress.value}
            error={error}
            canSubmit={canSubmit}
            onSubmit={submitJob}
          />
        )}
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
        New stage render
      </p>
      <h1 className="text-2xl font-medium text-white sm:text-3xl">
        Generate a dealer-ready car photo
      </h1>
      <TypewriterText
        text="Pick a stage, upload your car, and render a finished listing in seconds."
        className="text-sm text-slate-300"
        speedMs={22}
        startDelayMs={200}
      />
    </div>
  );
}

interface SingleImageFormProps {
  title: string;
  onTitleChange: (next: string) => void;
  carImage?: StoredImage;
  onCarImageChange: (next?: StoredImage) => void;
  backgrounds: BackgroundOption[];
  isLoadingBackgrounds: boolean;
  selectedBackgroundIds: string[];
  onBackgroundChange: (ids: string[]) => void;
  licensePlate: string;
  onLicensePlateChange: (next: string) => void;
  logo?: StoredImage;
  onLogoChange: (next?: StoredImage) => void;
  isSubmitting: boolean;
  progressValue: number;
  error: string;
  canSubmit: boolean;
  onSubmit: () => void;
}

function SingleImageForm({
  title,
  onTitleChange,
  carImage,
  onCarImageChange,
  backgrounds,
  isLoadingBackgrounds,
  selectedBackgroundIds,
  onBackgroundChange,
  licensePlate,
  onLicensePlateChange,
  logo,
  onLogoChange,
  isSubmitting,
  progressValue,
  error,
  canSubmit,
  onSubmit,
}: SingleImageFormProps) {
  return (
    <div className="space-y-5">
      <FormSection
        step={1}
        title="Job details"
        subtitle="Optional name to help you find this render later."
      >
        <Input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Job title (optional)"
        />
      </FormSection>

      <FormSection
        step={2}
        title="Car photo"
        subtitle="Upload one image of the vehicle you want to stage."
      >
        <SingleCarUpload image={carImage} onChange={onCarImageChange} />
      </FormSection>

      <FormSection
        step={3}
        title="Background"
        subtitle="Pick one stage. Selection highlights in orange."
      >
        {isLoadingBackgrounds ? (
          <p className="text-sm text-slate-400">Loading background library...</p>
        ) : (
          <BackgroundPicker
            backgrounds={backgrounds}
            selectedIds={selectedBackgroundIds}
            onChange={onBackgroundChange}
            mode="single"
          />
        )}
      </FormSection>

      <FormSection
        step={4}
        title="License plate"
        subtitle="Burned onto the rendered plate. Leave blank to keep the original."
        badge="Coming soon"
      >
        <LicensePlateInput
          value={licensePlate}
          onChange={onLicensePlateChange}
        />
        <ComingSoonNote feature="License plate" />
      </FormSection>

      <FormSection
        step={5}
        title="Logo"
        subtitle="Logo on license plate."
        badge="Coming soon"
      >
        <LogoUploadPanel logo={logo} onChange={onLogoChange} />
        <ComingSoonNote feature="Logo" />
      </FormSection>

      <FormSection
        step={6}
        title="Generate"
        subtitle="Costs 1 credit. Render takes about 18 seconds."
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Chip label={carImage ? "Car attached" : "No car attached"} />
          <Chip
            label={
              selectedBackgroundIds.length === 1
                ? "Background selected"
                : "No background selected"
            }
          />
          <Chip label={licensePlate ? `Plate: ${licensePlate}` : "No plate"} />
          <Chip label={logo ? "Logo attached" : "No logo"} />
        </div>

        {isSubmitting && (
          <div className="space-y-2">
            <p className="text-sm text-slate-300">
              Generating professional stage image...
            </p>
            <ProgressWithPercent value={progressValue} />
          </div>
        )}

        {error && <ErrorAlert message={error} />}

        <Button onClick={onSubmit} disabled={!canSubmit} className="gap-2">
          <SparkleIcon size={16} />
          {isSubmitting ? "Generating..." : "Generate"}
        </Button>
      </FormSection>
    </div>
  );
}

interface FormSectionProps {
  step: number;
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
}

function FormSection({ step, title, subtitle, badge, children }: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur sm:p-6">
      <header className="mb-4 flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-xs font-semibold text-cyan-200">
          {step}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-medium text-white">{title}</h2>
            {badge && (
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
    >
      <span aria-hidden className="mt-0.5 select-none">!</span>
      <p className="flex-1 leading-snug">{message}</p>
    </div>
  );
}

function ComingSoonNote({ feature }: { feature: string }) {
  return (
    <p className="rounded-md border border-amber-400/30 bg-amber-400/5 px-3 py-2 text-xs text-amber-200">
      {feature} is saved with the job locally but is not yet sent to the renderer.
    </p>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
      {label}
    </span>
  );
}
