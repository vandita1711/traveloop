import Link from "next/link";
import { ArrowRight, CalendarRange, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-slate-950 px-6 py-8 text-white shadow-card md:px-10 md:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,101,242,0.55),transparent_32%),radial-gradient(circle_at_right,rgba(40,199,255,0.32),transparent_28%)]" />
      <div className="absolute right-6 top-6 hidden h-28 w-28 rounded-full bg-white/10 blur-3xl md:block" />
      <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            Personalized travel planning made easy
          </div>
          <div className="space-y-3">
            <h2 className="font-heading text-3xl font-semibold leading-tight md:text-5xl">
              Build beautiful multi-city trips in one calm, structured workspace.
            </h2>
            <p className="max-w-2xl text-sm text-white/75 md:text-base">
              Organize stops, activity ideas, budgets, notes, and packing lists with a SaaS-style dashboard that is made to demo well.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/trips/new">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-white/90">
                <CalendarRange className="h-4 w-4" />
                Create a new trip
              </Button>
            </Link>
            <Link href="/trips">
              <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                Explore your plans
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/70">This week</p>
            <p className="mt-2 font-heading text-3xl font-semibold">2 active trips</p>
            <p className="mt-2 text-sm text-white/70">
              One confirmed itinerary and one planning route with shared links ready to demo.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs text-white/70">Cities</p>
              <p className="mt-2 font-heading text-2xl font-semibold">5</p>
            </div>
            <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs text-white/70">Packed items</p>
              <p className="mt-2 font-heading text-2xl font-semibold">3</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
