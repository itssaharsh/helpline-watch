import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Text } from '@radix-ui/themes'
import SpriteText from 'three-spritetext'
import type { NetworkData } from '../lib/types'

const ForceGraph3D = lazy(() => import('react-force-graph-3d'))

export function Network3D({ data, onNumber }: { data: NetworkData | null; onNumber: (n: string) => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const fg = useRef<any>(null)
  const [size, setSize] = useState({ w: 800, h: 520 })
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.max(320, e.contentRect.width), h: 520 }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const graph = useMemo(() => {
    if (!data) return { nodes: [], links: [] }
    return { nodes: data.nodes.map((n) => ({ ...n, val: n.type === 'brand' ? 14 : 3 + 3 * (n.brands ?? 1) })), links: data.edges.map((e) => ({ source: e.source, target: e.target })) }
  }, [data])
  useEffect(() => {
    const api = fg.current
    if (!api) return
    const t = setTimeout(() => {
      const controls = api.controls?.()
      if (controls) { controls.autoRotate = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches; controls.autoRotateSpeed = 0.5 }
      api.d3Force?.('charge')?.strength(-160)
      api.d3Force?.('link')?.distance(34)
      api.cameraPosition?.({ x: 0, y: 16, z: 130 }, { x: 0, y: 0, z: 0 }, 800)
    }, 400)
    return () => clearTimeout(t)
  }, [graph])
  if (!data || data.nodes.length === 0) return <Text size="2" style={{ color: '#A2A69E' }}>Sweep two or more brands to see numbers that pose as several of them at once.</Text>
  const shared = data.nodes.filter((n) => n.type === 'number' && (n.brands ?? 0) >= 2).length
  return (
    <div>
      <Text as="p" size="2" mb="3" style={{ color: '#A2A69E' }}>Every suspicious number from the latest sweep of each brand, in 3D. Brands are violet, fakes coral, numbers to check amber. Drag to orbit, click a number to open it. <span className="c-net num">{shared}</span> shared so far.</Text>
      <div ref={wrap} className="net-wrap" style={{ height: 520 }}>
        <Suspense fallback={<Text size="2" style={{ color: '#A2A69E', padding: 16, display: 'block' }}>Loading the 3D view.</Text>}>
          <ForceGraph3D ref={fg} width={size.w} height={size.h} graphData={graph} backgroundColor="rgba(0,0,0,0)" showNavInfo={false} enableNodeDrag={false} nodeRelSize={5} warmupTicks={60} cooldownTicks={120}
            nodeColor={(n: any) => (n.type === 'brand' ? '#B48CFF' : n.verdict === 'fake' ? '#FF6166' : '#FFB020')} nodeOpacity={0.95}
            linkColor={() => 'rgba(241,242,238,.28)'} linkWidth={1.2} linkOpacity={0.6}
            nodeLabel={(n: any) => `${n.label}${n.type === 'number' && (n.brands ?? 0) >= 2 ? ` · ${n.brands} brands` : ''}`}
            nodeThreeObjectExtend={true}
            nodeThreeObject={(n: any) => {
              if (n.type !== 'brand' && (n.brands ?? 0) < 2) return false as any
              const s = new SpriteText(n.label)
              s.color = n.type === 'brand' ? '#F1F2EE' : '#FF6166'
              s.textHeight = n.type === 'brand' ? 8 : 5.5
              s.fontFace = n.type === 'brand' ? 'Unbounded, sans-serif' : 'Martian Mono, monospace'
              s.fontWeight = n.type === 'brand' ? '700' : '600'
              s.position.y = -(n.type === 'brand' ? 15 : 10)
              return s
            }}
            onNodeClick={(n: any) => { if (n.type === 'number') onNumber(String(n.id).slice(4)) }}
          />
        </Suspense>
      </div>
    </div>
  )
}
