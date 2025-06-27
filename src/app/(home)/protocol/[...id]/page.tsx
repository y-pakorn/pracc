"use client"

import { useParams } from "next/navigation"

export default function ProtocolPage() {
  const { id } = useParams()
  return <div>{id}</div>
}
