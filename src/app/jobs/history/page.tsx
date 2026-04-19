"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobService } from "@/lib/api/jobs";
import type { GenerationJob } from "@/types/carstage";
import { JobCard } from "@/modules/jobs/job-card";

export default function JobHistoryPage() {
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

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Job History</h1>
          <p className="text-sm text-slate-400">
            Revisit all past generations and re-download image outputs.
          </p>
        </div>
        <Link href="/jobs/new">
          <Button>Create Job</Button>
        </Link>
      </Card>

      {isLoading ? (
        <Card>
          <p className="text-sm text-slate-400">Loading history...</p>
        </Card>
      ) : jobs.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {jobs.map((job, index) => (
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
          <p className="text-sm text-slate-400">No saved jobs yet.</p>
        </Card>
      )}
    </div>
  );
}
