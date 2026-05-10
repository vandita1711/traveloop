"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { createTripAction } from "@/actions/trips";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { tripCoverOptions } from "@/lib/mock/travel-data";
import { createTripSchema, type CreateTripValues } from "@/lib/validations/trip";

export function CreateTripForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateTripValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: "Bali to Dubai Workcation",
      description:
        "A polished two-city trip mixing a remote-work villa week in Bali with a high-energy long weekend in Dubai.",
      coverImage: tripCoverOptions[0]?.value,
      startDate: "2026-08-08",
      endDate: "2026-08-18",
      travelerCount: 2,
      currency: "USD",
      budgetTarget: 4800,
    },
  });

  const selectedCover = watch("coverImage");

  const onSubmit = (values: CreateTripValues) => {
    setServerError(null);

    startTransition(async () => {
      const result = await createTripAction(values);

      if (!result.success || !result.data?.tripId) {
        setServerError(result.error ?? "Unable to create trip.");
        return;
      }

      router.push(`/trips/${result.data.tripId}/itinerary`);
      router.refresh();
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Phase 2
          </div>
          <CardTitle className="text-2xl">Create a new trip</CardTitle>
          <CardDescription>
            Start with the trip frame, then jump straight into the itinerary builder to map cities and activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="title">Trip title</Label>
              <Input id="title" {...register("title")} />
              {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description ? (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              ) : null}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate ? (
                  <p className="text-xs text-destructive">{errors.startDate.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate ? <p className="text-xs text-destructive">{errors.endDate.message}</p> : null}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="travelerCount">Travelers</Label>
                <Input id="travelerCount" type="number" min={1} max={12} {...register("travelerCount")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" maxLength={3} {...register("currency")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetTarget">Budget target</Label>
                <Input id="budgetTarget" type="number" min={0} step={50} {...register("budgetTarget")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover image</Label>
              <Select id="coverImage" {...register("coverImage")}>
                {tripCoverOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

            <Button type="submit" disabled={isPending}>
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Create trip and open itinerary builder
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div
          className="min-h-[320px] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.15), rgba(15,23,42,0.7)), url(${selectedCover})`,
          }}
        >
          <div className="flex h-full flex-col justify-end p-6 text-white">
            <p className="text-sm text-white/75">Live preview</p>
            <h3 className="mt-2 font-heading text-3xl font-semibold">
              Your trip card will look polished from the first save.
            </h3>
            <p className="mt-3 max-w-md text-sm text-white/80">
              This cover image carries through to the dashboard, my trips library, and itinerary pages for a clean demo flow.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
