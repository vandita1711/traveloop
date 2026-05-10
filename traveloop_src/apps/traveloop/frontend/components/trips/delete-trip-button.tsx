"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteTripAction } from "@/actions/trips";
import { Button } from "@/components/ui/button";

export function DeleteTripButton({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center text-destructive hover:bg-destructive/5"
        disabled={isPending}
        onClick={() => {
          const confirmed = window.confirm("Delete this trip? This removes its stops, activities, and notes.");
          if (!confirmed) {
            return;
          }

          setError(null);
          startTransition(async () => {
            const result = await deleteTripAction(tripId);
            if (!result.success) {
              setError(result.error ?? "Unable to delete trip.");
              return;
            }
            router.refresh();
          });
        }}
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "Deleting..." : "Delete trip"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
