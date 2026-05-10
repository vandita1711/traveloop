import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { rpcCall, invalidateCache } from '../api';
import { MapPin, Calendar, Clock, Plus, CheckCircle2, Circle, Trash2, DollarSign, ListChecks, FileText, ChevronRight, Map as MapIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../components/ui/dialog';

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

export function TripDetails({ tripId, onBack }: { tripId: number, onBack: () => void }) {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');

  const loadTrip = useCallback(async () => {
    try {
      console.log("[FETCH_START] get_trip_details", tripId);
      const result = await rpcCall({ func: 'get_trip_details', args: { trip_id: tripId } });
      setTrip(result);
    } catch (error) {
      console.error("[FETCH_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  const handleTogglePacking = async (itemId: number) => {
    try {
      const updated = await rpcCall({ func: 'toggle_packing_item', args: { item_id: itemId } });
      setTrip((prev: any) => ({
        ...prev,
        packing_list: prev.packing_list.map((item: any) => item.id === itemId ? updated : item)
      }));
      invalidateCache(['get_trip_details']);
    } catch (error) {
      console.error("Toggle packing error", error);
    }
  };

  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;
    if (!content) return;

    try {
      const newNote = await rpcCall({ func: 'add_note', args: { trip_id: tripId, content } });
      setTrip((prev: any) => ({
        ...prev,
        notes: [newNote, ...prev.notes]
      }));
      (e.target as HTMLFormElement).reset();
      invalidateCache(['get_trip_details']);
    } catch (error) {
      console.error("Add note error", error);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading trip details...</div>;
  if (!trip) return <div className="p-8 text-center">Trip not found. <Button onClick={onBack}>Go back</Button></div>;

  const budgetData = trip?.budget?.map((item: any) => ({
    name: item.category,
    value: item.amount
  })) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-muted-foreground hover:text-primary">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back to Trips
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {trip.stops.length} Stops</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Share Trip</Button>
          <Button>Edit Trip</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
          <TabsTrigger value="itinerary" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-2 py-3 bg-transparent font-medium">
            <MapIcon className="h-4 w-4 mr-2" /> Itinerary
          </TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-2 py-3 bg-transparent font-medium">
            <DollarSign className="h-4 w-4 mr-2" /> Budget
          </TabsTrigger>
          <TabsTrigger value="packing" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-2 py-3 bg-transparent font-medium">
            <ListChecks className="h-4 w-4 mr-2" /> Packing List
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-2 py-3 bg-transparent font-medium">
            <FileText className="h-4 w-4 mr-2" /> Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary" className="pt-6 space-y-8">
          {trip.stops.length > 0 ? (
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-primary/20 before:to-transparent">
              {trip.stops.map((stop: any, index: number) => (
                <div key={stop.id} className="relative flex items-start group">
                  <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-sm">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="ml-14 flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold font-heading">{stop.city_name}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-fit">
                        <Plus className="h-4 w-4 mr-1" /> Add Activity
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {stop.activities.map((activity: any) => (
                        <Card key={activity.id} className="bg-muted/30 border-none">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-background p-2">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">{activity.name}</p>
                                <p className="text-xs text-muted-foreground">{activity.category} • {activity.duration}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="font-mono">
                              ${activity.cost}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                      {stop.activities.length === 0 && (
                        <div className="col-span-full py-4 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                          No activities planned for this stop yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="ml-14">
                <Button variant="outline" className="border-dashed border-2 h-12 w-full max-w-sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Next Stop
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
              <h3 className="text-xl font-semibold">No stops added yet</h3>
              <p className="text-muted-foreground">Start building your itinerary by adding your first destination.</p>
              <Button size="lg"><Plus className="mr-2 h-5 w-5" /> Add First Stop</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="budget" className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Visualizing your trip expenses</CardDescription>
              </CardHeader>
              <CardContent>
                {budgetData.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex h-6 w-full overflow-hidden rounded-full bg-muted shadow-inner">
                      {budgetData.map((item: any, index: number) => {
                        const total = budgetData.reduce((acc: number, curr: any) => acc + curr.value, 0);
                        const percentage = (item.value / total) * 100;
                        return (
                          <div 
                            key={item.name}
                            style={{ width: `${percentage}%`, backgroundColor: COLORS[index % COLORS.length] }}
                            className="h-full transition-all hover:opacity-80"
                            title={`${item.name}: ${percentage.toFixed(1)}%`}
                          />
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {budgetData.map((item: any, index: number) => (
                        <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{item.name}</span>
                            <span className="text-xs text-muted-foreground">${item.value.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <DollarSign className="h-10 w-10 opacity-10" />
                    <p className="italic">No budget items yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Expense Details</CardTitle>
                  <CardDescription>Track every dollar</CardDescription>
                </div>
                <Button size="sm"><Plus className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trip.budget.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <span className="font-mono font-bold">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="text-lg font-bold">Total Estimated</span>
                    <span className="text-2xl font-bold font-heading text-primary">
                      ${trip.budget.reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="packing" className="pt-6">
          <Card className="border-none shadow-sm max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Essential Packing List</CardTitle>
                  <CardDescription>Don't forget the essentials!</CardDescription>
                </div>
                <Badge variant="outline" className="h-fit">
                  {trip.packing_list.filter((i: any) => i.is_packed).length} / {trip.packing_list.length} Packed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {trip.packing_list.map((item: any) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                    item.is_packed ? "bg-primary/5 border-primary/20 opacity-60" : "hover:border-primary/50"
                  )}
                  onClick={() => handleTogglePacking(item.id)}
                >
                  <div className={cn(
                    "rounded-full p-1",
                    item.is_packed ? "bg-primary text-white" : "border-2 border-muted-foreground/30 text-transparent"
                  )}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className={cn("flex-1 text-sm font-medium", item.is_packed && "line-through")}>
                    {item.item_name}
                  </span>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{item.category}</Badge>
                </div>
              ))}
              <div className="pt-4 flex gap-2">
                <Input placeholder="Add new item..." className="flex-1" />
                <Button size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="pt-6 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Trip Notes</CardTitle>
              <CardDescription>Capture ideas, research, and memories</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNote} className="space-y-4 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="content">New Note</Label>
                  <textarea 
                    id="content"
                    name="content"
                    placeholder="Write something down..."
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Note</Button>
                </div>
              </form>

              <div className="space-y-4">
                {trip.notes.map((note: any) => (
                  <div key={note.id} className="p-4 rounded-lg bg-muted/30 border-l-4 border-primary">
                    <p className="text-sm leading-relaxed">{note.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-tight">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
                {trip.notes.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-4 opacity-10" />
                    <p>No notes for this trip yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
