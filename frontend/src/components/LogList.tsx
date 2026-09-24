import { Text } from '@radix-ui/themes'
import { useEffect, useRef } from 'react'
import type { LogLine } from '../lib/types'

export function LogList({ lines, running }: { lines: LogLine[]; running: boolean }) {
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => { ref.current?.lastElementChild?.scrollIntoView({ block: 'nearest' }) }, [lines.length])
  return (
    <div className="panel">
      <div className="panel-head"><span className="swatch" style={{ background: '#A2A69E' }} /><Text weight="bold">Search log</Text><Text size="1" style={{ color: '#A2A69E' }}>{running ? 'running' : `${lines.length} lines`}</Text></div>
      <ol ref={ref} style={{ margin: 0, padding: '4px 16px', listStyle: 'none', maxHeight: 480, overflowY: 'auto' }} aria-live="polite">
        {lines.length === 0 && <li><Text size="2" style={{ color: '#A2A69E' }}>Waiting for a sweep.</Text></li>}
        {lines.map((l, i) => (
          <li key={i} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr)', gap: 12, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <span className="num" style={{ fontSize: 12, color: '#A2A69E' }}>{new Date(l.at).toLocaleTimeString(undefined, { hour12: false })}</span>
            <Text size="2" style={{ color: l.kind === 'fail' ? '#FF6166' : l.kind === 'warn' ? '#FFB020' : l.kind === 'ok' ? '#F1F2EE' : '#A2A69E' }}>{l.text}</Text>
          </li>
        ))}
      </ol>
    </div>
  )
}
