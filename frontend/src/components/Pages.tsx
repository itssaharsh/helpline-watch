import { useMemo, useState } from 'react'
import { Badge, Box, Card, Flex, Link, SegmentedControl, Skeleton, Text } from '@radix-ui/themes'
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
  const pending = cityCalls.filter((c) => c.status === 'pending')
  const failed = cityCalls.filter((c) => c.status === 'failed')

  return (
    <Flex direction="column" gap="4">
      <div style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: 2 }}>
        <SegmentedControl.Root size="1" value={city?.id ?? ''} onValueChange={(v) => { setCityId(v); setPageId(null) }}>
          {p.cities.map((c) => {
            const mine = Object.values(p.calls).filter((k) => k.city_id === c.id)
            const isPending = mine.some((k) => k.status === 'pending')
            const fakes = p.fakesByCity[c.id] ?? 0
            return <SegmentedControl.Item key={c.id} value={c.id}>{c.name}{isPending ? <Text color="gray"> …</Text> : fakes > 0 ? <Text color="ruby" weight="bold" className="num"> {fakes}</Text> : null}</SegmentedControl.Item>
          })}
        </SegmentedControl.Root>
      </div>
      {city && (
        <Flex align="center" gap="2" wrap="wrap">
          {pages.map((s) => {
            const reds = redCount(s, p.verdictOf)
            const on = s.call_id === active?.call_id
            return <Badge key={s.call_id} asChild color={on ? 'gray' : 'gray'} variant={on ? 'solid' : 'soft'} size="2" style={{ cursor: 'pointer' }}><button type="button" onClick={() => setPageId(s.call_id)} aria-pressed={on}>{pageLabel(s)}{reds > 0 ? <span className="num" style={{ marginLeft: 6, opacity: .85 }}>{reds}</span> : null}</button></Badge>
          })}
          {pending.map((c) => <Badge key={c.id} variant="outline" color="gray" size="2"><Skeleton loading>{c.group === 'maps' ? 'Google Maps' : c.group === 'hindi' ? 'Hindi search' : c.label.split(' · ').pop()}</Skeleton></Badge>)}
          {failed.map((c) => <Badge key={c.id} variant="outline" color="ruby" size="2" title={c.error}>{c.group === 'maps' ? 'Google Maps' : c.label.split(' · ').pop()}: no result</Badge>)}
        </Flex>
      )}
      {!active ? (
        <Card size="3">
          {p.running ? <Flex direction="column" gap="3"><Skeleton width="60%" height="16px" /><Skeleton width="40%" height="12px" /><Skeleton width="85%" height="12px" /><Skeleton width="55%" height="16px" /></Flex> : <Text size="2" color="gray">No pages recorded for {city?.name ?? 'this city'} yet.</Text>}
        </Card>
      ) : <Page snapshot={active} city={city} verdictOf={p.verdictOf} landed={p.landed} onNumber={p.onNumber} />}
    </Flex>
  )
}

function Stars({ rating, reviews }: { rating: number | null; reviews: number | null }) {
  if (rating == null) return null
  const full = Math.round(rating)
  return <Text size="1" color="gray"><Text weight="medium" style={{ color: 'var(--gray-12)' }}>{rating.toFixed(1)}</Text> <span className="r-stars" aria-hidden>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span> ({reviews ?? 0})</Text>
}

export function Page({ snapshot, city, verdictOf, landed, onNumber }: { snapshot: SerpSnapshot; city: City | null; verdictOf: VerdictOf; landed: Set<string>; onNumber: (n: string) => void }) {
  const mark = (text: string | null | undefined, item: SerpItem) => withMarks(text, item.numbers, verdictOf, landed, onNumber)
  const items = snapshot.items
  const isMaps = snapshot.engine === 'google_maps'
  const locals = items.filter((i) => i.kind === 'local'), paa = items.filter((i) => i.kind === 'paa'), kg = items.find((i) => i.kind === 'knowledge')
  const flow = items.filter((i) => i.kind !== 'local' && i.kind !== 'paa' && i.kind !== 'knowledge')
  const firstOrganic = flow.findIndex((f) => f.kind === 'organic')
  const paaIndex = items.findIndex((i) => i.kind === 'paa')
  const paaAfter = paaIndex > 0 ? items[paaIndex - 1] : null
  return (
    <Card size="3" className="page-card">
      <Flex direction="column" gap="1" mb="4">
        <Text size="2" color="gray">{isMaps ? 'Google Maps' : 'Google Search'}{city ? `, searched from ${city.name}` : ''}{snapshot.hl === 'hi' ? ', in Hindi' : ''}</Text>
        <Text size="4" weight="medium">“{snapshot.query}”</Text>
        <Flex gap="3" align="center">
          {snapshot.fixture_kind === 'synthetic' && <Badge color="amber" variant="soft">Demo fixture, not evidence</Badge>}
          {snapshot.archive_link && <Link size="2" href={snapshot.archive_link} target="_blank" rel="noreferrer">Replay this search on SerpApi <ArrowSquareOut size={12} style={{ display: 'inline', verticalAlign: -1 }} /></Link>}
        </Flex>
      </Flex>
      <div className="page" dir={snapshot.hl === 'hi' ? 'auto' : undefined}>
        <div style={kg ? { display: 'grid', gap: 24, gridTemplateColumns: 'minmax(0,1fr) 240px' } : undefined}>
          <Flex direction="column" gap="5" style={{ minWidth: 0 }}>
            {isMaps && items.map((it, i) => <MapsCard key={i} item={it} mark={mark} />)}
            {isMaps && items.length === 0 && <Text size="2" color="gray">No listings.</Text>}
            {!isMaps && flow.map((it, i) => (
              <Flex key={i} direction="column" gap="5">
                {it.kind === 'ad' && <div><Text size="1" weight="bold" as="div">Sponsored</Text><div className="r-url">{it.displayed_link ?? it.link}</div><div className="r-title">{mark(it.title, it)}</div><div className="r-text">{mark(it.text, it)}</div></div>}
                {it.kind === 'answer' && <div className="r-box"><div className="r-text" style={{ fontSize: 15 }}>{mark(it.text, it)}</div><div className="r-url" style={{ marginTop: 4 }}>{it.title}</div></div>}
                {it.kind === 'organic' && <div><div className="r-url">{it.displayed_link ?? it.link}</div><div className="r-title">{mark(it.title, it)}</div><div className="r-text">{mark(it.text, it)}</div></div>}
                {paaAfter === it && paa.length > 0 && (
                  <div className="r-box"><Text size="3" weight="medium" as="div" mb="2">People also ask</Text>
                    {paa.map((q, j) => <Box key={j} py="2" style={{ borderTop: j ? '1px solid var(--gray-a4)' : undefined }}><Text size="2" as="div">{q.question}</Text><div className="r-text" style={{ marginTop: 4 }}>{mark(q.text, q)}</div><div className="r-url" style={{ marginTop: 4 }}>{q.title}</div></Box>)}
                  </div>
                )}
                {i === firstOrganic && locals.length > 0 && (
                  <div className="r-box"><Text size="3" weight="medium" as="div" mb="2">Places</Text>
                    {locals.map((l, j) => <Box key={j} py="2" style={{ borderTop: j ? '1px solid var(--gray-a4)' : undefined }}><Text size="2" weight="medium" as="div">{mark(l.title, l)}</Text><Stars rating={l.rating} reviews={l.reviews} /><div className="r-text">{[l.listing_type, l.address].filter(Boolean).join(', ')}</div>{l.phone && <div className="r-text">{mark(l.phone, l)}</div>}</Box>)}
                  </div>
                )}
              </Flex>
            ))}
            {!isMaps && flow.length === 0 && <Text size="2" color="gray">Nothing on this page.</Text>}
          </Flex>
          {kg && <aside className="r-box" style={{ alignSelf: 'start' }}><Text size="4" weight="medium" as="div">{kg.title}</Text><div className="r-text">{kg.text}</div>{kg.phone && <div className="r-text" style={{ marginTop: 8 }}><Text color="gray">Customer service: </Text>{mark(kg.phone, kg)}</div>}{kg.link && <div className="r-url" style={{ marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>{kg.link}</div>}</aside>}
        </div>
      </div>
    </Card>
  )
}

export function MapsCard({ item, mark }: { item: SerpItem; mark: (t: string | null | undefined, i: SerpItem) => React.ReactNode }) {
  return (
    <div className="r-box">
      <Text size="3" weight="medium" as="div">{mark(item.title, item)}</Text>
      <Stars rating={item.rating} reviews={item.reviews} />
      <div className="r-text">{[item.listing_type, item.address].filter(Boolean).join(', ')}</div>
      {item.phone && <div className="r-text">{mark(item.phone, item)}</div>}
      <Flex gap="3" mt="1" align="center">
        {item.unclaimed && <Badge color="amber" variant="soft" size="1">Unclaimed listing</Badge>}
        {item.place_id && !item.place_id.startsWith('synthetic') && <Link size="1" href={`https://www.google.com/maps/place/?q=place_id:${item.place_id}`} target="_blank" rel="noreferrer">Open in Maps</Link>}
        {item.link && <span className="r-url" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.link}</span>}
      </Flex>
    </div>
  )
}
