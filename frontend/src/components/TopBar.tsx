import type { Health } from '../lib/types'
import { Tag } from './Chip'

export function TopBar({ health, view, setView }: { health: Health | null; view: 'console' | 'network'; setView: (v: 'console' | 'network') => void }) {
  const live = health?.mode === 'live'
  return (
    <header className="h-12 flex items-center gap-4 px-4 border-b border-line bg-surface-1/80 backdrop-blur-sm sticky top-0 z-20">
      <a href="/" className="flex items-center gap-2 no-underline">
        <img src="/icon.svg" width={22} height={22} alt="" />
        <span className="font-display font-bold text-[15px] tracking-tight">Helpline Watch</span>
      </a>
      <nav className="flex items-center gap-1 ml-2" aria-label="Views">
        {(['console', 'network'] as const).map((v) => (
          <button key={v} type="button" onClick={() => setView(v)} className="btn btn-ghost relative capitalize" aria-current={view === v ? 'page' : undefined} style={{ color: view === v ? 'var(--ink)' : undefined }}>
            {v === 'console' ? 'Sweep console' : 'Scam network'}
            {view === v && <span className="absolute left-2 right-2 -bottom-[9px] h-0.5 bg-accent rounded-full" />}
          </button>
        ))}
      </nav>
      <div className="ml-auto hidden md:flex items-center gap-3 text-[13px] text-ink-muted">
        {health ? (
          <>
            <span className="inline-flex items-center gap-2">{live ? <span className="dot-live" /> : <span className="w-2 h-2 rounded-full bg-ink-muted/60" />}{live ? 'Live · SerpApi' : 'Replay · recorded fixtures'}</span>
            <span className="num" title="Search credits left on your SerpApi plan">{health.credits_left != null ? `${health.credits_left.toLocaleString()} credits left` : `cap ${health.max_calls} calls / sweep`}</span>
            {!health.has_key && <Tag tone="warning">no API key · replay only</Tag>}
          </>
        ) : <span className="sk w-40 h-4 inline-block" />}
      </div>
    </header>
  )
}
