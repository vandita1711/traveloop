import { CalendarDays, Coins, Globe2, MapPin, NotebookPen } from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSharedTripByCode } from "@/lib/data/planner";
import { currency, formatTripDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PublicSharedTripPage({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = await params;
  const shared = await getSharedTripByCode(shareCode);

  if (!shared?.isPublic) {
    notFound();
  }

  const totalBudget = shared.trip.budgetItems.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="min-h-screen bg-[#eef4ff] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="overflow-hidden">
          <div
            className="relative rounded-[28px] bg-slate-950 px-6 py-10 text-white"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(10,15,32,0.9), rgba(33,61,119,0.75)), url(${shared.trip.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/15 text-white">Public itinerary</Badge>
                <Badge className="bg-cyan-400/20 text-cyan-100">{shared.trip.owner.name}</Badge>
              </div>
              <div>
                <h1 className="font-heading text-4xl font-semibold">{shared.trip.title}</h1>
                <p className="mt-3 max-w-3xl text-sm text-white/75 md:text-base">{shared.trip.description}</p>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-white/75">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatTripDateRange(shared.trip.startDate, shared.trip.endDate)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {shared.trip.stops.map((stop) => stop.cityName).join(" • ")}
                </span>
                <span className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  {currency(totalBudget, shared.trip.currency)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Shared route and activity plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shared.trip.stops.map((stop, index) => (
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
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-950">{activity.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
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
                <CardTitle>Trip summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe2 className="h-4 w-4" />
                    {shared.trip.stops.length} cities
                  </p>
                </div>
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="mt-2 font-medium text-slate-950">{currency(totalBudget, shared.trip.currency)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest journal note</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-950">
                    <NotebookPen className="h-4 w-4 text-slate-500" />
                    {shared.trip.notes[0]?.title ?? "No note shared yet"}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {shared.trip.notes[0]?.content ?? "This itinerary has no public notes yet."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
