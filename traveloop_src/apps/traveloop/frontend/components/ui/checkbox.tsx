import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-5 w-5 rounded-md border border-slate-300 accent-[hsl(var(--primary))] transition",
        className,
      )}
      {...props}
    />
  ),
);

Checkbox.displayName = "Checkbox";
