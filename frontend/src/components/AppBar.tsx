import { Badge, Box, Button, Checkbox, Flex, IconButton, Popover, Select, Text, Tooltip } from '@radix-ui/themes'
import { MapPin, Moon, Sun } from '@phosphor-icons/react'
import type { Brand, City, Health } from '../lib/types'

interface Props {
  brands: Brand[]; cities: City[]; brandId: string | null; cityIds: string[]; health: Health | null; running: boolean; done: boolean
  progress: { done: number; total: number }; appearance: 'light' | 'dark'; mode: string | null
  onBrand: (id: string) => void; onCities: (ids: string[]) => void; onSweep: () => void; onToggleAppearance: () => void
}

export function AppBar(p: Props) {
  const live = (p.mode ?? p.health?.mode) === 'live'
  const label = p.running ? `Sweeping ${p.progress.done} of ${p.progress.total}` : p.done ? 'Sweep again' : 'Sweep'
  return (
    <Flex asChild align="center" gap="3" px="4" style={{ height: 56, borderBottom: '1px solid var(--gray-a5)', background: 'var(--color-panel-solid)' }}>
      <header>
        <Flex align="center" gap="2" mr="2" style={{ minWidth: 0 }}>
          <img src="/icon.svg" width={24} height={24} alt="" />
          <Text weight="bold" size="3" style={{ whiteSpace: 'nowrap' }} className="hidden sm:block">Helpline Watch</Text>
        </Flex>
        <Select.Root value={p.brandId ?? undefined} onValueChange={p.onBrand} disabled={p.running}>
          <Select.Trigger variant="surface" aria-label="Brand" style={{ minWidth: 0, maxWidth: 170 }} />
          <Select.Content position="popper">
            {p.brands.map((b) => <Select.Item key={b.id} value={b.id}>{b.name}</Select.Item>)}
          </Select.Content>
        </Select.Root>
        <Popover.Root>
          <Popover.Trigger>
            <Button variant="surface" color="gray" disabled={p.running} aria-label="Cities"><MapPin size={16} /><span className="num">{p.cityIds.length}</span><span className="hidden sm:inline">{p.cityIds.length === 1 ? ' city' : ' cities'}</span></Button>
          </Popover.Trigger>
          <Popover.Content width="300px" size="2">
            <Text as="p" size="2" color="gray" mb="3">Each city costs three searches. The first five hold 61% of reported incidents.</Text>
            <Flex direction="column" gap="2">
              {p.cities.map((c) => {
                const on = p.cityIds.includes(c.id)
                return (
                  <Text key={c.id} as="label" size="2">
                    <Flex gap="2" align="center">
                      <Checkbox checked={on} onCheckedChange={(v) => p.onCities(v ? [...p.cityIds, c.id] : p.cityIds.filter((x) => x !== c.id))} />
                      {c.name}<Text color="gray"> {c.state}</Text>
                    </Flex>
                  </Text>
                )
              })}
            </Flex>
          </Popover.Content>
        </Popover.Root>
        <Box flexGrow="1" />
        <Flex align="center" gap="2" display={{ initial: 'none', md: 'flex' }}>
          {p.health ? (
            <>
              <Badge color={live ? 'grass' : 'gray'} variant="soft" radius="full">{live ? 'Live on SerpApi' : 'Replay'}</Badge>
              <Text size="2" color="gray" className="num">{live && p.health.credits_left != null ? `${p.health.credits_left.toLocaleString()} credits left` : `cap ${p.health.max_calls} calls per sweep`}</Text>
            </>
          ) : null}
        </Flex>
        <Tooltip content={p.appearance === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          <IconButton variant="ghost" color="gray" onClick={p.onToggleAppearance} aria-label="Toggle appearance">{p.appearance === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</IconButton>
        </Tooltip>
        <Button highContrast onClick={p.onSweep} disabled={p.running || !p.brandId || p.cityIds.length === 0} loading={p.running} style={{ minWidth: 0 }}>{label}</Button>
      </header>
    </Flex>
  )
}
