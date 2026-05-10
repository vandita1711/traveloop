"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { moveStopAction } from "@/actions/trips";
import { Button } from "@/components/ui/button";

export function StopMoveButtons({
  tripId,
  stopId,
  canMoveUp,
  canMoveDown,
}: {
  tripId: string;
  stopId: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleMove = (direction: "up" | "down") => {
    setError(null);
    startTransition(async () => {
      const result = await moveStopAction({ tripId, stopId, direction });
      if (!result.success) {
        setError(result.error ?? "Unable to move stop.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={!canMoveUp || isPending}
          onClick={() => handleMove("up")}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={!canMoveDown || isPending}
          onClick={() => handleMove("down")}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
