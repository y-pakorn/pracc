import { Github, LayoutDashboard, Twitter } from "lucide-react"

import { siteConfig } from "@/config/site"

export const nav = Object.freeze([
  {
    title: "Statistics",
    items: [
      {
        icon: LayoutDashboard,
        label: "Overview",
        href: "/",
      },
    ],
  },
  {
    title: "About",
    items: [
      {
        icon: Twitter,
        label: "Twitter",
        href: siteConfig.url.twitter,
        isExternal: true,
      },
      {
        icon: Github,
        label: "GitHub",
        href: siteConfig.url.github,
        isExternal: true,
      },
    ],
  },
] as {
  title: string
  items: {
    icon: React.ElementType
    label: string
    href: string
    isExternal?: boolean
  }[]
}[])
