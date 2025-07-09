import { Metadata } from "next"
import _ from "lodash"

import { siteConfig } from "@/config/site"
import { getOverviewProtocols } from "@/services/data"
import { DominanceChart } from "@/components/chart/dominance-chart"

export const metadata: Metadata = {
  title: "Dominance",
  description: "Dominance of protocols among all privacy preserving protocols",
  openGraph: {
    title: "Dominance",
    description:
      "Dominance of protocols among all privacy preserving protocols",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Dominance",
      },
    ],
  },
}

export default async function DominancePage() {
  const { allTvls, protocols } = await getOverviewProtocols()
  const [prev, curr] = allTvls.month.slice(-2)

  return (
    <div>
      <DominanceChart
        tvl={_.chain(curr.tvls)
          .entries()
          .map(([name, tvl]) => ({
            name,
            logo: protocols.find((p) => p.name === name)?.logo || "",
            tvl,
            tvls: _.chain(allTvls.month)
              .slice(-14)
              .map((d) => d.tvls[name] || 0)
              .value(),
            pct: tvl / curr.totalTvl,
            change24h: prev.tvls[name]
              ? (tvl - prev.tvls[name]) / prev.tvls[name]
              : 0,
          }))
          .value()}
      />
    </div>
  )
}
