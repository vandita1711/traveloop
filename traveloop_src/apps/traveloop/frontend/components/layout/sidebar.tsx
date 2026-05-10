"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { logoutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { appNavigation } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex h-full flex-col rounded-[28px] border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3 px-2 pt-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 text-white shadow-glow">
          TL
        </div>
        <div>
          <p className="font-heading text-xl font-semibold text-slate-900">Traveloop</p>
          <p className="text-xs text-muted-foreground">Plan polished multi-city trips</p>
        </div>
      </div>

      <nav className="space-y-2">
        {appNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-slate-950 text-white shadow-soft"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950",
              )}
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutUser} className="mt-auto pt-6">
        <Button type="submit" variant="outline" className="w-full justify-center">
          Sign out
        </Button>
      </form>
    </div>
  );

  return (
    <>
      <div className="hidden w-[290px] shrink-0 lg:block">{content}</div>
      <div className="lg:hidden">
        <Button
          size="icon"
          variant="outline"
          className="fixed left-4 top-4 z-40 bg-white/85"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {open ? (
          <div className="fixed inset-0 z-30 bg-slate-950/20 p-4 pt-20 backdrop-blur-sm">
            {content}
          </div>
        ) : null}
      </div>
    </>
  );
}
