import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force'
import { useMemo, useState } from 'react'
import type { NetworkData } from '../lib/types'

interface Node { id: string; type: 'brand' | 'number'; label: string; verdict?: string; brands?: number; x?: number; y?: number }
interface Link { source: Node | string; target: Node | string }

const W = 640, H = 380

export function Network({ data, onNumber, compact }: { data: NetworkData | null; onNumber: (n: string) => void; compact?: boolean }) {
  const [hover, setHover] = useState<string | null>(null)
  const layout = useMemo(() => {
    if (!data || data.nodes.length === 0) return null
    const nodes: Node[] = data.nodes.map((n) => ({ ...n }))
    const links: Link[] = data.edges.map((e) => ({ source: e.source, target: e.target }))
    const sim = forceSimulation(nodes as any)
      .force('link', forceLink(links as any).id((d: any) => d.id).distance(70))
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(W / 2, H / 2))
      .force('collide', forceCollide().radius((d: any) => (d.type === 'brand' ? 34 : 18)))
      .stop()
    for (let i = 0; i < 300; i++) sim.tick()
    const xs = nodes.map((n) => n.x ?? 0), ys = nodes.map((n) => n.y ?? 0)
    const pad = 56
    const box = { x: Math.min(...xs) - pad, y: Math.min(...ys) - pad, w: Math.max(...xs) - Math.min(...xs) + pad * 2, h: Math.max(...ys) - Math.min(...ys) + pad * 2 }
    return { nodes, links: links as { source: Node; target: Node }[], box }
  }, [data])

  if (!layout) return <div className="p-6 text-[13px] text-ink-muted">Run sweeps for two or more brands to see numbers that pose as several of them at once.</div>
  const tone = (n: Node) => (n.type === 'brand' ? 'var(--accent)' : n.verdict === 'fake' ? 'var(--danger)' : 'var(--warning)')
  const multi = layout.nodes.filter((n) => n.type === 'number' && (n.brands ?? 0) >= 2).length
  return (
    <div className="relative">
      <svg viewBox={`${layout.box.x} ${layout.box.y} ${layout.box.w} ${layout.box.h}`} preserveAspectRatio="xMidYMid meet" className="w-full block" style={{ height: compact ? 300 : 480 }} role="img" aria-label={`Scam network: ${layout.nodes.length} nodes, ${multi} numbers posing as several brands`}>
        {layout.links.map((l, i) => {
          const hot = hover && (l.source.id === hover || l.target.id === hover)
          return <line key={i} className="edge" pathLength={1} x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y} stroke={hot ? 'var(--danger)' : 'var(--line-strong)'} strokeWidth={hot ? 2.5 : 1.5} style={{ animationDelay: `${i * 40}ms` }} />
        })}
        {layout.nodes.map((n) => {
          const r = n.type === 'brand' ? 16 : 6 + 4 * (n.brands ?? 1)
          const show = n.type === 'brand' || (n.brands ?? 0) >= 2 || hover === n.id
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onClick={() => n.type === 'number' && onNumber(n.id.slice(4))} style={{ cursor: n.type === 'number' ? 'pointer' : 'default' }} tabIndex={n.type === 'number' ? 0 : -1} onKeyDown={(e) => { if (e.key === 'Enter' && n.type === 'number') onNumber(n.id.slice(4)) }}>
              <circle r={r} fill={n.type === 'brand' ? 'var(--accent-soft)' : `color-mix(in oklch, ${tone(n)} 22%, transparent)`} stroke={tone(n)} strokeWidth={n.type === 'brand' ? 1.5 : 1.2} />
              {show && <text y={r + 12} textAnchor="middle" fontSize={n.type === 'brand' ? 11 : 10} fontFamily={n.type === 'brand' ? 'var(--ff-display)' : 'var(--ff-mono)'} fontWeight={n.type === 'brand' ? 700 : 400} fill={n.type === 'brand' ? 'var(--ink)' : tone(n)}>{n.label}{n.type === 'number' && (n.brands ?? 0) >= 2 ? ` · ${n.brands} brands` : ''}</text>}
            </g>
          )
        })}
      </svg>
      <div className="absolute left-3 bottom-2 text-[11px] text-ink-muted num">{layout.nodes.filter((n) => n.type === 'brand').length} brands · {layout.nodes.filter((n) => n.type === 'number').length} suspicious numbers · {multi} shared</div>
    </div>
  )
}
