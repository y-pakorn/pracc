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
  RawProtocol,
} from "@/types"

export const getRawProtocols = cache(async (): Promise<RawProtocol[]> => {
  const response = await fetch(env.DATA_API_URL)
  return response.json()
})

export const getMiniProtocols = cache(async (): Promise<MiniProtocol[]> => {
  const protocols = await getRawProtocols()
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

const getCoins = cache(async (coinIds: string[]) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
      coinIds.join(",")
    )}&price_change_percentage=24h&sparkline=true`
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
      fdvs: _.chain(c.sparkline_in_7d.price)
        .filter((_, i) => i % 12 === 0)
        .map((p) => p * c.total_supply)
        .value() as number[],
    }))
    .groupBy("id")
    .mapValues((c) => c[0])
    .value()
  return data
})

export const getOverviewProtocols = cache(
  async (): Promise<{
    protocols: ProtocolOverview[]
    allTvls: Record<"month" | "year" | "all", OverallTvl[]>
    allFdvs: OverallFdv[]
  }> => {
    const rawProtocols = await getRawProtocols()
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
          score: null,
          ipc: rawProtocol.ipc,
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
