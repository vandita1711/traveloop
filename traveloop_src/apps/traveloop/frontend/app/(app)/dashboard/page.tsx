import { CalendarRange, Coins, Globe2, PlaneTakeoff } from "lucide-react";

import { HeroBanner } from "@/components/dashboard/hero-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { TripCard } from "@/components/dashboard/trip-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { recommendationCards } from "@/lib/constants";
import { getDashboardData } from "@/lib/data/dashboard";
import { requireUserSession } from "@/lib/require-user-session";
import { currency, formatRelativeDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireUserSession();
  const data = await getDashboardData(session!.user.id);

  return (
    <div className="space-y-6">
      <HeroBanner />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={PlaneTakeoff}
          label="Total trips"
          value={String(data.stats.totalTrips)}
          hint="Across draft, planning, and confirmed itineraries"
        />
        <StatCard
          icon={Globe2}
          label="Cities mapped"
          value={String(data.stats.totalCities)}
          hint="Stops captured in current multi-city plans"
        />
        <StatCard
          icon={Coins}
          label="Planned budget"
          value={currency(data.stats.totalBudget)}
          hint="Combined seeded spending target across trips"
        />
        <StatCard
          icon={CalendarRange}
          label="Daily avg"
          value={currency(data.stats.averageDailySpend)}
          hint="Average planned spend per trip day"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Upcoming trips</CardTitle>
              <CardDescription>Real seeded itineraries for Tokyo, Paris, and the Alps.</CardDescription>
            </div>
            <Badge>{data.upcomingTrips.length} active</Badge>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-2">
            {data.upcomingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Quick inspiration tiles for the next planning sprint.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendationCards.map((card) => (
              <div key={card.title} className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                <Badge className="mb-3 bg-cyan-500/10 text-cyan-700">{card.tag}</Badge>
                <h3 className="font-heading text-lg font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Previous trips</CardTitle>
            <CardDescription>Completed journeys stay accessible for inspiration and reuse.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.previousTrips.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-muted-foreground">
                No completed trips yet. Once you wrap a journey, it will show up here with stats and notes.
              </div>
            ) : (
              data.previousTrips.map((trip) => (
                <div key={trip.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                  <p className="font-heading text-lg font-semibold text-slate-950">{trip.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{trip.description}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>The rest of the MVP screens will plug into these routes next.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[ 
              { label: "Create Trip", href: "/trips/new", date: "Ready now" },
              { label: "Activity Search", href: "/explore/activities", date: "Phase 3" },
              { label: "Packing Checklist", href: "/packing", date: "Phase 4" },
              { label: "Shared Itinerary", href: "/shared", date: "Phase 5" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <p className="font-medium text-slate-950">{item.label}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.date}</p>
              </div>
            ))}
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5 md:col-span-2">
              <p className="font-medium text-slate-950">Next trip starts {formatRelativeDate(data.upcomingTrips[0]?.startDate ?? new Date())}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Seeded itinerary is aligned to the upcoming demo timeline so the dashboard feels live.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
