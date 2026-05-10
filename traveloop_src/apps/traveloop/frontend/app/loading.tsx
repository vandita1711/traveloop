import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#eef4ff] p-6">
      <div className="mx-auto flex max-w-[1600px] gap-6">
        <Skeleton className="hidden h-[88vh] w-[290px] lg:block" />
        <div className="flex-1 space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-72 w-full" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
