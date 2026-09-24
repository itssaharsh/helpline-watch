import { Checkbox, Flex, Popover, Select, Text } from '@radix-ui/themes'
import { MapPin } from '@phosphor-icons/react'
import type { Brand, City, Health } from '../lib/types'

interface Props { brands: Brand[]; cities: City[]; brandId: string | null; cityIds: string[]; health: Health | null; running: boolean; done: boolean; progress: { done: number; total: number }; mode: string | null; onBrand: (id: string) => void; onCities: (ids: string[]) => void; onSweep: () => void }

export function AppBar(p: Props) {
  const live = (p.mode ?? p.health?.mode) === 'live'
  const label = p.running ? `Sweeping ${p.progress.done} of ${p.progress.total}` : p.done ? 'Sweep again' : 'Sweep'
  return (
    <header className="appbar">
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#F4F7FA', textDecoration: 'none', marginRight: 8 }}><img src="/icon.svg" width={26} height={26} alt="" /><span className="hidden sm:block" style={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>Helpline Watch</span></a>
      <Select.Root value={p.brandId ?? undefined} onValueChange={p.onBrand} disabled={p.running}>
        <Select.Trigger variant="soft" color="gray" aria-label="Brand" className="brand-select" />
        <Select.Content position="popper">{p.brands.map((b) => <Select.Item key={b.id} value={b.id}>{b.name}</Select.Item>)}</Select.Content>
      </Select.Root>
      <Popover.Root>
        <Popover.Trigger><button type="button" className="btn btn-ghost" style={{ height: 32, padding: '0 12px' }} disabled={p.running} aria-label="Cities"><MapPin size={15} /><span className="num">{p.cityIds.length}</span><span className="hidden sm:inline">{p.cityIds.length === 1 ? ' city' : ' cities'}</span></button></Popover.Trigger>
        <Popover.Content width="300px" size="2">
          <Text as="p" size="2" mb="3" className="muted">Three searches per city. The first five hold 61% of reported incidents.</Text>
          <Flex direction="column" gap="2">{p.cities.map((c) => { const on = p.cityIds.includes(c.id); return <Text key={c.id} as="label" size="2"><Flex gap="2" align="center"><Checkbox checked={on} onCheckedChange={(v) => p.onCities(v ? [...p.cityIds, c.id] : p.cityIds.filter((x) => x !== c.id))} />{c.name}<span className="muted"> {c.state}</span></Flex></Text> })}</Flex>
        </Popover.Content>
      </Popover.Root>
      <div style={{ flex: 1 }} />
      {p.health && <span className="muted hidden md:inline-flex" style={{ alignItems: 'center', gap: 8, fontSize: 13 }}><span className="dot" style={{ background: live ? 'var(--official)' : '#6F7C8A' }} />{live ? `Live on SerpApi${p.health.credits_left != null ? `, ${p.health.credits_left.toLocaleString()} credits left` : ''}` : `Replaying recorded searches, cap ${p.health.max_calls} per sweep`}</span>}
      <button type="button" className="btn btn-white" onClick={p.onSweep} disabled={p.running || !p.brandId || p.cityIds.length === 0} aria-busy={p.running}>{label}</button>
    </header>
  )
}
