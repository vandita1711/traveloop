import Link from "next/link";
import { CalendarDays, Coins, MapPin, NotebookPen, Route, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserSession } from "@/lib/require-user-session";
import { currency, formatTripDateRange } from "@/lib/utils";
import { getTripById } from "@/services/trip-service";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const session = await requireUserSession();
  const { tripId } = await params;
  const trip = await getTripById(session!.user.id, tripId);

  if (!trip) {
    notFound();
  }

  const totalBudget = trip.budgetItems.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div
          className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-8 text-white md:px-8"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(10,15,32,0.92), rgba(33,61,119,0.72)), url(${trip.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/15 text-white">{trip.status}</Badge>
              {trip.sharedTrip ? (
                <Badge className="bg-cyan-400/20 text-cyan-100">
                  <Share2 className="mr-1 h-3 w-3" />
                  Shared
                </Badge>
              ) : null}
            </div>
            <div>
              <h1 className="font-heading text-3xl font-semibold md:text-4xl">{trip.title}</h1>
              <p className="mt-3 max-w-3xl text-sm text-white/75 md:text-base">{trip.description}</p>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-white/78">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formatTripDateRange(trip.startDate, trip.endDate)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {trip.stops.length > 0 ? trip.stops.map((stop) => stop.cityName).join(" • ") : "No stops yet"}
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                {currency(totalBudget, trip.currency)}
              </div>
            </div>
            <Link href={`/trips/${trip.id}/itinerary`}>
              <Button className="mt-2 bg-white text-slate-950 hover:bg-white/90">
                <Route className="h-4 w-4" />
                Open itinerary builder
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Itinerary snapshot</CardTitle>
            <CardDescription>
              Quick overview of the route. Use the itinerary builder for timeline editing and activity planning.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trip.stops.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-muted-foreground">
                This trip does not have route stops yet. Open the itinerary builder to add your first city.
              </div>
            ) : null}
            {trip.stops.map((stop, index) => (
              <div key={stop.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Stop {index + 1}</p>
                    <h3 className="font-heading text-xl font-semibold text-slate-950">
                      {stop.cityName}, {stop.country}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatTripDateRange(stop.arrivalDate, stop.departureDate)}
                    </p>
                  </div>
                  <Badge>{stop.activities.length} activities</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{stop.summary}</p>
                <div className="mt-4 space-y-3">
                  {stop.activities.map((activity) => (
                    <div key={activity.id} className="rounded-2xl bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-950">{activity.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{activity.location}</p>
                        </div>
                        <Badge>{activity.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget preview</CardTitle>
              <CardDescription>Current category totals from seeded data and your trip edits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {trip.budgetItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-950">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <p className="font-semibold text-slate-950">{currency(Number(item.amount), trip.currency)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Packing + notes</CardTitle>
              <CardDescription>Interactive management lands in Phase 4, but your summary is already visible here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-950">Packed items</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {trip.packingItems.filter((item) => item.isPacked).length}/{trip.packingItems.length}
                </p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <NotebookPen className="h-4 w-4 text-slate-600" />
                  <p className="text-sm font-medium text-slate-950">Latest note</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {trip.notes[0]?.content ?? "No notes yet for this itinerary."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
