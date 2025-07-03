"use client"

import { memo, useEffect, useMemo, useState } from "react"
import { PaginationState } from "@tanstack/react-table"
import dayjs from "dayjs"
import _ from "lodash"
import {
  ChartBarStacked,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Table,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ProtocolOverview } from "@/types"

import { MultiSelectFilterCombobox } from "../filter-combobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import { Separator } from "../ui/separator"
import { ProtocolOverviewTable } from "./protocol-overview-table"

const paginationLimits = [10, 15, 20]
export const ProtocolOverviewTableHeader = memo(
  ({
    protocols,
    className,
    limits = paginationLimits,
    defaultLimit = limits[0],
    ...props
  }: {
    protocols: ProtocolOverview[]
    defaultLimit?: number
    limits?: number[]
  } & React.ComponentProps<"div">) => {
    const [categories, setCategories] = useState<string[]>([])
    const [subCategories, setSubCategories] = useState<string[]>([])

    const [search, _setSearch] = useState("")
    const setSearch = useMemo(() => _.debounce(_setSearch, 50), [])

    const { allCategory, allSubcategory, totalTvl } = useMemo(() => {
      return {
        allCategory: _.chain(protocols)
          .flatMap("categories")
          .uniq()
          .map((category) => ({ label: category, value: category }))
          .value(),
        allSubcategory: _.chain(protocols)
          .flatMap("subCategories")
          .uniq()
          .map((subcategory) => ({ label: subcategory, value: subcategory }))
          .value(),
        totalTvl: _.chain(protocols).map("tvl").sum().value(),
      }
    }, [protocols])

    const filteredProtocols = useMemo(() => {
      return _.chain(protocols)
        .filter((protocol) =>
          categories.length
            ? _.intersection(categories, protocol.categories).length > 0
            : true
        )
        .filter((protocol) =>
          subCategories.length
            ? _.intersection(subCategories, protocol.subCategories).length > 0
            : true
        )
        .filter((protocol) =>
          search
            ? protocol.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
            : true
        )
        .map((protocol, i) => ({
          ...protocol,
          rank: i + 1,
          liveWhenUnix: protocol.liveWhen
            ? dayjs(protocol.liveWhen).unix() * 1000
            : undefined,
          tvlPct: protocol.tvl ? protocol.tvl / totalTvl : undefined,
        }))
        .value()
    }, [protocols, categories, subCategories, totalTvl, search])

    const [paginationState, setPaginationState] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: defaultLimit,
    })
    const maxPageIndex = useMemo(() => {
      return Math.floor(filteredProtocols.length / paginationState.pageSize)
    }, [filteredProtocols, paginationState.pageSize])

    useEffect(() => {
      setPaginationState((p) => ({
        ...p,
        pageIndex: 0,
      }))
    }, [categories, subCategories, search])

    return (
      <div className={cn(className)} {...props}>
        <div className="flex items-center gap-2 px-3">
          <Table className="size-4" />
          <span className="font-semibold">
            {filteredProtocols.length} Privacy Protocols
          </span>

          <div className="flex-1" />
          <Select
            value={paginationState.pageSize.toString()}
            onValueChange={(value) =>
              setPaginationState((prev) => ({
                ...prev,
                pageSize: Number(value),
              }))
            }
          >
            <SelectTrigger asChild>
              <Button variant="outline" size="xs" className="h-7! text-xs!">
                Limit {paginationState.pageSize} <ChevronDown />
              </Button>
            </SelectTrigger>
            <SelectContent>
              {limits.map((limit) => (
                <SelectItem key={limit} value={limit.toString()}>
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="xs"
            onClick={() =>
              setPaginationState((prev) => ({
                ...prev,
                pageIndex: 0,
              }))
            }
            disabled={paginationState.pageIndex === 0}
          >
            <ChevronsLeft />
          </Button>
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
            <span className="text-muted-foreground">/ {maxPageIndex + 1}</span>
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
          <Button
            variant="outline"
            size="xs"
            onClick={() =>
              setPaginationState((prev) => ({
                ...prev,
                pageIndex: maxPageIndex,
              }))
            }
            disabled={paginationState.pageIndex === maxPageIndex}
          >
            <ChevronsRight />
          </Button>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center gap-2 px-3">
          <MultiSelectFilterCombobox
            options={allCategory}
            value={categories}
            onChange={setCategories}
            label="Category"
            icon={ChartBarStacked}
          />

          <MultiSelectFilterCombobox
            options={allSubcategory}
            value={subCategories}
            onChange={setSubCategories}
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
            disabled={!search && !categories.length && !subCategories.length}
            onClick={() => {
              setSearch("")
              setCategories([])
              setSubCategories([])
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
            const isSelected = categories.includes(cat)
            if (!isSelected) {
              setCategories([...categories, cat])
            }
          }}
          onSubcategoryClick={(subcat) => {
            const isSelected = subCategories.includes(subcat)
            if (!isSelected) {
              setSubCategories([...subCategories, subcat])
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
