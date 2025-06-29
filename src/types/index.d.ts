export type ProtocolOverview = {
  name: string
  logo: string
  category: string
  subcategory: string
  liveWhen: string
  website: string
  tvl: number | null
  coin: CoinGeckoCoin | null
  score: number | null
}

export type RawProtocol = {
  name: string
  category: string
  sub_category: string
  live_at: string
  url: string
  logo_url: string
  defillama_slug: string
  coingecko_id: string
  privacy_stack: string
  tech_stack: string
  priv_who: number | string
  priv_what: number | string
  de_anon: number | string
  liveness_req: number | string
  base_maturity: number | string
  punk_lv: number | string
}

export type MiniProtocol = {
  name: string
  category: string
  subcategory: string
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
