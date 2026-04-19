"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SparkleIcon } from "@/components/ui/icons/sparkle";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { jobService } from "@/lib/api/jobs";
import { BackgroundPicker } from "@/modules/backgrounds/background-picker";
import { BatchLockedPanel } from "@/modules/jobs/batch-locked-panel";
import { JobModeTabs, type JobMode } from "@/modules/jobs/job-mode-tabs";
import { LicensePlateInput } from "@/modules/jobs/license-plate-input";
import { LogoUploadPanel } from "@/modules/uploads/logo-upload-panel";
import { SingleCarUpload } from "@/modules/uploads/single-car-upload";
import type { BackgroundOption, StoredImage } from "@/types/carstage";

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
  const [progressValue, setProgressValue] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    void jobService.listBackgrounds().then((items) => {
      setBackgrounds(items);
      setIsLoadingBackgrounds(false);
    });
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }
    const interval = window.setInterval(() => {
      setProgressValue((current) => Math.min(current + 12, 92));
    }, 240);
    return () => window.clearInterval(interval);
  }, [isSubmitting]);

  const canSubmit = useMemo(() => {
    return Boolean(carImage) && selectedBackgroundIds.length === 1 && !isSubmitting;
  }, [carImage, isSubmitting, selectedBackgroundIds.length]);

  const submitJob = async () => {
    if (!carImage) {
      return;
    }
    setError("");
    setProgressValue(8);
    setIsSubmitting(true);
    try {
      const created = await jobService.createJob({
        title,
        carImages: [carImage],
        logo,
        licensePlate: licensePlate || undefined,
        selectedBackgroundIds,
      });
      setProgressValue(100);
      router.push(`/jobs/${created.id}`);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Could not submit job."
      );
    } finally {
      setIsSubmitting(false);
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
            progressValue={progressValue}
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
      >
        <LicensePlateInput
          value={licensePlate}
          onChange={onLicensePlateChange}
        />
      </FormSection>

      <FormSection
        step={5}
        title="Logo"
        subtitle="Logo on license plate."
      >
        <LogoUploadPanel logo={logo} onChange={onLogoChange} />
      </FormSection>

      <FormSection
        step={6}
        title="Generate"
        subtitle="Costs 1 credit. Render takes about 12 seconds."
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
            <Progress value={progressValue} />
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

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
  children: React.ReactNode;
}

function FormSection({ step, title, subtitle, children }: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur sm:p-6">
      <header className="mb-4 flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-xs font-semibold text-cyan-200">
          {step}
        </span>
        <div>
          <h2 className="text-base font-medium text-white">{title}</h2>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
      {label}
    </span>
  );
}
