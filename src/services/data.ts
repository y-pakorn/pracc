import { cache } from "react"
import _ from "lodash"

import { env } from "@/env.mjs"
import { dayjs } from "@/lib/dayjs"
import {
  CoinGeckoCoin,
  MiniProtocol,
  OverallFdv,
  OverallTvl,
  ProtocolOverview,
  RawInternalProtocol,
  RawProtocol,
} from "@/types"

export const getRawProtocols = cache(
  async (): Promise<{
    protocols: RawProtocol[]
    internalProtocols: RawInternalProtocol[]
  }> => {
    const response = await fetch(env.DATA_API_URL).then((res) => res.json())
    return {
      protocols: response["Protocols"],
      internalProtocols: response["InternalProtocols"],
    }
  }
)

export const getMiniProtocols = cache(async (): Promise<MiniProtocol[]> => {
  const { protocols } = await getRawProtocols()
  return _.chain(protocols)
    .map((p) => ({
      id: p.id,
      name: p.name,
      categories: p.categories.split(","),
      subCategories: p.sub_categories.split(","),
      logo: p.logo_url,
    }))
    .value()
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

const getCoins = cache(async (coinIds: string[], sparkline: boolean = true) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
      coinIds.join(",")
    )}&price_change_percentage=24h&sparkline=${sparkline}`
  ).then((res) => res.json())
  const data = _.chain(response)
    .map((c) => ({
      id: c.id as string,
      symbol: c.symbol as string,
      image: c.image as string,
      totalSupply: c.total_supply as number,
      currentPrice: c.current_price as number,
      fdv: (c.current_price * c.total_supply) as number,
      change24h: c.price_change_percentage_24h as number,
      fdvs: _.chain(c.sparkline_in_7d?.price)
        .filter((_, i) => i % 12 === 0)
        .map((p) => p * c.total_supply)
        .value() as number[],
    }))
    .groupBy("id")
    .mapValues((c) => c[0])
    .value()
  return data
})

const getCoinHistoricalData = cache(async (coinId: string) => {
  if (!coinId) return null
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=365`
  ).then((res) => res.json())
  return response as {
    prices: [number, number][]
    market_caps: [number, number][]
    total_volumes: [number, number][]
  }
})

export const getOverviewProtocols = cache(
  async (): Promise<{
    protocols: ProtocolOverview[]
    allTvls: Record<"month" | "year" | "all", OverallTvl[]>
    allFdvs: OverallFdv[]
  }> => {
    const { protocols: rawProtocols } = await getRawProtocols()
    const coins = await getCoins(
      rawProtocols.map((r) => r.coingecko_id).filter((c) => c !== "")
    )

    const allTvls: Record<number, Record<string, number>> = {}
    const allFdvs: Record<number, Record<string, number>> = {}

    const currentDay = dayjs.utc().startOf("day")
    const protocols = await Promise.all(
      rawProtocols.map(async (rawProtocol) => {
        const tvl = await getTvl(rawProtocol.defillama_slug)
        const coin = coins[rawProtocol.coingecko_id]
        if (coin) {
          const fdvs = coin.fdvs
          for (let i = 0; i < fdvs.length; i++) {
            const date = currentDay.subtract(i * 12, "hour").unix()
            if (!allFdvs[date]) {
              allFdvs[date] = {}
            }
            allFdvs[date][rawProtocol.name] = fdvs[i]
          }
        }
        if (tvl) {
          tvl.forEach((d) => {
            if (d.tvl === 0) return

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
          id: rawProtocol.id,
          name: rawProtocol.name,
          categories: rawProtocol.categories.split(","),
          subCategories: rawProtocol.sub_categories.split(","),
          liveWhen: rawProtocol.live_at,
          website: rawProtocol.url,
          logo: rawProtocol.logo_url,
          tvl: _.last(tvl)?.tvl ?? null,
          coin: coin ? _.omit(coin, "fdvs") : null,
          ipc: rawProtocol.ipc,
          overallScore: rawProtocol.overall_score,
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
      allFdvs: _.chain(allFdvs)
        .entries()
        .map(([date, fdvs]) => ({
          date: Number(date),
          totalFdv: _.chain(fdvs).values().sum().value(),
          fdvs,
        }))
        .sortBy((d) => -d.date)
        .slice(0, 14)
        .reverse()
        .value(),
    }
  }
)

export const getProtocol = cache(async (id: string) => {
  const { protocols, internalProtocols: rawInternalProtocols } =
    await getRawProtocols()
  const protocol = protocols.find((p) => p.id === id)
  const internalProtocols = rawInternalProtocols.filter((p) => p.asc_id === id)

  if (!protocol) return null

  const tvl = await getTvl(protocol.defillama_slug)

  return {
    protocol,
    internalProtocols,
    tvl: !tvl
      ? null
      : (() => {
          const iter = _.chain(tvl)
            .map((d) => ({
              date: dayjs
                .utc(d.date * 1000)
                .startOf("day")
                .unix(),
              tvl: d.tvl,
            }))
            .sortBy((d) => -d.date)
          return {
            month: iter.slice(0, 60).reverse().value(),
            year: iter
              .slice(0, 520)
              .filter((_, i) => i % 7 === 0)
              .reverse()
              .value(),
            all: iter
              .filter(
                (_, i) =>
                  i % Math.max(1, Math.min(30, Math.floor(tvl.length / 30))) ===
                  0
              )
              .reverse()
              .value(),
          }
        })(),
  }
})
