"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { addStopAction } from "@/actions/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cityCatalog } from "@/lib/mock/travel-data";
import { addStopSchema, type AddStopValues } from "@/lib/validations/trip";

export function AddStopForm({
  tripId,
  startDate,
  endDate,
}: {
  tripId: string;
  startDate: string;
  endDate: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddStopValues>({
    resolver: zodResolver(addStopSchema),
    defaultValues: {
      tripId,
      cityName: "Bali",
      country: "Indonesia",
      arrivalDate: startDate,
      departureDate: endDate,
      summary: "A balanced stop with a clear mix of logistics, anchor activities, and downtime.",
      coverImage: "",
    },
  });

  const onSubmit = (values: AddStopValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await addStopAction(values);
      if (!result.success) {
        setServerError(result.error ?? "Unable to add stop.");
        return;
      }
      reset({
        ...values,
        cityName: "",
        country: "",
        summary: "",
      });
      router.refresh();
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cityName">City</Label>
          <Input id="cityName" list="city-suggestions" {...register("cityName")} />
          <datalist id="city-suggestions">
            {cityCatalog.map((city) => (
              <option key={city.cityName} value={city.cityName} />
            ))}
          </datalist>
          {errors.cityName ? <p className="text-xs text-destructive">{errors.cityName.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register("country")} />
          {errors.country ? <p className="text-xs text-destructive">{errors.country.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="arrivalDate">Arrival</Label>
          <Input id="arrivalDate" type="date" {...register("arrivalDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="departureDate">Departure</Label>
          <Input id="departureDate" type="date" {...register("departureDate")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Stop summary</Label>
        <Textarea id="summary" {...register("summary")} />
      </div>

      <div className="flex flex-wrap gap-2">
        {cityCatalog.slice(0, 4).map((city) => (
          <button
            key={city.cityName}
            type="button"
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
            onClick={() => {
              setValue("cityName", city.cityName);
              setValue("country", city.country);
              setValue("coverImage", city.image);
              setValue("summary", city.blurb);
            }}
          >
            {city.cityName}
          </button>
        ))}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Add stop
      </Button>
    </form>
  );
}
