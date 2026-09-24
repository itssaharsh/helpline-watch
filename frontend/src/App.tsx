import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Callout, Card, Flex, Heading, ScrollArea, Tabs, Text, Theme } from '@radix-ui/themes'
import { Warning } from '@phosphor-icons/react'
import { api } from './lib/api'
import type { Brand, City, Health, NetworkData, Verdict } from './lib/types'
import { useSweep } from './lib/useSweep'
import { AppBar } from './components/AppBar'
import { Evidence } from './components/Evidence'
import { FindingsPanel } from './components/FindingsPanel'
import { Kit } from './components/Kit'
import { LogList } from './components/LogList'
import { Network } from './components/Network'
import { Pages } from './components/Pages'

const params = new URLSearchParams(window.location.search)
const DEMO = params.get('demo') === '1'
const FORCED = params.get('state')

function initialAppearance(): 'light' | 'dark' {
  try { const saved = localStorage.getItem('hw-appearance'); if (saved === 'light' || saved === 'dark') return saved } catch { /* private mode */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [appearance, setAppearance] = useState<'light' | 'dark'>(initialAppearance)
  const toggle = useCallback(() => setAppearance((a) => { const next = a === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('hw-appearance', next) } catch { /* ignore */ } return next }), [])
  return (
    <Theme appearance={appearance} accentColor="gray" grayColor="slate" radius="medium" scaling="100%" panelBackground="solid">
      {window.location.pathname === '/_kit' ? <Kit /> : <Workspace appearance={appearance} onToggleAppearance={toggle} />}
    </Theme>
  )
}

type Tab = 'evidence' | 'pages' | 'network' | 'log'

function Workspace({ appearance, onToggleAppearance }: { appearance: 'light' | 'dark'; onToggleAppearance: () => void }) {
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
  const running = state.status === 'running', done = state.status === 'done'

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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const brand = useMemo(() => brands.find((b) => b.id === brandId) ?? null, [brands, brandId])
  const sweptCityIds = running || done ? state.cityIds : cityIds
  const sweptCities = useMemo(() => sweptCityIds.map((id) => cities.find((c) => c.id === id)).filter((c): c is City => Boolean(c)), [cities, sweptCityIds])
  const verdictOf = useCallback((norm: string): Verdict | undefined => state.findings.find((f) => f.number_norm === norm)?.verdict, [state.findings])
  const landed = useMemo(() => new Set(state.landed), [state.landed])
  const fakesByCity = useMemo(() => { const out: Record<string, number> = {}; for (const f of state.findings) if (f.verdict === 'fake') for (const c of f.city_ids) out[c] = (out[c] ?? 0) + 1; return out }, [state.findings])
  const finding = useMemo(() => state.findings.find((f) => f.number_norm === selected) ?? null, [state.findings, selected])
  const progress = useMemo(() => { const all = Object.values(state.calls); return { done: all.filter((c) => c.status !== 'pending').length, total: all.length } }, [state.calls])
  const shownError = error ?? state.error

  const onSweep = useCallback(() => { if (brandId && cityIds.length) { setSelected(null); setError(null); setTab('pages'); start(brandId, cityIds, 6) } }, [brandId, cityIds, start])
  const onSelect = useCallback((n: string | null) => { setSelected(n); if (n) setTab('evidence') }, [])
  const onTogglePack = useCallback(async (v: boolean) => { if (!finding) return; setBusy(true); try { await patch(finding.number_norm, { in_pack: v }) } finally { setBusy(false) } }, [finding, patch])
  const onMarkOfficial = useCallback(async () => { if (!finding) return; setBusy(true); try { await patch(finding.number_norm, { mark_official: true }); setBrands(await api.brands()) } finally { setBusy(false) } }, [finding, patch])
  const onNetworkNumber = useCallback((n: string) => { if (state.findings.some((f) => f.number_norm === n)) onSelect(n) }, [state.findings, onSelect])

  const counts = { fake: state.findings.filter((f) => f.verdict === 'fake').length, review: state.findings.filter((f) => f.verdict === 'review').length, official: state.findings.filter((f) => f.verdict === 'official' || f.verdict === 'official_unlisted').length }
  const when = state.sweep?.started_at ? new Date(state.sweep.started_at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : null
  const synthetic = (state.sweep?.fixture_kinds?.synthetic ?? 0) > 0
  const activeTab: Tab = tab === 'evidence' && !finding ? 'pages' : tab

  return (
    <div className="shell">
      <AppBar brands={brands} cities={cities} brandId={brandId} cityIds={cityIds} health={health} running={running} done={done} progress={progress} appearance={appearance} mode={state.mode}
        onBrand={(id) => { setBrandId(id); setSelected(null) }} onCities={setCityIds} onSweep={onSweep} onToggleAppearance={onToggleAppearance} />
      <div className="progress-line" aria-hidden><div style={{ width: running && progress.total ? `${(progress.done / progress.total) * 100}%` : '0%' }} /></div>
      <div className="workspace">
        <FindingsPanel findings={state.findings} cities={cities} selected={selected} running={running} done={done} packUrl={state.sweepId && done ? api.packUrl(state.sweepId) : null} onSelect={onSelect} />
        <div className="pane">
          <ScrollArea scrollbars="vertical" style={{ height: '100%' }}>
            <Box px={{ initial: '4', md: '6' }} py="5" style={{ maxWidth: 1040 }}>
              {shownError && (
                <Callout.Root color="ruby" mb="4"><Callout.Icon><Warning size={16} /></Callout.Icon><Callout.Text>{shownError}</Callout.Text><Button size="1" variant="soft" color="ruby" onClick={onSweep} disabled={!brandId}>Sweep again</Button></Callout.Root>
              )}
              <Flex align="end" justify="between" gap="4" mb="4" wrap="wrap">
                <Box>
                  <Heading size="6" style={{ letterSpacing: '-0.01em' }}>{brand ? brand.name : 'Pick a brand'}</Heading>
                  <Text as="p" size="2" color="gray" mt="1">
                    {state.status === 'idle' ? 'Nothing swept yet.' : running ? `Sweeping ${sweptCities.map((c) => c.name).join(', ')}.` : (
                      <><Text weight="medium" style={{ color: 'var(--ruby-11)' }}>{counts.fake} fake</Text>, {counts.review} to check, <Text weight="medium" style={{ color: 'var(--grass-11)' }}>{counts.official} official</Text> across {sweptCities.length} cities from {state.liveCalls + state.cacheHits} searches{state.liveCalls === 0 ? ', none live' : ''}{when ? `, swept ${when}` : ''}.{synthetic ? ' Demo fixtures, not evidence.' : ''}{state.diff?.previous_id ? ` Since last sweep: ${state.diff.new.length} new, ${state.diff.persisting.length} still planted, ${state.diff.gone.length} gone.` : ''}</>
                    )}
                  </Text>
                  {brand && <Text as="p" size="1" color="gray" mt="1">Official numbers on file: {brand.official_numbers.length ? brand.official_numbers.join(', ') : 'none'}.</Text>}
                </Box>
              </Flex>

              {state.status === 'idle' && !running ? (
                <Card size="3" style={{ maxWidth: 560 }}>
                  <Heading size="4" mb="2">Nothing swept for {brand?.name ?? 'this brand'} yet</Heading>
                  <Text as="p" size="2" color="gray" mb="4">A sweep runs every query a victim would type, from each chosen city, across search results, the answer box, People also ask, the local pack, Maps and ads, then marks every number that is not the brand’s.</Text>
                  <Button highContrast onClick={onSweep} disabled={!brandId || cityIds.length === 0}>Sweep {brand?.name ?? ''}</Button>
                </Card>
              ) : (
                <Tabs.Root value={activeTab} onValueChange={(v) => setTab(v as Tab)}>
                  <Tabs.List size="2">
                    <Tabs.Trigger value="evidence" disabled={!finding}>Evidence{finding ? <Text color="gray" className="num" ml="2">{finding.display}</Text> : ''}</Tabs.Trigger>
                    <Tabs.Trigger value="pages">Pages</Tabs.Trigger>
                    <Tabs.Trigger value="network">Across brands</Tabs.Trigger>
                    <Tabs.Trigger value="log">Log{running ? <Text color="gray" className="num" ml="2">{progress.done}/{progress.total}</Text> : ''}</Tabs.Trigger>
                  </Tabs.List>
                  <Box pt="5">
                    <Tabs.Content value="evidence">{finding && <Evidence finding={finding} cities={cities} snapshots={state.snapshots} verdictOf={verdictOf} busy={busy} onTogglePack={onTogglePack} onMarkOfficial={onMarkOfficial} onNumber={onSelect} />}</Tabs.Content>
                    <Tabs.Content value="pages"><Pages cities={sweptCities} snapshots={state.snapshots} calls={state.calls} verdictOf={verdictOf} landed={landed} onNumber={onSelect} running={running} fakesByCity={fakesByCity} /></Tabs.Content>
                    <Tabs.Content value="network">
                      <Flex direction="column" gap="5">
                        <Network data={network} onNumber={onNetworkNumber} />
                        {state.advertisers.length > 0 && (
                          <Box>
                            <Heading size="3" mb="2">Advertising on the brand name</Heading>
                            <Text as="p" size="2" color="gray" mb="3">From SerpApi’s Google Ads Transparency Center for India. Anyone who is not the brand is worth a look.</Text>
                            {state.advertisers.map((a) => <Flex key={a.advertiser_id ?? a.advertiser} justify="between" py="2" style={{ borderTop: '1px solid var(--gray-a4)' }}><Text size="2" weight={a.is_brand ? 'regular' : 'medium'}>{a.advertiser}{!a.is_brand && <Text color="amber" weight="medium"> not the brand</Text>}</Text><Text size="2" color="gray" className="num">{a.creatives} {a.creatives === 1 ? 'ad' : 'ads'}</Text></Flex>)}
                          </Box>
                        )}
                      </Flex>
                    </Tabs.Content>
                    <Tabs.Content value="log"><LogList lines={state.log} running={running} /></Tabs.Content>
                  </Box>
                </Tabs.Root>
              )}
            </Box>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
