import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
  text-sm font-semibold transition-all duration-200 ease-in-out
  disabled:pointer-events-none disabled:opacity-50
  [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0
  outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
  aria-invalid:border-destructive
  hover:scale-[1.02] active:scale-[0.98] hover:shadow-md active:shadow-sm
  transform-gpu will-change-transform`,
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-lg active:bg-primary/95",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:shadow-lg active:bg-destructive/95 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-body-foreground shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:shadow-lg active:bg-secondary/90",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        sidebarInactive:
          "text-secondary-foreground bg-transparent hover:bg-secondary w-full justify-start font-medium hover:translate-x-1 transition-transform",
        sidebarActive:
          "[&_svg:not([class*='size-'])]:text-accent-foreground text-foreground shadow-xs bg-secondary w-full justify-start border",
        loading:
          "bg-primary/80 text-primary-foreground shadow-xs cursor-not-allowed animate-pulse",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xs: "h-7 rounded-md gap-1 px-2.5 has-[>svg]:px-2 text-xs gap-1 [&_svg:not([class*='size-'])]:size-3.5",
        icon: "size-9",
        smIcon: "size-8",
        xsIcon: "size-6 [&_svg:not([class*='size-'])]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const isDisabled = disabled || loading

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({
          variant: loading ? "loading" : variant,
          size,
          className,
        })
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="mr-2 animate-spin">
          <svg
            className="size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
