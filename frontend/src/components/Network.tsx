import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force'
import { useMemo, useState } from 'react'
import { Text } from '@radix-ui/themes'
import type { NetworkData } from '../lib/types'

interface Node { id: string; type: 'brand' | 'number'; label: string; verdict?: string; brands?: number; x?: number; y?: number }
interface Link { source: Node | string; target: Node | string }

export function Network({ data, onNumber, height = 420 }: { data: NetworkData | null; onNumber: (n: string) => void; height?: number }) {
  const [hover, setHover] = useState<string | null>(null)
  const layout = useMemo(() => {
    if (!data || data.nodes.length === 0) return null
    const nodes: Node[] = data.nodes.map((n) => ({ ...n }))
    const links: Link[] = data.edges.map((e) => ({ source: e.source, target: e.target }))
    const sim = forceSimulation(nodes as any)
      .force('link', forceLink(links as any).id((d: any) => d.id).distance(60))
      .force('charge', forceManyBody().strength(-140))
      .force('center', forceCenter(0, 0)).force('x', forceX(0).strength(0.1)).force('y', forceY(0).strength(0.1))
      .force('collide', forceCollide().radius((d: any) => (d.type === 'brand' ? 36 : (d.brands ?? 1) >= 2 ? 64 : 18))).stop()
    for (let i = 0; i < 300; i++) sim.tick()
    const xs = nodes.map((n) => n.x ?? 0), ys = nodes.map((n) => n.y ?? 0)
    const padX = 130, padY = 44
    return { nodes, links: links as { source: Node; target: Node }[], box: { x: Math.min(...xs) - padX, y: Math.min(...ys) - padY, w: Math.max(...xs) - Math.min(...xs) + padX * 2, h: Math.max(...ys) - Math.min(...ys) + padY * 2 } }
  }, [data])
  if (!layout) return <Text size="2" color="gray">Sweep two or more brands to see numbers that pose as several of them at once.</Text>
  const shared = layout.nodes.filter((n) => n.type === 'number' && (n.brands ?? 0) >= 2).length
  return (
    <div>
      <Text as="p" size="2" color="gray" mb="3">Every suspicious number from the latest sweep of each brand. A number touching several brands is one operation. {shared} shared so far.</Text>
      <svg viewBox={`${layout.box.x} ${layout.box.y} ${layout.box.w} ${layout.box.h}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height, display: 'block' }} role="img" aria-label={`Scam network with ${shared} shared numbers`}>
        {layout.links.map((l, i) => { const hot = hover && (l.source.id === hover || l.target.id === hover); return <line key={i} className="edge" pathLength={1} x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y} stroke={hot ? 'var(--ruby-9)' : 'var(--gray-a7)'} strokeWidth={hot ? 2.5 : 1.5} style={{ animationDelay: `${i * 30}ms` }} /> })}
        {layout.nodes.map((n) => {
          const isBrand = n.type === 'brand', r = isBrand ? 18 : 6 + 3 * (n.brands ?? 1), fake = n.verdict === 'fake'
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onClick={() => !isBrand && onNumber(n.id.slice(4))} style={{ cursor: isBrand ? 'default' : 'pointer' }} tabIndex={isBrand ? -1 : 0} onKeyDown={(e) => { if (e.key === 'Enter' && !isBrand) onNumber(n.id.slice(4)) }}>
              <circle r={r} fill={isBrand ? 'var(--color-panel-solid)' : fake ? 'var(--ruby-9)' : 'var(--amber-9)'} stroke={isBrand ? 'var(--gray-12)' : fake ? 'var(--ruby-11)' : 'var(--amber-11)'} strokeWidth={isBrand ? 1.6 : 1} />
            </g>
          )
        })}
        {layout.nodes.filter((n) => n.type === 'brand' || (n.brands ?? 0) >= 2 || hover === n.id).map((n) => {
          const isBrand = n.type === 'brand', r = isBrand ? 18 : 6 + 3 * (n.brands ?? 1)
          return <text key={`l-${n.id}`} x={isBrand ? n.x : (n.x ?? 0) + r + 8} y={isBrand ? (n.y ?? 0) + r + 14 : (n.y ?? 0) + 4} textAnchor={isBrand ? 'middle' : 'start'} fontSize={isBrand ? 13 : 12} fontFamily="var(--default-font-family)" fontWeight={isBrand ? 600 : 500} fill={isBrand ? 'var(--gray-12)' : 'var(--ruby-11)'} stroke="var(--color-panel-solid)" strokeWidth={4} style={{ paintOrder: 'stroke', pointerEvents: 'none' }}>{n.label}</text>
        })}
      </svg>
    </div>
  )
}
