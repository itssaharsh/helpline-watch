import { Text } from '@radix-ui/themes'
import { useEffect, useRef } from 'react'
import type { LogLine } from '../lib/types'

export function LogList({ lines, running }: { lines: LogLine[]; running: boolean }) {
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => { ref.current?.lastElementChild?.scrollIntoView({ block: 'nearest' }) }, [lines.length])
  return (
    <div className="glass">
      <div className="glass-head"><Text weight="bold">Search log</Text><Text size="1" className="muted">{running ? 'running' : `${lines.length} lines`}</Text></div>
      <ol ref={ref} style={{ margin: 0, padding: '4px 16px', listStyle: 'none', maxHeight: 480, overflowY: 'auto' }} aria-live="polite">
        {lines.length === 0 && <li><Text size="2" className="muted">Waiting for a sweep.</Text></li>}
        {lines.map((l, i) => (
          <li key={i} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr)', gap: 12, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <span className="num faint" style={{ fontSize: 12 }}>{new Date(l.at).toLocaleTimeString(undefined, { hour12: false })}</span>
            <Text size="2" style={{ color: l.kind === 'fail' ? 'var(--fake)' : l.kind === 'warn' ? 'var(--check)' : l.kind === 'ok' ? '#F4F7FA' : '#9BA7B4' }}>{l.text}</Text>
          </li>
        ))}
      </ol>
    </div>
  )
}
