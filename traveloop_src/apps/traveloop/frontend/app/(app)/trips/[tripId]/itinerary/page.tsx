import Link from "next/link";
import { ArrowLeft, CalendarDays, Coins, MapPinned, Route, Users } from "lucide-react";
import { notFound } from "next/navigation";

import { AddStopForm } from "@/components/trips/add-stop-form";
import { ItineraryTimeline } from "@/components/trips/itinerary-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserSession } from "@/lib/require-user-session";
import { currency, formatTripDateRange } from "@/lib/utils";
import { getTripById } from "@/services/trip-service";

export default async function ItineraryBuilderPage({
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/trips/${trip.id}`}>
              <span className="inline-flex items-center gap-1 hover:text-slate-950">
                <ArrowLeft className="h-4 w-4" />
                Back to trip
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-semibold text-slate-950">{trip.title}</h1>
            <Badge>{trip.status}</Badge>
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">{trip.description}</p>
        </div>
        <Link href="/trips/new">
          <Button variant="outline">Create another trip</Button>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip frame</CardTitle>
              <CardDescription>Dates, travelers, and budget context for the route you are building.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Dates
                </p>
                <p className="mt-3 font-medium text-slate-950">
                  {formatTripDateRange(trip.startDate, trip.endDate)}
                </p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Travelers
                </p>
                <p className="mt-3 font-medium text-slate-950">{trip.travelerCount} total</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  Planned spend
                </p>
                <p className="mt-3 font-medium text-slate-950">{currency(totalBudget, trip.currency)}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinned className="h-4 w-4" />
                  Stops mapped
                </p>
                <p className="mt-3 font-medium text-slate-950">{trip.stops.length} cities</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add a stop</CardTitle>
              <CardDescription>
                Search or quick-pick a city, define its dates, and drop it into the route.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddStopForm
                tripId={trip.id}
                startDate={trip.startDate.toISOString().slice(0, 10)}
                endDate={trip.endDate.toISOString().slice(0, 10)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Builder guidance</CardTitle>
              <CardDescription>Keep the demo flow sharp and easy for judges to understand.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-[24px] bg-slate-50 p-4">
                1. Add cities in travel order, then use the arrow controls to refine the route.
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                2. Add 2-4 anchor activities per stop to make the timeline feel intentional.
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                3. Keep durations and estimated cost realistic so the future budget dashboard reads cleanly.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/60 bg-slate-950 p-6 text-white shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/65">Itinerary builder</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold">Timeline view</h2>
                <p className="mt-3 max-w-xl text-sm text-white/75">
                  This is the Phase 3 planning workspace for city stops, activities, route order, and pacing.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <Route className="h-5 w-5" />
              </div>
            </div>
          </div>

          <ItineraryTimeline trip={trip} />
        </div>
      </div>
    </div>
  );
}
