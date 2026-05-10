import Link from "next/link";
import { MapPinned } from "lucide-react";

import { ActivityExplorer } from "@/components/explore/activity-explorer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityExplorerData } from "@/lib/data/planner";
import { cityCatalog } from "@/lib/mock/travel-data";
import { requireUserSession } from "@/lib/require-user-session";

export default async function ActivitySearchPage() {
  const session = await requireUserSession();
  const activities = await getActivityExplorerData(session!.user.id);

  return (
    <div className="space-y-6">
      <ActivityExplorer activities={activities} />

      <Card>
        <CardHeader>
          <CardTitle>City search</CardTitle>
          <CardDescription>Fast destination suggestions with travel metadata for itinerary planning.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {cityCatalog.map((city) => (
            <div key={city.cityName} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-slate-500" />
                <p className="font-heading text-lg font-semibold text-slate-950">
                  {city.cityName}, {city.country}
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{city.blurb}</p>
              <p className="mt-4 text-xs text-slate-500">
                Airport {city.airport} • {city.timezone} • Avg {city.averageDailyBudget}/day
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Link href="/trips/new">
          <Button>Turn ideas into a trip</Button>
        </Link>
      </div>
    </div>
  );
}
