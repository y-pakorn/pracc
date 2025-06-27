"use client"

import * as React from "react"
import { useCallback, useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Flag,
  Globe,
  LayoutDashboard,
  Settings,
  SunMoon,
  Twitter,
} from "lucide-react"
import { useTheme } from "next-themes"

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

  const sections = useMemo(
    () =>
      [
        {
          title: "Statistics",
          items: [
            {
              icon: LayoutDashboard,
              label: "Overview",
              href: "/",
            },
            {
              icon: Globe,
              label: "Chains",
              href: "/chains",
            },
          ],
        },
        {
          title: "About",
          items: [
            {
              icon: Flag,
              label: "Our Mission",
              href: "/mission",
            },
            {
              icon: Twitter,
              label: "Twitter",
              href: "https://x.com/pracc_xyz",
              isExternal: true,
            },
          ],
        },
      ] as {
        title: string
        items: {
          icon: React.ElementType
          label: string
          href?: string
          onClick?: () => void
          isExternal?: boolean
        }[]
      }[],
    [toggleTheme]
  )

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

      {sections.map((section, i) => (
        <div key={i} className="space-y-1">
          <div className="text-muted-foreground text-xs font-medium">
            {section.title}
          </div>
          <div className="flex flex-col gap-1">
            {section.items.map((item, i) => {
              return (
                <Button
                  key={i}
                  size="sm"
                  variant={
                    pathname === item.href ? "sidebarActive" : "sidebarInactive"
                  }
                  onClick={() => {
                    if (item.href) {
                      if (item.isExternal) {
                        window.open(item.href, "_blank", "noopener,noreferrer")
                      } else {
                        router.push(item.href)
                      }
                    }
                    if (item.onClick) {
                      item.onClick()
                    }
                  }}
                >
                  <item.icon />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
