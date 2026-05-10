import { Backpack, CheckCircle2, ListChecks } from "lucide-react";

import { AddPackingItemForm } from "@/components/packing/add-packing-item-form";
import { PackingItemToggle } from "@/components/packing/packing-item-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPackingPageData } from "@/lib/data/planner";
import { requireUserSession } from "@/lib/require-user-session";

export default async function PackingPage() {
  const session = await requireUserSession();
  const trips = await getPackingPageData(session!.user.id);
  const totalItems = trips.flatMap((trip) => trip.packingItems).length;
  const packedItems = trips.flatMap((trip) => trip.packingItems).filter((item) => item.isPacked).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total checklist items</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{totalItems}</p>
            </div>
            <ListChecks className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Packed already</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{packedItems}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Trips tracked</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{trips.length}</p>
            </div>
            <Backpack className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
      </div>

      {trips.map((trip) => (
        <Card key={trip.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{trip.title}</CardTitle>
                <CardDescription>
                  {trip.packingItems.filter((item) => item.isPacked).length}/{trip.packingItems.length} packed
                </CardDescription>
              </div>
              <Badge>{trip.packingItems.length} items</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AddPackingItemForm tripId={trip.id} />
            <div className="space-y-3">
              {trip.packingItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-[24px] bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <PackingItemToggle itemId={item.id} checked={item.isPacked} />
                    <div>
                      <p className="font-medium text-slate-950">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.category} • Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <Badge className={item.isPacked ? "bg-emerald-100 text-emerald-700" : ""}>
                    {item.isPacked ? "Packed" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
