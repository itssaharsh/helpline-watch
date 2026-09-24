import { Box, Button, Checkbox, Flex, Popover, Select, Text } from '@radix-ui/themes'
import { MapPin } from '@phosphor-icons/react'
import type { Brand, City, Health } from '../lib/types'

interface Props { brands: Brand[]; cities: City[]; brandId: string | null; cityIds: string[]; health: Health | null; running: boolean; done: boolean; progress: { done: number; total: number }; mode: string | null; onBrand: (id: string) => void; onCities: (ids: string[]) => void; onSweep: () => void }

export function AppBar(p: Props) {
  const live = (p.mode ?? p.health?.mode) === 'live'
  const label = p.running ? `Sweeping ${p.progress.done} of ${p.progress.total}` : p.done ? 'Sweep again' : 'Sweep'
  return (
    <Flex asChild align="center" gap="3" px="4" style={{ height: 60, borderBottom: '1px solid rgba(255,255,255,.08)', background: '#111725' }}>
      <header>
        <Flex align="center" gap="2" mr="2"><img src="/icon.svg" width={28} height={28} alt="" /><span className="display hidden sm:block" style={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>Helpline Watch</span></Flex>
        <Select.Root value={p.brandId ?? undefined} onValueChange={p.onBrand} disabled={p.running}>
          <Select.Trigger variant="soft" color="gray" aria-label="Brand" style={{ minWidth: 0, maxWidth: 170 }} />
          <Select.Content position="popper">{p.brands.map((b) => <Select.Item key={b.id} value={b.id}>{b.name}</Select.Item>)}</Select.Content>
        </Select.Root>
        <Popover.Root>
          <Popover.Trigger><Button variant="soft" color="cyan" disabled={p.running} aria-label="Cities"><MapPin size={16} weight="bold" /><span className="num">{p.cityIds.length}</span><span className="hidden sm:inline">{p.cityIds.length === 1 ? ' city' : ' cities'}</span></Button></Popover.Trigger>
          <Popover.Content width="300px" size="2">
            <Text as="p" size="2" mb="3" style={{ color: '#A2A69E' }}>Three searches per city. The first five hold 61% of reported incidents.</Text>
            <Flex direction="column" gap="2">
              {p.cities.map((c) => { const on = p.cityIds.includes(c.id); return <Text key={c.id} as="label" size="2"><Flex gap="2" align="center"><Checkbox color="cyan" checked={on} onCheckedChange={(v) => p.onCities(v ? [...p.cityIds, c.id] : p.cityIds.filter((x) => x !== c.id))} />{c.name}<Text style={{ color: '#A2A69E' }}> {c.state}</Text></Flex></Text> })}
            </Flex>
          </Popover.Content>
        </Popover.Root>
        <Box flexGrow="1" />
        {p.health && <Flex align="center" gap="2" display={{ initial: 'none', md: 'flex' }}><span style={{ width: 8, height: 8, borderRadius: 999, background: live ? '#36C58C' : '#A2A69E', boxShadow: live ? '0 0 10px #36C58C' : undefined }} /><Text size="2" style={{ color: '#A2A69E' }}>{live ? `Live on SerpApi${p.health.credits_left != null ? `, ${p.health.credits_left.toLocaleString()} credits left` : ''}` : `Replaying recorded searches, cap ${p.health.max_calls} per sweep`}</Text></Flex>}
        <Button color="lime" size="3" onClick={p.onSweep} disabled={p.running || !p.brandId || p.cityIds.length === 0} loading={p.running} style={{ fontWeight: 700, minWidth: 0 }}>{label}</Button>
      </header>
    </Flex>
  )
}
