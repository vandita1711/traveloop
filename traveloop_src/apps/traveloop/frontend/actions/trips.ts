"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { findCityByName } from "@/lib/mock/travel-data";
import { prisma } from "@/lib/prisma";
import {
  addActivitySchema,
  addStopSchema,
  createTripSchema,
  deleteTripSchema,
  moveStopSchema,
  type AddActivityValues,
  type AddStopValues,
  type CreateTripValues,
} from "@/lib/validations/trip";
import { slugify } from "@/lib/utils";

type ActionResult<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

async function createUniqueSlug(title: string) {
  const baseSlug = slugify(title);
  const existing = await prisma.trip.count({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
  });

  return existing === 0 ? baseSlug : `${baseSlug}-${existing + 1}`;
}

export async function createTripAction(
  values: CreateTripValues,
): Promise<ActionResult<{ tripId: string }>> {
  const userId = await requireUser();
  const parsed = createTripSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid trip form." };
  }

  const slug = await createUniqueSlug(parsed.data.title);

  const trip = await prisma.trip.create({
    data: {
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      coverImage: parsed.data.coverImage,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      travelerCount: parsed.data.travelerCount,
      currency: parsed.data.currency.toUpperCase(),
      budgetTarget: parsed.data.budgetTarget,
      ownerId: userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/trips");

  return {
    success: true,
    data: { tripId: trip.id },
  };
}

export async function deleteTripAction(tripId: string): Promise<ActionResult> {
  const userId = await requireUser();
  const parsed = deleteTripSchema.safeParse({ tripId });

  if (!parsed.success) {
    return { success: false, error: "Invalid trip selection." };
  }

  await prisma.trip.deleteMany({
    where: {
      id: parsed.data.tripId,
      ownerId: userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/trips");

  return { success: true };
}

export async function addStopAction(
  values: AddStopValues,
): Promise<ActionResult<{ stopId: string }>> {
  const userId = await requireUser();
  const parsed = addStopSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid stop form." };
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: parsed.data.tripId,
      ownerId: userId,
    },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!trip) {
    return { success: false, error: "Trip not found." };
  }

  const matchedCity = findCityByName(parsed.data.cityName);

  const stop = await prisma.stop.create({
    data: {
      tripId: trip.id,
      cityName: parsed.data.cityName,
      country: parsed.data.country,
      arrivalDate: new Date(parsed.data.arrivalDate),
      departureDate: new Date(parsed.data.departureDate),
      summary: parsed.data.summary,
      coverImage: parsed.data.coverImage || matchedCity?.image,
      orderIndex: trip.stops.length,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/trips");
  revalidatePath(`/trips/${trip.id}`);
  revalidatePath(`/trips/${trip.id}/itinerary`);

  return { success: true, data: { stopId: stop.id } };
}

export async function addActivityAction(
  values: AddActivityValues,
): Promise<ActionResult<{ activityId: string }>> {
  const userId = await requireUser();
  const parsed = addActivitySchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid activity form.",
    };
  }

  const stop = await prisma.stop.findFirst({
    where: {
      id: parsed.data.stopId,
      trip: {
        id: parsed.data.tripId,
        ownerId: userId,
      },
    },
    include: {
      activities: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!stop) {
    return { success: false, error: "Stop not found." };
  }

  const activity = await prisma.activity.create({
    data: {
      stopId: stop.id,
      title: parsed.data.title,
      description: parsed.data.description,
      type: parsed.data.type,
      location: parsed.data.location,
      durationMins: parsed.data.durationMins,
      estimatedCost: parsed.data.estimatedCost,
      orderIndex: stop.activities.length,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/trips/${parsed.data.tripId}`);
  revalidatePath(`/trips/${parsed.data.tripId}/itinerary`);

  return { success: true, data: { activityId: activity.id } };
}

export async function moveStopAction(input: {
  tripId: string;
  stopId: string;
  direction: "up" | "down";
}): Promise<ActionResult> {
  const userId = await requireUser();
  const parsed = moveStopSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid stop move." };
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: parsed.data.tripId,
      ownerId: userId,
    },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!trip) {
    return { success: false, error: "Trip not found." };
  }

  const currentIndex = trip.stops.findIndex((stop) => stop.id === parsed.data.stopId);

  if (currentIndex === -1) {
    return { success: false, error: "Stop not found." };
  }

  const swapIndex = parsed.data.direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (swapIndex < 0 || swapIndex >= trip.stops.length) {
    return { success: false, error: "Stop is already at the edge of the route." };
  }

  const current = trip.stops[currentIndex];
  const target = trip.stops[swapIndex];

  await prisma.$transaction([
    prisma.stop.update({
      where: { id: current.id },
      data: { orderIndex: target.orderIndex },
    }),
    prisma.stop.update({
      where: { id: target.id },
      data: { orderIndex: current.orderIndex },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/trips");
  revalidatePath(`/trips/${trip.id}`);
  revalidatePath(`/trips/${trip.id}/itinerary`);

  return { success: true };
}

export async function upsertBudgetItemAction(input: {
  tripId: string;
  label: string;
  category:
    | "FLIGHTS"
    | "HOTELS"
    | "FOOD"
    | "TRANSPORT"
    | "ACTIVITIES"
    | "SHOPPING"
    | "MISC";
  amount: number;
}): Promise<ActionResult> {
  const userId = await requireUser();
  const trip = await prisma.trip.findFirst({
    where: {
      id: input.tripId,
      ownerId: userId,
    },
  });

  if (!trip) {
    return { success: false, error: "Trip not found." };
  }

  await prisma.budgetItem.create({
    data: {
      tripId: input.tripId,
      label: input.label,
      category: input.category,
      amount: input.amount,
    },
  });

  revalidatePath("/budget");
  revalidatePath(`/trips/${trip.id}`);
  return { success: true };
}

export async function addPackingItemAction(input: {
  tripId: string;
  label: string;
  category: string;
  quantity: number;
}): Promise<ActionResult> {
  const userId = await requireUser();
  const trip = await prisma.trip.findFirst({
    where: { id: input.tripId, ownerId: userId },
  });

  if (!trip) {
    return { success: false, error: "Trip not found." };
  }

  await prisma.packingItem.create({
    data: {
      tripId: input.tripId,
      label: input.label,
      category: input.category,
      quantity: input.quantity,
    },
  });

  revalidatePath("/packing");
  revalidatePath(`/trips/${trip.id}`);
  return { success: true };
}

export async function togglePackingItemAction(itemId: string): Promise<ActionResult> {
  const userId = await requireUser();
  const item = await prisma.packingItem.findFirst({
    where: {
      id: itemId,
      trip: {
        ownerId: userId,
      },
    },
    include: {
      trip: true,
    },
  });

  if (!item) {
    return { success: false, error: "Packing item not found." };
  }

  await prisma.packingItem.update({
    where: { id: item.id },
    data: { isPacked: !item.isPacked },
  });

  revalidatePath("/packing");
  revalidatePath(`/trips/${item.trip.id}`);
  return { success: true };
}

export async function addNoteAction(input: {
  tripId: string;
  title: string;
  content: string;
}): Promise<ActionResult> {
  const userId = await requireUser();
  const trip = await prisma.trip.findFirst({
    where: { id: input.tripId, ownerId: userId },
  });

  if (!trip) {
    return { success: false, error: "Trip not found." };
  }

  await prisma.note.create({
    data: {
      tripId: input.tripId,
      authorId: userId,
      title: input.title,
      content: input.content,
    },
  });

  revalidatePath("/notes");
  revalidatePath(`/trips/${trip.id}`);
  return { success: true };
}

export async function toggleTripSharingAction(tripId: string): Promise<ActionResult> {
  const userId = await requireUser();
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, ownerId: userId },
    include: { sharedTrip: true },
  });

  if (!trip) {
    return { success: false, error: "Trip not found." };
  }

  if (trip.sharedTrip) {
    await prisma.sharedTrip.update({
      where: { tripId: trip.id },
      data: { isPublic: !trip.sharedTrip.isPublic },
    });
  } else {
    await prisma.sharedTrip.create({
      data: {
        tripId: trip.id,
        shareCode: `${trip.slug}-${trip.id.slice(-6)}`,
        isPublic: true,
      },
    });
  }

  revalidatePath("/shared");
  revalidatePath("/community");
  revalidatePath(`/trips/${trip.id}`);
  return { success: true };
}
