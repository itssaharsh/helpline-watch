import type { Health } from '../lib/types'

export function TopBar({ health }: { health: Health | null }) {
  const live = health?.mode === 'live'
  return (
    <header className="h-14 flex items-center gap-4 px-5 sm:px-6">
      <a href="/" className="flex items-center gap-2.5 no-underline">
        <img src="/icon.svg" width={26} height={26} alt="" />
        <span className="font-bold text-[17px] tracking-tight whitespace-nowrap">Helpline Watch</span>
      </a>
      <p className="hidden md:block text-[13px] text-ink-muted">Finds the fake customer-care numbers planted on Google before customers call them.</p>
      <div className="ml-auto text-[13px] text-ink-muted text-right hidden sm:block">
        {health ? (live ? `Live on SerpApi${health.credits_left != null ? `, ${health.credits_left.toLocaleString()} credits left` : ''}` : 'Replaying recorded searches, no key needed') : <span className="sk inline-block w-40 h-4 align-middle" />}
      </div>
    </header>
  )
}
