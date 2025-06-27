import { getOverviewProtocols } from "@/services/data"
import { OverallTvlChart } from "@/components/chart/overall-tvl-chart"
import { ProtocolOverviewTableHeader } from "@/components/table/protocol-overview-table-header"

export const revalidate = 60 * 60 * 12 // 12 hours

export default async function Home() {
  const { protocols, allTvls } = await getOverviewProtocols()

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Privacy Protocol Overview</h1>
        <p className="text-secondary-foreground text-sm">
          This is a curated list of privacy-focused protocols, including mixers,
          zero-knowledge solutions, and privacy-preserving applications. We
          carefully evaluate each protocol based on their security model,
          decentralization, and real-world usage to provide an objective
          overview of the privacy landscape.
        </p>
      </div>
      <OverallTvlChart tvls={allTvls} />
      <ProtocolOverviewTableHeader
        protocols={protocols}
        className="bg-card rounded-md border py-2 text-sm"
      />
    </>
  )
}
