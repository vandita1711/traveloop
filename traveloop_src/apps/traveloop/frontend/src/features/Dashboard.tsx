import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { rpcCall } from '../api';
import { MapPin, Calendar, Plane, Map as MapIcon, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export function DashboardView({ onSelectTrip, onCreateTrip }: { onSelectTrip: (id: number) => void, onCreateTrip: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      console.log("[FETCH_START] get_dashboard_data");
      const result = await rpcCall({ func: 'get_dashboard_data', args: { user_id: 1 } });
      setData(result);
    } catch (error) {
      console.error("[FETCH_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;

  const stats = [
    { label: "Total Trips", value: data?.stats?.total_trips || 0, icon: MapIcon },
    { label: "Cities Visited", value: data?.stats?.total_cities || 0, icon: MapPin },
    { label: "Upcoming Flights", value: 2, icon: Plane }, // Hardcoded for demo
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative rounded-xl overflow-hidden h-[240px] md:h-[300px] bg-cover bg-center shadow-lg"
        style={{ backgroundImage: "url('./assets/hero-coastal-1.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-6 md:p-10 text-white">
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-2">Adventure Awaits</h1>
          <p className="text-white/80 md:text-xl max-w-2xl mb-6">Plan your next journey and discover the world with Traveloop.</p>
          <div className="flex gap-3">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={onCreateTrip}>
              <Plus className="mr-2 h-5 w-5" /> Plan New Trip
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-2xl bg-primary/10 p-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold font-heading">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-heading">Upcoming Trips</h2>
          <Button variant="ghost" className="text-primary hover:text-primary/80" onClick={onCreateTrip}>View All</Button>
        </div>
        
        {data?.upcoming_trips?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.upcoming_trips.map((trip: any) => (
              <Card 
                key={trip.id} 
                className="group cursor-pointer overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => onSelectTrip(trip.id)}
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img 
                    src={`./assets/card-paris-1.jpg`} 
                    alt={trip.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/50 backdrop-blur-md text-white border-none">Upcoming</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{trip.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 bg-muted/30 py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <MapIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No upcoming trips</h3>
              <p className="text-muted-foreground mb-6">Start planning your next adventure today!</p>
              <Button variant="outline" onClick={onCreateTrip}>Create your first trip</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
