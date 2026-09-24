import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Callout, Flex, Tabs, Text, Theme } from '@radix-ui/themes'
import { Warning } from '@phosphor-icons/react'
import { api } from './lib/api'
import type { Brand, City, Health, NetworkData, Verdict } from './lib/types'
import { useSweep } from './lib/useSweep'
import { AppBar } from './components/AppBar'
import { Evidence } from './components/Evidence'
import { FindingsPanel } from './components/FindingsPanel'
import { Hero } from './components/Hero'
import { Kit } from './components/Kit'
import { LogList } from './components/LogList'
import { Network3D } from './components/Network3D'
import { Pages } from './components/Pages'

const params = new URLSearchParams(window.location.search)
const DEMO = params.get('demo') === '1'
const FORCED = params.get('state')
type Tab = 'evidence' | 'pages' | 'network' | 'log'

export default function App() {
  return (
    <Theme appearance="dark" accentColor="lime" grayColor="slate" radius="large" scaling="100%" panelBackground="solid">
      {window.location.pathname === '/_kit' ? <Kit /> : <Workspace />}
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
  const TAB_HUE: Record<Tab, string> = { evidence: '#FF6166', pages: '#4CC9F0', network: '#B48CFF', log: '#A2A69E' }

  return (
    <div className="shell">
      <AppBar brands={brands} cities={cities} brandId={brandId} cityIds={cityIds} health={health} running={running} done={done} progress={progress} mode={state.mode} onBrand={(id) => { setBrandId(id); setSelected(null) }} onCities={setCityIds} onSweep={onSweep} />
      <div className="progress-line" aria-hidden><div style={{ width: running && progress.total ? `${(progress.done / progress.total) * 100}%` : '0%' }} /></div>
      <Hero brand={brand} cities={sweptCities} findings={state.findings} markers={markers} running={running} done={done} idle={idle} searches={state.liveCalls + state.cacheHits} live={state.liveCalls} when={when} synthetic={(state.sweep?.fixture_kinds?.synthetic ?? 0) > 0} diff={state.diff} packUrl={state.sweepId && done ? api.packUrl(state.sweepId) : null} />
      <div className="workspace">
        <FindingsPanel findings={state.findings} cities={cities} selected={selected} running={running} onSelect={onSelect} />
        <div className="pane">
          <Box px={{ initial: '4', md: '6' }} py="5" style={{ maxWidth: 1100 }}>
            {shownError && <Callout.Root color="ruby" mb="4"><Callout.Icon><Warning size={16} /></Callout.Icon><Callout.Text>{shownError}</Callout.Text><Button size="1" color="lime" onClick={onSweep} disabled={!brandId}>Sweep again</Button></Callout.Root>}
            {idle && !running ? (
              <div className="panel" style={{ maxWidth: 560, padding: 24 }}>
                <div className="display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Nothing swept for {brand?.name ?? 'this brand'} yet</div>
                <Text as="p" size="2" mb="4" style={{ color: '#A2A69E' }}>A sweep runs every query a victim would type, from each chosen city, across search results, the answer box, People also ask, the local pack, Maps and ads, then marks every number that is not the brand’s.</Text>
                <Button color="lime" size="3" onClick={onSweep} disabled={!brandId || cityIds.length === 0}>Sweep {brand?.name ?? ''}</Button>
              </div>
            ) : (
              <Tabs.Root value={activeTab} onValueChange={(v) => setTab(v as Tab)}>
                <Tabs.List size="2" style={{ boxShadow: 'inset 0 -1px 0 rgba(255,255,255,.08)' }}>
                  {(['evidence', 'pages', 'network', 'log'] as Tab[]).map((t) => (
                    <Tabs.Trigger key={t} value={t} disabled={t === 'evidence' && !finding} style={{ color: activeTab === t ? TAB_HUE[t] : undefined }}>
                      <span style={{ width: 8, height: 8, borderRadius: 3, background: TAB_HUE[t], marginRight: 8, opacity: activeTab === t ? 1 : .5 }} />
                      {t === 'evidence' ? 'Evidence' : t === 'pages' ? 'Pages' : t === 'network' ? 'Across brands' : 'Log'}
                      {t === 'evidence' && finding ? <span className="num" style={{ marginLeft: 8, color: '#A2A69E' }}>{finding.display}</span> : null}
                      {t === 'log' && running ? <span className="num" style={{ marginLeft: 8, color: '#A2A69E' }}>{progress.done}/{progress.total}</span> : null}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                <Box pt="5">
                  <Tabs.Content value="evidence">{finding && <Evidence finding={finding} cities={cities} snapshots={state.snapshots} verdictOf={verdictOf} busy={busy} onTogglePack={onTogglePack} onMarkOfficial={onMarkOfficial} onNumber={onSelect} />}</Tabs.Content>
                  <Tabs.Content value="pages"><Pages cities={sweptCities} snapshots={state.snapshots} calls={state.calls} verdictOf={verdictOf} landed={landed} onNumber={onSelect} running={running} fakesByCity={fakesByCity} /></Tabs.Content>
                  <Tabs.Content value="network">
                    <Flex direction="column" gap="5">
                      <Network3D data={network} onNumber={onNetworkNumber} />
                      {state.advertisers.length > 0 && (
                        <div className="panel">
                          <div className="panel-head"><span className="swatch" style={{ background: '#FFB020' }} /><Text weight="bold">Advertising on the brand name</Text><Text size="1" style={{ color: '#A2A69E' }}>Google Ads Transparency Center, India</Text></div>
                          <div style={{ padding: '4px 16px 8px' }}>{state.advertisers.map((a) => <Flex key={a.advertiser_id ?? a.advertiser} justify="between" py="2" style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}><Text size="2" weight={a.is_brand ? 'regular' : 'bold'}>{a.advertiser}{!a.is_brand && <span className="badge badge-review" style={{ marginLeft: 8, height: 18, fontSize: 11 }}>not the brand</span>}</Text><Text size="2" className="num" style={{ color: '#A2A69E' }}>{a.creatives} {a.creatives === 1 ? 'ad' : 'ads'}</Text></Flex>)}</div>
                        </div>
                      )}
                    </Flex>
                  </Tabs.Content>
                  <Tabs.Content value="log"><LogList lines={state.log} running={running} /></Tabs.Content>
                </Box>
              </Tabs.Root>
            )}
          </Box>
        </div>
      </div>
    </div>
  )
}
