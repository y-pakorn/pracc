"use client"

import { memo, useState } from "react"
import Link from "next/link"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

type ProtocolOverviewWithMetadata = ProtocolOverview & {
  liveWhenUnix: number
  tvlPct?: number
}

const columns: ColumnDef<ProtocolOverviewWithMetadata>[] = [
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
          <img src={logo} alt={name} className="size-4 shrink-0 rounded-full" />
          <Link
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
        <Badge variant="outline">
          {category}
          <div
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: getColor(category).hex() }}
          />
        </Badge>
      )
    },
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
    cell: ({ getValue }) => {
      const subcategory = getValue<string>()
      return (
        <Badge variant="outline">
          {subcategory}
          <div
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: getColor(subcategory).hex() }}
          />
        </Badge>
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
      if (!tvl) return "-"
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
      return <span>{dayjs(liveWhen).fromNow(true)}</span>
    },
  },
]

export const ProtocolOverviewTable = memo(
  ({
    protocols,
    className,
    rankOffset = 0,
    ...props
  }: {
    protocols: ProtocolOverviewWithMetadata[]
    rankOffset?: number
  } & React.ComponentProps<"div">) => {
    const [sorting, setSorting] = useState<SortingState>([
      {
        desc: false,
        id: "age",
      },
    ])

    const table = useReactTable({
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      data: protocols,
      onSortingChange: setSorting,
      state: {
        sorting,
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
                    <TableCell key={cell.id}>
                      {match(cell.column.id)
                        .with("rank", () => {
                          return <span>{rankOffset + i + 1}</span>
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
                  className="h-24 text-center"
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
