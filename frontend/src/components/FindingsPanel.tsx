import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Kbd, ScrollArea, Skeleton, Text, Tooltip } from '@radix-ui/themes'
import { VERDICT_TAG, reasonFor } from '../lib/labels'
import type { City, Finding } from '../lib/types'

type Filter = 'all' | 'fake' | 'review' | 'official'
interface Props { findings: Finding[]; cities: City[]; selected: string | null; running: boolean; onSelect: (n: string | null) => void }

export function FindingsPanel(p: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const listRef = useRef<HTMLDivElement>(null)
  const shown = useMemo(() => p.findings.filter((f) => filter === 'all' ? true : filter === 'official' ? f.verdict === 'official' || f.verdict === 'official_unlisted' : f.verdict === filter), [p.findings, filter])
  const counts = { fake: p.findings.filter((f) => f.verdict === 'fake').length, review: p.findings.filter((f) => f.verdict === 'review').length, official: p.findings.filter((f) => f.verdict === 'official' || f.verdict === 'official_unlisted').length }
  const cityName = (id: string) => p.cities.find((c) => c.id === id)?.name ?? id
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if ((e.key !== 'ArrowDown' && e.key !== 'ArrowUp') || shown.length === 0) return
      e.preventDefault()
      const idx = shown.findIndex((f) => f.number_norm === p.selected)
      const next = e.key === 'ArrowDown' ? Math.min(shown.length - 1, idx + 1) : Math.max(0, idx - 1)
      p.onSelect(shown[next].number_norm)
      listRef.current?.querySelector<HTMLElement>(`[data-number="${CSS.escape(shown[next].number_norm)}"]`)?.scrollIntoView({ block: 'nearest' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shown, p])
  const filters: { id: Filter; label: string; count?: number; color: string }[] = [
    { id: 'all', label: 'All', color: '#F1F2EE' }, { id: 'fake', label: 'Fake', count: counts.fake, color: '#FF6166' }, { id: 'review', label: 'Check', count: counts.review, color: '#FFB020' }, { id: 'official', label: 'Official', count: counts.official, color: '#36C58C' },
  ]
  return (
    <div className="pane pane-side">
      <Box px="4" pt="4" pb="3">
        <Text as="div" weight="bold" size="3" className="display" mb="3">Findings <span className="num" style={{ color: '#A2A69E', fontSize: 12, marginLeft: 6 }}>{p.findings.length}</span></Text>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} role="tablist" aria-label="Filter findings">
          {filters.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
              style={{ height: 30, padding: '0 12px', borderRadius: 999, border: `1px solid ${filter === f.id ? f.color : 'rgba(255,255,255,.12)'}`, background: filter === f.id ? f.color : 'transparent', color: filter === f.id ? '#0C1018' : f.color, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {f.label}{f.count ? <span className="num" style={{ marginLeft: 6, fontSize: 12 }}>{f.count}</span> : null}
            </button>
          ))}
        </div>
      </Box>
      <ScrollArea scrollbars="vertical" style={{ flex: 1, minHeight: 0 }}>
        <div ref={listRef} role="listbox" aria-label="Findings" style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}>
          {p.running && p.findings.length === 0 && [0, 1, 2].map((i) => <Box key={i} px="4" py="3" style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}><Skeleton width="150px" height="18px" /><Box mt="2"><Skeleton width="220px" height="12px" /></Box></Box>)}
          {!p.running && shown.length === 0 && <Box px="4" py="6"><Text size="2" style={{ color: '#A2A69E' }}>{p.findings.length === 0 ? 'Nothing swept yet. Press Sweep to see every number a victim would be shown.' : 'No numbers under this filter.'}</Text></Box>}
          {shown.map((f) => (
            <button key={f.number_norm} type="button" role="option" aria-selected={p.selected === f.number_norm} data-number={f.number_norm} className="row" onClick={() => p.onSelect(f.number_norm)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span className={`num c-${f.verdict}`} style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}>{f.display}</span>
                <Tooltip content={`Score ${f.score}. Fake needs 3 or more; 1 to 2 goes to check.`}><span className={`badge badge-${f.verdict}`}>{VERDICT_TAG[f.verdict]}</span></Tooltip>
              </span>
              <span style={{ fontSize: 12, color: '#A2A69E', textAlign: 'right', lineHeight: 1.3 }}>{f.city_ids.length === 0 ? '' : f.city_ids.length === 1 ? cityName(f.city_ids[0]) : `${f.city_ids.length} cities`}{f.in_pack ? <><br />in pack</> : ''}</span>
              <span style={{ gridColumn: '1 / -1', fontSize: 13, color: '#A2A69E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reasonFor(f.signals)}{f.other_brands.length > 0 ? `, also seen for ${f.other_brands.join(', ')}` : ''}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
      <Box px="4" py="3" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}><Text size="1" style={{ color: '#A2A69E' }}><Kbd size="1">↑</Kbd> <Kbd size="1">↓</Kbd> move, <Kbd size="1">Esc</Kbd> clear. Fakes join the pack automatically; open one to keep or remove it.</Text></Box>
    </div>
  )
}
