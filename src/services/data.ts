import { cache } from "react"
import _ from "lodash"

import { env } from "@/env.mjs"
import { ProtocolOverview, RawProtocol } from "@/types"

export const getRawProtocols = cache(async (): Promise<RawProtocol[]> => {
  const response = await fetch(env.DATA_API_URL)
  return response.json()
})

const getTvl = cache(async (s: string) => {
  if (!s) return null

  const baseUrl = "https://api.llama.fi"

  const [type, slug] = s.split(":")

  if (type === "p") {
    // protocoll
    const response = await fetch(`${baseUrl}/protocol/${slug}`).then((res) =>
      res.json()
    )

    return response.tvl.map((d: any) => ({
      tvl: d.totalLiquidityUSD,
      date: d.date,
    })) as {
      tvl: number
      date: number
    }[]
  } else if (type === "c") {
    // chain
    const response = await fetch(
      `${baseUrl}/v2/historicalChainTvl/${slug}`
    ).then((res) => res.json())

    return response as {
      tvl: number
      date: number
    }[]
  }
  return null
})

export const getOverviewProtocols = cache(
  async (): Promise<{
    protocols: ProtocolOverview[]
    allTvls: {
      date: number
      totalTvl: number
      tvls: {
        name: string
        tvl: number
      }[]
    }[]
  }> => {
    const rawProtocols = await getRawProtocols()

    const allTvls: Record<
      number,
      {
        name: string
        tvl: number
      }[]
    > = {}

    const protocols = await Promise.all(
      rawProtocols.map(async (rawProtocol) => {
        const tvl = await getTvl(rawProtocol.defillama_slug)
        if (tvl) {
          tvl.forEach((d) => {
            if (!allTvls[d.date]) {
              allTvls[d.date] = []
            }
            allTvls[d.date].push({
              name: rawProtocol.name,
              tvl: d.tvl,
            })
          })
        }
        return {
          name: rawProtocol.name,
          category: rawProtocol.category,
          subcategory: rawProtocol.sub_category,
          liveWhen: rawProtocol.live_at,
          website: rawProtocol.url,
          logo: rawProtocol.logo_url,
          tvl: _.last(tvl)?.tvl ?? null,
          score: null,
        }
      })
    )

    return {
      protocols,
      allTvls: _.chain(allTvls)
        .entries()
        .map(([date, tvls]) => ({
          date: Number(date),
          totalTvl: _.sumBy(tvls, "tvl"),
          tvls,
        }))
        .value(),
    }
  }
)
