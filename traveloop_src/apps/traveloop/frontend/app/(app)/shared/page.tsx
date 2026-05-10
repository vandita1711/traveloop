import Link from "next/link";
import { ExternalLink, Globe2, Link2 } from "lucide-react";

import { ShareTripButton } from "@/components/shared/share-trip-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSharedTripsForUser } from "@/lib/data/planner";
import { requireUserSession } from "@/lib/require-user-session";

export default async function SharedTripsPage() {
  const session = await requireUserSession();
  const trips = await getSharedTripsForUser(session!.user.id);

  return (
    <div className="space-y-6">
      {trips.map((trip) => (
        <Card key={trip.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{trip.title}</CardTitle>
                <CardDescription>
                  Publish or hide a public itinerary view with a shareable URL.
                </CardDescription>
              </div>
              <Badge className={trip.sharedTrip?.isPublic ? "bg-emerald-100 text-emerald-700" : ""}>
                {trip.sharedTrip?.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                <Globe2 className="h-4 w-4" />
                {trip.stops.length} stops
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                <Link2 className="h-4 w-4" />
                {trip.sharedTrip ? `/share/${trip.sharedTrip.shareCode}` : "Not published yet"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ShareTripButton tripId={trip.id} isPublic={Boolean(trip.sharedTrip?.isPublic)} />
              {trip.sharedTrip ? (
                <Link href={`/share/${trip.sharedTrip.shareCode}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                  Preview public page
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
