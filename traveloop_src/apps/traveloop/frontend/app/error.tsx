"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="auth-surface flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-[28px] border border-white/60 bg-white/90 p-8 text-center shadow-card">
          <p className="text-sm font-medium text-primary">Traveloop hit turbulence</p>
          <h2 className="mt-3 font-heading text-2xl font-semibold text-slate-950">
            Something went wrong while loading your workspace.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            The app is still wired for hackathon speed, so a refresh usually gets us back on track.
          </p>
          <Button onClick={reset} className="mt-6">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
