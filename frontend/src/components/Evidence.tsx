import { Badge, Box, Button, Callout, Card, DataList, Flex, Heading, Link, Separator, Switch, Text } from '@radix-ui/themes'
import { ArrowSquareOut, Info } from '@phosphor-icons/react'
import { SIGNAL_LABEL, SURFACE_LABEL, VERDICT_TAG } from '../lib/labels'
import type { City, Finding, SerpSnapshot, Verdict } from '../lib/types'
import { withMarks, type VerdictOf } from './withMarks'

const COLOR: Record<Verdict, 'ruby' | 'amber' | 'grass'> = { fake: 'ruby', review: 'amber', official: 'grass', official_unlisted: 'grass' }

interface Props { finding: Finding; cities: City[]; snapshots: SerpSnapshot[]; verdictOf: VerdictOf; busy: boolean; onTogglePack: (v: boolean) => void; onMarkOfficial: () => void; onNumber: (n: string) => void }

export function Evidence(p: Props) {
  const f = p.finding
  const cityName = (id: string | null) => (id ? (p.cities.find((c) => c.id === id)?.name ?? id) : 'national')
  const headline = f.verdict === 'fake' ? 'Not the brand’s number' : f.verdict === 'review' ? 'Not on the list, needs a look' : f.verdict === 'official' ? 'The brand’s own number' : 'On the brand’s site, missing from the list'
  const sightings = p.snapshots.flatMap((s) => s.items.filter((it) => it.numbers.some((n) => n.norm === f.number_norm)).map((it) => ({ snapshot: s, item: it })))
  return (
    <Flex direction="column" gap="5">
      <Flex align="start" justify="between" gap="4" wrap="wrap">
        <Box>
          <Flex align="center" gap="3" wrap="wrap">
            <Heading size="7" className="num" style={{ color: f.verdict === 'fake' ? 'var(--ruby-11)' : f.verdict === 'review' ? 'var(--amber-12)' : 'var(--grass-11)', letterSpacing: '-0.01em' }}>{f.display}</Heading>
            <Badge color={COLOR[f.verdict]} variant={f.verdict === 'fake' ? 'solid' : 'soft'} size="2">{VERDICT_TAG[f.verdict]}</Badge>
          </Flex>
          <Text as="p" size="2" color="gray" mt="1">{headline}. Score {f.score}, seen {f.observations.length} {f.observations.length === 1 ? 'time' : 'times'} in {f.city_ids.length || 'no'} {f.city_ids.length === 1 ? 'city' : 'cities'}.{f.other_brands.length > 0 ? ` Also seen for ${f.other_brands.join(', ')}.` : ''}</Text>
        </Box>
        <Flex align="center" gap="4">
          {(f.verdict === 'fake' || f.verdict === 'review') && (
            <Text as="label" size="2"><Flex gap="2" align="center"><Switch checked={f.in_pack} disabled={p.busy} onCheckedChange={p.onTogglePack} highContrast />Keep in the pack</Flex></Text>
          )}
          {f.verdict !== 'official' && <Button variant="soft" color="gray" disabled={p.busy} onClick={p.onMarkOfficial}>Mark as official</Button>}
        </Flex>
      </Flex>

      <Card size="2">
        <Heading size="3" mb="3">Why</Heading>
        <DataList.Root size="2">
          {f.signals.map((s) => (
            <DataList.Item key={s.code}>
              <DataList.Label minWidth="56px"><Text weight="bold" className="num" style={{ color: s.weight > 0 ? 'var(--ruby-11)' : 'var(--grass-11)' }}>{s.weight > 0 ? `+${s.weight}` : 'ok'}</Text></DataList.Label>
              <DataList.Value><Text size="2"><Text weight="medium">{SIGNAL_LABEL[s.code] ?? s.code}.</Text> <Text color="gray">{s.detail}</Text></Text></DataList.Value>
            </DataList.Item>
          ))}
        </DataList.Root>
      </Card>

      <Box>
        <Heading size="3" mb="3">Where it appeared</Heading>
        <Flex direction="column" gap="3">
          {sightings.length === 0 && <Text size="2" color="gray">No page snapshots for this number.</Text>}
          {sightings.map(({ snapshot, item }, i) => (
            <Card key={i} size="2">
              <Flex align="center" gap="2" mb="2" wrap="wrap">
                <Text size="2" weight="medium">{item.kind === 'maps' ? 'Maps listing' : item.kind === 'local' ? 'Local pack' : item.kind === 'ad' ? 'Search ad' : item.kind === 'paa' ? 'People also ask' : item.kind === 'knowledge' ? 'Knowledge panel' : item.kind === 'answer' ? 'Answer box' : 'Search result'} in {cityName(snapshot.city_id)}</Text>
                {snapshot.hl === 'hi' && <Badge variant="soft" color="gray">Hindi query</Badge>}
                {snapshot.fixture_kind === 'synthetic' && <Badge variant="soft" color="amber">Demo fixture</Badge>}
                <Box flexGrow="1" />
                {snapshot.archive_link ? <Link size="1" href={snapshot.archive_link} target="_blank" rel="noreferrer">Replay on SerpApi <ArrowSquareOut size={11} style={{ display: 'inline', verticalAlign: -1 }} /></Link> : <Text size="1" color="gray">“{snapshot.query}”</Text>}
              </Flex>
              <div className="page" dir={snapshot.hl === 'hi' ? 'auto' : undefined}>
                {(item.kind === 'organic' || item.kind === 'ad') && <><div className="r-url">{item.displayed_link ?? item.link}</div><div className="r-title">{withMarks(item.title, item.numbers, p.verdictOf, new Set(), p.onNumber)}</div><div className="r-text">{withMarks(item.text, item.numbers, p.verdictOf, new Set(), p.onNumber)}</div></>}
                {item.kind === 'paa' && <><div className="r-text" style={{ fontWeight: 500 }}>{item.question}</div><div className="r-text">{withMarks(item.text, item.numbers, p.verdictOf, new Set(), p.onNumber)}</div></>}
                {(item.kind === 'local' || item.kind === 'maps') && <><Text size="3" weight="medium" as="div">{withMarks(item.title, item.numbers, p.verdictOf, new Set(), p.onNumber)}</Text><div className="r-text">{[item.listing_type, item.address].filter(Boolean).join(', ')}{item.reviews != null ? `, ${item.reviews} reviews` : ''}{item.rating != null ? `, ${item.rating} stars` : ''}{item.unclaimed ? ', unclaimed' : ''}</div>{item.phone && <div className="r-text">{withMarks(item.phone, item.numbers, p.verdictOf, new Set(), p.onNumber)}</div>}{item.place_id && !item.place_id.startsWith('synthetic') && <Link size="1" href={`https://www.google.com/maps/place/?q=place_id:${item.place_id}`} target="_blank" rel="noreferrer">Open in Maps</Link>}</>}
                {(item.kind === 'knowledge' || item.kind === 'answer') && <><Text size="3" weight="medium" as="div">{item.title}</Text><div className="r-text">{withMarks(item.text, item.numbers, p.verdictOf, new Set(), p.onNumber)}</div>{item.phone && <div className="r-text">{withMarks(item.phone, item.numbers, p.verdictOf, new Set(), p.onNumber)}</div>}</>}
              </div>
            </Card>
          ))}
        </Flex>
      </Box>

      <Box>
        <Heading size="3" mb="3">Searching for the number itself</Heading>
        {!f.reverse_checked ? (
          <Callout.Root color="gray" variant="soft" size="1"><Callout.Icon><Info size={16} /></Callout.Icon><Callout.Text>Not searched. Only the top suspects are, to save credits.</Callout.Text></Callout.Root>
        ) : f.reverse_hits.length === 0 ? <Text size="2" color="gray">No pages mention this number.</Text> : (
          <Flex direction="column" gap="2">
            {f.reverse_hits.map((h, i) => (
              <Box key={i}>
                <Flex gap="2" align="center"><Text size="1" color="gray">{h.domain}</Text>{h.scam_words.length > 0 && <Badge color="ruby" variant="soft" size="1">{h.scam_words.slice(0, 2).join(', ')}</Badge>}</Flex>
                <Link size="2" href={h.link} target="_blank" rel="noreferrer">{h.title || h.link}</Link>
                {i < f.reverse_hits.length - 1 && <Separator size="4" mt="2" />}
              </Box>
            ))}
          </Flex>
        )}
      </Box>

      <Box>
        <Heading size="3" mb="3">All sightings</Heading>
        <Flex direction="column" gap="2">
          {f.observations.map((o, i) => (
            <Text key={i} size="2"><Text weight="medium">{SURFACE_LABEL[o.surface]}</Text> <Text color="gray">in {cityName(o.city_id)}{o.source_domain ? ` on ${o.source_domain}` : ''}{o.listing?.title ? `, listing “${o.listing.title}”` : ''}</Text></Text>
          ))}
        </Flex>
      </Box>
    </Flex>
  )
}
