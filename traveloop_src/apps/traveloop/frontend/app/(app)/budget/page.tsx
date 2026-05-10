import { AlertTriangle, Coins, TrendingUp, Wallet } from "lucide-react";

import { AddBudgetItemForm } from "@/components/budget/add-budget-item-form";
import { BudgetCharts } from "@/components/budget/budget-charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBudgetDashboardData } from "@/lib/data/planner";
import { requireUserSession } from "@/lib/require-user-session";
import { getTripsForUser } from "@/services/trip-service";
import { currency } from "@/lib/utils";

export default async function BudgetPage() {
  const session = await requireUserSession();
  const [data, trips] = await Promise.all([
    getBudgetDashboardData(session!.user.id),
    getTripsForUser(session!.user.id),
  ]);

  const firstTripId = trips[0]?.id;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Budget target</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{currency(data.totals.totalBudgetTarget)}</p>
            </div>
            <Wallet className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Planned spend</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{currency(data.totals.totalPlannedSpend)}</p>
            </div>
            <Coins className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Over-budget trips</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{data.totals.overBudgetTrips}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Average performance</p>
              <p className="mt-2 font-heading text-3xl font-semibold">
                {data.totals.totalBudgetTarget > 0
                  ? `${Math.round((data.totals.totalPlannedSpend / data.totals.totalBudgetTarget) * 100)}%`
                  : "0%"}
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
      </div>

      <BudgetCharts categoryBreakdown={data.categoryBreakdown} timelineBudget={data.timelineBudget} />

      {firstTripId ? (
        <Card>
          <CardHeader>
            <CardTitle>Add a budget line item</CardTitle>
            <CardDescription>Fast way to make the budget dashboard feel more alive during the demo.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddBudgetItemForm tripId={firstTripId} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Trip budget watchlist</CardTitle>
          <CardDescription>Daily averages and over-budget alerts across all current plans.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.tripBudgetRows.map((trip) => (
            <div key={trip.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-heading text-xl font-semibold text-slate-950">{trip.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Daily avg {currency(trip.dailyAverage, trip.currency)} • Planned {currency(trip.plannedSpend, trip.currency)} • Target {currency(trip.budgetTarget, trip.currency)}
                  </p>
                </div>
                <Badge className={trip.overBudget ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}>
                  {trip.overBudget ? "Over budget" : "Healthy"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
