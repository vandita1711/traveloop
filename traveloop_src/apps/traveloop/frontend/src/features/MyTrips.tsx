import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { rpcCall } from '../api';
import { Search, MapPin, Calendar, Plus, Filter } from 'lucide-react';

export function MyTrips({ onSelectTrip, onCreateTrip }: { onSelectTrip: (id: number) => void, onCreateTrip: () => void }) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadTrips = useCallback(async () => {
    try {
      console.log("[FETCH_START] get_trips");
      const result = await rpcCall({ func: 'get_trips', args: { user_id: 1 } });
      setTrips(result);
    } catch (error) {
      console.error("[FETCH_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(search.toLowerCase()) || 
    trip.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading your trips...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">My Adventures</h1>
          <p className="text-muted-foreground">Manage and explore all your planned journeys</p>
        </div>
        <Button size="lg" onClick={onCreateTrip}>
          <Plus className="mr-2 h-5 w-5" /> New Journey
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search trips..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const isCompleted = new Date(trip.end_date) < new Date();
            return (
              <Card 
                key={trip.id} 
                className="group cursor-pointer overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => onSelectTrip(trip.id)}
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img 
                    src={trip.id % 2 === 0 ? './assets/card-santorini-1.jpg' : './assets/card-swissalps-1.jpg'} 
                    alt={trip.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={isCompleted ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}>
                      {isCompleted ? "Completed" : "Upcoming"}
                    </Badge>
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
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto opacity-10" />
          <h3 className="text-xl font-semibold">No journeys found</h3>
          <p className="text-muted-foreground">Try adjusting your search or create a new trip.</p>
          <Button variant="outline" onClick={() => setSearch("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}
