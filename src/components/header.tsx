"use client"

import React, { memo, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Github, MoonIcon, Search, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { nav } from "@/config/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { MiniProtocol } from "@/types"

import { Button } from "./ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import { Input } from "./ui/input"

export const Header = memo(
  ({
    className,
    protocols,
    ...props
  }: React.ComponentProps<"div"> & {
    protocols: MiniProtocol[]
  }) => {
    const { setTheme, resolvedTheme } = useTheme()
    const toggleTheme = useCallback(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }, [setTheme, resolvedTheme])

    const [open, setOpen] = useState(false)
    useEffect(() => {
      document.addEventListener("keydown", (e) => {
        if (e.key === "/") {
          e.preventDefault()
          setOpen(true)
        }
      })
    }, [])

    return (
      <>
        <div
          className={cn("sticky top-0 flex items-center gap-2", className)}
          {...props}
        >
          <div className="relative w-sm">
            <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
            <p className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-sm">
              <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                <span className="text-xs">⌘</span>/
              </kbd>
            </p>
            <Input
              className="h-8 cursor-pointer pl-8"
              placeholder="Search"
              readOnly
              onClick={() => setOpen(true)}
            />
          </div>
          <Link
            href={siteConfig.url.github}
            target="_blank"
            rel="noreferrer"
            className="ml-auto"
          >
            <Button variant="outline" size="smIcon">
              <Github />
            </Button>
          </Link>
          <Button onClick={toggleTheme} variant="outline" size="smIcon">
            <SunIcon className="size-4 dark:hidden" />
            <MoonIcon className="hidden size-4 dark:block" />
          </Button>
        </div>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Type a command or search..."
            autoFocus={false}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {nav.map((section) => (
              <CommandGroup key={section.title} heading={section.title}>
                {section.items.map((item) => (
                  <Link
                    href={item.href}
                    key={item.label}
                    prefetch={false}
                    rel={item.isExternal ? "noreferrer noopener" : undefined}
                    target={item.isExternal ? "_blank" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <CommandItem>
                      <item.icon className="size-4 shrink-0" />
                      {item.label}
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            ))}
            <CommandGroup heading="Protocols">
              {protocols.map((protocol) => (
                <Link
                  href={`/protocols/${protocol.id}`}
                  prefetch={false}
                  key={protocol.id}
                  onClick={() => setOpen(false)}
                >
                  <CommandItem>
                    <img
                      src={protocol.logo}
                      alt={protocol.name}
                      className="size-4 shrink-0 rounded-full"
                    />
                    {protocol.name}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    )
  }
)

Header.displayName = "Header"
