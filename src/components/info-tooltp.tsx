import { memo } from "react"
import { Info } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export const InfoTooltip = memo(
  ({
    children,
    className,
    tooltipProps,
    ...props
  }: React.ComponentProps<typeof Button> & {
    tooltipProps?: React.ComponentProps<typeof TooltipContent>
  }) => {
    return (
      <Tooltip {...tooltipProps}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="xsIcon"
            className={cn("p-0", className)}
            {...props}
          >
            <Info />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-pretty">
          {children}
        </TooltipContent>
      </Tooltip>
    )
  }
)

InfoTooltip.displayName = "InfoTooltip"
