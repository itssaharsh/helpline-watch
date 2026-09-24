import type { ReactNode } from 'react'
import type { Verdict } from '../lib/types'
import { Mark } from './Mark'

export type VerdictOf = (norm: string) => Verdict | undefined

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
