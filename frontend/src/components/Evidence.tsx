import { Button, Flex, Link, Switch, Text } from '@radix-ui/themes'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { SIGNAL_LABEL, SURFACE_LABEL, VERDICT_TAG } from '../lib/labels'
import type { City, Finding, SerpSnapshot } from '../lib/types'
import { withMarks, type VerdictOf } from './withMarks'

interface Props { finding: Finding; cities: City[]; snapshots: SerpSnapshot[]; verdictOf: VerdictOf; busy: boolean; onTogglePack: (v: boolean) => void; onMarkOfficial: () => void; onNumber: (n: string) => void }
const HUE: Record<string, string> = { fake: '#FF6166', review: '#FFB020', official: '#36C58C', official_unlisted: '#36C58C' }

export function Evidence(p: Props) {
  const f = p.finding, hue = HUE[f.verdict]
  const cityName = (id: string | null) => (id ? (p.cities.find((c) => c.id === id)?.name ?? id) : 'national')
  const headline = f.verdict === 'fake' ? 'Not the brand’s number' : f.verdict === 'review' ? 'Not on the list, needs a look' : f.verdict === 'official' ? 'The brand’s own number' : 'On the brand’s site, missing from the list'
  const sightings = p.snapshots.flatMap((s) => s.items.filter((it) => it.numbers.some((n) => n.norm === f.number_norm)).map((it) => ({ snapshot: s, item: it })))
  const none = new Set<string>()
  return (
    <Flex direction="column" gap="4">
      <div className="panel" style={{ borderColor: hue }}>
        <div style={{ padding: '20px 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', justifyContent: 'space-between', background: `linear-gradient(90deg, ${hue}22, transparent 60%)` }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}><span className="num" style={{ fontSize: 30, fontWeight: 600, color: hue }}>{f.display}</span><span className={`badge badge-${f.verdict}`}>{VERDICT_TAG[f.verdict]}</span></div>
            <Text as="p" size="2" mt="1" style={{ color: '#A2A69E' }}>{headline}. Score <span className="num">{f.score}</span>, seen {f.observations.length} {f.observations.length === 1 ? 'time' : 'times'} in {f.city_ids.length || 'no'} {f.city_ids.length === 1 ? 'city' : 'cities'}.{f.other_brands.length > 0 ? ` Also seen for ${f.other_brands.join(', ')}.` : ''}</Text>
          </div>
          <Flex align="center" gap="4">
            {(f.verdict === 'fake' || f.verdict === 'review') && <Text as="label" size="2"><Flex gap="2" align="center"><Switch color="lime" checked={f.in_pack} disabled={p.busy} onCheckedChange={p.onTogglePack} />Keep in the pack</Flex></Text>}
            {f.verdict !== 'official' && <Button variant="soft" color="gray" disabled={p.busy} onClick={p.onMarkOfficial}>Mark as official</Button>}
          </Flex>
        </div>
        <div style={{ padding: '4px 20px 12px' }}>
          {f.signals.map((s) => (
            <div key={s.code} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0,1fr)', gap: 10, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.07)' }}>
              <span className="num" style={{ fontWeight: 700, color: s.weight > 0 ? '#FF6166' : '#36C58C' }}>{s.weight > 0 ? `+${s.weight}` : 'ok'}</span>
              <Text size="2"><b>{SIGNAL_LABEL[s.code] ?? s.code}.</b> <span style={{ color: '#A2A69E' }}>{s.detail}</span></Text>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><span className="swatch" style={{ background: '#4CC9F0' }} /><Text weight="bold">Where it appeared</Text><Text size="1" style={{ color: '#A2A69E' }}>{sightings.length} {sightings.length === 1 ? 'result' : 'results'}</Text></div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sightings.length === 0 && <Text size="2" style={{ color: '#A2A69E' }}>No page snapshots for this number.</Text>}
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

      <div className="panel">
        <div className="panel-head"><span className="swatch" style={{ background: '#B48CFF' }} /><Text weight="bold">Searching for the number itself</Text></div>
        <div style={{ padding: 16 }}>
          {!f.reverse_checked ? <Text size="2" style={{ color: '#A2A69E' }}>Not searched. Only the top suspects are, to save credits.</Text> : f.reverse_hits.length === 0 ? <Text size="2" style={{ color: '#A2A69E' }}>No pages mention this number.</Text> : f.reverse_hits.map((h, i) => (
            <div key={i} style={{ padding: '8px 0', borderTop: i ? '1px solid rgba(255,255,255,.07)' : undefined }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#A2A69E' }}>{h.domain}{h.scam_words.length > 0 && <span className="badge badge-fake" style={{ height: 18, fontSize: 11 }}>{h.scam_words.slice(0, 2).join(', ')}</span>}</div>
              <Link size="2" href={h.link} target="_blank" rel="noreferrer" style={{ color: '#F1F2EE' }}>{h.title || h.link}</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><span className="swatch" style={{ background: '#A2A69E' }} /><Text weight="bold">All sightings</Text></div>
        <div style={{ padding: '8px 16px 12px' }}>{f.observations.map((o, i) => <div key={i} style={{ padding: '6px 0', fontSize: 13 }}><b>{SURFACE_LABEL[o.surface]}</b> <span style={{ color: '#A2A69E' }}>in {cityName(o.city_id)}{o.source_domain ? ` on ${o.source_domain}` : ''}{o.listing?.title ? `, listing “${o.listing.title}”` : ''}</span></div>)}</div>
      </div>
    </Flex>
  )
}
