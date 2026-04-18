"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { jobService } from "@/lib/api/jobs";
import { CarUploadPanel } from "@/modules/uploads/car-upload-panel";
import { BackgroundPicker } from "@/modules/backgrounds/background-picker";
import { LogoUploadPanel } from "@/modules/uploads/logo-upload-panel";
import type { BackgroundOption, StoredImage } from "@/types/carstage";

export default function CreateJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [carImages, setCarImages] = useState<StoredImage[]>([]);
  const [selectedBackgroundIds, setSelectedBackgroundIds] = useState<string[]>([]);
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
    return carImages.length > 0 && selectedBackgroundIds.length > 0 && !isSubmitting;
  }, [carImages.length, isSubmitting, selectedBackgroundIds.length]);

  const submitJob = async () => {
    setError("");
    setProgressValue(8);
    setIsSubmitting(true);
    try {
      const created = await jobService.createJob({
        title,
        carImages,
        logo,
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
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-slate-100">New Generation Job</h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload one or many cars, select backgrounds, attach a logo, and generate 6 variations.
        </p>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Job details</h2>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Job title (optional)"
        />
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">1) Car image upload</h2>
        <CarUploadPanel images={carImages} onChange={setCarImages} />
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">2) Background selection</h2>
        {isLoadingBackgrounds ? (
          <p className="text-sm text-slate-400">Loading background library...</p>
        ) : (
          <BackgroundPicker
            backgrounds={backgrounds}
            selectedIds={selectedBackgroundIds}
            onChange={setSelectedBackgroundIds}
          />
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">3) Logo upload</h2>
        <LogoUploadPanel logo={logo} onChange={setLogo} />
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">4) Submit job</h2>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span>{carImages.length} car images</span>
          <span>{selectedBackgroundIds.length} backgrounds selected</span>
          <span>{logo ? "Logo attached" : "No logo attached"}</span>
        </div>
        {isSubmitting && (
          <div className="space-y-2">
            <p className="text-sm text-slate-300">Generating professional stage images...</p>
            <Progress value={progressValue} />
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button onClick={submitJob} disabled={!canSubmit}>
          {isSubmitting ? "Submitting..." : "Submit Job"}
        </Button>
      </Card>
    </div>
  );
}
