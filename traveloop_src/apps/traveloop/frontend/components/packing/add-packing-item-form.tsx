"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { addPackingItemAction } from "@/actions/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddPackingItemForm({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [label, setLabel] = useState("Passport holder");
  const [category, setCategory] = useState("Essentials");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4 md:grid-cols-[1fr_180px_110px_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await addPackingItemAction({ tripId, label, category, quantity });
          if (!result.success) {
            setError(result.error ?? "Unable to add packing item.");
            return;
          }
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label>Item</Label>
        <Input value={label} onChange={(event) => setLabel(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Input value={category} onChange={(event) => setCategory(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Qty</Label>
        <Input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add"}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive md:col-span-4">{error}</p> : null}
    </form>
  );
}
