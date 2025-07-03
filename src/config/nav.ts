import {
  BarChart,
  Book,
  ChartColumnStacked,
  Github,
  LayoutDashboard,
  MessageCircle,
  Twitter,
} from "lucide-react"

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
      {
        icon: ChartColumnStacked,
        label: "Dominance",
        href: "/dominance",
      },
    ],
  },
  {
    title: "About",
    items: [
      {
        icon: Book,
        label: "Methodology",
        href: "/methodology",
      },
      {
        icon: MessageCircle,
        label: "Feedback",
        href: "https://pracc.userjot.com/",
        isExternal: true,
      },
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
