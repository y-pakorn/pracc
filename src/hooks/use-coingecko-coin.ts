import { useQuery } from "@tanstack/react-query"
import _ from "lodash"

import { RawCoingeckoCoin } from "@/types"

export const useCoingeckoCoins = (coinGeckoIds: string[]) => {
  return useQuery<Record<string, RawCoingeckoCoin>>({
    queryKey: ["coingecko-coin", coinGeckoIds],
    queryFn: async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
          coinGeckoIds.join(",")
        )}&price_change_percentage=24h&sparkline=false`
      ).then((res) => res.json())
      return _.keyBy(res as RawCoingeckoCoin[], "id")
    },
  })
}

export const useCoingeckoCoin = (coinGeckoId: string) => {
  return useQuery<RawCoingeckoCoin>({
    queryKey: ["coingecko-coin", coinGeckoId],
    queryFn: async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
          coinGeckoId
        )}&price_change_percentage=24h&sparkline=false`
      ).then((res) => res.json())
      return res[0] as RawCoingeckoCoin
    },
  })
}
