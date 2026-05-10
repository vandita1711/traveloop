import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatTripDateRange } from "@/lib/utils";

type TripCardProps = {
  trip: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    startDate: Date;
    endDate: Date;
    stops: { cityName: string }[];
    sharedTrip: { shareCode: string } | null;
  };
};

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="bg-white/90 text-slate-900">{trip.stops.length} stops</Badge>
            {trip.sharedTrip ? (
              <Badge className="bg-slate-950/75 text-white">
                <Share2 className="mr-1 h-3 w-3" />
                Public
              </Badge>
            ) : null}
          </div>
        </div>
        <CardContent className="space-y-4 p-5">
          <div>
            <h3 className="font-heading text-xl font-semibold text-slate-950">{trip.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{trip.description}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {formatTripDateRange(trip.startDate, trip.endDate)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {trip.stops.map((stop) => stop.cityName).join(" • ")}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
