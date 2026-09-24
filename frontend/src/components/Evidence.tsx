import { Flex, Link, Switch, Text } from '@radix-ui/themes'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { SIGNAL_LABEL, SURFACE_LABEL, VERDICT_TAG } from '../lib/labels'
import type { City, Finding, SerpSnapshot } from '../lib/types'
import { withMarks, type VerdictOf } from './withMarks'

interface Props { finding: Finding; cities: City[]; snapshots: SerpSnapshot[]; verdictOf: VerdictOf; busy: boolean; onTogglePack: (v: boolean) => void; onMarkOfficial: () => void; onNumber: (n: string) => void }
const HUE: Record<string, string> = { fake: 'var(--fake)', review: 'var(--check)', official: 'var(--official)', official_unlisted: 'var(--official)' }

export function Evidence(p: Props) {
  const f = p.finding, hue = HUE[f.verdict]
  const cityName = (id: string | null) => (id ? (p.cities.find((c) => c.id === id)?.name ?? id) : 'national')
  const headline = f.verdict === 'fake' ? 'Not the brand’s number' : f.verdict === 'review' ? 'Not on the list, needs a look' : f.verdict === 'official' ? 'The brand’s own number' : 'On the brand’s site, missing from the list'
  const sightings = p.snapshots.flatMap((s) => s.items.filter((it) => it.numbers.some((n) => n.norm === f.number_norm)).map((it) => ({ snapshot: s, item: it })))
  const none = new Set<string>()
  return (
    <Flex direction="column" gap="4">
      <div className="glass">
        <div style={{ padding: '20px 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}><span className="dot" style={{ background: hue, width: 10, height: 10 }} /><span className="num" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>{f.display}</span><span className={`badge badge-${f.verdict}`}>{VERDICT_TAG[f.verdict]}</span></div>
            <Text as="p" size="2" mt="1" className="muted">{headline}. Score <span className="num">{f.score}</span>, seen {f.observations.length} {f.observations.length === 1 ? 'time' : 'times'} in {f.city_ids.length || 'no'} {f.city_ids.length === 1 ? 'city' : 'cities'}.{f.other_brands.length > 0 ? ` Also seen for ${f.other_brands.join(', ')}.` : ''}</Text>
          </div>
          <Flex align="center" gap="4">
            {(f.verdict === 'fake' || f.verdict === 'review') && <Text as="label" size="2"><Flex gap="2" align="center"><Switch highContrast checked={f.in_pack} disabled={p.busy} onCheckedChange={p.onTogglePack} />Keep in the pack</Flex></Text>}
            {f.verdict !== 'official' && <button type="button" className="btn btn-ghost" style={{ height: 34 }} disabled={p.busy} onClick={p.onMarkOfficial}>Mark as official</button>}
          </Flex>
        </div>
        <div style={{ padding: '4px 20px 12px' }}>
          {f.signals.map((s) => (
            <div key={s.code} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0,1fr)', gap: 10, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.07)' }}>
              <span className="num" style={{ fontWeight: 700, color: s.weight > 0 ? 'var(--fake)' : 'var(--official)' }}>{s.weight > 0 ? `+${s.weight}` : 'ok'}</span>
              <Text size="2"><b>{SIGNAL_LABEL[s.code] ?? s.code}.</b> <span className="muted">{s.detail}</span></Text>
            </div>
          ))}
        </div>
      </div>

      <div className="glass">
        <div className="glass-head"><Text weight="bold">Where it appeared</Text><Text size="1" className="muted">{sightings.length} {sightings.length === 1 ? 'result' : 'results'}</Text></div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sightings.length === 0 && <Text size="2" className="muted">No page snapshots for this number.</Text>}
          {sightings.map(({ snapshot, item }, i) => (
            <div key={i} className="sheet" style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8, fontSize: 12, color: '#4F5765' }}>
                <b style={{ color: '#1B2233' }}>{item.kind === 'maps' ? 'Maps listing' : item.kind === 'local' ? 'Local pack' : item.kind === 'ad' ? 'Search ad' : item.kind === 'paa' ? 'People also ask' : item.kind === 'knowledge' ? 'Knowledge panel' : item.kind === 'answer' ? 'Answer box' : 'Search result'} in {cityName(snapshot.city_id)}</b>
                {snapshot.hl === 'hi' && <span>Hindi query</span>}{snapshot.fixture_kind === 'synthetic' && <span style={{ fontWeight: 700, color: '#5A3A00', background: 'rgba(255,176,32,.28)', padding: '1px 8px', borderRadius: 6 }}>Demo fixture</span>}
                <span style={{ marginLeft: 'auto' }}>{snapshot.archive_link ? <Link size="1" href={snapshot.archive_link} target="_blank" rel="noreferrer" style={{ color: '#1A0DAB' }}>Replay on SerpApi <ArrowSquareOut size={11} style={{ display: 'inline', verticalAlign: -1 }} /></Link> : `“${snapshot.query}”`}</span>
              </div>
              {(item.kind === 'organic' || item.kind === 'ad') && <><div className="r-url">{item.displayed_link ?? item.link}</div><div className="r-title">{withMarks(item.title, item.numbers, p.verdictOf, none, p.onNumber)}</div><div className="r-text">{withMarks(item.text, item.numbers, p.verdictOf, none, p.onNumber)}</div></>}
              {item.kind === 'paa' && <><div className="r-text" style={{ fontWeight: 600 }}>{item.question}</div><div className="r-text">{withMarks(item.text, item.numbers, p.verdictOf, none, p.onNumber)}</div></>}
              {(item.kind === 'local' || item.kind === 'maps') && <><div style={{ fontSize: 15, fontWeight: 600 }}>{withMarks(item.title, item.numbers, p.verdictOf, none, p.onNumber)}</div><div className="r-text">{[item.listing_type, item.address].filter(Boolean).join(', ')}{item.reviews != null ? `, ${item.reviews} reviews` : ''}{item.rating != null ? `, ${item.rating} stars` : ''}{item.unclaimed ? ', unclaimed' : ''}</div>{item.phone && <div className="r-text">{withMarks(item.phone, item.numbers, p.verdictOf, none, p.onNumber)}</div>}{item.place_id && !item.place_id.startsWith('synthetic') && <a href={`https://www.google.com/maps/place/?q=place_id:${item.place_id}`} target="_blank" rel="noreferrer" style={{ color: '#1A0DAB', fontSize: 12 }}>Open in Maps</a>}</>}
              {(item.kind === 'knowledge' || item.kind === 'answer') && <><div style={{ fontSize: 15, fontWeight: 600 }}>{item.title}</div><div className="r-text">{withMarks(item.text, item.numbers, p.verdictOf, none, p.onNumber)}</div>{item.phone && <div className="r-text">{withMarks(item.phone, item.numbers, p.verdictOf, none, p.onNumber)}</div>}</>}
            </div>
          ))}
        </div>
      </div>

      <div className="glass">
        <div className="glass-head"><Text weight="bold">Searching for the number itself</Text></div>
        <div style={{ padding: 16 }}>
          {!f.reverse_checked ? <Text size="2" className="muted">Not searched. Only the top suspects are, to save credits.</Text> : f.reverse_hits.length === 0 ? <Text size="2" className="muted">No pages mention this number.</Text> : f.reverse_hits.map((h, i) => (
            <div key={i} style={{ padding: '8px 0', borderTop: i ? '1px solid rgba(255,255,255,.07)' : undefined }}>
              <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12 }}>{h.domain}{h.scam_words.length > 0 && <span className="badge badge-fake" style={{ height: 18, fontSize: 11 }}>{h.scam_words.slice(0, 2).join(', ')}</span>}</div>
              <Link size="2" href={h.link} target="_blank" rel="noreferrer" style={{ color: '#F4F7FA' }}>{h.title || h.link}</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="glass">
        <div className="glass-head"><Text weight="bold">All sightings</Text></div>
        <div style={{ padding: '8px 16px 12px' }}>{f.observations.map((o, i) => <div key={i} style={{ padding: '6px 0', fontSize: 13 }}><b>{SURFACE_LABEL[o.surface]}</b> <span className="muted">in {cityName(o.city_id)}{o.source_domain ? ` on ${o.source_domain}` : ''}{o.listing?.title ? `, listing “${o.listing.title}”` : ''}</span></div>)}</div>
      </div>
    </Flex>
  )
}
