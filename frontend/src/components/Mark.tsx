import type { ReactNode } from 'react'
import { Check } from '@phosphor-icons/react'
import type { Verdict } from '../lib/types'
import { VERDICT_TAG } from '../lib/labels'

export function Mark({ children, verdict, landed, onClick, tag = true }: { children: ReactNode; verdict: Verdict; landed?: boolean; onClick?: () => void; tag?: boolean }) {
  return (
    <button type="button" className={`mark mark-${verdict} ${landed ? 'landed' : ''}`} onClick={onClick} aria-label={`${typeof children === 'string' ? children : 'number'}, ${VERDICT_TAG[verdict]}`}>
      <span className="num">{children}</span>
      {verdict === 'fake' && tag && <span className="tag">FAKE</span>}
      {verdict === 'official' && <Check size={13} weight="bold" style={{ display: 'inline', marginLeft: 3, verticalAlign: -2 }} />}
    </button>
  )
}
