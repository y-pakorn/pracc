"use client"

import React, { useMemo, useState } from "react"
import _ from "lodash"
import { Check, ChevronDown } from "lucide-react"
import { Bar, BarChart, XAxis } from "recharts"
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
import { Checkbox } from "../ui/checkbox"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"

export function OverallTvlChart({
  tvls,
  className,
  ...props
}: {
  tvls: Record<"month" | "year" | "all", OverallTvl[]>
} & React.ComponentProps<"div">) {
  const [selectedTf, setSelectedTf] = useState<"month" | "year" | "all">("all")
  const [excluded, setExcluded] = useState<string[]>([])

  const { tfs, config, protocols, usedData, lastTvl, firstTvl } =
    useMemo(() => {
      const protocols = _.chain(tvls[selectedTf])
        .flatMap((t) => _.keys(t.tvls))
        .uniq()
        .map((p) => ({
          protocol: p,
          color: getColor(p).hex(),
        }))
        .value()
      const tvl = _.chain(tvls[selectedTf])
        .map((t) => {
          const omitted = _.omit(t.tvls, excluded)
          return {
            ...t,
            tvls: omitted,
            totalTvl: _.chain(omitted).values().sum().value(),
          }
        })
        .dropWhile((t) => !t.totalTvl)
        .value()
      return {
        usedData: tvl,
        tfs: _.keys(tvls),
        config: _.chain(protocols)
          .map(({ protocol, color }) => [
            `tvls.${protocol}`,
            {
              label: protocol,
              color,
            },
          ])
          .fromPairs()
          .value() satisfies ChartConfig,
        protocols,
        lastTvl: _.last(tvl)!,
        firstTvl: _.first(tvl)!,
      }
    }, [tvls, selectedTf, excluded])

  const [filterOpen, setFilterOpen] = useState(false)

  const { current, change24h } = useMemo(() => {
    const tvl = tvls["month"]
    const td = tvl[tvl.length - 1]
    const yd = tvl[tvl.length - 2]
    const change24h = (td.totalTvl - yd.totalTvl) / yd.totalTvl
    return {
      current: td.totalTvl,
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
      <div className="flex items-center gap-2 p-2 pb-0">
        <div>
          <h2 className="text-secondary-foreground text-sm font-medium">
            Total Value Shielded
          </h2>
          <h1 className="text-2xl font-semibold">
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
        <div className="flex flex-col items-end gap-2">
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="xs">
                Filter {excluded.length} protocols{" "}
                <ChevronDown
                  className={cn(
                    "text-muted-foreground transition-transform",
                    filterOpen && "rotate-180"
                  )}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search protocols" />
                <CommandList>
                  <CommandGroup>
                    {protocols.map(({ protocol, color }) => {
                      const isIncluded = !excluded.includes(protocol)
                      return (
                        <CommandItem
                          key={protocol}
                          value={protocol}
                          onSelect={(protocol) => {
                            if (isIncluded) {
                              setExcluded((e) => [...e, protocol])
                            } else {
                              setExcluded((e) =>
                                e.filter((p) => p !== protocol)
                              )
                            }
                          }}
                        >
                          <Checkbox checked={isIncluded} />
                          {protocol}
                          <div className="text-muted-foreground ml-auto text-xs">
                            {formatter.pct(
                              ((lastTvl.tvls as any)?.[protocol] || 0) /
                                lastTvl.totalTvl
                            )}
                          </div>
                          <div
                            className="size-2 rounded-full"
                            style={{
                              backgroundColor: color,
                            }}
                          />
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>

                  {excluded.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem onSelect={() => setExcluded([])}>
                          Clear All Filters
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-2">
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
        </div>
      </div>
      <ChartContainer
        config={config}
        className="bg-background h-[210px] w-full rounded-md p-2 pb-0 shadow-xs"
      >
        <BarChart
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
          {protocols.map(({ protocol, color }) => (
            <Bar
              stackId="a"
              key={protocol}
              dataKey={`tvls.${protocol}`}
              fill={color}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}
