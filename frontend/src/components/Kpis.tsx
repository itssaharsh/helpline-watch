import type { CallState, Diff, Finding, Verdict } from '../lib/types'
import { Tag } from './Chip'

interface Props { findings: Finding[]; calls: Record<string, CallState>; cityIds: string[]; liveCalls: number; cacheHits: number; sweepId: string | null; running: boolean; diff: Diff | null; packUrl: string | null; mode: string | null; fixtureKinds: Record<string, number> }

function count(findings: Finding[], v: Verdict) { return findings.filter((f) => f.verdict === v).length }

export function Kpis(p: Props) {
  const packCount = p.findings.filter((f) => f.in_pack).length
  const cityStates = p.cityIds.map((c) => Object.values(p.calls).filter((k) => k.city_id === c))
  const complete = cityStates.filter((ks) => ks.length > 0 && ks.every((k) => k.status !== 'pending') && ks.some((k) => k.status === 'done')).length
  const partial = cityStates.filter((ks) => ks.some((k) => k.status === 'failed')).length
  const synthetic = p.fixtureKinds.synthetic ?? 0
  const tiles: { label: string; value: string; tone: string; hint?: string }[] = [
    { label: 'Fake', value: String(count(p.findings, 'fake')), tone: 'var(--danger)', hint: 'score ≥ 3' },
    { label: 'Needs review', value: String(count(p.findings, 'review')), tone: 'var(--warning)', hint: 'score 1–2, never auto-filed' },
    { label: 'Official', value: String(count(p.findings, 'official') + count(p.findings, 'official_unlisted')), tone: 'var(--success)', hint: 'matches the list or the brand’s site' },
    { label: 'Coverage', value: `${complete} / ${p.cityIds.length}`, tone: partial ? 'var(--warning)' : 'var(--ink)', hint: partial ? `${partial} city with a failed call` : 'cities fully swept' },
    { label: 'Calls', value: `${p.liveCalls + p.cacheHits}`, tone: 'var(--ink)', hint: `${p.liveCalls} live · ${p.cacheHits} cached` },
  ]
  return (
    <section className="flex flex-wrap items-stretch gap-3" aria-label="Sweep summary">
      {tiles.map((t) => (
        <div key={t.label} className="card px-4 py-3 min-w-[132px] flex-1">
          <div className="label">{t.label}</div>
          <div className="num text-[26px] leading-tight font-semibold mt-0.5" style={{ color: t.tone }}>{t.value}</div>
          {t.hint && <div className="text-[11px] text-ink-muted mt-0.5">{t.hint}</div>}
        </div>
      ))}
      <div className="card px-4 py-3 flex flex-col justify-between gap-2 min-w-[240px]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="label">Mode</span>
          <Tag tone={p.mode === 'live' ? 'success' : 'muted'}>{p.mode === 'live' ? 'live' : 'replay'}</Tag>
          {synthetic > 0 && <Tag tone="warning">synthetic fixtures · demo data</Tag>}
          {p.diff && p.diff.previous_id && (
            <span className="text-[12px] text-ink-muted num">since last sweep: <span className="text-danger">+{p.diff.new.length}</span> · {p.diff.persisting.length} persisting · <span className="text-success">{p.diff.gone.length} gone</span></span>
          )}
        </div>
        <a className={`btn btn-secondary ${!p.packUrl || packCount === 0 || p.running ? 'pointer-events-none opacity-40' : ''}`} href={p.packUrl ?? '#'} download aria-disabled={!p.packUrl || packCount === 0 || p.running}
          title={packCount === 0 ? 'Nothing in the pack yet. Open a red finding and keep it in the pack.' : undefined}>
          Download takedown pack <span className="num">({packCount})</span>
        </a>
      </div>
    </section>
  )
}
