import { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ComingSoonCard({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {badge}
      </CardHeader>
      <CardContent>
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-muted-foreground">
          This screen is scaffolded and wired into navigation. The full interactive experience lands in the next implementation phase.
        </div>
      </CardContent>
    </Card>
  );
}
