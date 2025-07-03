import { getMiniProtocols, getRawProtocols } from "@/services/data"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

export const revalidate = 43200 // 12 hours

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const protocols = await getMiniProtocols()

  return (
    <div
      className="flex flex-col"
      style={
        {
          "--sidebar-width": "220px",
          "--header-height": "52px",
        } as React.CSSProperties
      }
    >
      <div className="container flex h-screen w-full justify-center overflow-hidden">
        <ScrollArea className="h-full w-[var(--sidebar-width)] shrink-0 overflow-y-auto border-r">
          <AppSidebar className="p-4" />
        </ScrollArea>
        {/* <ScrollArea className="h-full w-full overflow-y-auto"> */}
        <div className="flex h-full w-full flex-col overflow-y-auto">
          <Header
            className="bg-background sticky top-0 z-10 h-[var(--header-height)] px-6 py-4"
            protocols={protocols}
          />
          <div className="flex-1 space-y-4 px-6 py-4">{children}</div>
        </div>
        {/* </ScrollArea> */}
      </div>
    </div>
  )
}
