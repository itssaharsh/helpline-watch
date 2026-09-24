import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'
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
export function Globe({ markers, sweeping }: { markers: GlobeMarker[]; sweeping: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const markersRef = useRef(markers)
  useEffect(() => { markersRef.current = markers }, [markers])
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const [phi0, theta] = focus(21, 80)
    let width = canvas.offsetWidth, height = canvas.offsetHeight
    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2), width: width * 2, height: height * 2, phi: phi0, theta, dark: 1, diffuse: 1.4,
      mapSamples: 30000, mapBrightness: 7, baseColor: [0.16, 0.2, 0.3], markerColor: [0.3, 0.79, 0.94], glowColor: [0.08, 0.14, 0.24],
      scale: 2.1, offset: [width * 2 * 0.22, height * 2 * 0.06], markers: [],
    })
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
    const ro = new ResizeObserver(() => { width = canvas.offsetWidth; height = canvas.offsetHeight; globe.update({ width: width * 2, height: height * 2, offset: [width * 2 * 0.22, height * 2 * 0.06] }) })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); globe.destroy() }
  }, [])
  return <canvas ref={ref} aria-label={sweeping ? 'Globe: sweeping the selected cities' : 'Globe: swept cities'} style={{ width: '100%', height: '100%', contain: 'layout paint size' }} />
}
