import { cache } from "react"
import _ from "lodash"

import { env } from "@/env.mjs"
import { dayjs } from "@/lib/dayjs"
import { OverallTvl, ProtocolOverview, RawProtocol } from "@/types"

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
    allTvls: Record<"month" | "year" | "all", OverallTvl[]>
  }> => {
    const rawProtocols = await getRawProtocols()

    const allTvls: Record<number, Record<string, number>> = {}

    const protocols = await Promise.all(
      rawProtocols.map(async (rawProtocol) => {
        const tvl = await getTvl(rawProtocol.defillama_slug)
        if (tvl) {
          tvl.forEach((d) => {
            const date = dayjs
              .utc(d.date * 1000)
              .startOf("day")
              .unix()

            if (!allTvls[date]) {
              allTvls[date] = {}
            }
            allTvls[date][rawProtocol.name] = d.tvl
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

    const iter = _.chain(allTvls)
      .entries()
      .map(([date, tvls]) => ({
        date: Number(date),
        totalTvl: _.chain(tvls).values().sum().value(),
        tvls,
      }))
      .sortBy((d) => -d.date)

    const month = iter.slice(0, 60).reverse().value()
    const year = iter
      .slice(0, 520)
      .filter((_, i) => i % 7 === 0)
      .reverse()
      .value()
    const all = iter
      .filter((_, i) => i % 30 === 0)
      .reverse()
      .value()

    return {
      protocols,
      allTvls: {
        month,
        year,
        all,
      },
    }
  }
)
