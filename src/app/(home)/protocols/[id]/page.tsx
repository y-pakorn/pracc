import Link from "next/link"
import {
  ArrowUpRight,
  ChevronLeft,
  ExternalLink,
  Globe,
  List,
  Twitter,
} from "lucide-react"
import { match, P } from "ts-pattern"

import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { getProtocol } from "@/services/data"
import { Button } from "@/components/ui/button"
import { CategoryBadge } from "@/components/ui/category-badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProtocolTvlChart } from "@/components/chart/protocol-tvl-chart"
import { InfoTooltip } from "@/components/info-tooltp"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const p = await getProtocol(id)
  if (!p)
    return {
      title: "Protocol not found",
      description: "The protocol you are looking for does not exist.",
    }
  return {
    title: p.protocol.name,
    description: p.protocol.description,
  }
}

export async function generateStaticParams() {
  return []
}

export default async function ProtocolPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const p = await getProtocol(id)

  if (!p)
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2 text-center">
        <div>
          <div className="text-2xl font-semibold">Protocol not found</div>
          <div className="text-muted-foreground text-sm">
            The protocol you are looking for does not exist.
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button size="xs" variant="outline">
              <ChevronLeft /> Go Back
            </Button>
          </Link>
          <Link href="/protocols">
            <Button size="xs" variant="outline">
              Browse Protocols <List />
            </Button>
          </Link>
        </div>
      </div>
    )

  const { protocol, internalProtocols, tvl } = p

  return (
    <div className="flex gap-4">
      <div className="bg-card w-2xs space-y-2 rounded-md border py-2">
        <div className="space-y-1 px-3 py-2">
          <img
            src={protocol.logo_url}
            alt={protocol.name}
            className="size-10 shrink-0 rounded-full"
          />
          <h1 className="text-2xl font-semibold">{protocol.name}</h1>
          <p className="text-secondary-foreground text-xs">
            {protocol.description || (
              <span className="text-muted-foreground">
                No description available
              </span>
            )}
          </p>
        </div>
        <Separator />
        <div className="flex flex-wrap items-center gap-1 px-2 text-xs font-medium">
          {[
            {
              label: "Live When",
              value: protocol.live_at
                ? formatter.month(protocol.live_at)
                : null,
              tooltip: "The month and year when the protocol was first live",
            },
            {
              label: "IPC",
              value: protocol.ipc,
              tooltip:
                "The amount of privacy-preserving features the protocol has",
            },
            {
              label: "Overall Score",
              value: protocol.overall_score,
              tooltip: "The overall score of the protocol",
            },
            {
              label: "Coingecko ID",
              value: protocol.coingecko_id,
              href: `https://www.coingecko.com/en/coins/${protocol.coingecko_id}`,
              tooltip: "The Coingecko ID of the protocol's coin",
            },
            {
              label: "Defillama Slug",
              value: protocol.defillama_slug,
              href: match(protocol.defillama_slug?.split(":"))
                .with(
                  ["p", P.select()],
                  (slug) => `https://defillama.com/protocol/${slug}`
                )
                .with(
                  ["c", P.select()],
                  (slug) => `https://defillama.com/chain/${slug}`
                )
                .otherwise(() => null),
              tooltip: "The Defillama slug of the protocol's TVL/TVS",
            },
          ].map(({ label, value, tooltip, href }) =>
            !value ? null : (
              <div
                key={label}
                className="bg-background flex items-center gap-1 rounded-md px-2 py-0.5"
              >
                <div className="text-muted-foreground">{label}</div>
                <Link
                  className={cn(
                    "text-body-foreground",
                    href ? "hover:underline" : "pointer-events-none"
                  )}
                  href={href ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {value}
                </Link>
                <InfoTooltip className="text-muted-foreground">
                  {tooltip}
                </InfoTooltip>
              </div>
            )
          )}
        </div>
        <div className="bg-background mx-2 rounded-md p-2">
          <h2 className="text-muted-foreground text-xs font-medium">
            Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {protocol.categories.split(",").map((category) => (
              <Tooltip key={category}>
                <TooltipTrigger asChild>
                  <Link
                    href={`/protocols?category=${category}`}
                    prefetch={false}
                  >
                    <CategoryBadge category={category} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Search protocols by {category}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
        <div className="bg-background mx-2 rounded-md p-2">
          <h2 className="text-muted-foreground text-xs font-medium">
            Subcategory
          </h2>
          <div className="flex flex-wrap gap-2">
            {protocol.sub_categories.split(",").map((category) => (
              <Tooltip key={category}>
                <TooltipTrigger asChild>
                  <Link
                    href={`/protocols?sub-category=${category}`}
                    prefetch={false}
                  >
                    <CategoryBadge category={category} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Search protocols by {category}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-2 px-2 md:grid-cols-2">
          {[
            {
              label: "Website",
              icon: Globe,
              href: protocol.url,
            },
            {
              label: "Twitter",
              icon: Twitter,
              href: protocol.twitter_url,
            },
          ].map(({ label, icon: Icon, href }) =>
            !href ? null : (
              <Link
                href={href}
                key={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="xs" className="w-full">
                  <Icon />
                  {label}
                  <ArrowUpRight />
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {tvl && <ProtocolTvlChart name={protocol.name} tvls={tvl} />}
      </div>
    </div>
  )
}
