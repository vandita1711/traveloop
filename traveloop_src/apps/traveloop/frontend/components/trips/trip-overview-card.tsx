import Link from "next/link";
import { ArrowRight, CalendarDays, Coins, MapPin, Users } from "lucide-react";

import { DeleteTripButton } from "@/components/trips/delete-trip-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { currency, formatTripDateRange } from "@/lib/utils";

export function TripOverviewCard({
  trip,
}: {
  trip: {
    id: string;
    title: string;
    description: string;
    status: string;
    coverImage: string;
    startDate: Date;
    endDate: Date;
    travelerCount: number;
    currency: string;
    budgetTarget: { toString(): string } | number;
    stops: { cityName: string }[];
    budgetItems: { amount: { toString(): string } | number }[];
  };
}) {
  const plannedSpend = trip.budgetItems.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <Card className="overflow-hidden">
      <div
        className="h-40 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.12), rgba(15,23,42,0.55)), url(${trip.coverImage})`,
        }}
      />
      <CardContent className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-xl font-semibold text-slate-950">{trip.title}</h3>
              <Badge>{trip.status}</Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{trip.description}</p>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {formatTripDateRange(trip.startDate, trip.endDate)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {trip.stops.length > 0 ? trip.stops.map((stop) => stop.cityName).join(" • ") : "Route not mapped yet"}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {trip.travelerCount} traveler{trip.travelerCount > 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Target {currency(Number(trip.budgetTarget), trip.currency)} • Planned {currency(plannedSpend, trip.currency)}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Link href={`/trips/${trip.id}`}>
            <Button className="w-full justify-center" variant="outline">
              View details
            </Button>
          </Link>
          <Link href={`/trips/${trip.id}/itinerary`}>
            <Button className="w-full justify-center">
              Open itinerary
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <DeleteTripButton tripId={trip.id} />
      </CardContent>
    </Card>
  );
}
