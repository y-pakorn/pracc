import _ from "lodash"

import { getOverviewProtocols } from "@/services/data"
import { OverallFdvChart } from "@/components/chart/overall-fdv-chart"
import { OverallTvlChart } from "@/components/chart/overall-tvl-chart"
import { ProtocolOverviewTableHeader } from "@/components/table/protocol-overview-table-header"

export default async function Home() {
  const { protocols, allTvls, allFdvs } = await getOverviewProtocols()

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-card flex flex-col justify-center gap-3 rounded-md border p-2">
          <div className="space-y-1 p-1 pb-0">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold">
                Privacy Protocol Overview
              </h1>
            </div>
            <h2 className="text-body-foreground text-sm font-medium">
              Under{" "}
              <span className="italic">Privacy Robustness Accelerationism</span>
            </h2>
            <p className="text-secondary-foreground text-xs">
              A curated list of privacy-focused protocols including mixers,
              cryptography solutions, and privacy applications. Each protocol is
              evaluated based on multiple metrics to provide an objective
              overview.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Protocols",
                value: protocols.length,
              },
              {
                label: "Categories",
                value: _.chain(protocols).flatMap("categories").uniq().value()
                  .length,
              },
              {
                label: "Subcategories",
                value: _.chain(protocols)
                  .flatMap("subCategories")
                  .uniq()
                  .value().length,
              },
            ].map(({ label, value }, i) => (
              <div key={i} className="bg-background rounded-md p-2 text-end">
                <p className="text-secondary-foreground text-xs font-medium">
                  {label}
                </p>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <OverallFdvChart fdvs={allFdvs} />
      </div>
      <OverallTvlChart tvls={allTvls} />
      <ProtocolOverviewTableHeader
        protocols={protocols}
        className="bg-card rounded-md border py-2 text-sm"
      />
    </>
  )
}
