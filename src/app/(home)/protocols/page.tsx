import { getOverviewProtocols } from "@/services/data"
import { ProtocolOverviewTableHeader } from "@/components/table/protocol-overview-table-header"

export default async function ProtocolsPage() {
  const { protocols } = await getOverviewProtocols()
  return (
    <ProtocolOverviewTableHeader
      protocols={protocols}
      className="bg-card rounded-md border py-2 text-sm"
      defaultLimit={15}
      limits={[10, 15, 20, 25, 30]}
    />
  )
}
