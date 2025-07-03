"use client"

import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"

import { createIDBPersister } from "@/lib/idb"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60, // 1 minute
      experimental_prefetchInRender: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
})

const persister = createIDBPersister()

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
