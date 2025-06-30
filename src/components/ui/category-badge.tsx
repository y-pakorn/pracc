import { memo } from "react"

import { getColor } from "@/lib/color"
import { cn } from "@/lib/utils"

import { Badge } from "./badge"

export const CategoryBadge = memo(
  ({
    category,
    className,
    ...props
  }: { category: string } & React.ComponentProps<"div">) => {
    return (
      <Badge
        variant="outline"
        className={cn("cursor-pointer", className)}
        {...props}
      >
        <div
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: getColor(category).hex() }}
        />
        {category}
      </Badge>
    )
  }
)
CategoryBadge.displayName = "CategoryBadge"
