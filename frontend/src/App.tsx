import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { api } from './lib/api'
import type { Brand, City, Health, NetworkData, SweepSummary, Verdict } from './lib/types'
import { useSweep } from './lib/useSweep'
import { CaseFile } from './components/CaseFile'
import { Drawer } from './components/Drawer'
import { Kit } from './components/Kit'
import { CityTabs, Sheet } from './components/Sheet'
import { TopBar } from './components/TopBar'

const params = new URLSearchParams(window.location.search)
const DEMO = params.get('demo') === '1'
const FORCED = params.get('state')

export default function App() {
  if (window.location.pathname === '/_kit') return <Kit />
  return <Desk />
}

function Desk() {
  const [health, setHealth] = useState<Health | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [brandId, setBrandId] = useState<string | null>(null)
  const [cityIds, setCityIds] = useState<string[]>([])
  const [reverse] = useState(6)
  const [recent, setRecent] = useState<SweepSummary[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [activeCity, setActiveCity] = useState<string | null>(null)
  const [network, setNetwork] = useState<NetworkData | null>(null)
  const [error, setError] = useState<string | null>(FORCED === 'error' ? 'The connection to the sweep was lost. Nothing was filed. Sweep again to continue.' : null)
  const [busy, setBusy] = useState(false)
  const [setupOpen, setSetupOpen] = useState(false)
  const { state, start, load, patch, clearLanded } = useSweep()
  const autoStarted = useRef(false)
  const running = state.status === 'running'
  const done = state.status === 'done'

  useEffect(() => {
    Promise.all([api.health(), api.brands(), api.cities()])
      .then(([h, b, c]) => { setHealth(h); setBrands(b); setCities(c.cities); setCityIds(c.default); setBrandId(b[0]?.id ?? null); setActiveCity(c.default[0] ?? null) })
      .catch((e) => setError(`The app could not reach its API: ${e.message}`))
  }, [])

  useEffect(() => {
    if (!brandId) return
    let cancelled = false
    api.sweeps(brandId).then((list) => {
      if (cancelled) return
      setRecent(list)
      if (list[0] && FORCED !== 'empty' && !DEMO) load(list[0].id)
    }).catch(() => undefined)
    return () => { cancelled = true }
  }, [brandId, load])

  useEffect(() => {
    if (DEMO && brandId && cityIds.length && !autoStarted.current) { autoStarted.current = true; start(brandId, cityIds, reverse) }
  }, [brandId, cityIds, reverse, start])

  useEffect(() => {
    if (!done || !brandId) return
    api.sweeps(brandId).then(setRecent).catch(() => undefined)
    api.network().then(setNetwork).catch(() => undefined)
  }, [done, brandId])
  useEffect(() => { if (!network) api.network().then(setNetwork).catch(() => undefined) }, [network])
  useEffect(() => { if (state.landed.length) { const t = setTimeout(clearLanded, 1200); return () => clearTimeout(t) } }, [state.landed, clearLanded])

  const brand = useMemo(() => brands.find((b) => b.id === brandId) ?? null, [brands, brandId])
  const sweptCityIds = running || done ? state.cityIds : cityIds
  const sweptCities = useMemo(() => sweptCityIds.map((id) => cities.find((c) => c.id === id)).filter((c): c is City => Boolean(c)), [cities, sweptCityIds])
  const verdictOf = useCallback((norm: string): Verdict | undefined => state.findings.find((f) => f.number_norm === norm)?.verdict, [state.findings])
  const landed = useMemo(() => new Set(state.landed), [state.landed])
  const fakesByCity = useMemo(() => {
    const out: Record<string, number> = {}
    for (const f of state.findings) if (f.verdict === 'fake') for (const c of f.city_ids) out[c] = (out[c] ?? 0) + 1
    return out
  }, [state.findings])
  const finding = useMemo(() => state.findings.find((f) => f.number_norm === selected) ?? null, [state.findings, selected])
  const progress = useMemo(() => { const all = Object.values(state.calls); return { done: all.filter((c) => c.status !== 'pending').length, total: all.length } }, [state.calls])
  const activeCityObj = sweptCities.find((c) => c.id === activeCity) ?? sweptCities[0] ?? null

  const onSweep = useCallback(() => { if (brandId && cityIds.length) { setSelected(null); setError(null); setSetupOpen(false); start(brandId, cityIds, reverse) } }, [brandId, cityIds, reverse, start])
  const onTogglePack = useCallback(async (v: boolean) => { if (!finding) return; setBusy(true); try { await patch(finding.number_norm, { in_pack: v }) } finally { setBusy(false) } }, [finding, patch])
  const onMarkOfficial = useCallback(async () => { if (!finding) return; setBusy(true); try { await patch(finding.number_norm, { mark_official: true }); setBrands(await api.brands()) } finally { setBusy(false) } }, [finding, patch])
  const onNetworkNumber = useCallback((n: string) => { if (state.findings.some((f) => f.number_norm === n)) setSelected(n) }, [state.findings])

  const empty = state.status === 'idle'
  const shownError = error ?? state.error
  const sweepLabel = running ? `Sweeping, ${progress.done} of ${progress.total}` : done ? 'Sweep again' : 'Sweep now'
  return (
    <div className="min-h-full flex flex-col overflow-x-hidden">
      <TopBar health={health} />
      <main className="flex-1 px-4 sm:px-6 pb-10 grid gap-6 grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_400px] items-start">
        <section className="flex flex-col gap-4 min-w-0">
          <div className="grid gap-x-6 gap-y-3 pt-2 sm:grid-cols-[minmax(0,1fr)_auto] items-start">
            <div className="min-w-0">
              <h1 className="text-[30px] leading-tight">{brand ? `What a victim searching for ${brand.name} is shown` : 'What a victim is shown'}</h1>
              <p className="text-[14px] text-ink-muted mt-1">
                {sweptCities.length ? `${sweptCities.map((c) => c.name).join(', ')}. ` : ''}
                {brand && brand.official_numbers.length ? `Official numbers on file: ${brand.official_numbers.join(', ')}.` : brand ? 'No official numbers on file, so every number is compared against an empty list.' : ''}
                {' '}<button type="button" className="underline" onClick={() => setSetupOpen((v) => !v)} aria-expanded={setupOpen}>{setupOpen ? 'Hide setup' : 'Change brand or cities'}</button>
              </p>
            </div>
            <button type="button" className="btn btn-ink min-w-[168px] sm:mt-1" onClick={onSweep} disabled={running || !brandId || cityIds.length === 0} aria-busy={running} title={cityIds.length === 0 ? 'Pick at least one city' : undefined}>
              <AnimatePresence mode="popLayout" initial={false}><motion.span key={running ? 'r' : done ? 'd' : 'i'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>{sweepLabel}</motion.span></AnimatePresence>
            </button>
          </div>

          {setupOpen && (
            <div className="sheet p-5 grid gap-5 sm:grid-cols-2">
              <div>
                <h2 className="text-[15px] mb-2">Brand</h2>
                <div className="flex flex-wrap gap-1.5" role="listbox" aria-label="Brand">
                  {brands.map((b) => <button key={b.id} type="button" role="option" aria-selected={b.id === brandId} disabled={running} onClick={() => setBrandId(b.id)} className="h-8 px-3 rounded-md border text-[13px]" style={{ borderColor: b.id === brandId ? 'var(--ink)' : 'var(--line-strong)', background: b.id === brandId ? 'var(--ink)' : 'transparent', color: b.id === brandId ? 'var(--paper)' : 'var(--ink)' }}>{b.name}</button>)}
                </div>
                <p className="text-[12px] text-ink-muted mt-2">Official numbers come from the brand’s public support pages. Verify them before filing; “Mark as official” inside a number adds to the list.</p>
              </div>
              <div>
                <h2 className="text-[15px] mb-2">Cities, three searches each</h2>
                <div className="flex flex-wrap gap-1.5">
                  {cities.map((c) => { const on = cityIds.includes(c.id); return <button key={c.id} type="button" aria-pressed={on} disabled={running} onClick={() => setCityIds(on ? cityIds.filter((x) => x !== c.id) : [...cityIds, c.id])} className="h-8 px-3 rounded-md border text-[13px]" style={{ borderColor: on ? 'var(--ink)' : 'var(--line-strong)', background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--paper)' : 'var(--ink)' }}>{c.name}</button> })}
                </div>
                <p className="text-[12px] text-ink-muted mt-2">The first five hold 61% of reported incidents.</p>
                {recent.length > 1 && <p className="text-[12px] text-ink-muted mt-2">Earlier sweeps: {recent.slice(1, 5).map((s) => <button key={s.id} type="button" className="underline mr-2" disabled={running} onClick={() => { setSelected(null); load(s.id) }}>{new Date(s.started_at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</button>)}</p>}
              </div>
            </div>
          )}

          {shownError && (
            <div role="alert" className="sheet px-5 py-3 text-[14px] flex items-center gap-3 border-l-4 border-red">
              <span>{shownError}</span>
              <button type="button" className="btn btn-quiet ml-auto" onClick={onSweep} disabled={!brandId}>Sweep again</button>
            </div>
          )}

          {empty && !running ? (
            <div className="sheet px-8 py-10 max-w-[720px]">
              <h2 className="text-[20px]">Nothing swept for {brand?.name ?? 'this brand'} yet.</h2>
              <p className="text-ink-muted mt-2 mb-5">Sweep now to see every customer-care number a victim in {sweptCities[0]?.name ?? 'Mumbai'} would be shown, with the ones that are not the brand’s circled in red.</p>
              <button type="button" className="btn btn-ink" onClick={onSweep} disabled={!brandId || cityIds.length === 0}>Sweep now</button>
            </div>
          ) : (
            <div className="flex flex-col min-w-0">
              <CityTabs cities={sweptCities} active={activeCityObj?.id ?? null} onPick={setActiveCity} calls={state.calls} fakesByCity={fakesByCity} />
              <Sheet city={activeCityObj} snapshots={state.snapshots} calls={Object.values(state.calls).filter((c) => c.city_id === activeCityObj?.id)} verdictOf={verdictOf} landed={landed} onNumber={setSelected} running={running} />
            </div>
          )}
        </section>

        <CaseFile brand={brand} cities={sweptCities} findings={state.findings} advertisers={state.advertisers} diff={state.diff} network={network}
          sweepAt={state.sweep?.started_at ?? null} mode={state.mode ?? health?.mode ?? null} liveCalls={state.liveCalls} cacheHits={state.cacheHits} running={running} done={done}
          synthetic={(state.sweep?.fixture_kinds?.synthetic ?? 0) > 0} packUrl={state.sweepId && done ? api.packUrl(state.sweepId) : null} selected={selected} log={state.log}
          onSelect={setSelected} onNetworkNumber={onNetworkNumber} />
      </main>
      <Drawer finding={finding} cities={cities} busy={busy} onClose={() => setSelected(null)} onTogglePack={onTogglePack} onMarkOfficial={onMarkOfficial} />
    </div>
  )
}
