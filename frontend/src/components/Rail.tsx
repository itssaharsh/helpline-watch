import { AnimatePresence, motion } from 'motion/react'
import type { Brand, City, SweepSummary } from '../lib/types'

interface Props {
  brands: Brand[]; cities: City[]; brandId: string | null; cityIds: string[]; reverse: number; running: boolean; progress: { done: number; total: number }
  recent: SweepSummary[]; activeSweepId: string | null
  onBrand: (id: string) => void; onCities: (ids: string[]) => void; onReverse: (n: number) => void; onSweep: () => void; onLoad: (id: string) => void
}

export function Rail(p: Props) {
  const brand = p.brands.find((b) => b.id === p.brandId)
  const phase = p.running ? 'running' : p.activeSweepId ? 'again' : 'now'
  const label = phase === 'running' ? 'Sweeping…' : phase === 'again' ? 'Sweep again' : 'Sweep now'
  return (
    <aside className="w-full lg:w-[280px] shrink-0 border-b lg:border-b-0 lg:border-r border-line bg-surface-1/60 flex flex-col gap-5 p-4 overflow-y-auto">
      <section>
        <div className="label mb-2">Brand</div>
        <div className="flex flex-col gap-1" role="listbox" aria-label="Brand">
          {p.brands.map((b) => (
            <button key={b.id} type="button" role="option" aria-selected={b.id === p.brandId} onClick={() => p.onBrand(b.id)} disabled={p.running}
              className="flex items-center justify-between h-9 px-3 rounded-md text-left transition-colors row-hover"
              style={{ background: b.id === p.brandId ? 'var(--surface-2)' : undefined, boxShadow: b.id === p.brandId ? 'inset 2px 0 0 var(--accent)' : undefined }}>
              <span className="font-medium">{b.name}</span>
              <span className="text-[11px] text-ink-muted">{b.regulated ? 'regulated' : b.category.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </section>
      <section>
        <div className="label mb-2">Official numbers on file</div>
        {brand && brand.official_numbers.length ? (
          <ul className="flex flex-col gap-1">
            {brand.official_numbers.map((n) => <li key={n} className="num text-[13px] text-success">{n}</li>)}
          </ul>
        ) : <p className="text-[13px] text-ink-muted">None on file. Every number found will be compared against an empty list.</p>}
        <p className="text-[11px] text-ink-muted mt-2">Verify against the brand’s own site before filing. “Mark as official” in a finding adds to this list.</p>
      </section>
      <section>
        <div className="label mb-2">Cities</div>
        <div className="flex flex-wrap gap-1.5">
          {p.cities.map((c) => {
            const on = p.cityIds.includes(c.id)
            return (
              <button key={c.id} type="button" aria-pressed={on} disabled={p.running} onClick={() => p.onCities(on ? p.cityIds.filter((x) => x !== c.id) : [...p.cityIds, c.id])}
                className="h-7 px-2.5 rounded-sm text-[13px] border transition-colors"
                style={{ borderColor: on ? 'color-mix(in oklch, var(--accent) 45%, transparent)' : 'var(--line)', background: on ? 'var(--accent-soft)' : 'transparent', color: on ? 'var(--accent)' : 'var(--ink-muted)' }}>
                {c.name}
              </button>
            )
          })}
        </div>
        <p className="text-[11px] text-ink-muted mt-2">Each city costs {Math.max(1, 3)} searches. The first five hold 61% of reported incidents.</p>
      </section>
      <section className="flex items-center justify-between">
        <label htmlFor="reverse" className="label">Reverse lookups</label>
        <input id="reverse" type="number" min={0} max={12} value={p.reverse} disabled={p.running} onChange={(e) => p.onReverse(Math.max(0, Math.min(12, Number(e.target.value))))}
          className="num w-16 h-8 bg-surface-2 border border-line rounded-sm px-2 text-right text-[14px]" />
      </section>
      <button type="button" className="btn btn-primary w-full" onClick={p.onSweep} disabled={p.running || !p.brandId || p.cityIds.length === 0} aria-busy={p.running}
        title={p.cityIds.length === 0 ? 'Pick at least one city' : undefined}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={phase} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="num">
            {label}{phase === 'running' && <span className="opacity-80"> {p.progress.done}/{p.progress.total}</span>}
          </motion.span>
        </AnimatePresence>
      </button>
      <section>
        <div className="label mb-2">Recent sweeps</div>
        {p.recent.length === 0 ? <p className="text-[13px] text-ink-muted">No sweeps for this brand yet.</p> : (
          <ul className="flex flex-col gap-1">
            {p.recent.slice(0, 6).map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => p.onLoad(s.id)} disabled={p.running} className="w-full flex items-center justify-between h-8 px-2 rounded-sm row-hover text-[13px]"
                  style={{ background: s.id === p.activeSweepId ? 'var(--surface-2)' : undefined }}>
                  <span className="num text-ink-muted">{new Date(s.started_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="flex gap-2 num"><span className="text-danger">{s.counts.fake}</span><span className="text-warning">{s.counts.review}</span><span className="text-success">{s.counts.official + s.counts.official_unlisted}</span></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  )
}
