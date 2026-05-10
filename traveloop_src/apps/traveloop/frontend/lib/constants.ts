import {
  Backpack,
  BarChart3,
  CalendarRange,
  Compass,
  LayoutDashboard,
  Map,
  NotebookTabs,
  Search,
  Share2,
} from "lucide-react";

export const appNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Trips", href: "/trips", icon: Map },
  { label: "Create Trip", href: "/trips/new", icon: CalendarRange },
  { label: "Activity Search", href: "/explore/activities", icon: Search },
  { label: "Budget", href: "/budget", icon: BarChart3 },
  { label: "Packing", href: "/packing", icon: Backpack },
  { label: "Notes", href: "/notes", icon: NotebookTabs },
  { label: "Community", href: "/community", icon: Compass },
  { label: "Shared Trips", href: "/shared", icon: Share2 },
];

export const recommendationCards = [
  {
    title: "Tokyo after dark",
    description: "Compact city stops for food-first itineraries and metro-friendly nights.",
    tag: "Food trails",
  },
  {
    title: "Bali reset week",
    description: "Wellness stays, scooter loops, and ocean-view work sessions.",
    tag: "Slow travel",
  },
  {
    title: "Dubai weekend sprint",
    description: "High-contrast luxury, desert adventure, and skyline dining in three days.",
    tag: "Short trip",
  },
];
