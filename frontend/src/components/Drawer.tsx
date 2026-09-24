import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { SIGNAL_LABEL, SURFACE_LABEL } from '../lib/labels'
import type { City, Finding } from '../lib/types'

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
  const cityName = (id: string | null) => (id ? (p.cities.find((c) => c.id === id)?.name ?? id) : 'national')
  const headline = f ? (f.verdict === 'fake' ? 'Not the brand’s number' : f.verdict === 'review' ? 'Not on the list, needs a look' : f.verdict === 'official' ? 'The brand’s own number' : 'On the brand’s site, missing from the list') : ''
  return (
    <AnimatePresence>
      {f && (
        <>
          <motion.div key="scrim" className="fixed inset-0 z-30" style={{ background: 'rgba(27,34,51,.32)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={onClose} aria-hidden />
          <motion.aside key="slip" role="dialog" aria-modal="true" aria-label={`Number ${f.display}`} className="fixed top-0 right-0 bottom-0 z-40 w-full max-w-[520px] bg-paper overflow-y-auto flex flex-col shadow-[-12px_0_32px_-16px_rgba(27,34,51,.4)]"
            initial={{ x: 520 }} animate={{ x: 0 }} exit={{ x: 520 }} transition={{ type: 'spring', visualDuration: 0.3, bounce: 0 }}>
            <header className="px-7 pt-6 pb-5 border-b border-line">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="relative inline-block">
                    <h2 className="text-[30px] font-bold tracking-tight" style={{ color: f.verdict === 'fake' ? 'var(--ink)' : f.verdict === 'review' ? 'var(--ink)' : 'var(--green)' }}>{f.display}</h2>
                    {f.verdict === 'fake' && <svg className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+24px)] h-[calc(100%+16px)]" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden><ellipse cx="50" cy="20" rx="48" ry="17" fill="none" stroke="var(--red)" strokeWidth="2" transform="rotate(-2 50 20)" /></svg>}
                    {f.verdict === 'fake' && <span className="pen text-red text-[20px] absolute -top-4 -right-12 rotate-[-8deg]">fake</span>}
                    {f.verdict === 'review' && <span className="pen text-ink-muted text-[18px] absolute -top-4 -right-14 rotate-[-6deg]">check this</span>}
                  </div>
                  <p className="text-[15px] mt-2">{headline}. Score {f.score}, seen {f.observations.length} {f.observations.length === 1 ? 'time' : 'times'} in {f.city_ids.length || 'no'} {f.city_ids.length === 1 ? 'city' : 'cities'}.</p>
                </div>
                <button type="button" className="btn btn-quiet shrink-0" onClick={onClose}>Close</button>
              </div>
            </header>

            <section className="px-7 py-5 border-b border-line">
              <h3 className="text-[15px] mb-2">Why</h3>
              <ul className="flex flex-col gap-2 text-[14px]">
                {f.signals.map((s) => (
                  <li key={s.code} className="grid grid-cols-[36px_1fr] gap-2">
                    <span className="pen text-[16px]" style={{ color: s.weight > 0 ? 'var(--red)' : 'var(--green)' }}>{s.weight > 0 ? `+${s.weight}` : 'ok'}</span>
                    <span><span className="font-semibold">{SIGNAL_LABEL[s.code] ?? s.code}.</span> <span className="text-ink-muted">{s.detail}</span></span>
                  </li>
                ))}
              </ul>
              {f.other_brands.length > 0 && <p className="mt-3 text-[14px]">Also seen for <span className="font-semibold">{f.other_brands.join(', ')}</span>.</p>}
            </section>

            <section className="px-7 py-5 border-b border-line">
              <h3 className="text-[15px] mb-2">Where it appeared</h3>
              <ul className="flex flex-col gap-4 text-[14px]">
                {f.observations.map((o, i) => (
                  <li key={i}>
                    <div className="font-semibold">{SURFACE_LABEL[o.surface]} in {cityName(o.city_id)}{o.provenance.hl === 'hi' ? ', Hindi query' : ''}</div>
                    {o.listing?.title && <div className="text-ink-muted">Listing “{o.listing.title}”, {o.listing.reviews ?? 0} reviews{o.listing.rating != null ? `, ${o.listing.rating} stars` : ''}{o.listing.unclaimed ? ', unclaimed' : ''}{o.listing.listing_type ? `, ${o.listing.listing_type}` : ''}{o.listing.place_id && !o.listing.place_id.startsWith('synthetic') && <> <a className="underline" href={`https://www.google.com/maps/place/?q=place_id:${o.listing.place_id}`} target="_blank" rel="noreferrer">open in Maps</a></>}</div>}
                    {o.source_link && <a className="block truncate text-link underline" href={o.source_link} target="_blank" rel="noreferrer">{o.source_title ?? o.source_link}</a>}
                    {o.context && <blockquote className="mt-1 pl-3 border-l-2 border-line text-ink-muted">{o.context}</blockquote>}
                    <div className="mt-1 text-[12px] text-ink-faint">
                      {o.provenance.archive_link ? <a className="underline text-ink-muted" href={o.provenance.archive_link} target="_blank" rel="noreferrer">Replay this search on SerpApi</a> : <>Query “{o.provenance.query}”{o.provenance.fixture_kind === 'synthetic' ? '. Demo fixture, not evidence.' : ''}</>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="px-7 py-5 border-b border-line">
              <h3 className="text-[15px] mb-2">Searching for the number itself</h3>
              {!f.reverse_checked ? <p className="text-[14px] text-ink-muted">Not searched. Only the top suspects are, to save credits.</p> : f.reverse_hits.length === 0 ? <p className="text-[14px] text-ink-muted">No pages mention this number.</p> : (
                <ul className="flex flex-col gap-2 text-[14px]">
                  {f.reverse_hits.map((h, i) => (
                    <li key={i}>
                      <div className="text-ink-muted">{h.domain}{h.scam_words.length > 0 && <span className="pen text-red text-[15px] ml-2">{h.scam_words.slice(0, 2).join(', ')}</span>}</div>
                      <a className="underline" href={h.link} target="_blank" rel="noreferrer">{h.title || h.link}</a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="px-7 py-5 mt-auto flex items-center gap-4 flex-wrap">
              {(f.verdict === 'fake' || f.verdict === 'review') && (
                <label className="flex items-center gap-2 text-[14px] cursor-pointer">
                  <input type="checkbox" checked={f.in_pack} disabled={p.busy} onChange={(e) => p.onTogglePack(e.target.checked)} className="w-4 h-4 accent-[var(--ink)]" />
                  Keep in the takedown pack
                </label>
              )}
              {f.verdict !== 'official' && <button type="button" className="btn btn-paper ml-auto" disabled={p.busy} onClick={p.onMarkOfficial} title="Adds this number to the brand’s official list and re-checks the sweep">Mark as official</button>}
            </section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
