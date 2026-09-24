import type { ReactNode } from 'react'
import type { Verdict } from '../lib/types'

export type VerdictOf = (norm: string) => Verdict | undefined

/** A phone number as the analyst would mark it on a printout. */
export function Mark({ children, verdict, landed, onClick, title, note = true }: { children: ReactNode; verdict: Verdict; landed?: boolean; onClick?: () => void; title?: string; note?: boolean }) {
  const label = verdict === 'fake' ? 'fake' : verdict === 'review' ? 'check' : 'official'
  return (
    <button type="button" className={`mark mark-${verdict} ${landed ? 'landed' : ''}`} onClick={onClick} title={title} aria-label={`${typeof children === 'string' ? children : 'number'}, ${label}`}>
      {verdict === 'fake' && (
        <svg className="circle" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden><ellipse cx="50" cy="20" rx="48" ry="17" pathLength={1} transform="rotate(-2 50 20)" /></svg>
      )}
      {children}
      {verdict === 'fake' && note && <span className="note" aria-hidden>fake</span>}
      {verdict === 'official' && <svg className="tick" viewBox="0 0 12 12" aria-hidden><path d="M2 6.5l2.6 2.6L10 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </button>
  )
}

function escapeRe(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

/** Split text on the numbers found in it and wrap each in a Mark. */
export function withMarks(text: string | null | undefined, numbers: { raw: string; norm: string }[], verdictOf: VerdictOf, landed: Set<string>, onNumber: (norm: string) => void): ReactNode {
  if (!text) return null
  const known = numbers.filter((n) => text.includes(n.raw))
  if (known.length === 0) return text
  const re = new RegExp(known.map((n) => escapeRe(n.raw)).join('|'), 'g')
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0
    if (start > last) out.push(text.slice(last, start))
    const norm = known.find((n) => n.raw === m[0])?.norm ?? ''
    const verdict = verdictOf(norm) ?? 'review'
    const alone = text.trim() === m[0].trim()
    out.push(<Mark key={`${start}-${i++}`} verdict={verdict} landed={landed.has(norm)} onClick={() => onNumber(norm)} title="Open this number" note={alone}>{m[0]}</Mark>)
    last = start + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
