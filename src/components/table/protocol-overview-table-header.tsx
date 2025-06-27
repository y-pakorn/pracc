"use client"

import { memo, useEffect, useMemo, useState } from "react"
import { PaginationState } from "@tanstack/react-table"
import dayjs from "dayjs"
import _ from "lodash"
import {
  ChartBarStacked,
  ChevronLeft,
  ChevronRight,
  Search,
  Table,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ProtocolOverview } from "@/types"

import { MultiSelectFilterCombobox } from "../filter-combobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { ProtocolOverviewTable } from "./protocol-overview-table"

const limit = 15

export const ProtocolOverviewTableHeader = memo(
  ({
    protocols,
    className,
    ...props
  }: { protocols: ProtocolOverview[] } & React.ComponentProps<"div">) => {
    const [category, setCategory] = useState<string[]>([])
    const [subcategory, setSubcategory] = useState<string[]>([])

    const [search, _setSearch] = useState("")
    const setSearch = useMemo(() => _.debounce(_setSearch, 300), [])

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

    const filteredProtocols = useMemo(() => {
      return _.chain(protocols)
        .filter((protocol) =>
          category.length ? category.includes(protocol.category) : true
        )
        .filter((protocol) =>
          subcategory.length ? subcategory.includes(protocol.subcategory) : true
        )
        .map((protocol) => ({
          ...protocol,
          liveWhenUnix: protocol.liveWhen
            ? dayjs(protocol.liveWhen).unix() * 1000
            : undefined,
          tvlPct: protocol.tvl ? protocol.tvl / totalTvl : undefined,
        }))
        .filter((protocol) =>
          search
            ? protocol.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
            : true
        )
        .value()
    }, [protocols, category, subcategory, totalTvl, search])

    const [paginationState, setPaginationState] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: limit,
    })
    const maxPageIndex = useMemo(() => {
      return Math.floor(filteredProtocols.length / limit)
    }, [filteredProtocols])

    useEffect(() => {
      setPaginationState({
        pageIndex: 0,
        pageSize: limit,
      })
    }, [category, subcategory, search])

    return (
      <div className={cn(className)} {...props}>
        <div className="flex items-center gap-2 px-3">
          <Table className="size-4" />
          <span className="font-semibold">
            {filteredProtocols.length} Privacy Protocols
          </span>

          <div className="flex-1" />
          <Button
            disabled={paginationState.pageIndex === 0}
            variant="outline"
            size="xs"
            onClick={() =>
              setPaginationState((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex - 1,
              }))
            }
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
            Page {paginationState.pageIndex + 1}
          </Button>
          <Button
            disabled={paginationState.pageIndex === maxPageIndex}
            variant="outline"
            size="xs"
            onClick={() =>
              setPaginationState((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
          >
            Next
            <ChevronRight />
          </Button>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center gap-2 px-3">
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
          <div className="flex-1" />
          <div className="relative flex">
            <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
            <div className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 font-bold italic">
              auto
            </div>
            <Input
              className="h-7 w-3xs shrink pl-8 text-xs!"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a protocol"
            />
          </div>
          <Button
            variant="default"
            size="xs"
            disabled={!search && !category.length && !subcategory.length}
            onClick={() => {
              setSearch("")
              setCategory([])
              setSubcategory([])
            }}
          >
            Reset
          </Button>
        </div>
        <Separator className="my-2" />
        <ProtocolOverviewTable
          className="-my-2"
          protocols={filteredProtocols}
          onCategoryClick={(cat) => {
            const isSelected = category.includes(cat)
            if (!isSelected) {
              setCategory([...category, cat])
            }
          }}
          onSubcategoryClick={(subcat) => {
            const isSelected = subcategory.includes(subcat)
            if (!isSelected) {
              setSubcategory([...subcategory, subcat])
            }
          }}
          paginationState={paginationState}
          setPaginationState={setPaginationState}
        />
      </div>
    )
  }
)

ProtocolOverviewTableHeader.displayName = "ProtocolOverviewTableHeader"
