import { env } from "@/env.mjs"

export const siteConfig = {
  name: "PRACC",
  author: "PRACC",
  description:
    "Privacy Robustness Accelerationism, a curated list of privacy-focused projects.",
  keywords: [],
  url: {
    twitter: "https://x.com/pracc_xyz",
    github: "https://github.com/y-pakorn/pracc",
    base: env.NEXT_PUBLIC_APP_URL,
    author: "PRACC",
  },
  twitter: "@pracc_xyz",
  favicon: "/logo.svg",
  ogImage: "https://i.ibb.co/GD9scbD/og.png",
}
