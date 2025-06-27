"use client"

import React, { useMemo, useState } from "react"
import _ from "lodash"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { getColor } from "@/lib/color"
import { dayjs } from "@/lib/dayjs"
import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { OverallTvl } from "@/types"

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

export function OverallTvlChart({
  tvls,
  className,
  ...props
}: { tvls: Record<string, OverallTvl[]> } & React.ComponentProps<"div">) {
  const [selectedTf, setSelectedTf] = useState<string>("all")
  const { tfs, config, protocols, usedData, tvl } = useMemo(() => {
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
      tvl: _.last(tvls[selectedTf])!,
    }
  }, [tvls, selectedTf])

  return (
    <div
      className={cn(
        "bg-card w-full space-y-2 rounded-md border p-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div>
          <h2 className="text-secondary-foreground text-sm font-medium">
            Total Value Shielded
          </h2>
          <h1 className="text-2xl font-semibold">
            <span className="text-secondary-foreground">$</span>
            {formatter.number(tvl.totalTvl)}
          </h1>
          <p className="text-muted-foreground text-xs">
            {dayjs.utc(tvl.date * 1000).format("DD/MM/YYYY")}
          </p>
        </div>
        <div className="flex-1" />
        {tfs.map((tf) => (
          <Button
            key={tf}
            variant={selectedTf === tf ? "default" : "outline"}
            size="xs"
            onClick={() => setSelectedTf(tf)}
          >
            {_.startCase(tf)}
          </Button>
        ))}
      </div>
      <ChartContainer config={config} className="h-[200px] w-full">
        <BarChart
          accessibilityLayer
          data={usedData}
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(unix) => dayjs.utc(unix * 1000).format("D/M/YY")}
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
                          {formatter.number(tvl)}
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
        </BarChart>
      </ChartContainer>
    </div>
  )
}
