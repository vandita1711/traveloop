"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { addActivityAction } from "@/actions/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { activityTypeOptions } from "@/lib/mock/travel-data";
import { addActivitySchema, type AddActivityValues } from "@/lib/validations/trip";

export function AddActivityForm({
  tripId,
  stopId,
  cityName,
}: {
  tripId: string;
  stopId: string;
  cityName: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddActivityValues>({
    resolver: zodResolver(addActivitySchema),
    defaultValues: {
      tripId,
      stopId,
      title: "",
      description: "",
      type: "SIGHTSEEING",
      location: cityName,
      durationMins: 90,
      estimatedCost: 40,
    },
  });

  const onSubmit = (values: AddActivityValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await addActivityAction(values);
      if (!result.success) {
        setServerError(result.error ?? "Unable to add activity.");
        return;
      }
      reset({
        ...values,
        title: "",
        description: "",
      });
      router.refresh();
    });
  };

  return (
    <form className="space-y-4 rounded-[24px] bg-white p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2">
          <Label htmlFor={`title-${stopId}`}>Activity title</Label>
          <Input id={`title-${stopId}`} {...register("title")} placeholder="Sunset food walk" />
          {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`type-${stopId}`}>Type</Label>
          <Select id={`type-${stopId}`} {...register("type")}>
            {activityTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${stopId}`}>Description</Label>
        <Textarea id={`description-${stopId}`} {...register("description")} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={`location-${stopId}`}>Location</Label>
          <Input id={`location-${stopId}`} {...register("location")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`duration-${stopId}`}>Duration (mins)</Label>
          <Input id={`duration-${stopId}`} type="number" min={15} step={15} {...register("durationMins")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`cost-${stopId}`}>Estimated cost</Label>
          <Input id={`cost-${stopId}`} type="number" min={0} step={5} {...register("estimatedCost")} />
        </div>
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Add activity
      </Button>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock3 className="h-3.5 w-3.5" />
        Activities appear in the timeline immediately after refresh.
      </p>
    </form>
  );
}
