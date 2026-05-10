import { differenceInCalendarDays } from "date-fns";

import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  const trips = await prisma.trip.findMany({
    where: { ownerId: userId },
    include: {
      stops: {
        include: {
          activities: true,
        },
        orderBy: { orderIndex: "asc" },
      },
      budgetItems: true,
      packingItems: true,
      sharedTrip: true,
    },
    orderBy: { startDate: "asc" },
  });

  const now = new Date();
  const upcomingTrips = trips.filter((trip) => trip.endDate >= now);
  const previousTrips = trips.filter((trip) => trip.endDate < now);
  const totalBudget = trips.reduce(
    (sum, trip) => sum + trip.budgetItems.reduce((tripSum, item) => tripSum + Number(item.amount), 0),
    0,
  );
  const totalDays = trips.reduce(
    (sum, trip) => sum + Math.max(1, differenceInCalendarDays(trip.endDate, trip.startDate) + 1),
    0,
  );
  const totalCities = trips.reduce((sum, trip) => sum + trip.stops.length, 0);

  return {
    upcomingTrips,
    previousTrips,
    stats: {
      totalTrips: trips.length,
      totalCities,
      totalBudget,
      averageDailySpend: totalDays > 0 ? totalBudget / totalDays : 0,
    },
  };
}
