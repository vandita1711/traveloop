import { z } from "zod";

export const createTripSchema = z
  .object({
    title: z.string().min(3, "Trip title must be at least 3 characters."),
    description: z.string().min(20, "Add a short but meaningful trip description."),
    coverImage: z.string().min(1, "Choose a cover image."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    travelerCount: z.coerce.number().int().min(1).max(12),
    currency: z.string().min(3).max(3),
    budgetTarget: z.coerce.number().min(0),
  })
  .refine((values) => new Date(values.endDate) >= new Date(values.startDate), {
    path: ["endDate"],
    message: "End date must be on or after the start date.",
  });

export const addStopSchema = z
  .object({
    tripId: z.string().min(1),
    cityName: z.string().min(2, "City is required."),
    country: z.string().min(2, "Country is required."),
    arrivalDate: z.string().min(1, "Arrival date is required."),
    departureDate: z.string().min(1, "Departure date is required."),
    summary: z.string().min(10, "Add a short summary for this stop."),
    coverImage: z.string().optional(),
  })
  .refine((values) => new Date(values.departureDate) >= new Date(values.arrivalDate), {
    path: ["departureDate"],
    message: "Departure date must be on or after arrival date.",
  });

export const addActivitySchema = z.object({
  tripId: z.string().min(1),
  stopId: z.string().min(1),
  title: z.string().min(3, "Activity name is required."),
  description: z.string().min(10, "Add a short activity description."),
  type: z.enum([
    "SIGHTSEEING",
    "FOOD",
    "OUTDOOR",
    "CULTURE",
    "SHOPPING",
    "NIGHTLIFE",
    "WELLNESS",
    "TRANSPORT",
  ]),
  location: z.string().min(2, "Location is required."),
  durationMins: z.coerce.number().int().min(15).max(1440),
  estimatedCost: z.coerce.number().min(0),
});

export const moveStopSchema = z.object({
  tripId: z.string().min(1),
  stopId: z.string().min(1),
  direction: z.enum(["up", "down"]),
});

export const deleteTripSchema = z.object({
  tripId: z.string().min(1),
});

export type CreateTripValues = z.infer<typeof createTripSchema>;
export type AddStopValues = z.infer<typeof addStopSchema>;
export type AddActivityValues = z.infer<typeof addActivitySchema>;
