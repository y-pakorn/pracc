"use client"

import { memo, useMemo, useState } from "react"
import Link from "next/link"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import _ from "lodash"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  Globe,
} from "lucide-react"
import { match } from "ts-pattern"
import uniqolor from "uniqolor"

import { getColor } from "@/lib/color"
import { dayjs } from "@/lib/dayjs"
import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { ProtocolOverview } from "@/types"

import { InfoTooltip } from "../info-tooltp"
import { Badge } from "../ui/badge"
import { Button, buttonVariants } from "../ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

type ProtocolOverviewWithMetadata = ProtocolOverview & {
  liveWhenUnix?: number
  tvlPct?: number
}

const columnConfig: (props: {
  onCategoryClick?: (category: string) => void
  onSubcategoryClick?: (subcategory: string) => void
}) => ColumnDef<ProtocolOverviewWithMetadata>[] = ({
  onCategoryClick,
  onSubcategoryClick,
}) => [
  {
    accessorKey: "rank",
    header: "#",
  },
  {
    accessorFn: (row) => [row.logo, row.name, row.website] as const,
    header: "Name",
    cell: ({ getValue }) => {
      const [logo, name, website] = getValue<[string, string, string]>()
      return (
        <div className="flex w-fit items-center gap-2">
          <img src={logo} alt={name} className="size-5 shrink-0 rounded-full" />
          <Link
            prefetch={false}
            href={`/protocol/${name}`}
            className="font-semibold hover:underline"
          >
            {name}
          </Link>
          <Link
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "xsIcon",
              }),
              "text-muted-foreground -ml-1"
            )}
          >
            <ExternalLink />
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }) => {
      const category = getValue<string>()
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              onClick={() => onCategoryClick?.(category)}
              className="cursor-pointer"
            >
              <div
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: getColor(category).hex() }}
              />
              {category}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Filter for {category}</TooltipContent>
        </Tooltip>
      )
    },
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
    cell: ({ getValue }) => {
      const subcategory = getValue<string>()
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              onClick={() => onSubcategoryClick?.(subcategory)}
              className="cursor-pointer"
            >
              <div
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: getColor(subcategory).hex() }}
              />
              {subcategory}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Filter for {subcategory}</TooltipContent>
        </Tooltip>
      )
    },
  },
  {
    id: "tvl",
    sortUndefined: "last",
    sortDescFirst: true,
    accessorKey: "tvlPct",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <div className="flex items-center">
          <InfoTooltip>Total Value Shielded</InfoTooltip>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              column.toggleSorting()
            }}
            className="p-0!"
          >
            <span>TVS</span>
            {match(isSorted)
              .with(false, () => <ArrowUpDown />)
              .with("asc", () => <ArrowUp />)
              .with("desc", () => <ArrowDown />)
              .exhaustive()}
          </Button>
        </div>
      )
    },
    cell: ({ getValue, row }) => {
      const tvlPct = getValue<number>()
      const tvl = row.original.tvl
      if (!tvl) return <span className="text-muted-foreground">-</span>
      return (
        <div>
          <div>
            <span className="text-secondary-foreground">$</span>
            {formatter.numberReadable(tvl)}
          </div>
          <div className="text-muted-foreground text-xs">
            {tvlPct < 0.001 ? "<0.001%" : formatter.pct(tvlPct)}
          </div>
        </div>
      )
    },
  },
  {
    id: "age",
    accessorKey: "liveWhenUnix",
    sortUndefined: "last",
    sortDescFirst: false,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            column.toggleSorting()
          }}
          className="p-0!"
        >
          <span>Age</span>
          {match(isSorted)
            .with(false, () => <ArrowUpDown />)
            .with("asc", () => <ArrowUp />)
            .with("desc", () => <ArrowDown />)
            .exhaustive()}
        </Button>
      )
    },
    cell: ({ getValue }) => {
      const liveWhen = getValue<string>()
      if (!liveWhen) return <span className="text-muted-foreground">-</span>
      return <span>{dayjs(liveWhen).fromNow(true)}</span>
    },
  },
]

export const ProtocolOverviewTable = memo(
  ({
    protocols,
    className,
    onCategoryClick,
    onSubcategoryClick,
    paginationState,
    setPaginationState,
    ...props
  }: {
    protocols: ProtocolOverviewWithMetadata[]
    onCategoryClick?: (category: string) => void
    onSubcategoryClick?: (subcategory: string) => void
    paginationState: PaginationState
    setPaginationState: (paginationState: PaginationState) => void
  } & React.ComponentProps<"div">) => {
    const columns = useMemo(
      () =>
        columnConfig({
          onCategoryClick,
          onSubcategoryClick,
        }),
      [onCategoryClick, onSubcategoryClick]
    )
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      data: protocols,
      onSortingChange: setSorting,
      state: {
        sorting,
        pagination: paginationState,
      },
    })

    return (
      <div className={cn("w-full text-sm font-medium", className)} {...props}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-12">
                      {match(cell.column.id)
                        .with("rank", () => {
                          return (
                            <span>
                              {paginationState.pageIndex *
                                paginationState.pageSize +
                                i +
                                1}
                            </span>
                          )
                        })
                        .otherwise(() => {
                          return flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }
)

ProtocolOverviewTable.displayName = "ProtocolOverviewTable"
