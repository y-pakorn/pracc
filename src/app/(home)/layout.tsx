import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex min-h-screen w-full justify-center">
      <AppSidebar className="w-[220px] shrink-0 border-r p-4" />
      <div className="flex w-full flex-col gap-6 px-6 py-4">{children}</div>
    </div>
  )
}
