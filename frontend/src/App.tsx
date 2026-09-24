import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Text, Theme } from '@radix-ui/themes'
import { api } from './lib/api'
import type { Brand, City, Health, NetworkData, Verdict } from './lib/types'
import { useSweep } from './lib/useSweep'
import { AppBar } from './components/AppBar'
import { Evidence } from './components/Evidence'
import { FindingsPanel } from './components/FindingsPanel'
import { Hero } from './components/Hero'
import { Kit } from './components/Kit'
import { Landing } from './components/Landing'
import { LogList } from './components/LogList'
import { Network3D } from './components/Network3D'
import { Pages } from './components/Pages'

const params = new URLSearchParams(window.location.search)
const DEMO = params.get('demo') === '1'
const FORCED = params.get('state')
type Tab = 'evidence' | 'pages' | 'network' | 'log'

export default function App() {
  const path = window.location.pathname
  return (
    <Theme appearance="dark" accentColor="gray" grayColor="slate" radius="large" scaling="100%" panelBackground="solid" hasBackground={false}>
      <div className="bg" aria-hidden />
      {path === '/_kit' ? <Kit /> : path.startsWith('/app') ? <Workspace /> : <Landing />}
    </Theme>
  )
}

function Workspace() {
  const [health, setHealth] = useState<Health | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [brandId, setBrandId] = useState<string | null>(null)
  const [cityIds, setCityIds] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('pages')
  const [network, setNetwork] = useState<NetworkData | null>(null)
  const [error, setError] = useState<string | null>(FORCED === 'error' ? 'The connection to the sweep was lost. Nothing was filed. Sweep again to continue.' : null)
  const [busy, setBusy] = useState(false)
  const { state, start, load, patch, clearLanded } = useSweep()
  const autoStarted = useRef(false)
  const running = state.status === 'running', done = state.status === 'done', idle = state.status === 'idle'

  useEffect(() => {
    Promise.all([api.health(), api.brands(), api.cities()])
      .then(([h, b, c]) => { setHealth(h); setBrands(b); setCities(c.cities); setCityIds(c.default); setBrandId(b[0]?.id ?? null) })
      .catch((e) => setError(`The app could not reach its API: ${e.message}`))
  }, [])
  useEffect(() => {
    if (!brandId) return
    let cancelled = false
    api.sweeps(brandId).then((list) => { if (!cancelled && list[0] && FORCED !== 'empty' && !DEMO) load(list[0].id) }).catch(() => undefined)
    return () => { cancelled = true }
  }, [brandId, load])
  useEffect(() => { if (DEMO && brandId && cityIds.length && !autoStarted.current) { autoStarted.current = true; start(brandId, cityIds, 6) } }, [brandId, cityIds, start])
  useEffect(() => { if (done) api.network().then(setNetwork).catch(() => undefined) }, [done, state.sweepId])
  useEffect(() => { if (!network) api.network().then(setNetwork).catch(() => undefined) }, [network])
  useEffect(() => { if (state.landed.length) { const t = setTimeout(clearLanded, 1400); return () => clearTimeout(t) } }, [state.landed, clearLanded])
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [])

  const brand = useMemo(() => brands.find((b) => b.id === brandId) ?? null, [brands, brandId])
  const sweptCityIds = running || done ? state.cityIds : cityIds
  const sweptCities = useMemo(() => sweptCityIds.map((id) => cities.find((c) => c.id === id)).filter((c): c is City => Boolean(c)), [cities, sweptCityIds])
  const verdictOf = useCallback((norm: string): Verdict | undefined => state.findings.find((f) => f.number_norm === norm)?.verdict, [state.findings])
  const landed = useMemo(() => new Set(state.landed), [state.landed])
  const fakesByCity = useMemo(() => { const out: Record<string, number> = {}; for (const f of state.findings) if (f.verdict === 'fake') for (const c of f.city_ids) out[c] = (out[c] ?? 0) + 1; return out }, [state.findings])
  const markers = useMemo(() => sweptCities.map((c) => { const mine = Object.values(state.calls).filter((k) => k.city_id === c.id); const active = running && mine.some((k) => k.status === 'pending'); return { city: c, size: 0.045 + 0.02 * (fakesByCity[c.id] ?? 0), active } }), [sweptCities, state.calls, running, fakesByCity])
  const finding = useMemo(() => state.findings.find((f) => f.number_norm === selected) ?? null, [state.findings, selected])
  const progress = useMemo(() => { const all = Object.values(state.calls); return { done: all.filter((c) => c.status !== 'pending').length, total: all.length } }, [state.calls])
  const shownError = error ?? state.error

  const onSweep = useCallback(() => { if (brandId && cityIds.length) { setSelected(null); setError(null); setTab('pages'); start(brandId, cityIds, 6) } }, [brandId, cityIds, start])
  const onSelect = useCallback((n: string | null) => { setSelected(n); if (n) setTab('evidence') }, [])
  const onTogglePack = useCallback(async (v: boolean) => { if (!finding) return; setBusy(true); try { await patch(finding.number_norm, { in_pack: v }) } finally { setBusy(false) } }, [finding, patch])
  const onMarkOfficial = useCallback(async () => { if (!finding) return; setBusy(true); try { await patch(finding.number_norm, { mark_official: true }); setBrands(await api.brands()) } finally { setBusy(false) } }, [finding, patch])
  const onNetworkNumber = useCallback((n: string) => { if (state.findings.some((f) => f.number_norm === n)) onSelect(n) }, [state.findings, onSelect])
  const when = state.sweep?.started_at ? new Date(state.sweep.started_at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : null
  const activeTab: Tab = tab === 'evidence' && !finding ? 'pages' : tab
  const TABS: { id: Tab; label: string }[] = [{ id: 'evidence', label: 'Evidence' }, { id: 'pages', label: 'Pages' }, { id: 'network', label: 'Across brands' }, { id: 'log', label: 'Log' }]

  return (
    <div className="shell">
      <AppBar brands={brands} cities={cities} brandId={brandId} cityIds={cityIds} health={health} running={running} done={done} progress={progress} mode={state.mode} onBrand={(id) => { setBrandId(id); setSelected(null) }} onCities={setCityIds} onSweep={onSweep} />
      <div className="progress-line" aria-hidden><div style={{ width: running && progress.total ? `${(progress.done / progress.total) * 100}%` : '0%' }} /></div>
      <Hero brand={brand} cities={sweptCities} findings={state.findings} markers={markers} running={running} done={done} idle={idle} searches={state.liveCalls + state.cacheHits} live={state.liveCalls} when={when} synthetic={(state.sweep?.fixture_kinds?.synthetic ?? 0) > 0} diff={state.diff} packUrl={state.sweepId && done ? api.packUrl(state.sweepId) : null} />
      <div className="workspace">
        <FindingsPanel findings={state.findings} cities={cities} selected={selected} running={running} onSelect={onSelect} />
        <div className="pane">
          {shownError && <div className="glass" role="alert" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, borderColor: 'rgba(245,138,138,.4)' }}><span style={{ color: 'var(--fake)', fontSize: 14 }}>{shownError}</span><button type="button" className="btn btn-ghost" style={{ height: 32, marginLeft: 'auto' }} onClick={onSweep} disabled={!brandId}>Sweep again</button></div>}
          {idle && !running ? (
            <div className="glass" style={{ maxWidth: 560, padding: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Nothing swept for {brand?.name ?? 'this brand'} yet</div>
              <Text as="p" size="2" mb="4" className="muted">A sweep runs every query a victim would type, from each chosen city, across search results, the answer box, People also ask, the local pack, Maps and ads, then marks every number that is not the brand’s.</Text>
              <button type="button" className="btn btn-white" onClick={onSweep} disabled={!brandId || cityIds.length === 0}>Sweep {brand?.name ?? ''}</button>
            </div>
          ) : (
            <div>
              <div className="tabs" role="tablist">
                {TABS.map((t) => (
                  <button key={t.id} type="button" role="tab" className="tab" aria-selected={activeTab === t.id} disabled={t.id === 'evidence' && !finding} onClick={() => setTab(t.id)}>
                    {t.label}
                    {t.id === 'evidence' && finding ? <span className="num faint">{finding.display}</span> : null}
                    {t.id === 'log' && running ? <span className="num faint">{progress.done}/{progress.total}</span> : null}
                  </button>
                ))}
              </div>
              <Box pt="5">
                {activeTab === 'evidence' && finding && <Evidence finding={finding} cities={cities} snapshots={state.snapshots} verdictOf={verdictOf} busy={busy} onTogglePack={onTogglePack} onMarkOfficial={onMarkOfficial} onNumber={onSelect} />}
                {activeTab === 'pages' && <Pages cities={sweptCities} snapshots={state.snapshots} calls={state.calls} verdictOf={verdictOf} landed={landed} onNumber={onSelect} running={running} fakesByCity={fakesByCity} />}
                {activeTab === 'network' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <Network3D data={network} onNumber={onNetworkNumber} />
                    {state.advertisers.length > 0 && (
                      <div className="glass">
                        <div className="glass-head"><Text weight="bold">Advertising on the brand name</Text><Text size="1" className="muted">Google Ads Transparency Center, India</Text></div>
                        <div style={{ padding: '4px 16px 8px' }}>{state.advertisers.map((a) => <div key={a.advertiser_id ?? a.advertiser} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.06)', fontSize: 14 }}><span style={{ fontWeight: a.is_brand ? 400 : 600 }}>{a.advertiser}{!a.is_brand && <span className="badge badge-review" style={{ marginLeft: 8 }}>not the brand</span>}</span><span className="num muted">{a.creatives} {a.creatives === 1 ? 'ad' : 'ads'}</span></div>)}</div>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'log' && <LogList lines={state.log} running={running} />}
              </Box>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
