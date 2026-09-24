import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Box, Button, Flex, Kbd, ScrollArea, SegmentedControl, Skeleton, Text, Tooltip } from '@radix-ui/themes'
import { DownloadSimple } from '@phosphor-icons/react'
import { VERDICT_TAG, reasonFor } from '../lib/labels'
import type { City, Finding, Verdict } from '../lib/types'

const COLOR: Record<Verdict, 'ruby' | 'amber' | 'grass' | 'gray'> = { fake: 'ruby', review: 'amber', official: 'grass', official_unlisted: 'grass' }
type Filter = 'all' | 'fake' | 'review' | 'official'

interface Props { findings: Finding[]; cities: City[]; selected: string | null; running: boolean; done: boolean; packUrl: string | null; onSelect: (n: string | null) => void }

export function FindingsPanel(p: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const listRef = useRef<HTMLDivElement>(null)
  const shown = useMemo(() => p.findings.filter((f) => filter === 'all' ? true : filter === 'official' ? f.verdict === 'official' || f.verdict === 'official_unlisted' : f.verdict === filter), [p.findings, filter])
  const counts = { fake: p.findings.filter((f) => f.verdict === 'fake').length, review: p.findings.filter((f) => f.verdict === 'review').length, official: p.findings.filter((f) => f.verdict === 'official' || f.verdict === 'official_unlisted').length }
  const packCount = p.findings.filter((f) => f.in_pack).length
  const cityName = (id: string) => p.cities.find((c) => c.id === id)?.name ?? id

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      if (shown.length === 0) return
      e.preventDefault()
      const idx = shown.findIndex((f) => f.number_norm === p.selected)
      const next = e.key === 'ArrowDown' ? Math.min(shown.length - 1, idx + 1) : Math.max(0, idx - 1)
      p.onSelect(shown[next].number_norm)
      listRef.current?.querySelector<HTMLElement>(`[data-number="${CSS.escape(shown[next].number_norm)}"]`)?.scrollIntoView({ block: 'nearest' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shown, p])

  return (
    <div className="pane pane-side">
      <Flex direction="column" gap="3" px="4" pt="4" pb="3">
        <Flex align="center" justify="between">
          <Text size="3" weight="bold">Findings</Text>
          <Text size="1" color="gray" className="num">{p.findings.length} numbers</Text>
        </Flex>
        <SegmentedControl.Root size="1" value={filter} onValueChange={(v) => setFilter(v as Filter)} style={{ maxWidth: '100%', overflowX: 'auto' }}>
          <SegmentedControl.Item value="all">All</SegmentedControl.Item>
          <SegmentedControl.Item value="fake">Fake {counts.fake > 0 && <span className="num">{counts.fake}</span>}</SegmentedControl.Item>
          <SegmentedControl.Item value="review">Check {counts.review > 0 && <span className="num">{counts.review}</span>}</SegmentedControl.Item>
          <SegmentedControl.Item value="official">Official</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Flex>
      <ScrollArea scrollbars="vertical" style={{ flex: 1, minHeight: 0 }}>
        <div ref={listRef} role="listbox" aria-label="Findings" style={{ borderTop: '1px solid var(--gray-a4)' }}>
          {p.running && p.findings.length === 0 && [0, 1, 2].map((i) => (
            <Box key={i} px="4" py="3" style={{ borderBottom: '1px solid var(--gray-a4)' }}><Skeleton width="150px" height="18px" /><Box mt="2"><Skeleton width="220px" height="12px" /></Box></Box>
          ))}
          {!p.running && shown.length === 0 && (
            <Box px="4" py="6"><Text size="2" color="gray">{p.findings.length === 0 ? 'Nothing swept yet. Run a sweep to see every number a victim would be shown.' : `No numbers under “${filter}”.`}</Text></Box>
          )}
          {shown.map((f) => (
            <button key={f.number_norm} type="button" role="option" aria-selected={p.selected === f.number_norm} data-number={f.number_norm} className="row" onClick={() => p.onSelect(f.number_norm)}>
              <Flex align="center" gap="2" style={{ minWidth: 0 }}>
                <Text size="3" weight="medium" className="num" style={{ color: f.verdict === 'fake' ? 'var(--ruby-11)' : f.verdict === 'review' ? 'var(--amber-12)' : 'var(--grass-11)' }}>{f.display}</Text>
                <Tooltip content={`Score ${f.score}. Fake needs 3 or more; 1 to 2 goes to check.`}><Badge color={COLOR[f.verdict]} variant={f.verdict === 'fake' ? 'solid' : 'soft'} size="1">{VERDICT_TAG[f.verdict]}</Badge></Tooltip>
              </Flex>
              <Text size="1" color="gray" className="num" style={{ whiteSpace: 'nowrap' }}>{f.city_ids.length === 0 ? '' : f.city_ids.length === 1 ? cityName(f.city_ids[0]) : `${f.city_ids.length} cities`}{f.in_pack ? ' · in pack' : ''}</Text>
              <Text size="1" color="gray" style={{ gridColumn: '1 / -1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reasonFor(f.signals)}{f.other_brands.length > 0 ? `, also seen for ${f.other_brands.join(', ')}` : ''}</Text>
            </button>
          ))}
        </div>
      </ScrollArea>
      <Flex direction="column" gap="2" px="4" py="3" style={{ borderTop: '1px solid var(--gray-a5)', background: 'var(--color-panel-solid)' }}>
        <Button asChild highContrast disabled={!p.packUrl || packCount === 0 || p.running} style={{ width: '100%' }}>
          <a href={p.packUrl ?? '#'} download aria-disabled={!p.packUrl || packCount === 0 || p.running} onClick={(e) => { if (!p.packUrl || packCount === 0) e.preventDefault() }}><DownloadSimple size={16} />Download takedown pack{packCount > 0 ? ` (${packCount})` : ''}</a>
        </Button>
        <Text size="1" color="gray">{packCount === 0 ? 'Fakes are added to the pack automatically; open one to keep or remove it.' : `${packCount} number${packCount === 1 ? '' : 's'} in the pack. CSV, evidence, report and complaint template.`}</Text>
        <Text size="1" color="gray"><Kbd size="1">↑</Kbd> <Kbd size="1">↓</Kbd> move, <Kbd size="1">Esc</Kbd> clear</Text>
      </Flex>
    </div>
  )
}
