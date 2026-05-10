import { differenceInCalendarDays, format } from "date-fns";

import { cityCatalog } from "@/lib/mock/travel-data";
import { prisma } from "@/lib/prisma";

export async function getBudgetDashboardData(userId: string) {
  const trips = await prisma.trip.findMany({
    where: { ownerId: userId },
    include: {
      budgetItems: true,
      stops: true,
    },
    orderBy: { startDate: "asc" },
  });

  const budgetByCategory = new Map<string, number>();

  for (const trip of trips) {
    for (const item of trip.budgetItems) {
      budgetByCategory.set(
        item.category,
        (budgetByCategory.get(item.category) ?? 0) + Number(item.amount),
      );
    }
  }

  const categoryBreakdown = Array.from(budgetByCategory.entries()).map(([category, amount]) => ({
    category,
    amount,
  }));

  const tripBudgetRows = trips.map((trip) => {
    const plannedSpend = trip.budgetItems.reduce((sum, item) => sum + Number(item.amount), 0);
    const tripDays = Math.max(1, differenceInCalendarDays(trip.endDate, trip.startDate) + 1);
    const overBudget = plannedSpend > Number(trip.budgetTarget);

    return {
      id: trip.id,
      title: trip.title,
      budgetTarget: Number(trip.budgetTarget),
      plannedSpend,
      dailyAverage: plannedSpend / tripDays,
      overBudget,
      currency: trip.currency,
    };
  });

  const timelineBudget = trips.map((trip) => ({
    month: format(trip.startDate, "MMM"),
    planned: trip.budgetItems.reduce((sum, item) => sum + Number(item.amount), 0),
    target: Number(trip.budgetTarget),
  }));

  return {
    tripBudgetRows,
    categoryBreakdown,
    timelineBudget,
    totals: {
      totalBudgetTarget: tripBudgetRows.reduce((sum, trip) => sum + trip.budgetTarget, 0),
      totalPlannedSpend: tripBudgetRows.reduce((sum, trip) => sum + trip.plannedSpend, 0),
      overBudgetTrips: tripBudgetRows.filter((trip) => trip.overBudget).length,
    },
  };
}

export async function getPackingPageData(userId: string) {
  const trips = await prisma.trip.findMany({
    where: { ownerId: userId },
    include: {
      packingItems: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { startDate: "asc" },
  });

  return trips;
}

export async function getNotesPageData(userId: string) {
  const trips = await prisma.trip.findMany({
    where: { ownerId: userId },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { startDate: "asc" },
  });

  return trips;
}

export async function getSharedTripsForUser(userId: string) {
  return prisma.trip.findMany({
    where: { ownerId: userId },
    include: {
      stops: {
        include: {
          activities: true,
        },
        orderBy: { orderIndex: "asc" },
      },
      sharedTrip: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPublicTrips() {
  return prisma.sharedTrip.findMany({
    where: { isPublic: true },
    include: {
      trip: {
        include: {
          owner: true,
          stops: {
            include: {
              activities: true,
            },
            orderBy: { orderIndex: "asc" },
          },
          budgetItems: true,
          notes: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getSharedTripByCode(shareCode: string) {
  return prisma.sharedTrip.findUnique({
    where: { shareCode },
    include: {
      trip: {
        include: {
          owner: true,
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
        },
      },
    },
  });
}

export async function getActivityExplorerData(userId: string) {
  const trips = await prisma.trip.findMany({
    where: { ownerId: userId },
    include: {
      stops: {
        include: {
          activities: true,
        },
      },
    },
  });

  const plannedActivities = trips.flatMap((trip) =>
    trip.stops.flatMap((stop) =>
      stop.activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        location: activity.location,
        durationMins: activity.durationMins,
        estimatedCost: Number(activity.estimatedCost),
        tripTitle: trip.title,
        cityName: stop.cityName,
      })),
    ),
  );

  const suggestedActivities = cityCatalog.flatMap((city) => [
    {
      id: `${city.cityName}-walk`,
      title: `${city.cityName} highlights walk`,
      description: `A compact first-day route through the best of ${city.cityName}.`,
      type: "SIGHTSEEING",
      location: city.cityName,
      durationMins: 120,
      estimatedCost: Math.round(city.averageDailyBudget * 0.18),
      tripTitle: "Suggested",
      cityName: city.cityName,
    },
    {
      id: `${city.cityName}-food`,
      title: `${city.cityName} food trail`,
      description: `A food-first evening with local must-try stops in ${city.cityName}.`,
      type: "FOOD",
      location: city.cityName,
      durationMins: 150,
      estimatedCost: Math.round(city.averageDailyBudget * 0.22),
      tripTitle: "Suggested",
      cityName: city.cityName,
    },
  ]);

  return [...plannedActivities, ...suggestedActivities];
}
