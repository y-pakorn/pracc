import Link from "next/link"
import { notFound } from "next/navigation"
import _ from "lodash"
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  Circle,
  ExternalLink,
  Globe,
  List,
  Twitter,
} from "lucide-react"
import { match, P } from "ts-pattern"

import { criteria } from "@/config/critera"
import { scoreTier } from "@/config/score-tier"
import { formatter } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { getProtocol, getRawProtocols } from "@/services/data"
import { Button } from "@/components/ui/button"
import { CategoryBadge } from "@/components/ui/category-badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProtocolFdvChart } from "@/components/chart/protocol-fdv-chart"
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
  // const { protocols } = await getRawProtocols()
  // return protocols.map((p) => ({
  //   id: p.id,
  // }))
  return []
}

export default async function ProtocolPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const p = await getProtocol(id)

  if (!p) return notFound()

  const { protocol, internalProtocols, tvl, fdv, coin } = p
  const tier = scoreTier.find((t) => protocol.overall_score > t.gt)

  return (
    <div className="flex gap-4">
      <div
        className="bg-card sticky h-fit w-2xs shrink-0 space-y-2 rounded-md border py-2"
        style={{
          top: "calc(var(--header-height) + 1rem)",
        }}
      >
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
          {coin && (
            <div className="mt-2 flex items-center gap-1 text-sm font-medium">
              <img src={coin.image} className="size-4 shrink-0 rounded-full" />
              <div className="font-semibold">{_.upperCase(coin.symbol)}</div>
              <div className="text-secondary-foreground ml-auto">
                $
                {formatter.numberReadable(coin.currentPrice, {
                  mantissa: 4,
                })}
              </div>
              <div
                className={cn(
                  "text-muted-foreground text-xs",
                  coin.change24h > 0 ? "text-green-400" : "text-red-400"
                )}
              >
                ({formatter.pct(coin.change24h / 100)})
              </div>
            </div>
          )}
        </div>
        <Separator />
        <div className="inline-flex w-full items-center px-3">
          <div className="text-secondary-foreground text-sm font-medium">
            Overall Score
            <InfoTooltip>
              Calculated from average score of all of the privacy components in
              the protocol.
            </InfoTooltip>
          </div>
          <div
            className="ml-auto text-2xl font-semibold"
            style={{
              color: tier?.color,
            }}
          >
            {protocol.overall_score || "N/A"}
            {tier?.emoji}
          </div>
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
        {fdv && coin && (
          <ProtocolFdvChart name={protocol.name} coin={coin} fdv={fdv} />
        )}

        {internalProtocols.map((internalProtocol, i) => {
          return (
            <Collapsible
              defaultOpen
              key={i}
              className="bg-card rounded-md border py-2"
            >
              <div className="flex items-center gap-2 px-3">
                <div className="-space-y-1">
                  <p className="text-muted-foreground text-xs">
                    Privacy Analysis
                  </p>
                  <h2 className="font-semibold">
                    {internalProtocol.name
                      ? `${protocol.name} - ${internalProtocol.name}`
                      : protocol.name}
                  </h2>
                </div>
                <div className="flex-1" />
                <InfoTooltip className="text-muted-foreground">
                  Calculated from all of the scores of each criteria.
                </InfoTooltip>
                <div className="text-secondary-foreground font-medium">
                  Total Score: {internalProtocol.overall_score || "N/A"}
                </div>
                <CollapsibleTrigger>
                  <ChevronDown className="text-muted-foreground" />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2 space-y-2">
                <Separator />
                <div className="grid grid-cols-1 gap-2 px-2">
                  {(
                    [
                      {
                        key: "who",
                        value: internalProtocol.priv_who,
                      },
                      {
                        key: "what",
                        value: internalProtocol.priv_what,
                      },
                      {
                        key: "deanon",
                        value: internalProtocol.de_anon,
                      },
                      {
                        key: "liveness",
                        value: internalProtocol.liveness_req,
                      },
                      {
                        key: "maturity",
                        value: internalProtocol.base_maturity,
                      },
                    ] as const
                  ).map(({ key, value }) => (
                    <div
                      key={key}
                      className="bg-background space-y-3 rounded-md p-3"
                    >
                      <Collapsible className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">
                            {criteria[key].definition.title}
                          </h3>
                          <CollapsibleTrigger>
                            <ChevronDown className="text-muted-foreground" />
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <div className="text-secondary-foreground text-sm whitespace-pre-wrap">
                            {criteria[key].definition.description}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      <Separator />
                      {value === "" ? (
                        <div className="text-2xl font-semibold">
                          <span className="text-secondary-foreground">
                            Stage:
                          </span>{" "}
                          N/A
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-2xl">
                            <div className="font-semibold">
                              <span className="text-secondary-foreground">
                                Stage:
                              </span>{" "}
                              {criteria[key].scores[value].title}
                            </div>
                            <div
                              className="font-bold"
                              style={{
                                color: "white",
                                WebkitTextStroke:
                                  "4.5px var(--accent-foreground)",
                                paintOrder: "stroke fill",
                              }}
                            >
                              {value}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <div className="text-muted-foreground text-xs">
                                Definition
                              </div>
                              <div className="text-body-foreground text-sm whitespace-pre-wrap">
                                {criteria[key].scores[value].definition}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-muted-foreground text-xs">
                                Characteristics
                              </div>
                              <div className="text-body-foreground space-y-0.5 text-sm whitespace-pre-wrap">
                                {criteria[key].scores[
                                  value
                                ].characteristics.map((characteristic) => (
                                  <div
                                    key={characteristic}
                                    className="flex items-center"
                                  >
                                    <Circle className="fill-body-foreground mx-2 size-1.5 shrink-0" />
                                    {characteristic}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}
