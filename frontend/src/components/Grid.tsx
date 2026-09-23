import { COLUMNS, columnFor, groupToColumn, type ColumnId } from '../lib/columns'
import type { Advertiser, CallState, City, Finding } from '../lib/types'
import { VerdictChip } from './Chip'

interface Props { cities: City[]; calls: Record<string, CallState>; findings: Finding[]; landed: string[]; advertisers: Advertiser[]; onChip: (n: string) => void; empty: boolean }

type CellStatus = 'pending' | 'done' | 'failed' | 'idle'

function cellStatus(calls: CallState[], col: ColumnId): CellStatus {
  const relevant = calls.filter((c) => groupToColumn(c.group) === (col === 'paa' ? 'search' : col === 'ads' ? 'search' : col))
  if (relevant.length === 0) return 'idle'
  if (relevant.some((c) => c.status === 'pending')) return 'pending'
  if (relevant.every((c) => c.status === 'failed')) return 'failed'
  return 'done'
}

export function Grid(p: Props) {
  const byCell = new Map<string, Finding[]>()
  for (const f of p.findings) {
    const seen = new Set<string>()
    for (const o of f.observations) {
      if (!o.city_id) continue
      const key = `${o.city_id}:${columnFor(o.surface)}`
      if (seen.has(key)) continue
      seen.add(key)
      byCell.set(key, [...(byCell.get(key) ?? []), f])
    }
  }
  const landed = new Set(p.landed)
  return (
    <section className="card overflow-hidden" aria-label="What a victim sees, by city and surface">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[760px]">
          <thead>
            <tr className="text-left">
              <th className="label px-4 py-3 w-[128px] font-semibold">City</th>
              {COLUMNS.map((c) => <th key={c.id} className="px-3 py-3 align-bottom"><div className="label">{c.title}</div><div className="text-[11px] text-ink-muted font-normal normal-case tracking-normal">{c.hint}</div></th>)}
            </tr>
          </thead>
          <tbody>
            {p.cities.map((city) => {
              const cityCalls = Object.values(p.calls).filter((c) => c.city_id === city.id)
              return (
                <tr key={city.id} className="border-t border-line align-top">
                  <td className="px-4 py-3"><div className="font-medium">{city.name}</div><div className="text-[11px] text-ink-muted">{city.state}</div></td>
                  {COLUMNS.map((col) => {
                    const status = cellStatus(cityCalls, col.id)
                    const items = byCell.get(`${city.id}:${col.id}`) ?? []
                    const failed = cityCalls.find((c) => c.status === 'failed' && groupToColumn(c.group) === (col.id === 'maps' ? 'maps' : 'search'))
                    return (
                      <td key={col.id} className="px-3 py-3 min-w-[170px]">
                        {status === 'pending' && items.length === 0 ? (
                          <div className="flex flex-col gap-1.5" aria-busy="true"><span className="sk h-5 w-28 block" /><span className="sk h-5 w-20 block" /></div>
                        ) : status === 'failed' ? (
                          <div className="text-[12px] text-danger border border-dashed rounded-sm px-2 py-1" style={{ borderColor: 'color-mix(in oklch, var(--danger) 45%, transparent)' }}>{failed?.error ?? 'Call failed'}</div>
                        ) : items.length === 0 ? (
                          <span className="text-ink-muted text-[13px]">{status === 'idle' && p.empty ? '' : '—'}</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((f) => <VerdictChip key={f.number_norm} display={f.display} verdict={f.verdict} landed={landed.has(f.number_norm)} onClick={() => p.onChip(f.number_norm)} title={`${f.verdict} · score ${f.score}`} />)}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            <tr className="border-t border-line align-top">
              <td className="px-4 py-3"><div className="font-medium">National</div><div className="text-[11px] text-ink-muted">Ads Transparency</div></td>
              <td colSpan={3} className="px-3 py-3 text-[13px] text-ink-muted">Advertisers currently bidding on the brand name in India. Brand-owned in amber; anyone else is worth a look.</td>
              <td className="px-3 py-3 min-w-[170px]">
                {p.calls.ads?.status === 'pending' ? <span className="sk h-5 w-28 block" /> : p.advertisers.length === 0 ? <span className="text-ink-muted text-[13px]">—</span> : (
                  <div className="flex flex-wrap gap-1.5">
                    {p.advertisers.map((a) => (
                      <span key={a.advertiser_id ?? a.advertiser} className={`chip ${a.is_brand ? 'chip-brand' : 'chip-third'}`} style={{ cursor: 'default' }} title={`${a.creatives} creatives`}>
                        {a.advertiser} <span className="opacity-70">×{a.creatives}</span>
                      </span>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
