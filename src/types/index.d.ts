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
  ipc: number
  overallScore: number
}

export type RawInternalProtocol = {
  asc_id: string
  name: string
  category: string
  sub_category: string
  live_at: string
  privacy_stack: string // comma separated
  tech_stack: string // comma separated
  priv_who: number | string
  priv_what: number | string
  de_anon: number | string
  liveness_req: number | string
  base_maturity: number | string
  punk_lv: number | string
  overall_score: number
  note: string
}

export type RawProtocol = {
  id: string
  name: string
  description?: string
  twitter_url?: string
  live_at: string
  url: string
  logo_url: string
  defillama_slug: string
  coingecko_id: string
  categories: string // comma separated
  sub_categories: string // comma separated
  ipc: number
  overall_score: number
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

export type ProtocolTvl = {
  date: number
  tvl: number
}

export type OverallFdv = {
  date: number
  totalFdv: number
  fdvs: Record<string, number>
}

export type ProtocolFdv = {
  date: number
  fdv: number
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

export type RawCoingeckoCoin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_supply: number
  max_supply: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
}
