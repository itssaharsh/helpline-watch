import type { Verdict } from '../lib/types'

export function VerdictChip({ display, verdict, landed, onClick, title }: { display: string; verdict: Verdict | 'pending'; landed?: boolean; onClick?: () => void; title?: string }) {
  return (
    <button type="button" className={`chip chip-${verdict} ${landed ? 'landed' : ''}`} onClick={onClick} title={title} aria-label={`${display}, ${verdict}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} aria-hidden />
      {display}
    </button>
  )
}

export function Tag({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'muted' | 'danger' | 'warning' | 'success' | 'accent' }) {
  const color = { muted: 'var(--ink-muted)', danger: 'var(--danger)', warning: 'var(--warning)', success: 'var(--success)', accent: 'var(--accent)' }[tone]
  return <span className="inline-flex items-center h-5 px-1.5 rounded-sm text-[11px] font-semibold tracking-wide" style={{ color, background: `color-mix(in oklch, ${color} 12%, transparent)` }}>{children}</span>
}
