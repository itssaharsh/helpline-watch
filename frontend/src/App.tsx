import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from './lib/api'
import type { Brand, City, Health, NetworkData, SweepSummary } from './lib/types'
import { useSweep } from './lib/useSweep'
import { Drawer } from './components/Drawer'
import { Findings } from './components/Findings'
import { Grid } from './components/Grid'
import { Kit } from './components/Kit'
import { Kpis } from './components/Kpis'
import { Network } from './components/Network'
import { Rail } from './components/Rail'
import { RunLog } from './components/RunLog'
import { TopBar } from './components/TopBar'

const params = new URLSearchParams(window.location.search)
const DEMO = params.get('demo') === '1'
const FORCED = params.get('state')

export default function App() {
  if (window.location.pathname === '/_kit') return <Kit />
  return <Console />
}

function Console() {
  const [health, setHealth] = useState<Health | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [brandId, setBrandId] = useState<string | null>(null)
  const [cityIds, setCityIds] = useState<string[]>([])
  const [reverse, setReverse] = useState(6)
  const [recent, setRecent] = useState<SweepSummary[]>([])
  const [view, setView] = useState<'console' | 'network'>('console')
  const [selected, setSelected] = useState<string | null>(null)
  const [network, setNetwork] = useState<NetworkData | null>(null)
  const [bootError, setBootError] = useState<string | null>(FORCED === 'error' ? 'Connection to the sweep stream was lost. Sweep again; nothing was filed.' : null)
  const [busy, setBusy] = useState(false)
  const { state, start, load, patch, clearLanded } = useSweep()
  const autoStarted = useRef(false)
  const running = state.status === 'running'

  useEffect(() => {
    Promise.all([api.health(), api.brands(), api.cities()])
      .then(([h, b, c]) => { setHealth(h); setBrands(b); setCities(c.cities); setCityIds(c.default); setBrandId(b[0]?.id ?? null) })
      .catch((e) => setBootError(`Could not reach the API: ${e.message}`))
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
    if (state.status !== 'done' || !brandId) return
    api.sweeps(brandId).then(setRecent).catch(() => undefined)
    api.network().then(setNetwork).catch(() => undefined)
  }, [state.status, brandId])

  useEffect(() => { if (view === 'network' && !network) api.network().then(setNetwork).catch(() => undefined) }, [view, network])
  useEffect(() => { if (state.landed.length) { const t = setTimeout(clearLanded, 900); return () => clearTimeout(t) } }, [state.landed, clearLanded])

  const selectedCities = useMemo(() => {
    const ids = running || state.status === 'done' ? state.cityIds : cityIds
    return ids.map((id) => cities.find((c) => c.id === id)).filter((c): c is City => Boolean(c))
  }, [cities, cityIds, state.cityIds, running, state.status])
  const finding = useMemo(() => state.findings.find((f) => f.number_norm === selected) ?? null, [state.findings, selected])
  const progress = useMemo(() => {
    const all = Object.values(state.calls)
    return { done: all.filter((c) => c.status !== 'pending').length, total: all.length }
  }, [state.calls])

  const onSweep = useCallback(() => { if (brandId) { setSelected(null); setBootError(null); start(brandId, cityIds, reverse) } }, [brandId, cityIds, reverse, start])
  const onTogglePack = useCallback(async (v: boolean) => { if (!finding) return; setBusy(true); try { await patch(finding.number_norm, { in_pack: v }) } finally { setBusy(false) } }, [finding, patch])
  const onMarkOfficial = useCallback(async () => {
    if (!finding) return
    setBusy(true)
    try { await patch(finding.number_norm, { mark_official: true }); setBrands(await api.brands()) } finally { setBusy(false) }
  }, [finding, patch])
  const onNetworkNumber = useCallback((n: string) => {
    if (state.findings.some((f) => f.number_norm === n)) { setView('console'); setSelected(n) }
  }, [state.findings])

  const empty = state.status === 'idle' && !running
  return (
    <div className="min-h-full flex flex-col overflow-x-hidden">
      <TopBar health={health} view={view} setView={setView} />
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        <Rail brands={brands} cities={cities} brandId={brandId} cityIds={cityIds} reverse={reverse} running={running} progress={progress} recent={recent} activeSweepId={state.sweepId}
          onBrand={setBrandId} onCities={setCityIds} onReverse={setReverse} onSweep={onSweep} onLoad={(id) => { setSelected(null); load(id) }} />
        <main className="flex-1 min-w-0 p-4 flex flex-col gap-4">
          {(bootError || state.error) && (
            <div role="alert" className="card px-4 py-3 text-[13px] flex items-center gap-3" style={{ borderColor: 'color-mix(in oklch, var(--danger) 45%, transparent)' }}>
              <span className="text-danger font-medium">{bootError ?? state.error}</span>
              <button type="button" className="btn btn-ghost ml-auto" onClick={onSweep} disabled={!brandId}>Sweep again</button>
            </div>
          )}
          {view === 'console' ? (
            <>
              <Kpis findings={state.findings} calls={state.calls} cityIds={running || state.status === 'done' ? state.cityIds : cityIds} liveCalls={state.liveCalls} cacheHits={state.cacheHits} sweepId={state.sweepId} running={running}
                diff={state.diff} packUrl={state.sweepId && state.status === 'done' ? api.packUrl(state.sweepId) : null} mode={state.mode ?? health?.mode ?? null} fixtureKinds={state.sweep?.fixture_kinds ?? {}} />
              {empty && (
                <div className="card px-5 py-6 flex items-center gap-4">
                  <div className="flex-1"><h2 className="text-[18px] font-bold">No sweeps for {brands.find((b) => b.id === brandId)?.name ?? 'this brand'} yet.</h2><p className="text-[13px] text-ink-muted mt-1">Sweep now to see every customer-care number a victim in {selectedCities[0]?.name ?? 'Mumbai'} would be shown, and which ones are not the brand’s.</p></div>
                  <button type="button" className="btn btn-primary" onClick={onSweep} disabled={!brandId || cityIds.length === 0}>Sweep now</button>
                </div>
              )}
              <Grid cities={selectedCities} calls={state.calls} findings={state.findings} landed={state.landed} advertisers={state.advertisers} onChip={setSelected} empty={empty} />
              <div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
                <Findings findings={state.findings} cities={cities} onSelect={setSelected} selected={selected} reverseInFlight={state.reverseInFlight} />
                <section className="card overflow-hidden" aria-label="Scam network">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-line"><h2 className="text-[15px] font-bold">Scam network</h2><button type="button" className="btn btn-ghost" onClick={() => setView('network')}>Expand</button></div>
                  <Network data={network} onNumber={onNetworkNumber} compact />
                </section>
              </div>
              <RunLog lines={state.log} running={running} />
            </>
          ) : (
            <section className="card overflow-hidden">
              <div className="px-4 py-3 border-b border-line"><h2 className="text-[18px] font-bold">Scam network</h2><p className="text-[13px] text-ink-muted">Every suspicious number from the latest sweep of each brand. A number touching several brands is one operation, not five coincidences.</p></div>
              <Network data={network} onNumber={onNetworkNumber} />
            </section>
          )}
        </main>
      </div>
      <Drawer finding={finding} cities={cities} busy={busy} onClose={() => setSelected(null)} onTogglePack={onTogglePack} onMarkOfficial={onMarkOfficial} />
    </div>
  )
}
