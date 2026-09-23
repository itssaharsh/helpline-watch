import type { Brand, City, Health, NetworkData, Sweep, Diff, SweepSummary, Finding } from './types'

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  return res.json() as Promise<T>
}

export const api = {
  health: () => json<Health>('/api/health'),
  brands: () => json<Brand[]>('/api/brands'),
  cities: () => json<{ cities: City[]; default: string[] }>('/api/cities'),
  sweeps: (brandId: string) => json<SweepSummary[]>(`/api/sweeps?brand_id=${encodeURIComponent(brandId)}`),
  sweep: (id: string) => json<{ sweep: Sweep; counts: Record<string, number>; diff: Diff }>(`/api/sweeps/${id}`),
  network: () => json<NetworkData>('/api/network'),
  patchFinding: (sweepId: string, number: string, body: { in_pack?: boolean; mark_official?: boolean }) =>
    json<{ finding: Finding; counts: Record<string, number>; brand: Brand }>(`/api/sweeps/${sweepId}/findings/${encodeURIComponent(number)}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }),
  packUrl: (sweepId: string) => `/api/sweeps/${sweepId}/pack.zip`,
}

export type StreamHandlers = Partial<Record<'started' | 'plan' | 'call_done' | 'call_failed' | 'findings' | 'advertisers' | 'reverse_started' | 'reverse_done' | 'done' | 'error', (payload: any) => void>>

/** Open the sweep stream. Returns a close function. */
export function openSweepStream(brandId: string, cityIds: string[], reverse: number, handlers: StreamHandlers): () => void {
  const url = `/api/sweeps/stream?brand_id=${encodeURIComponent(brandId)}&cities=${encodeURIComponent(cityIds.join(','))}&reverse=${reverse}`
  const es = new EventSource(url)
  const names = Object.keys(handlers) as (keyof StreamHandlers)[]
  for (const name of names) {
    es.addEventListener(name, (ev) => {
      const payload = JSON.parse((ev as MessageEvent).data)
      handlers[name]?.(payload)
      if (name === 'done' || name === 'error') es.close()
    })
  }
  es.onerror = () => { handlers.error?.({ message: 'Connection to the sweep stream was lost.' }); es.close() }
  return () => es.close()
}
