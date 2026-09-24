import createGlobe from 'cobe'
import { useEffect, useRef, useState } from 'react'
import type { City } from '../lib/types'

export interface GlobeMarker { city: City; size: number; active: boolean }

function parseLL(ll: string): [number, number] {
  const m = ll.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  return m ? [Number(m[1]), Number(m[2])] : [20, 78]
}
// cobe: angles that put a lat/long at the centre of the visible disc
function focus(lat: number, lng: number): [number, number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]
}

/** India-centred globe; markers are the swept cities, sized by fake count, pulsing while their pages return. */
function hasWebGL(): boolean {
  try { const c = document.createElement('canvas'); return Boolean(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

export function Globe({ markers, sweeping, centered = false }: { markers: GlobeMarker[]; sweeping: boolean; centered?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const markersRef = useRef(markers)
  const [fallback, setFallback] = useState(false)
  useEffect(() => { markersRef.current = markers }, [markers])
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (!hasWebGL()) { setFallback(true); return }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const [phi0, theta] = focus(21, 80)
    let width = canvas.offsetWidth, height = canvas.offsetHeight
    const offsetFor = (w: number, h: number): [number, number] => (centered ? [0, h * 2 * 0.08] : w < 1024 ? [0, h * 2 * 0.42] : [w * 2 * 0.27, h * 2 * 0.06])
    const scaleFor = (w: number) => (centered ? 1.55 : w < 1024 ? 1.7 : 2.1)
    let globe: ReturnType<typeof createGlobe>
    try {
      globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2), width: width * 2, height: height * 2, phi: phi0, theta, dark: 1, diffuse: 1.4,
      mapSamples: 30000, mapBrightness: 5, baseColor: [0.22, 0.27, 0.36], markerColor: [0.6, 0.84, 0.96], glowColor: [0.07, 0.11, 0.18],
      scale: scaleFor(width), offset: offsetFor(width, height), markers: [],
      })
    } catch { setFallback(true); return }
    let raf = 0, t = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (document.hidden) return
      t += 1
      const ms = markersRef.current.map((m) => ({ location: parseLL(m.city.ll), size: (m.active ? m.size + 0.03 * (0.5 + 0.5 * Math.sin(t / 6)) : m.size) * 0.6 }))
      const wobble = reduce ? 0 : Math.sin(t / 160) * 0.04
      globe.update({ phi: phi0 + wobble, markers: ms })
    }
    tick()
    const ro = new ResizeObserver(() => { width = canvas.offsetWidth; height = canvas.offsetHeight; globe.update({ width: width * 2, height: height * 2, offset: offsetFor(width, height), scale: scaleFor(width) }) })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); globe.destroy() }
  }, [centered])
  if (fallback) {
    // No WebGL here (some VMs and remote desktops): a pre-rendered still of the same globe keeps the layout intact.
    return <img src={centered ? '/globe-hero.png' : '/globe-console.png'} alt={sweeping ? 'Globe: sweeping the selected cities' : 'Globe: swept cities'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  }
  return <canvas ref={ref} aria-label={sweeping ? 'Globe: sweeping the selected cities' : 'Globe: swept cities'} style={{ width: '100%', height: '100%', contain: 'layout paint size' }} />
}
