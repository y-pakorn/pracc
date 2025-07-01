"use client"

import * as React from "react"
import { useCallback, useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowUpRight,
  Flag,
  Github,
  Globe,
  LayoutDashboard,
  Settings,
  SunMoon,
  Twitter,
} from "lucide-react"
import { useTheme } from "next-themes"

import { nav } from "@/config/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { Button } from "./ui/button"

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const pathname = usePathname()
  const router = useRouter()

  const { setTheme, resolvedTheme } = useTheme()
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [setTheme, resolvedTheme])

  return (
    <div {...props} className={cn("flex flex-col gap-6", className)}>
      <div>
        <h1 className="text-xl font-bold">PRACC</h1>
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
