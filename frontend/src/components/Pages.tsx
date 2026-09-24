import { useMemo, useState } from 'react'
import { Flex, Link, Skeleton } from '@radix-ui/themes'
import { ArrowSquareOut } from '@phosphor-icons/react'
import type { CallState, City, SerpItem, SerpSnapshot } from '../lib/types'
import { withMarks, type VerdictOf } from './withMarks'

interface Props { cities: City[]; snapshots: SerpSnapshot[]; calls: Record<string, CallState>; verdictOf: VerdictOf; landed: Set<string>; onNumber: (n: string) => void; running: boolean; fakesByCity: Record<string, number> }
const pageLabel = (s: SerpSnapshot) => (s.engine === 'google_maps' ? 'Google Maps' : s.hl === 'hi' ? 'Hindi search' : s.query)
function redCount(s: SerpSnapshot, verdictOf: VerdictOf) { const seen = new Set<string>(); for (const it of s.items) for (const n of it.numbers) if (verdictOf(n.norm) === 'fake') seen.add(n.norm); return seen.size }

export function Pages(p: Props) {
  const [cityId, setCityId] = useState<string | null>(null)
  const [pageId, setPageId] = useState<string | null>(null)
  const city = p.cities.find((c) => c.id === cityId) ?? p.cities[0] ?? null
  const pages = useMemo(() => p.snapshots.filter((s) => s.city_id === city?.id).sort((a, b) => (a.engine === 'google_maps' ? 1 : 0) - (b.engine === 'google_maps' ? 1 : 0) || (a.hl === 'hi' ? 1 : 0) - (b.hl === 'hi' ? 1 : 0)), [p.snapshots, city])
  const best = useMemo(() => pages.reduce((acc, s) => (redCount(s, p.verdictOf) > redCount(acc, p.verdictOf) ? s : acc), pages[0]), [pages, p.verdictOf])
  const active = pages.find((s) => s.call_id === pageId && s.city_id === city?.id) ?? best
  const cityCalls = Object.values(p.calls).filter((c) => c.city_id === city?.id)
  return (
    <Flex direction="column" gap="4">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="tablist" aria-label="Cities">
        {p.cities.map((c) => { const mine = Object.values(p.calls).filter((k) => k.city_id === c.id); const pending = mine.some((k) => k.status === 'pending'); const fakes = p.fakesByCity[c.id] ?? 0
          return <button key={c.id} type="button" role="tab" aria-selected={city?.id === c.id} className={`pill ${pending ? 'pending' : ''}`} onClick={() => { setCityId(c.id); setPageId(null) }}>{pending && <span className="breathe">●</span>}{c.name}{fakes > 0 && <span className="cnt">{fakes}</span>}</button> })}
      </div>
      {city && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {pages.map((s) => { const reds = redCount(s, p.verdictOf); const on = s.call_id === active?.call_id
            return <button key={s.call_id} type="button" className="pill" aria-pressed={on} onClick={() => setPageId(s.call_id)} style={{ height: 28, fontSize: 12 }}>{pageLabel(s)}{reds > 0 && <span className="cnt">{reds}</span>}</button> })}
          {cityCalls.filter((c) => c.status === 'pending').map((c) => <span key={c.id} className="pill pending" style={{ height: 28, fontSize: 12 }}><span className="breathe">●</span>{c.group === 'maps' ? 'Google Maps' : c.group === 'hindi' ? 'Hindi search' : c.label.split(' · ').pop()}</span>)}
          {cityCalls.filter((c) => c.status === 'failed').map((c) => <span key={c.id} className="pill failed" style={{ height: 28, fontSize: 12 }} title={c.error}>{c.group === 'maps' ? 'Google Maps' : c.label.split(' · ').pop()}: no result</span>)}
        </div>
      )}
      {!active ? (
        <div className="glass" style={{ padding: 24 }}>{p.running ? <Flex direction="column" gap="3"><Skeleton width="60%" height="16px" /><Skeleton width="40%" height="12px" /><Skeleton width="85%" height="12px" /></Flex> : <span className="muted">No pages recorded for {city?.name ?? 'this city'} yet.</span>}</div>
      ) : <Page snapshot={active} city={city} verdictOf={p.verdictOf} landed={p.landed} onNumber={p.onNumber} />}
    </Flex>
  )
}

function Stars({ rating, reviews }: { rating: number | null; reviews: number | null }) {
  if (rating == null) return null
  const full = Math.round(rating)
  return <span style={{ fontSize: 12, color: '#4F5765' }}><b style={{ color: '#1B2233' }}>{rating.toFixed(1)}</b> <span className="r-stars" aria-hidden>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span> ({reviews ?? 0})</span>
}

export function Page({ snapshot, city, verdictOf, landed, onNumber }: { snapshot: SerpSnapshot; city: City | null; verdictOf: VerdictOf; landed: Set<string>; onNumber: (n: string) => void }) {
  const mark = (text: string | null | undefined, item: SerpItem) => withMarks(text, item.numbers, verdictOf, landed, onNumber)
  const items = snapshot.items, isMaps = snapshot.engine === 'google_maps'
  const locals = items.filter((i) => i.kind === 'local'), paa = items.filter((i) => i.kind === 'paa'), kg = items.find((i) => i.kind === 'knowledge')
  const flow = items.filter((i) => i.kind !== 'local' && i.kind !== 'paa' && i.kind !== 'knowledge')
  const firstOrganic = flow.findIndex((f) => f.kind === 'organic'), paaIndex = items.findIndex((i) => i.kind === 'paa'), paaAfter = paaIndex > 0 ? items[paaIndex - 1] : null
  return (
    <div className="sheet" dir={snapshot.hl === 'hi' ? 'auto' : undefined}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: '#4F5765' }}>{isMaps ? 'Google Maps' : 'Google Search'}{city ? `, searched from ${city.name}` : ''}{snapshot.hl === 'hi' ? ', in Hindi' : ''}</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>“{snapshot.query}”</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
          {snapshot.fixture_kind === 'synthetic' && <span style={{ fontSize: 12, fontWeight: 700, color: '#5A3A00', background: 'rgba(255,176,32,.28)', padding: '2px 8px', borderRadius: 6 }}>Demo fixture, not evidence</span>}
          {snapshot.archive_link && <Link size="2" href={snapshot.archive_link} target="_blank" rel="noreferrer" style={{ color: '#1A0DAB' }}>Replay this search on SerpApi <ArrowSquareOut size={12} style={{ display: 'inline', verticalAlign: -1 }} /></Link>}
        </div>
      </div>
      <div className={kg ? 'page-grid' : undefined}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0, maxWidth: 640 }}>
          {isMaps && items.map((it, i) => <MapsCard key={i} item={it} mark={mark} />)}
          {isMaps && items.length === 0 && <span className="r-text">No listings.</span>}
          {!isMaps && flow.map((it, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {it.kind === 'ad' && <div><div style={{ fontSize: 12, fontWeight: 700 }}>Sponsored</div><div className="r-url">{it.displayed_link ?? it.link}</div><div className="r-title">{mark(it.title, it)}</div><div className="r-text">{mark(it.text, it)}</div></div>}
              {it.kind === 'answer' && <div className="r-box"><div className="r-text" style={{ fontSize: 15 }}>{mark(it.text, it)}</div><div className="r-url" style={{ marginTop: 4 }}>{it.title}</div></div>}
              {it.kind === 'organic' && <div><div className="r-url">{it.displayed_link ?? it.link}</div><div className="r-title">{mark(it.title, it)}</div><div className="r-text">{mark(it.text, it)}</div></div>}
              {paaAfter === it && paa.length > 0 && <div className="r-box"><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>People also ask</div>{paa.map((q, j) => <div key={j} style={{ padding: '8px 0', borderTop: j ? '1px solid #E3E5EA' : undefined }}><div style={{ fontSize: 14 }}>{q.question}</div><div className="r-text" style={{ marginTop: 4 }}>{mark(q.text, q)}</div><div className="r-url" style={{ marginTop: 4 }}>{q.title}</div></div>)}</div>}
              {i === firstOrganic && locals.length > 0 && <div className="r-box"><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Places</div>{locals.map((l, j) => <div key={j} style={{ padding: '8px 0', borderTop: j ? '1px solid #E3E5EA' : undefined }}><div style={{ fontSize: 14, fontWeight: 600 }}>{mark(l.title, l)}</div><Stars rating={l.rating} reviews={l.reviews} /><div className="r-text">{[l.listing_type, l.address].filter(Boolean).join(', ')}</div>{l.phone && <div className="r-text">{mark(l.phone, l)}</div>}</div>)}</div>}
            </div>
          ))}
          {!isMaps && flow.length === 0 && <span className="r-text">Nothing on this page.</span>}
        </div>
        {kg && <aside className="r-box" style={{ alignSelf: 'start' }}><div style={{ fontSize: 18, fontWeight: 600 }}>{kg.title}</div><div className="r-text">{kg.text}</div>{kg.phone && <div className="r-text" style={{ marginTop: 8 }}><span style={{ color: '#4F5765' }}>Customer service: </span>{mark(kg.phone, kg)}</div>}{kg.link && <div className="r-url" style={{ marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>{kg.link}</div>}</aside>}
      </div>
    </div>
  )
}

export function MapsCard({ item, mark }: { item: SerpItem; mark: (t: string | null | undefined, i: SerpItem) => React.ReactNode }) {
  return (
    <div className="r-box">
      <div style={{ fontSize: 15, fontWeight: 600 }}>{mark(item.title, item)}</div>
      <Stars rating={item.rating} reviews={item.reviews} />
      <div className="r-text">{[item.listing_type, item.address].filter(Boolean).join(', ')}</div>
      {item.phone && <div className="r-text">{mark(item.phone, item)}</div>}
      <div style={{ display: 'flex', gap: 12, marginTop: 4, alignItems: 'center', fontSize: 12 }}>
        {item.unclaimed && <span style={{ fontWeight: 700, color: '#5A3A00', background: 'rgba(255,176,32,.28)', padding: '1px 8px', borderRadius: 6 }}>Unclaimed listing</span>}
        {item.place_id && !item.place_id.startsWith('synthetic') && <a href={`https://www.google.com/maps/place/?q=place_id:${item.place_id}`} target="_blank" rel="noreferrer" style={{ color: '#1A0DAB' }}>Open in Maps</a>}
        {item.link && <span className="r-url" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.link}</span>}
      </div>
    </div>
  )
}
