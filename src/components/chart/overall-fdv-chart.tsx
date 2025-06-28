"use client"

import React, { useMemo, useState } from "react"
import _ from "lodash"
import { Check } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { match } from "ts-pattern"

import { getColor } from "@/lib/color"
import { dayjs } from "@/lib/dayjs"
import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { OverallFdv, OverallTvl } from "@/types"

import { Button } from "../ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import { Separator } from "../ui/separator"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

export function OverallFdvChart({
  fdvs,
  className,
  ...props
}: {
  fdvs: OverallFdv[]
} & React.ComponentProps<"div">) {
  const { config, protocols, change, firstFdv, lastFdv } = useMemo(() => {
    const protocols = _.chain(fdvs)
      .map((f) => _.keys(f.fdvs))
      .flatten()
      .uniq()
      .value()
    return {
      config: _.chain(protocols)
        .map((p) => [
          `fdvs.${p}`,
          {
            label: p,
            color: getColor(p).hex(),
          },
        ])
        .fromPairs()
        .value() satisfies ChartConfig,
      protocols,
      change: (() => {
        const lastFdv = _.last(fdvs)!
        const firstFdv = _.first(fdvs)!
        return (lastFdv.totalFdv - firstFdv.totalFdv) / firstFdv.totalFdv
      })(),
      firstFdv: _.first(fdvs)!,
      lastFdv: _.last(fdvs)!,
    }
  }, [fdvs])

  return (
    <div
      className={cn(
        "bg-card w-full space-y-2 rounded-md border p-2",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 p-2 pb-0">
        <div>
          <h2 className="text-secondary-foreground text-sm font-medium">
            All Protocols Fully Diluted Market Cap
          </h2>
          <h1 className="text-2xl font-semibold">
            <span className="text-secondary-foreground">$</span>
            {formatter.number(lastFdv.totalFdv)}{" "}
            <span
              className={cn(
                "text-muted-foreground text-base font-medium",
                change !== 0 && (change > 0 ? "text-green-400" : "text-red-400")
              )}
            >
              ({formatter.pct(change)})
            </span>
          </h1>
          <div className="text-muted-foreground -mt-0.5 inline-flex items-center text-xs">
            <p className="text-secondary-foreground">
              Data by{" "}
              <span className="font-semibold hover:underline">
                <a
                  href="https://www.coingecko.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Coingecko
                </a>
              </span>
            </p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b0/CoinGecko_logo.png"
              className="mx-1 size-4 shrink-0 rounded-full"
            />
            <p>
              {dayjs.utc(firstFdv.date * 1000).format("DD/MM/YYYY")} -{" "}
              {dayjs.utc(lastFdv.date * 1000).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>
        <div className="flex-1" />
      </div>
      <ChartContainer
        config={config}
        className="bg-background h-[120px] w-full rounded-md p-2 pb-0 shadow-xs"
      >
        <BarChart
          accessibilityLayer
          data={fdvs}
          margin={{
            top: 2,
            right: 0,
            bottom: -2,
            left: 0,
          }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={4}
            axisLine={false}
            fontSize={10}
            tickFormatter={(unix) =>
              dayjs.utc(unix * 1000).format("DD/MM/YYYY")
            }
          />
          <YAxis
            hide
            domain={["dataMin", (dataMax: number) => dataMax * 1.2]}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                prefix="$"
                additionalLabel={(payload: any) => {
                  const item = payload[0]
                  if (!item?.payload) return null
                  const date = dayjs
                    .utc(item.payload.date * 1000)
                    .format("DD/MM/YYYY")
                  const fdv = item.payload.totalFdv
                  return (
                    <div>
                      <Separator className="my-2" />
                      <div className="flex items-center gap-2">
                        <div className="text-secondary-foreground">Date</div>
                        <div className="ml-auto">{date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-secondary-foreground">Total</div>
                        <div className="ml-auto">
                          <span className="text-secondary-foreground">$</span>
                          {formatter.numberReadable(fdv)}
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
            }
          />
          {protocols.map((protocol) => (
            <Bar
              stackId="a"
              key={protocol}
              dataKey={`fdvs.${protocol}`}
              fill={getColor(protocol).hex()}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}
