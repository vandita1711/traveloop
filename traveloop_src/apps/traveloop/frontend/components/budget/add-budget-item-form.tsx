"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { upsertBudgetItemAction } from "@/actions/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const categories = ["FLIGHTS", "HOTELS", "FOOD", "TRANSPORT", "ACTIVITIES", "SHOPPING", "MISC"] as const;

export function AddBudgetItemForm({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [label, setLabel] = useState("Museum passes");
  const [category, setCategory] = useState<(typeof categories)[number]>("ACTIVITIES");
  const [amount, setAmount] = useState(120);

  return (
    <form
      className="grid gap-4 md:grid-cols-[1fr_180px_140px_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await upsertBudgetItemAction({ tripId, label, category, amount });
          if (!result.success) {
            setError(result.error ?? "Unable to add budget item.");
            return;
          }
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label>Label</Label>
        <Input value={label} onChange={(event) => setLabel(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input type="number" min={0} step={10} value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add item"}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive md:col-span-4">{error}</p> : null}
    </form>
  );
}
