import { useQuery } from "@tanstack/react-query"

export const useCoingeckoHistoricalData = (coinGeckoId: string) => {
  return useQuery({
    queryKey: ["coingecko-historical-data", coinGeckoId],
    queryFn: async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinGeckoId}/market_chart?vs_currency=usd&days=365`
      )
      const data = await res.json()
      return data as {
        market_caps: [number, number][]
        total_volumes: [number, number][]
        prices: [number, number][]
      }
    },
  })
}
