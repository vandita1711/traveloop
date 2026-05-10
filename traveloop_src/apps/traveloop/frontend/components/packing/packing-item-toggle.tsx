"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { togglePackingItemAction } from "@/actions/trips";
import { Checkbox } from "@/components/ui/checkbox";

export function PackingItemToggle({
  itemId,
  checked,
}: {
  itemId: string;
  checked: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Checkbox
      checked={checked}
      disabled={isPending}
      onChange={() => {
        startTransition(async () => {
          await togglePackingItemAction(itemId);
          router.refresh();
        });
      }}
    />
  );
}
