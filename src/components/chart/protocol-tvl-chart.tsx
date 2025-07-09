"use client"

import { memo, useMemo, useState } from "react"
import dayjs from "dayjs"
import _ from "lodash"
import { Check } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts"
import { match } from "ts-pattern"

import { getColor } from "@/lib/color"
import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { ProtocolTvl } from "@/types"

import { Button } from "../ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import { Separator } from "../ui/separator"

export const ProtocolTvlChart = memo(
  ({
    name,
    tvls,
    className,
    ...props
  }: {
    tvls: Record<"month" | "year" | "all", ProtocolTvl[]>
    name: string
  } & React.ComponentProps<"div">) => {
    const [selectedTf, setSelectedTf] = useState<"month" | "year" | "all">(
      "all"
    )
    const config = useMemo(
      () =>
        ({
          tvl: {
            label: "Total Value Shielded",
            color: getColor(name).hex(),
          },
        }) satisfies ChartConfig,
      [name]
    )
    const { tfs, usedData, firstTvl, lastTvl } = useMemo(() => {
      const firstTvl = _.first(tvls[selectedTf])!
      const lastTvl = _.last(tvls[selectedTf])!
      return {
        tfs: _.keys(tvls),
        usedData: tvls[selectedTf],
        firstTvl,
        lastTvl,
      }
    }, [tvls, selectedTf])

    const { current, change24h } = useMemo(() => {
      const tvl = tvls["month"]
      const td = tvl[tvl.length - 1]
      const ytd = tvl[tvl.length - 2]
      const change24h = (td.tvl - ytd.tvl) / ytd.tvl
      return {
        current: td.tvl,
        change24h,
      }
    }, [tvls])

    return (
      <div
        className={cn(
          "bg-card w-full space-y-2 rounded-md border p-2",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-2 p-1 pb-0 md:flex-row md:items-center">
          <div>
            <h2 className="text-secondary-foreground text-sm font-medium">
              Total Value Shielded
            </h2>
            <h1 className="text-xl font-semibold md:text-2xl">
              <span className="text-secondary-foreground">$</span>
              {formatter.number(current)}{" "}
              <span
                className={cn(
                  "text-muted-foreground text-base font-medium",
                  change24h !== 0 &&
                    (change24h > 0 ? "text-green-400" : "text-red-400")
                )}
              >
                ({formatter.pct(change24h)})
              </span>
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {dayjs.utc(firstTvl.date * 1000).format("DD/MM/YYYY")} -{" "}
              {dayjs.utc(lastTvl.date * 1000).format("DD/MM/YYYY")}
            </p>
          </div>
          <div className="flex-1" />
          <div className="flex flex-wrap items-center gap-2">
            {tfs.map((tf) => (
              <Button
                key={tf}
                variant={selectedTf === tf ? "default" : "outline"}
                size="xs"
                onClick={() => setSelectedTf(tf as "month" | "year" | "all")}
                className="flex-1 md:flex-auto"
              >
                {_.startCase(tf)}{" "}
                <Check className={cn(selectedTf !== tf && "hidden")} />
              </Button>
            ))}
          </div>
        </div>

        <ChartContainer
          config={config}
          className="bg-background h-[210px] w-full rounded-md p-2 pb-0 shadow-xs"
        >
          <AreaChart
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
            <YAxis
              hide
              domain={[(dataMin: number) => dataMin * 0.9, "dataMax"]}
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
                    return (
                      <div>
                        <Separator className="my-2" />
                        <div className="flex items-center gap-2">
                          <div className="text-secondary-foreground">Date</div>
                          <div className="ml-auto">{date}</div>
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <defs>
              <linearGradient id="fill-tvl" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={config.tvl.color}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={config.tvl.color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="tvl"
              type="monotone"
              stroke={config.tvl.color}
              fill="url(#fill-tvl"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    )
  }
)

ProtocolTvlChart.displayName = "ProtocolTvlChart"
