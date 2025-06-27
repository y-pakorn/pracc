"use client"

import { memo, useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import _ from "lodash"
import { ChartBarStacked, ChevronLeft, ChevronRight, Table } from "lucide-react"

import { cn } from "@/lib/utils"
import { ProtocolOverview } from "@/types"

import { MultiSelectFilterCombobox } from "../filter-combobox"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { ProtocolOverviewTable } from "./protocol-overview-table"

const limit = 10

export const ProtocolOverviewTableHeader = memo(
  ({
    protocols,
    className,
    ...props
  }: { protocols: ProtocolOverview[] } & React.ComponentProps<"div">) => {
    const [currentPage, setCurrentPage] = useState(1)
    const maxPage = useMemo(() => {
      return Math.ceil(protocols.length / limit)
    }, [protocols])

    const [category, setCategory] = useState<string[]>([])
    const [subcategory, setSubcategory] = useState<string[]>([])

    const { allCategory, allSubcategory, totalTvl } = useMemo(() => {
      return {
        allCategory: _.chain(protocols)
          .map("category")
          .uniq()
          .map((category) => ({ label: category, value: category }))
          .value(),
        allSubcategory: _.chain(protocols)
          .map("subcategory")
          .uniq()
          .map((subcategory) => ({ label: subcategory, value: subcategory }))
          .value(),
        totalTvl: _.chain(protocols).map("tvl").sum().value(),
      }
    }, [protocols])

    useEffect(() => {
      setCurrentPage(1)
    }, [category, subcategory])

    const data = useMemo(() => {
      return _.chain(protocols)
        .filter((protocol) =>
          category.length ? category.includes(protocol.category) : true
        )
        .filter((protocol) =>
          subcategory.length ? subcategory.includes(protocol.subcategory) : true
        )
        .slice((currentPage - 1) * limit, currentPage * limit)
        .map((protocol) => ({
          ...protocol,
          liveWhenUnix: dayjs(protocol.liveWhen).unix() * 1000,
          tvlPct: protocol.tvl ? protocol.tvl / totalTvl : undefined,
        }))
        .value()
    }, [protocols, category, subcategory, currentPage])

    return (
      <div className={cn(className)} {...props}>
        <div className="flex items-center gap-2 px-3">
          <Table className="size-4" />
          <span>Protocol Table</span>
          <div className="flex-1" />
          <Button
            disabled={currentPage === 1}
            variant="outline"
            size="xs"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft />
            Back
          </Button>
          <Button
            aria-readonly
            className="pointer-events-none"
            variant="outline"
            size="xs"
          >
            Page {currentPage}
          </Button>
          <Button
            disabled={currentPage === maxPage}
            variant="outline"
            size="xs"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
            <ChevronRight />
          </Button>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center gap-2 px-3">
          <Button
            aria-readonly
            className="pointer-events-none"
            variant="outline"
            size="xs"
          >
            Total {protocols.length} protocols
          </Button>

          <MultiSelectFilterCombobox
            options={allCategory}
            value={category}
            onChange={setCategory}
            label="Category"
            icon={ChartBarStacked}
          />

          <MultiSelectFilterCombobox
            options={allSubcategory}
            value={subcategory}
            onChange={setSubcategory}
            label="Subcategory"
            icon={ChartBarStacked}
          />
        </div>
        <Separator className="my-2" />
        <ProtocolOverviewTable
          className="-my-2"
          protocols={data}
          rankOffset={(currentPage - 1) * limit}
        />
      </div>
    )
  }
)

ProtocolOverviewTableHeader.displayName = "ProtocolOverviewTableHeader"
