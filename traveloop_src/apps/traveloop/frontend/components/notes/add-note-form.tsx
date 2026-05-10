"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { addNoteAction } from "@/actions/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function AddNoteForm({
  trips,
}: {
  trips: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [tripId, setTripId] = useState(trips[0]?.id ?? "");
  const [title, setTitle] = useState("Arrival plan");
  const [content, setContent] = useState("Confirm hotel check-in timing, transit passes, and the first dinner reservation.");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await addNoteAction({ tripId, title, content });
          if (!result.success) {
            setError(result.error ?? "Unable to add note.");
            return;
          }
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label>Trip</Label>
        <Select value={tripId} onChange={(event) => setTripId(event.target.value)}>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.title}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Entry</Label>
        <Textarea value={content} onChange={(event) => setContent(event.target.value)} />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Add journal entry"}
      </Button>
    </form>
  );
}
