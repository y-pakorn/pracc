import Link from "next/link"
import { ChevronLeft, List } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="max-w-sm">
        <div className="text-2xl font-semibold">Page Not Found</div>
        <div className="text-muted-foreground text-sm">
          The page you are looking for does not exist. You can go back to the
          home page or browse the protocols.
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
}
