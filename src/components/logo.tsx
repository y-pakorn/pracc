import React from "react"

import { cn } from "@/lib/utils"

export function Logo({ className, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      src="/logo.svg"
      alt="Logo"
      className={cn("size-5 shrink-0 invert dark:invert-0", className)}
      {...props}
    />
  )
}
