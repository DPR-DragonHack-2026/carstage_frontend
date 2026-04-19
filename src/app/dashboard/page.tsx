"use client";

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

  const handleDeleted = (jobId: string) => {
    setJobs((current) => current.filter((job) => job.id !== jobId));
  };

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      completed: jobs.filter((job) => job.status === "completed").length,
      carsProcessed: jobs.reduce((total, job) => total + job.carImages.length, 0),
    };
  }, [jobs]);

  return (
    <div className="space-y-6">
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
            {jobs.slice(0, 4).map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                onDeleted={handleDeleted}
                priorityFirstImage={index === 0}
              />
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
