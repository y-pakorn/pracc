"use client"

import { useMemo, useState } from "react"
import _ from "lodash"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Line, LineChart, Treemap, YAxis } from "recharts"

import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { OverallTvl, ProtocolOverview } from "@/types"

import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { ChartContainer } from "../ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import { Separator } from "../ui/separator"

function CustomTreemapCell({ ...props }: any) {
  const {
    depth,
    x,
    y,
    width,
    height,
    name,
    logo,
    pct,
    tvl,
    change24h,
    tvls,
    ...rest
  } = props
  if (depth === 0) return null

  const borderGap = 1.5
  const cellWidth = width - borderGap * 2
  const cellHeight = height - borderGap * 2

  // Calculate responsive sizes based on cell dimensions
  const minDimension = Math.min(cellWidth, cellHeight)
  const cellArea = cellWidth * cellHeight

  // Image size: scale between 8px and 40px based on cell size
  const imageSize = Math.max(10, Math.min(40, minDimension * 0.2))

  // Font sizes: scale based on cell area with smooth scaling
  const baseFontSize = Math.sqrt(cellArea) * 0.08
  const nameFontSize = Math.max(10, Math.min(20, baseFontSize))
  const pctFontSize = Math.max(8, Math.min(14, baseFontSize * 0.75))
  const tvlFontSize = Math.max(10, baseFontSize * 1.125)

  // Padding and gap: scale with cell size
  const padding = Math.max(4, Math.min(14, minDimension * 0.04))
  const flexGap = Math.max(3, Math.min(12, minDimension * 0.04))

  const chartHeight = Math.max(8, height * 0.15)
  return (
    <g>
      <foreignObject
        x={x + borderGap}
        y={y + borderGap}
        width={cellWidth}
        height={cellHeight}
      >
        <div
          className={cn(
            "bg-card flex h-full flex-col rounded-md shadow-sm",
            change24h > 0 && "bg-green-500/30",
            change24h < 0 && "bg-red-500/30"
          )}
          style={{ padding, gap: flexGap }}
        >
          <div className="flex flex-wrap items-center" style={{ gap: flexGap }}>
            <img
              src={logo}
              alt={name}
              className="shrink-0 rounded-full"
              style={{ width: imageSize, height: imageSize }}
            />
            <div
              className="truncate font-semibold"
              style={{ fontSize: nameFontSize }}
            >
              {name}
            </div>
            {width > 120 && (
              <div
                className="text-secondary-foreground"
                style={{ fontSize: pctFontSize }}
              >
                {formatter.pct(pct)}
              </div>
            )}
          </div>
          <div className="flex-1" />
          <ChartContainer
            config={{}}
            style={{
              maxHeight: chartHeight,
            }}
          >
            <LineChart
              data={tvls.map((d: any, i: number) => ({
                date: i,
                tvl: d,
              }))}
            >
              <Line
                dataKey="tvl"
                stroke={
                  !change24h ? "#808080" : change24h > 0 ? "#00ff00" : "#ff0000"
                }
                dot={false}
              />
              <YAxis domain={["dataMin", "auto"]} hide />
            </LineChart>
          </ChartContainer>
          <div
            className="flex flex-wrap items-baseline"
            style={{
              gap: flexGap,
            }}
          >
            <div className="font-medium" style={{ fontSize: tvlFontSize }}>
              {formatter.numberReadable(tvl)}
            </div>
            <div
              className={cn(
                "text-muted-foreground",
                change24h > 0 && "text-green-400",
                change24h < 0 && "text-red-400"
              )}
              style={{ fontSize: tvlFontSize / 1.5 }}
            >
              {formatter.pct(change24h)}
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  )
}

const paginationLimits = [5, 10, 15, 20]
export function DominanceChart({
  tvl,
  className,
  ...props
}: {
  tvl: {
    name: string
    logo: string
    tvl: number
    tvls: number[]
    pct: number
    change24h: number
  }[]
} & React.ComponentProps<"div">) {
  // 0: top 10%, 1: top 20%, 2: top 30%, etc.
  const [percentile, setPercentile] = useState(0)
  const [limit, setLimit] = useState(10)
  const maxPercentile = useMemo(
    () => Math.floor(tvl.length / limit),
    [limit, tvl.length]
  )

  const data = useMemo(() => {
    const minValue = _.minBy(tvl, "pct")!.pct
    const maxValue = _.maxBy(tvl, "pct")!.pct

    return _.chain(tvl)
      .map((protocol) => {
        const powValue = Math.pow(protocol.pct, 1.5)
        const maxPow = Math.pow(maxValue, 1.5)
        const minPow = Math.pow(minValue, 1.5)

        // Normalize to 0.01-1.0 range with more weight on large values
        const normalizedSize =
          0.015 + ((powValue - minPow) / (maxPow - minPow)) * 0.985

        return {
          ...protocol,
          size: normalizedSize,
        }
      })
      .orderBy("pct", "desc")
      .value()
  }, [tvl])

  return (
    <div className="bg-card space-y-2 rounded-md border py-2">
      <div className="flex items-center gap-2 px-4">
        <h1 className="font-semibold">Protocol Dominance Chart By TVS</h1>
        <div className="flex-1" />
        <Select
          value={limit.toString()}
          onValueChange={(value) => setLimit(Number(value))}
        >
          <SelectTrigger asChild>
            <Button variant="outline" size="xs" className="h-7! text-xs!">
              Limit {limit} <ChevronDown />
            </Button>
          </SelectTrigger>
          <SelectContent>
            {paginationLimits.map((limit) => (
              <SelectItem key={limit} value={limit.toString()}>
                {limit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="xsIcon"
          onClick={() => setPercentile(percentile - 1)}
          disabled={percentile === 0}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="xs"
          aria-readonly
          className="pointer-events-none"
        >
          {percentile > 0 ? (
            <>
              Top {percentile * limit} - {percentile * limit + limit}
            </>
          ) : (
            <>Top {limit}</>
          )}
        </Button>
        <Button
          variant="outline"
          size="xsIcon"
          onClick={() => setPercentile(percentile + 1)}
          disabled={percentile === maxPercentile}
        >
          <ChevronRight />
        </Button>
      </div>
      <Separator className="my-2" />
      <div className="px-3 md:h-[700px]">
        <ChartContainer config={{}} className="aspect-auto h-full w-full">
          <Treemap
            isAnimationActive={false}
            data={data.slice(limit * percentile, limit * (percentile + 1))}
            dataKey="size"
            content={<CustomTreemapCell />}
          />
        </ChartContainer>
      </div>
    </div>
  )
}
