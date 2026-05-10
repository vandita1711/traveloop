import { Bell, Search } from "lucide-react";

import { auth } from "@/lib/auth";

export async function Topbar() {
  const session = await auth();

  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-card backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="font-heading text-2xl font-semibold text-slate-950">
          {session?.user?.name?.split(" ")[0] ?? "Traveler"}, your next journey is taking shape
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-12 min-w-[220px] items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          Search trips, cities, activities
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white">
          <Bell className="h-4 w-4 text-slate-600" />
        </button>
        <div className="rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white">
          {session?.user?.name?.slice(0, 2).toUpperCase() ?? "TL"}
        </div>
      </div>
    </header>
  );
}
