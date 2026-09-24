import type { ReactNode } from 'react'
import type { Verdict } from '../lib/types'

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
