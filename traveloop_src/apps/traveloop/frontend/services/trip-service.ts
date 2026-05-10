import { prisma } from "@/lib/prisma";

export async function getTripsForUser(userId: string) {
  return prisma.trip.findMany({
    where: { ownerId: userId },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
      },
      budgetItems: true,
      sharedTrip: true,
    },
    orderBy: { startDate: "asc" },
  });
}

export async function getTripSummary(userId: string) {
  const trips = await getTripsForUser(userId);

  const totalStops = trips.reduce((sum, trip) => sum + trip.stops.length, 0);
  const totalBudget = trips.reduce(
    (sum, trip) => sum + trip.budgetItems.reduce((tripSum, item) => tripSum + Number(item.amount), 0),
    0,
  );
  const sharedTrips = trips.filter((trip) => trip.sharedTrip).length;

  return {
    trips,
    summary: {
      totalTrips: trips.length,
      totalStops,
      totalBudget,
      sharedTrips,
    },
  };
}

export async function getTripById(userId: string, tripId: string) {
  return prisma.trip.findFirst({
    where: {
      id: tripId,
      ownerId: userId,
    },
    include: {
      stops: {
        include: {
          activities: {
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
      budgetItems: true,
      packingItems: true,
      notes: {
        orderBy: { createdAt: "desc" },
      },
      sharedTrip: true,
    },
  });
}
