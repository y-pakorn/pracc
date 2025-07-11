import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { getOverviewProtocols } from "@/services/data"
import { ProtocolOverviewTableHeader } from "@/components/table/protocol-overview-table-header"

export const metadata: Metadata = {
  title: "Protocols",
  description: "A list of all privacy preserving protocols",
  openGraph: {
    title: "Protocols",
    description: "A list of all privacy preserving protocols",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Protocols",
      },
    ],
  },
}

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
