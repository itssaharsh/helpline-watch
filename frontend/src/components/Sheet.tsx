import { useMemo, useState } from 'react'
import type { CallState, City, SerpItem, SerpSnapshot } from '../lib/types'
import { withMarks, type VerdictOf } from './Mark'

interface SheetProps { city: City | null; snapshots: SerpSnapshot[]; calls: CallState[]; verdictOf: VerdictOf; landed: Set<string>; onNumber: (n: string) => void; running: boolean }

function pageLabel(s: SerpSnapshot) {
  if (s.engine === 'google_maps') return 'Google Maps'
  if (s.hl === 'hi') return 'Hindi search'
  return s.query
}

function redCount(s: SerpSnapshot, verdictOf: VerdictOf) {
  const seen = new Set<string>()
  for (const it of s.items) for (const n of it.numbers) if (verdictOf(n.norm) === 'fake') seen.add(n.norm)
  return seen.size
}

export function Sheet({ city, snapshots, calls, verdictOf, landed, onNumber, running }: SheetProps) {
  const pages = useMemo(() => snapshots.filter((s) => s.city_id === city?.id).sort((a, b) => (a.engine === 'google_maps' ? 1 : 0) - (b.engine === 'google_maps' ? 1 : 0) || (a.hl === 'hi' ? 1 : 0) - (b.hl === 'hi' ? 1 : 0)), [snapshots, city])
  const best = useMemo(() => pages.reduce((acc, p) => (redCount(p, verdictOf) > redCount(acc, verdictOf) ? p : acc), pages[0]), [pages, verdictOf])
  const [picked, setPicked] = useState<string | null>(null)
  const active = pages.find((p) => p.call_id === picked) ?? best
  const pending = calls.filter((c) => c.status === 'pending')
  const failed = calls.filter((c) => c.status === 'failed')

  if (!city) return <div className="sheet p-8 text-ink-muted">Pick a city.</div>
  return (
    <article className="sheet min-h-[720px] flex flex-col overflow-hidden" aria-label={`What a victim in ${city.name} is shown`}>
      <header className="px-6 sm:px-8 pt-6 pb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
          <span>Searched from {city.name}, {city.state}, on google.co.in</span>
          {active?.fixture_kind === 'synthetic' && <span className="pen-muted text-[15px]">demo fixture, not evidence</span>}
          {active?.archive_link && <a className="underline" href={active.archive_link} target="_blank" rel="noreferrer">Replay this search on SerpApi</a>}
        </div>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Pages for this city">
          {pages.map((p) => {
            const reds = redCount(p, verdictOf)
            const on = p.call_id === active?.call_id
            return (
              <button key={p.call_id} type="button" role="tab" aria-selected={on} onClick={() => setPicked(p.call_id)}
                className="h-8 px-3 rounded-md text-[13px] border transition-colors" style={{ borderColor: on ? 'var(--ink)' : 'var(--line)', background: on ? 'var(--ink)' : 'var(--paper)', color: on ? 'var(--paper)' : 'var(--ink-muted)' }}>
                {pageLabel(p)}{reds > 0 && <span className="ml-2 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red text-white text-[11px] font-bold">{reds}</span>}
              </button>
            )
          })}
          {pending.map((c) => <span key={c.id} className="h-8 px-3 rounded-md text-[13px] border border-line text-ink-faint inline-flex items-center gap-2"><span className="tab-dot pending" />{c.group === 'maps' ? 'Google Maps' : c.group === 'hindi' ? 'Hindi search' : c.label.split(' · ').pop()}</span>)}
          {failed.map((c) => <span key={c.id} className="h-8 px-3 rounded-md text-[13px] border border-dashed border-red text-red inline-flex items-center" title={c.error}>{c.group === 'maps' ? 'Google Maps' : c.label.split(' · ').pop()}: no result</span>)}
        </div>
      </header>
      <div className="rule" />
      {active ? <Page snapshot={active} verdictOf={verdictOf} landed={landed} onNumber={onNumber} /> : (
        <div className="px-8 py-10 flex flex-col gap-3" aria-busy={running}>
          {running ? <><span className="sk h-5 w-2/3" /><span className="sk h-4 w-1/2" /><span className="sk h-4 w-5/6" /><span className="sk h-5 w-1/2 mt-4" /><span className="sk h-4 w-2/3" /></> : <p className="text-ink-muted">No pages recorded for {city.name} yet. Run a sweep to see what a victim here is shown.</p>}
        </div>
      )}
    </article>
  )
}

function Stars({ rating, reviews }: { rating: number | null; reviews: number | null }) {
  if (rating == null) return null
  const full = Math.round(rating)
  return <span className="text-[13px] text-ink-muted"><span className="font-semibold text-ink">{rating.toFixed(1)}</span> <span className="stars" aria-hidden>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span> ({reviews ?? 0})</span>
}

function Page({ snapshot, verdictOf, landed, onNumber }: { snapshot: SerpSnapshot; verdictOf: VerdictOf; landed: Set<string>; onNumber: (n: string) => void }) {
  const mark = (text: string | null | undefined, item: SerpItem) => withMarks(text, item.numbers, verdictOf, landed, onNumber)
  const items = snapshot.items
  const isMaps = snapshot.engine === 'google_maps'
  const locals = items.filter((i) => i.kind === 'local')
  const paa = items.filter((i) => i.kind === 'paa')
  const kg = items.find((i) => i.kind === 'knowledge')
  const flow = items.filter((i) => i.kind !== 'local' && i.kind !== 'paa' && i.kind !== 'knowledge')
  const paaAfter = items.findIndex((i) => i.kind === 'paa') > 0 ? items[items.findIndex((i) => i.kind === 'paa') - 1] : null

  return (
    <div className="px-6 sm:px-8 py-6 flex flex-col gap-6" dir={snapshot.hl === 'hi' ? 'auto' : undefined}>
      <div className="flex items-center gap-3 h-11 px-4 rounded-full border border-line-strong bg-paper max-w-[620px]">
        <span className="flex-1 text-[15px] truncate">{snapshot.query}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--link)" strokeWidth="2.2" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
      </div>
      <div className={kg ? 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]' : ''}>
        <div className="flex flex-col gap-6 max-w-[640px] min-w-0">
          {isMaps && (
            <div className="flex flex-col gap-4">
              <p className="text-[13px] text-ink-muted">Listings shown on Google Maps for this search.</p>
              {items.length === 0 && <p className="text-ink-muted">No listings.</p>}
              {items.map((it, i) => <MapsCard key={i} item={it} mark={mark} />)}
            </div>
          )}
          {!isMaps && flow.map((it, i) => (
            <div key={i} className="flex flex-col gap-5">
              {it.kind === 'ad' && (
                <div>
                  <div className="text-[13px] font-bold text-ink mb-0.5">Sponsored</div>
                  <div className="serp-url">{it.displayed_link ?? it.link}</div>
                  <div className="serp-title">{mark(it.title, it)}</div>
                  <div className="serp-text">{mark(it.text, it)}</div>
                </div>
              )}
              {it.kind === 'answer' && (
                <div className="serp-box">
                  <div className="serp-text text-[15px] text-ink">{mark(it.text, it)}</div>
                  <div className="serp-url mt-1">{it.title}</div>
                </div>
              )}
              {it.kind === 'organic' && (
                <div>
                  <div className="serp-url">{it.displayed_link ?? it.link}</div>
                  <div className="serp-title">{mark(it.title, it)}</div>
                  <div className="serp-text">{mark(it.text, it)}</div>
                </div>
              )}
              {paaAfter === it && paa.length > 0 && (
                <div className="serp-box flex flex-col">
                  <div className="text-[16px] font-medium mb-2">People also ask</div>
                  {paa.map((q, j) => (
                    <div key={j} className="py-2 border-t border-line first:border-0">
                      <div className="text-[15px]">{q.question}</div>
                      <div className="serp-text mt-1">{mark(q.text, q)}</div>
                      <div className="serp-url mt-1">{q.title}</div>
                    </div>
                  ))}
                </div>
              )}
              {i === (flow.findIndex((f) => f.kind === 'organic')) && locals.length > 0 && (
                <div className="serp-box">
                  <div className="text-[16px] font-medium mb-2">Places</div>
                  {locals.map((l, j) => (
                    <div key={j} className="py-2 border-t border-line first:border-0 flex flex-col">
                      <div className="text-[15px] font-medium">{mark(l.title, l)}</div>
                      <Stars rating={l.rating} reviews={l.reviews} />
                      <div className="serp-text">{[l.listing_type, l.address].filter(Boolean).join(', ')}</div>
                      {l.phone && <div className="serp-text">{mark(l.phone, l)}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {!isMaps && flow.length === 0 && <p className="text-ink-muted">Nothing on this page.</p>}
        </div>
        {kg && (
          <aside className="serp-box self-start">
            <div className="text-[20px] font-medium">{kg.title}</div>
            <div className="serp-text">{kg.text}</div>
            {kg.phone && <div className="serp-text mt-2"><span className="text-ink-muted">Customer service: </span>{mark(kg.phone, kg)}</div>}
            {kg.link && <div className="serp-url mt-1 truncate">{kg.link}</div>}
          </aside>
        )}
      </div>
    </div>
  )
}

function MapsCard({ item, mark }: { item: SerpItem; mark: (t: string | null | undefined, i: SerpItem) => React.ReactNode }) {
  return (
    <div className="serp-box flex flex-col gap-0.5">
      <div className="text-[16px] font-medium">{mark(item.title, item)}</div>
      <Stars rating={item.rating} reviews={item.reviews} />
      <div className="serp-text">{[item.listing_type, item.address].filter(Boolean).join(', ')}</div>
      {item.phone && <div className="serp-text">{mark(item.phone, item)}</div>}
      <div className="flex gap-3 text-[12px] text-ink-muted mt-1">
        {item.unclaimed && <span className="pen-muted text-[14px]">unclaimed listing</span>}
        {item.place_id && !item.place_id.startsWith('synthetic') && <a className="underline" href={`https://www.google.com/maps/place/?q=place_id:${item.place_id}`} target="_blank" rel="noreferrer">Open in Maps</a>}
        {item.link && <span className="serp-url truncate">{item.link}</span>}
      </div>
    </div>
  )
}

export function CityTabs({ cities, active, onPick, calls, fakesByCity }: { cities: City[]; active: string | null; onPick: (id: string) => void; calls: Record<string, CallState>; fakesByCity: Record<string, number> }) {
  return (
    <div className="flex items-end gap-1 overflow-x-auto px-1" role="tablist" aria-label="Cities">
      {cities.map((c) => {
        const mine = Object.values(calls).filter((k) => k.city_id === c.id)
        const pending = mine.some((k) => k.status === 'pending')
        const failed = mine.length > 0 && mine.some((k) => k.status === 'failed')
        const fakes = fakesByCity[c.id] ?? 0
        return (
          <button key={c.id} type="button" role="tab" aria-selected={active === c.id} onClick={() => onPick(c.id)} className={`tab ${failed ? 'tab-failed' : ''}`}>
            <span className="font-medium">{c.name}</span>
            {pending ? <span className="tab-dot pending" aria-label="sweeping" /> : fakes > 0 ? <span className="tab-count" aria-label={`${fakes} fake`}>{fakes}</span> : mine.length > 0 ? <span className="tab-dot" style={{ background: 'var(--green)' }} aria-label="clean" /> : null}
          </button>
        )
      })}
    </div>
  )
}
