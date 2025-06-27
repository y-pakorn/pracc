import { getOverviewProtocols } from "@/services/data"
import { ProtocolOverviewTableHeader } from "@/components/table/protocol-overview-table-header"
import { ProtocolOverview } from "@/types"

export const revalidate = false

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
      <div className="text-sm font-semibold">
        <ProtocolOverviewTableHeader
          protocols={protocols}
          className="bg-card rounded-md border py-2"
        />
      </div>
    </>
  )
}
