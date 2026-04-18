"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobService } from "@/lib/api/jobs";
import type { GenerationJob } from "@/types/carstage";
import { JobCard } from "@/modules/jobs/job-card";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void jobService.listJobs().then((result) => {
      setJobs(result);
      setIsLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      completed: jobs.filter((job) => job.status === "completed").length,
      carsProcessed: jobs.reduce((total, job) => total + job.carImages.length, 0),
    };
  }, [jobs]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="relative h-[420px] w-full">
          <Image
            src="/variation_4.jpg"
            alt="Sports car hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/30" />
          <div className="absolute inset-0 p-8 sm:p-12">
            <div className="max-w-xl space-y-5">
              <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                CarStage AI Studio
              </p>
              <h1 className="text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
                Build showroom-grade car visuals in minutes
              </h1>
              <p className="text-base text-slate-200 sm:text-lg">
                Upload your car image, pick a scene, apply your brand, and get six polished
                stage-ready outputs.
              </p>
              <div className="flex gap-3">
                <Link href="/jobs/new">
                  <Button>Create New Job</Button>
                </Link>
                <Link href="/jobs/history">
                  <Button variant="outline">Open History</Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-6 -bottom-10 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 backdrop-blur sm:inset-x-12 sm:p-5">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
                Select background
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
                Upload car image
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
                Attach logo
              </div>
              <Link href="/jobs/new">
                <Button className="h-full w-full">Generate</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-8" />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
            <p className="text-sm text-slate-400">
              Create automotive stage jobs and revisit all generated galleries.
            </p>
          </div>
          <Link href="/jobs/new">
            <Button>Create New Job</Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Total Jobs
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-100">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Completed
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-100">{stats.completed}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Cars Processed
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-100">{stats.carsProcessed}</p>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Recent jobs</h2>
          <Link href="/jobs/history" className="text-sm font-semibold text-cyan-300">
            View all
          </Link>
        </div>
        {isLoading ? (
          <Card>
            <p className="text-sm text-slate-400">Loading jobs...</p>
          </Card>
        ) : jobs.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {jobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-slate-400">No jobs yet. Start with your first upload.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
