"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleTripSharingAction } from "@/actions/trips";
import { Button } from "@/components/ui/button";

export function ShareTripButton({
  tripId,
  isPublic,
}: {
  tripId: string;
  isPublic: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <Button
        variant={isPublic ? "secondary" : "default"}
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await toggleTripSharingAction(tripId);
            if (!result.success) {
              setError(result.error ?? "Unable to update sharing.");
              return;
            }
            router.refresh();
          });
        }}
      >
        {isPending ? "Updating..." : isPublic ? "Disable public sharing" : "Publish trip"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
