import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-slate-100">Signup coming soon</h1>
        <p className="text-sm text-slate-400">
          Account onboarding will be enabled once backend auth is finalized.
        </p>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/jobs/new">
            <Button>Try Generator</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
