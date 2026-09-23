import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { SIGNAL_LABEL, SURFACE_LABEL, VERDICT_LABEL } from '../lib/columns'
import type { City, Finding } from '../lib/types'
import { Tag } from './Chip'

const TONE: Record<string, string> = { fake: 'var(--danger)', review: 'var(--warning)', official: 'var(--success)', official_unlisted: 'var(--success)' }

interface Props { finding: Finding | null; cities: City[]; busy: boolean; onClose: () => void; onTogglePack: (v: boolean) => void; onMarkOfficial: () => void }

export function Drawer(p: Props) {
  const { finding, onClose } = p
  useEffect(() => {
    if (!finding) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finding, onClose])
  const f = finding
  const cityName = (id: string | null) => (id ? cities(p.cities, id) : 'national')
  return (
    <AnimatePresence>
      {f && (
        <>
          <motion.div key="scrim" className="fixed inset-0 z-30" style={{ background: 'color-mix(in oklch, var(--canvas) 60%, transparent)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={p.onClose} aria-hidden />
          <motion.aside key="drawer" role="dialog" aria-modal="true" aria-label={`Finding ${f.display}`} className="fixed top-0 right-0 bottom-0 z-40 w-full max-w-[480px] bg-surface-1 border-l border-line overflow-y-auto flex flex-col"
            initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: 'spring', visualDuration: 0.3, bounce: 0 }}>
            <header className="px-5 py-4 border-b border-line flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="num text-[22px] font-semibold" style={{ color: TONE[f.verdict] }}>{f.display}</h2>
                  <Tag tone={f.verdict === 'fake' ? 'danger' : f.verdict === 'review' ? 'warning' : 'success'}>{VERDICT_LABEL[f.verdict]}</Tag>
                </div>
                <div className="text-[12px] text-ink-muted mt-1 num">{f.kind.replace('_', ' ')} · score {f.score} · seen in {f.city_ids.length || 'no'} {f.city_ids.length === 1 ? 'city' : 'cities'} · {f.observations.length} sightings</div>
                <div className="mt-2 h-1.5 rounded-full bg-surface-3 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (f.score / 10) * 100)}%`, background: TONE[f.verdict] }} /></div>
              </div>
              <button type="button" className="btn btn-ghost" onClick={p.onClose} aria-label="Close">Esc</button>
            </header>

            <section className="px-5 py-4 border-b border-line">
              <div className="label mb-2">Why</div>
              <ul className="flex flex-col gap-2">
                {f.signals.map((s) => (
                  <li key={s.code} className="flex gap-3 text-[13px]">
                    <span className="num w-7 shrink-0 text-right" style={{ color: s.weight > 0 ? TONE[f.verdict] : 'var(--success)' }}>{s.weight > 0 ? `+${s.weight}` : '✓'}</span>
                    <span><span className="font-medium">{SIGNAL_LABEL[s.code] ?? s.code}.</span> <span className="text-ink-muted">{s.detail}</span></span>
                  </li>
                ))}
              </ul>
              {f.other_brands.length > 0 && <p className="mt-3 text-[13px] text-danger">Same number also posing as {f.other_brands.join(', ')}.</p>}
            </section>

            <section className="px-5 py-4 border-b border-line">
              <div className="label mb-2">Seen on</div>
              <ul className="flex flex-col gap-3">
                {f.observations.map((o, i) => (
                  <li key={i} className="text-[13px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{SURFACE_LABEL[o.surface]}</span>
                      <span className="text-ink-muted">· {cityName(o.city_id)}</span>
                      {o.provenance.hl === 'hi' && <Tag>Hindi query</Tag>}
                      {o.provenance.fixture_kind === 'synthetic' && <Tag tone="warning">synthetic fixture</Tag>}
                    </div>
                    {o.listing?.title && (
                      <div className="text-ink-muted mt-0.5">Listing “{o.listing.title}” · {o.listing.reviews ?? 0} reviews{o.listing.rating != null ? ` · ${o.listing.rating}★` : ''}{o.listing.unclaimed ? ' · unclaimed' : ''}{o.listing.listing_type ? ` · ${o.listing.listing_type}` : ''}
                        {o.listing.place_id && !o.listing.place_id.startsWith('synthetic') && <> · <a className="underline" href={`https://www.google.com/maps/place/?q=place_id:${o.listing.place_id}`} target="_blank" rel="noreferrer">open in Maps</a></>}
                      </div>
                    )}
                    {o.source_link && <a className="block truncate text-ink-muted underline mt-0.5" href={o.source_link} target="_blank" rel="noreferrer">{o.source_title ?? o.source_link}</a>}
                    {o.context && <blockquote className="mt-1 pl-3 border-l-2 border-line text-ink-muted">{o.context}</blockquote>}
                    <div className="mt-1 text-[12px]">
                      {o.provenance.archive_link ? <a className="underline text-accent" href={o.provenance.archive_link} target="_blank" rel="noreferrer">Replay this search on SerpApi</a> : <span className="text-ink-muted">query “{o.provenance.query}” · {o.provenance.engine}{o.provenance.fixture_kind === 'synthetic' ? ' · demo data, not evidence' : ''}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="px-5 py-4 border-b border-line">
              <div className="label mb-2">Reverse lookup</div>
              {!f.reverse_checked ? <p className="text-[13px] text-ink-muted">Not checked (only the top suspects are searched, to save credits).</p> : f.reverse_hits.length === 0 ? <p className="text-[13px] text-ink-muted">No pages mention this number.</p> : (
                <ul className="flex flex-col gap-2">
                  {f.reverse_hits.map((h, i) => (
                    <li key={i} className="text-[13px]">
                      <div className="flex items-center gap-2"><span className="text-ink-muted">{h.domain}</span>{h.scam_words.length > 0 && <Tag tone="danger">{h.scam_words.slice(0, 2).join(', ')}</Tag>}</div>
                      <a className="underline" href={h.link} target="_blank" rel="noreferrer">{h.title || h.link}</a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="px-5 py-4 mt-auto flex items-center gap-3 flex-wrap">
              {(f.verdict === 'fake' || f.verdict === 'review') && (
                <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                  <input type="checkbox" checked={f.in_pack} disabled={p.busy} onChange={(e) => p.onTogglePack(e.target.checked)} className="accent-[var(--accent)] w-4 h-4" />
                  In takedown pack
                </label>
              )}
              {f.verdict !== 'official' && <button type="button" className="btn btn-secondary ml-auto" disabled={p.busy} onClick={p.onMarkOfficial} title="Adds this number to the brand’s official list and re-classifies the sweep">Mark as official</button>}
            </section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function cities(list: City[], id: string) { return list.find((c) => c.id === id)?.name ?? id }
