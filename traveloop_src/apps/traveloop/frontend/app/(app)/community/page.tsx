import Link from "next/link";
import { Compass, ExternalLink, Globe2, NotebookPen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicTrips } from "@/lib/data/planner";

export default async function CommunityPage() {
  const publicTrips = await getPublicTrips();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community trips</CardTitle>
          <CardDescription>Browse public itineraries and reuse ideas across cities, budgets, and pacing styles.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2">
          {publicTrips.map((shared) => (
            <div key={shared.id} className="rounded-[28px] border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-xl font-semibold text-slate-950">{shared.trip.title}</h3>
                <Badge>Public</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{shared.trip.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">
                  <Compass className="h-3.5 w-3.5" />
                  {shared.trip.owner.name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">
                  <Globe2 className="h-3.5 w-3.5" />
                  {shared.trip.stops.length} stops
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">
                  <NotebookPen className="h-3.5 w-3.5" />
                  {shared.trip.notes[0]?.title ?? "Shared itinerary"}
                </span>
              </div>
              <Link href={`/share/${shared.shareCode}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-950">
                Open public itinerary
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
