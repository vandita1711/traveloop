import Link from "next/link";
import { CalendarRange, Coins, Globe2, Share2 } from "lucide-react";

import { TripOverviewCard } from "@/components/trips/trip-overview-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserSession } from "@/lib/require-user-session";
import { currency } from "@/lib/utils";
import { getTripSummary } from "@/services/trip-service";

export default async function TripsPage() {
  const session = await requireUserSession();
  const { trips, summary } = await getTripSummary(session!.user.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">My trips</CardTitle>
            <CardDescription>
              Create, review, and jump into itinerary editing from one organized trip library.
            </CardDescription>
          </div>
          <Badge>{trips.length} trips</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Trips", value: summary.totalTrips, icon: CalendarRange },
              { label: "Route stops", value: summary.totalStops, icon: Globe2 },
              { label: "Shared plans", value: summary.sharedTrips, icon: Share2 },
              { label: "Planned spend", value: currency(summary.totalBudget), icon: Coins },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <item.icon className="h-4 w-4 text-slate-500" />
                </div>
                <p className="mt-4 font-heading text-3xl font-semibold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Link href="/trips/new">
              <Button>Create another trip</Button>
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {trips.map((trip) => (
              <TripOverviewCard key={trip.id} trip={trip} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
