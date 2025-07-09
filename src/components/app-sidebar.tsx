"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import { nav } from "@/config/nav"
import { cn } from "@/lib/utils"

import { Logo } from "./logo"
import { Button } from "./ui/button"

export function AppSidebar({
  className,
  onNavClick,
  ...props
}: React.ComponentProps<"div"> & {
  onNavClick?: (href: string) => void
}) {
  const pathname = usePathname()

  return (
    <div {...props} className={cn("flex flex-col gap-6", className)}>
      <div>
        <div className="flex items-center gap-0.5">
          <Logo className="size-5" />
          <h1 className="text-xl font-extrabold tracking-[-0.06em]">PRACC</h1>
        </div>
        <h2 className="text-secondary-foreground text-xs">
          <span className="font-bold">P</span>rivacy{" "}
          <span className="font-bold">R</span>obustness{" "}
          <span className="font-bold">Acc</span>elerationism
        </h2>
      </div>

      {nav.map((section, i) => (
        <div key={i} className="space-y-1">
          <div className="text-muted-foreground text-xs font-medium">
            {section.title}
          </div>
          <div className="flex flex-col gap-1">
            {section.items.map((item, i) => {
              return (
                <Link
                  href={item.href}
                  key={i}
                  className="group"
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  onClick={() => onNavClick?.(item.href)}
                >
                  <Button
                    size="sm"
                    variant={
                      pathname === item.href
                        ? "sidebarActive"
                        : "sidebarInactive"
                    }
                    className="group"
                  >
                    <item.icon />
                    {item.label}
                    <div className="flex-1" />
                    {item.isExternal && (
                      <ArrowUpRight className="text-muted-foreground size-4 transition-transform duration-700 group-hover:rotate-360" />
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
