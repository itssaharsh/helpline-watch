import { useEffect, useRef } from 'react'
import type { LogLine } from '../lib/types'

const ICON: Record<LogLine['kind'], string> = { info: '·', ok: '✓', fail: '✗', warn: '⚠' }
const COLOR: Record<LogLine['kind'], string> = { info: 'var(--ink-muted)', ok: 'var(--success)', fail: 'var(--danger)', warn: 'var(--warning)' }

export function RunLog({ lines, running }: { lines: LogLine[]; running: boolean }) {
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight }) }, [lines.length])
  return (
    <section className="card overflow-hidden" aria-label="Run log" aria-live="polite">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-line"><h2 className="text-[13px] font-bold">Run log</h2>{running && <span className="dot-live" />}<span className="ml-auto text-[11px] text-ink-muted num">{lines.length} lines</span></div>
      <ol ref={ref} className="num text-[12px] leading-[18px] px-4 py-2 h-[168px] overflow-y-auto overflow-x-hidden">
        {lines.length === 0 && <li className="text-ink-muted">Waiting for a sweep.</li>}
        {lines.map((l, i) => <li key={i} className="flex gap-2"><span style={{ color: COLOR[l.kind] }}>{ICON[l.kind]}</span><span className="text-ink-muted w-16 shrink-0">{new Date(l.at).toLocaleTimeString(undefined, { hour12: false })}</span><span className="min-w-0 break-words" style={{ color: l.kind === 'fail' ? 'var(--danger)' : undefined }}>{l.text}</span></li>)}
      </ol>
    </section>
  )
}
