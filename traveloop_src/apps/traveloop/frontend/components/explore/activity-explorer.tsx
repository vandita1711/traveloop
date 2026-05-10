"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { currency } from "@/lib/utils";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  durationMins: number;
  estimatedCost: number;
  tripTitle: string;
  cityName: string;
};

export function ActivityExplorer({ activities }: { activities: ActivityItem[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [costBand, setCostBand] = useState("ALL");
  const [durationBand, setDurationBand] = useState("ALL");

  const filtered = useMemo(() => {
    return activities.filter((activity) => {
      const matchesQuery =
        query.length === 0 ||
        activity.title.toLowerCase().includes(query.toLowerCase()) ||
        activity.cityName.toLowerCase().includes(query.toLowerCase());

      const matchesType = type === "ALL" || activity.type === type;
      const matchesCost =
        costBand === "ALL" ||
        (costBand === "LOW" && activity.estimatedCost < 50) ||
        (costBand === "MID" && activity.estimatedCost >= 50 && activity.estimatedCost <= 120) ||
        (costBand === "HIGH" && activity.estimatedCost > 120);
      const matchesDuration =
        durationBand === "ALL" ||
        (durationBand === "SHORT" && activity.durationMins <= 90) ||
        (durationBand === "MEDIUM" && activity.durationMins > 90 && activity.durationMins <= 180) ||
        (durationBand === "LONG" && activity.durationMins > 180);

      return matchesQuery && matchesType && matchesCost && matchesDuration;
    });
  }, [activities, costBand, durationBand, query, type]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter activities</CardTitle>
          <CardDescription>Search by activity type, budget range, and time commitment.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tokyo, food, museum..." />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onChange={(event) => setType(event.target.value)}>
              {["ALL", "SIGHTSEEING", "FOOD", "OUTDOOR", "CULTURE", "SHOPPING", "NIGHTLIFE", "WELLNESS", "TRANSPORT"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cost</Label>
            <Select value={costBand} onChange={(event) => setCostBand(event.target.value)}>
              <option value="ALL">All</option>
              <option value="LOW">Under $50</option>
              <option value="MID">$50-$120</option>
              <option value="HIGH">Over $120</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select value={durationBand} onChange={(event) => setDurationBand(event.target.value)}>
              <option value="ALL">All</option>
              <option value="SHORT">Up to 90 mins</option>
              <option value="MEDIUM">90-180 mins</option>
              <option value="LONG">180+ mins</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-xl font-semibold text-slate-950">{activity.title}</h3>
                <Badge>{activity.type}</Badge>
                <Badge className="bg-cyan-500/10 text-cyan-700">{activity.cityName}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span>{activity.location}</span>
                <span>{activity.durationMins} mins</span>
                <span>{currency(activity.estimatedCost)}</span>
                <span>{activity.tripTitle}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
