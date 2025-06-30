export type ProtocolOverview = {
  id: string
  name: string
  logo: string
  categories: string[]
  subCategories: string[]
  liveWhen: string
  website: string
  tvl: number | null
  coin: CoinGeckoCoin | null
  score: number | null
  ipc: number
}

export type RawProtocol = {
  id: string
  name: string
  live_at: string
  url: string
  logo_url: string
  defillama_slug: string
  coingecko_id: string
  categories: string // comma separated
  sub_categories: string // comma separated
  ipc: number
}

export type MiniProtocol = {
  id: string
  name: string
  categories: string[]
  subCategories: string[]
  logo: string
}

export type OverallTvl = {
  date: number
  totalTvl: number
  tvls: Record<string, number>
}

export type OverallFdv = {
  date: number
  totalFdv: number
  fdvs: Record<string, number>
}

export type CoinGeckoCoin = {
  id: string
  symbol: string
  image: string
  totalSupply: number
  currentPrice: number
  fdv: number
  change24h: number
}
