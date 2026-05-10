import { Compass, MapPinned, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="auth-surface min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between rounded-[32px] bg-slate-950 px-8 py-10 text-white shadow-card md:px-10">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
              <Compass className="h-4 w-4" />
              Personalized Travel Planning Made Easy
            </div>
            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-semibold leading-tight md:text-6xl">
                Plan the whole trip,
                <span className="block text-cyan-300">not just the flights.</span>
              </h1>
              <p className="max-w-xl text-base text-white/72">
                Traveloop gives you one polished workspace for routes, activities, budgets, notes, and public sharing.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
              <MapPinned className="h-5 w-5 text-cyan-300" />
              <p className="mt-4 font-heading text-xl font-semibold">Multi-city</p>
              <p className="mt-2 text-sm text-white/65">Build complete city-by-city routes.</p>
            </div>
            <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-cyan-300" />
              <p className="mt-4 font-heading text-xl font-semibold">Demo-first</p>
              <p className="mt-2 text-sm text-white/65">Seeded data makes the experience feel alive instantly.</p>
            </div>
            <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
              <Compass className="h-5 w-5 text-cyan-300" />
              <p className="mt-4 font-heading text-xl font-semibold">Shareable</p>
              <p className="mt-2 text-sm text-white/65">Public itinerary links are baked into the plan.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
