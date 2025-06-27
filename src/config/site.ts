import { env } from "@/env.mjs"

export const siteConfig = {
  name: "PRACC",
  author: "PRACC",
  description:
    "Privacy Robustness Accelerationism, a curated list of privacy-focused projects.",
  keywords: [],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "PRACC",
  },
  twitter: "",
  favicon: "/favicon.ico",
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}
