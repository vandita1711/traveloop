import { CreateTripForm } from "@/components/trips/create-trip-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cityCatalog } from "@/lib/mock/travel-data";

export default function CreateTripPage() {
  return (
    <div className="space-y-6">
      <CreateTripForm />

      <Card>
        <CardHeader>
          <CardTitle>City ideas for faster planning</CardTitle>
          <CardDescription>
            These seeded destinations are ready to reuse in the itinerary builder as soon as the trip is created.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cityCatalog.map((city) => (
            <div key={city.cityName} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <p className="font-heading text-lg font-semibold text-slate-950">
                {city.cityName}, {city.country}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{city.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-white px-3 py-1">Airport: {city.airport}</span>
                <span className="rounded-full bg-white px-3 py-1">Budget: ${city.averageDailyBudget}/day</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
