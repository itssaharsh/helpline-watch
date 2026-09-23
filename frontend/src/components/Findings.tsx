import { SIGNAL_LABEL, SURFACE_LABEL, VERDICT_LABEL } from '../lib/columns'
import type { City, Finding } from '../lib/types'
import { Tag, VerdictChip } from './Chip'

const TONE: Record<string, 'danger' | 'warning' | 'success'> = { fake: 'danger', review: 'warning', official: 'success', official_unlisted: 'success' }

export function Findings({ findings, cities, onSelect, selected, reverseInFlight }: { findings: Finding[]; cities: City[]; onSelect: (n: string) => void; selected: string | null; reverseInFlight: string | null }) {
  const cityName = (id: string) => cities.find((c) => c.id === id)?.name ?? id
  return (
    <section className="card overflow-hidden flex flex-col min-h-[240px]" aria-label="Findings">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <h2 className="text-[15px] font-bold">Numbers found</h2>
        <span className="text-[12px] text-ink-muted num">{findings.length} distinct</span>
      </div>
      {findings.length === 0 ? (
        <div className="p-6 text-[13px] text-ink-muted">No numbers yet. Start a sweep to see every number a victim would be shown.</div>
      ) : (
        <ul className="divide-y divide-line overflow-y-auto max-h-[420px]">
          {findings.map((f) => (
            <li key={f.number_norm}>
              <button type="button" onClick={() => onSelect(f.number_norm)} aria-current={selected === f.number_norm ? 'true' : undefined}
                className="w-full text-left px-4 py-2.5 flex flex-col gap-1.5 row-hover" style={{ background: selected === f.number_norm ? 'var(--surface-2)' : undefined }}>
                <span className="flex items-center gap-3 min-w-0">
                  <VerdictChip display={f.display} verdict={f.verdict} />
                  <Tag tone={TONE[f.verdict]}>{VERDICT_LABEL[f.verdict]}</Tag>
                  <span className="num text-[12px] text-ink-muted">score {f.score}</span>
                  <span className="ml-auto text-[11px] text-ink-muted truncate">{f.surfaces.map((s) => SURFACE_LABEL[s]).slice(0, 2).join(' · ')}{f.city_ids.length ? ` · ${f.city_ids.slice(0, 3).map(cityName).join(', ')}${f.city_ids.length > 3 ? ` +${f.city_ids.length - 3}` : ''}` : ''}</span>
                  {f.in_pack && <Tag tone="danger">in pack</Tag>}
                </span>
                <span className="flex flex-wrap gap-1 text-[11px] text-ink-muted">
                  {f.signals.filter((s) => s.weight > 0).slice(0, 5).map((s) => <span key={s.code} className="px-1.5 h-5 inline-flex items-center rounded-sm bg-surface-2 whitespace-nowrap">{SIGNAL_LABEL[s.code] ?? s.code}</span>)}
                  {f.signals.every((s) => s.weight === 0) && f.signals[0] && <span className="px-1.5 h-5 inline-flex items-center rounded-sm bg-surface-2 whitespace-nowrap text-success">{SIGNAL_LABEL[f.signals[0].code] ?? f.signals[0].code}</span>}
                  {f.other_brands.length > 0 && <span className="px-1.5 h-5 inline-flex items-center rounded-sm text-danger whitespace-nowrap" style={{ background: 'color-mix(in oklch, var(--danger) 12%, transparent)' }}>posing as {f.other_brands.length + 1} brands</span>}
                  {reverseInFlight === f.number_norm && <span className="px-1.5 h-5 inline-flex items-center rounded-sm bg-surface-2 text-accent">reverse lookup…</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
