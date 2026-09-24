import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force'
import { useMemo, useState } from 'react'
import type { NetworkData } from '../lib/types'

interface Node { id: string; type: 'brand' | 'number'; label: string; verdict?: string; brands?: number; x?: number; y?: number }
interface Link { source: Node | string; target: Node | string }

export function Network({ data, onNumber, height = 300 }: { data: NetworkData | null; onNumber: (n: string) => void; height?: number }) {
  const [hover, setHover] = useState<string | null>(null)
  const layout = useMemo(() => {
    if (!data || data.nodes.length === 0) return null
    const nodes: Node[] = data.nodes.map((n) => ({ ...n }))
    const links: Link[] = data.edges.map((e) => ({ source: e.source, target: e.target }))
    const sim = forceSimulation(nodes as any)
      .force('link', forceLink(links as any).id((d: any) => d.id).distance(52))
      .force('charge', forceManyBody().strength(-120))
      .force('center', forceCenter(0, 0))
      .force('x', forceX(0).strength(0.12))
      .force('y', forceY(0).strength(0.12))
      .force('collide', forceCollide().radius((d: any) => (d.type === 'brand' ? 34 : 18)))
      .stop()
    for (let i = 0; i < 300; i++) sim.tick()
    const xs = nodes.map((n) => n.x ?? 0), ys = nodes.map((n) => n.y ?? 0)
    const padX = 84, padY = 40
    const box = { x: Math.min(...xs) - padX, y: Math.min(...ys) - padY, w: Math.max(...xs) - Math.min(...xs) + padX * 2, h: Math.max(...ys) - Math.min(...ys) + padY * 2 }
    return { nodes, links: links as { source: Node; target: Node }[], box }
  }, [data])

  if (!layout) return <p className="text-[13px] text-ink-muted">Sweep two or more brands to see numbers that pose as several of them at once.</p>
  const multi = layout.nodes.filter((n) => n.type === 'number' && (n.brands ?? 0) >= 2).length
  return (
    <div>
      <svg viewBox={`${layout.box.x} ${layout.box.y} ${layout.box.w} ${layout.box.h}`} preserveAspectRatio="xMidYMid meet" className="w-full block" style={{ height }} role="img" aria-label={`Scam network: ${multi} numbers posing as several brands`}>
        {layout.links.map((l, i) => {
          const hot = hover && (l.source.id === hover || l.target.id === hover)
          return <line key={i} className="edge" pathLength={1} x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y} stroke={hot ? 'var(--red)' : 'var(--line-strong)'} strokeWidth={hot ? 2.6 : 1.8} style={{ animationDelay: `${i * 40}ms` }} />
        })}
        {layout.nodes.map((n) => {
          const isBrand = n.type === 'brand'
          const r = isBrand ? 18 : 7 + 3 * (n.brands ?? 1)
          const fake = n.verdict === 'fake'
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onClick={() => !isBrand && onNumber(n.id.slice(4))} style={{ cursor: isBrand ? 'default' : 'pointer' }} tabIndex={isBrand ? -1 : 0} onKeyDown={(e) => { if (e.key === 'Enter' && !isBrand) onNumber(n.id.slice(4)) }}>
              {isBrand ? <circle r={r} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.6} /> : fake
                ? <ellipse rx={r + 3} ry={r} fill="var(--paper)" stroke="var(--red)" strokeWidth={2} transform="rotate(-8)" />
                : <circle r={r} fill="var(--hi-soft)" stroke="var(--line-strong)" strokeWidth={1} />}
            </g>
          )
        })}
        {layout.nodes.filter((n) => n.type === 'brand' || (n.brands ?? 0) >= 2 || hover === n.id).map((n) => {
          const isBrand = n.type === 'brand'
          const r = isBrand ? 18 : 7 + 3 * (n.brands ?? 1)
          return <text key={`l-${n.id}`} x={n.x} y={(n.y ?? 0) + r + 15} textAnchor="middle" fontSize={isBrand ? 14 : 13} fontFamily={isBrand ? 'var(--ff)' : 'var(--ff-pen)'} fontWeight={isBrand ? 700 : 400} fill={isBrand ? 'var(--ink)' : 'var(--red)'} stroke="var(--paper)" strokeWidth={4} style={{ paintOrder: 'stroke', pointerEvents: 'none' }}>{n.label}</text>
        })}
      </svg>
    </div>
  )
}
