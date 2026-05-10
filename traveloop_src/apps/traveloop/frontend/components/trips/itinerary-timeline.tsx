import { CalendarDays, Clock3, Coins, GripVertical, MapPin } from "lucide-react";

import { AddActivityForm } from "@/components/trips/add-activity-form";
import { StopMoveButtons } from "@/components/trips/stop-move-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currency, formatTripDateRange } from "@/lib/utils";

type ItineraryTrip = {
  id: string;
  currency: string;
  stops: Array<{
    id: string;
    cityName: string;
    country: string;
    summary: string | null;
    arrivalDate: Date;
    departureDate: Date;
    activities: Array<{
      id: string;
      title: string;
      description: string;
      type: string;
      location: string;
      durationMins: number;
      estimatedCost: { toString(): string } | number;
    }>;
  }>;
};

export function ItineraryTimeline({ trip }: { trip: ItineraryTrip }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline builder</CardTitle>
        <CardDescription>
          Add city stops, drop in activities, and move stops up or down to shape the route.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {trip.stops.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-muted-foreground">
            No stops yet. Add your first city to start building the timeline.
          </div>
        ) : null}

        {trip.stops.map((stop, index) => (
          <div key={stop.id} className="grid gap-4 lg:grid-cols-[48px_1fr]">
            <div className="hidden lg:flex lg:flex-col lg:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                {index + 1}
              </div>
              {index < trip.stops.length - 1 ? <div className="mt-3 h-full w-px bg-slate-200" /> : null}
            </div>

            <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white lg:hidden">
                      Stop {index + 1}
                    </div>
                    <h3 className="font-heading text-2xl font-semibold text-slate-950">
                      {stop.cityName}, {stop.country}
                    </h3>
                    <Badge>{stop.activities.length} activities</Badge>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {formatTripDateRange(stop.arrivalDate, stop.departureDate)}
                  </p>
                  <p className="max-w-2xl text-sm text-muted-foreground">{stop.summary}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="hidden rounded-2xl bg-white p-3 text-slate-500 md:block">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <StopMoveButtons
                    tripId={trip.id}
                    stopId={stop.id}
                    canMoveUp={index > 0}
                    canMoveDown={index < trip.stops.length - 1}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {stop.activities.map((activity) => (
                  <div key={activity.id} className="rounded-[24px] bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-slate-950">{activity.title}</p>
                          <Badge className="bg-cyan-500/10 text-cyan-700">{activity.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <p className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {activity.location}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            {activity.durationMins} mins
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Coins className="h-3.5 w-3.5" />
                            {currency(Number(activity.estimatedCost), trip.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <AddActivityForm tripId={trip.id} stopId={stop.id} cityName={stop.cityName} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
