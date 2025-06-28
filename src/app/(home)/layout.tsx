import { ScrollArea } from "@/components/ui/scroll-area"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex h-screen w-full justify-center overflow-hidden">
      <ScrollArea className="h-full w-[220px] shrink-0 overflow-y-auto border-r">
        <AppSidebar className="p-4" />
      </ScrollArea>
      <ScrollArea className="h-full w-full overflow-y-auto">
        <div className="flex flex-col gap-4 px-6 py-4">{children}</div>
      </ScrollArea>
    </div>
  )
}
