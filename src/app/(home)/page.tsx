import { ProtocolOverviewTableHeader } from "@/components/table/protocol-overview-table-header"
import { ProtocolOverview } from "@/types"

const protocols = [
  {
    name: "Tornado Cash V1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Tornado_cash_logo.jpg",
    category: "Payment",
    subcategory: "Mixer",
    liveWhen: "Dec 2019",
    website: "https://tornadocash.eth.limo/",
    tvl: 453090791.82865,
    score: null,
  },
  {
    name: "Tornado Cash Nova",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Tornado_cash_logo.jpg",
    category: "Payment",
    subcategory: "Mixer",
    liveWhen: "Dec 2021",
    website: "https://nova.tornadocash.eth.limo/",
    tvl: null,
    score: null,
  },
  {
    name: "ZCash",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Zcash_logo_%282024%E2%80%93present%29.svg/1200px-Zcash_logo_%282024%E2%80%93present%29.svg.png",
    category: "Payment",
    subcategory: "Privacy Coin",
    liveWhen: "Dec 2016",
    website: "https://z.cash/",
    tvl: null,
    score: null,
  },
  {
    name: "Monero",
    logo: "https://www.getmonero.org/press-kit/symbols/monero-symbol-on-white-480.png",
    category: "Payment",
    subcategory: "Privacy Coin",
    liveWhen: "Jan 2014",
    website: "https://getmonero.org/",
    tvl: null,
    score: null,
  },
  {
    name: "Aztec",
    logo: "https://img.cryptorank.io/coins/aztec1671431774571.png",
    category: "Smart Chain",
    subcategory: "ZK Rollup L2",
    liveWhen: "May 2025",
    website: "https://aztec.network/",
    tvl: 6217357.80931,
    score: null,
  },
  {
    name: "Penumbra",
    logo: "https://img.cryptorank.io/coins/penumbra1672225806163.png",
    category: "Exchange",
    subcategory: "Shielded AMM",
    liveWhen: "Jul 2024",
    website: "https://penumbra.zone/",
    tvl: 10999.23848,
    score: null,
  },
  {
    name: "Namada",
    logo: "https://storage.googleapis.com/members-portal-bucket/uploads/2024/02/686a8b87-namada.jpg",
    category: "Exchange",
    subcategory: "Shielded AMM",
    liveWhen: "Dec 2024",
    website: "https://namada.net/",
    tvl: 946713.34994,
    score: null,
  },
] as ProtocolOverview[]

export default function Home() {
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
