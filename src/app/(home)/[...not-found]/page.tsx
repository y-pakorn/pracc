import { notFound } from "next/navigation"

export const dynamicParams = false
export const dynamic = "force-static"

export default function CatchAll() {
  notFound()
}
