"use client"

import React, { useMemo, useState } from "react"
import _ from "lodash"
import { Check } from "lucide-react"
import { Bar, ComposedChart, XAxis } from "recharts"
import { match } from "ts-pattern"

import { getColor } from "@/lib/color"
import { dayjs } from "@/lib/dayjs"
import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { OverallTvl } from "@/types"

import { Button } from "../ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import { Separator } from "../ui/separator"

export function OverallTvlChart({
  tvls,
  className,
  ...props
}: {
  tvls: Record<"month" | "year" | "all", OverallTvl[]>
} & React.ComponentProps<"div">) {
  const [selectedTf, setSelectedTf] = useState<"month" | "year" | "all">("all")

  const { tfs, config, protocols, usedData, lastTvl, firstTvl } =
    useMemo(() => {
      const protocols = _.chain(tvls[selectedTf])
        .flatMap((t) => _.keys(t.tvls))
        .uniq()
        .value()
      return {
        usedData: tvls[selectedTf],
        tfs: _.keys(tvls),
        config: _.chain(protocols)
          .map((p) => [
            `tvls.${p}`,
            {
              label: p,
              color: getColor(p).hex(),
            },
          ])
          .fromPairs()
          .value() satisfies ChartConfig,
        protocols,
        lastTvl: _.last(tvls[selectedTf])!,
        firstTvl: _.first(tvls[selectedTf])!,
      }
    }, [tvls, selectedTf])

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
            Total Value Shielded
          </h2>
          <h1 className="text-2xl font-semibold">
            <span className="text-secondary-foreground">$</span>
            {formatter.number(lastTvl.totalTvl)}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {dayjs.utc(firstTvl.date * 1000).format("DD/MM/YYYY")} -{" "}
            {dayjs.utc(lastTvl.date * 1000).format("DD/MM/YYYY")}
          </p>
        </div>
        <div className="flex-1" />
        {tfs.map((tf) => (
          <Button
            key={tf}
            variant={selectedTf === tf ? "default" : "outline"}
            size="xs"
            onClick={() => setSelectedTf(tf as "month" | "year" | "all")}
          >
            {_.startCase(tf)}{" "}
            <Check className={cn(selectedTf !== tf && "hidden")} />
          </Button>
        ))}
      </div>
      <ChartContainer
        config={config}
        className="bg-background h-[210px] w-full rounded-md p-2 pb-0 shadow-xs"
      >
        <ComposedChart
          accessibilityLayer
          data={usedData}
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
              dayjs.utc(unix * 1000).format(
                match(selectedTf)
                  .with("month", () => "DD/MM/YY")
                  .with("year", () => "DD/MM/YY")
                  .with("all", () => "MM/YY")
                  .exhaustive()
              )
            }
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
                  const tvl = item.payload.totalTvl
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
                          {formatter.numberReadable(tvl)}
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
              dataKey={`tvls.${protocol}`}
              fill={getColor(protocol).hex()}
            />
          ))}
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
