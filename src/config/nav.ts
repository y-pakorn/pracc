import {
  BarChart,
  Book,
  ChartColumnStacked,
  Github,
  LayoutDashboard,
  List,
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
        icon: List,
        label: "Protocols",
        href: "/protocols",
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
        label: "Spec & Feedback",
        href: "https://www.notion.so/Specification-for-the-Privacy-Robustness-Acceleration-PR-ACC-Framework-22425b25d0bc8099b8abe286640cfdcd",
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
