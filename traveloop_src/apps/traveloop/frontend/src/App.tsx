import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { LayoutDashboard, Map as MapIcon, Compass, Settings, LogOut, Menu, X, Plus } from 'lucide-react';
import { cn } from './lib/utils';
import { rpcCall, invalidateCache } from './api';
import { DashboardView } from './features/Dashboard';
import { MyTrips } from './features/MyTrips';
import { TripDetails } from './features/TripDetails';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'trips' | 'explore' | 'settings'>('dashboard');
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("RENDER_SUCCESS");
  }, []);

  const handleSelectTrip = (id: number) => {
    setSelectedTripId(id);
    setActiveView('trips');
    setSidebarOpen(false);
  };

  const handleCreateTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      description: formData.get('description') as string,
    };

    try {
      console.log("[ACTION_START] create_trip");
      const result = await rpcCall({ func: 'create_trip', args: payload });
      console.log("[FETCH_RESPONSE]", result);
      
      // Force immediate re-render by updating state and closing dialog
      setCreateDialogOpen(false);
      
      // Invalidate caches before selecting the trip to ensure data is fresh when it loads
      await invalidateCache(['get_dashboard_data', 'get_trips']);
      
      handleSelectTrip(result.id);
    } catch (error) {
      console.error("Create trip failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trips', label: 'My Trips', icon: MapIcon },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    if (selectedTripId) {
      return <TripDetails tripId={selectedTripId} onBack={() => setSelectedTripId(null)} />;
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView onSelectTrip={handleSelectTrip} onCreateTrip={() => setCreateDialogOpen(true)} />;
      case 'trips':
        return <MyTrips onSelectTrip={handleSelectTrip} onCreateTrip={() => setCreateDialogOpen(true)} />;
      case 'explore':
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
            <Compass className="h-16 w-16 text-muted-foreground opacity-20" />
            <h2 className="text-2xl font-bold font-heading">Explore Destinations</h2>
            <p className="text-muted-foreground">Discover and search for new places to visit. (Coming soon)</p>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-heading">Settings</h2>
            <div className="space-y-4 max-w-xl">
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold">Connect Socials</h3>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 gap-2">
                    <img src="./assets/logo-google.png" alt="Google" className="h-4 w-4" /> Google
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <img src="./assets/logo-facebook.png" alt="Facebook" className="h-4 w-4" /> Facebook
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r bg-muted/30">
        <div className="p-6 flex items-center gap-3">
          <div className="rounded-xl bg-primary p-2">
            <PlaneIcon className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-primary">Traveloop</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as any);
                setSelectedTripId(null);
              }}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                activeView === item.id && !selectedTripId
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <Separator className="mb-4" />
          <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5">
              <PlaneIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading font-bold text-primary">Traveloop</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </header>

        {/* Mobile Nav Overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-background pt-16">
            <nav className="p-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as any);
                    setSelectedTripId(null);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 w-full rounded-xl px-6 py-4 text-lg font-medium",
                    activeView === item.id && !selectedTripId
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground bg-muted/50"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      {/* Create Trip Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleCreateTrip}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">Start a New Journey</DialogTitle>
              <DialogDescription>Fill in the details to begin planning your next adventure.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="name">Trip Name</Label>
                <Input id="name" name="name" placeholder="e.g., Summer in Europe" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" name="start_date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" name="end_date" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="What's the vibe of this trip?" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Journey"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlaneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

export default App;
