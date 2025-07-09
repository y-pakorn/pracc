"use client"

import { useState } from "react"

import { AppSidebar } from "./app-sidebar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

export function MobileSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-[var(--sidebar-width)]">
        <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
        <SheetDescription className="sr-only" />
        <AppSidebar
          className="w-full px-4 py-6"
          onNavClick={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
