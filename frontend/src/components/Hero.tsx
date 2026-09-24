import { DownloadSimple } from '@phosphor-icons/react'
import type { Brand, City, Diff, Finding } from '../lib/types'
import { Globe, type GlobeMarker } from './Globe'

interface Props { brand: Brand | null; cities: City[]; findings: Finding[]; markers: GlobeMarker[]; running: boolean; done: boolean; idle: boolean; searches: number; live: number; when: string | null; synthetic: boolean; diff: Diff | null; packUrl: string | null }

export function Hero(p: Props) {
  const fake = p.findings.filter((f) => f.verdict === 'fake').length
  const review = p.findings.filter((f) => f.verdict === 'review').length
  const official = p.findings.filter((f) => f.verdict === 'official' || f.verdict === 'official_unlisted').length
  const packCount = p.findings.filter((f) => f.in_pack).length
  return (
    <section className="hero" aria-label="Sweep overview">
      <div className="globe-wrap glass">
        <Globe markers={p.markers} sweeping={p.running} />
        <div style={{ position: 'absolute', left: 24, top: 22, maxWidth: 520 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 }}>{p.brand ? p.brand.name : 'Pick a brand'}</div>
          <p className="muted" style={{ marginTop: 8, fontSize: 14 }}>{p.idle ? 'Nothing swept yet.' : p.running ? `Sweeping ${p.cities.map((c) => c.name).join(', ')}.` : `${p.cities.map((c) => c.name).join(', ')}. ${p.searches} searches${p.live === 0 ? ', none live' : `, ${p.live} live`}${p.when ? `, ${p.when}` : ''}.`}</p>
          {p.brand && <p className="faint" style={{ marginTop: 4, fontSize: 13 }}>Official numbers on file: <span className="num">{p.brand.official_numbers.length ? p.brand.official_numbers.join(', ') : 'none'}</span></p>}
        </div>
        <div className="hidden lg:flex" style={{ position: 'absolute', left: 24, bottom: 18, gap: 14, flexWrap: 'wrap' }}>
          {p.cities.map((c) => { const m = p.markers.find((x) => x.city.id === c.id); return <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}><span className={`dot ${m?.active ? 'breathe' : ''}`} style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />{c.name}</span> })}
        </div>
      </div>
      <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {p.idle ? (
          <>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Every number a victim would be shown.</div>
            <p className="muted" style={{ fontSize: 14 }}>Press Sweep to search from each city across results, the answer box, People also ask, the local pack, Maps and ads.</p>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}><span className="num" style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>{fake}</span><span style={{ fontSize: 18, fontWeight: 600 }}>fake {fake === 1 ? 'number' : 'numbers'}</span></div>
            <div style={{ display: 'flex', gap: 18, fontSize: 14 }}>
              <span><span className="dot" style={{ background: 'var(--check)', marginRight: 6 }} /><span className="num">{review}</span> to check</span>
              <span><span className="dot" style={{ background: 'var(--official)', marginRight: 6 }} /><span className="num">{official}</span> official</span>
            </div>
            <p className="muted" style={{ fontSize: 13 }}>{p.synthetic ? 'Demo fixtures, not evidence. ' : ''}{p.diff?.previous_id ? `Since last sweep: ${p.diff.new.length} new, ${p.diff.persisting.length} still planted, ${p.diff.gone.length} gone.` : ''}</p>
            <a className="btn btn-white" href={p.packUrl ?? '#'} download aria-disabled={!p.packUrl || packCount === 0 || p.running} style={{ marginTop: 'auto' }}><DownloadSimple size={16} weight="bold" />Download takedown pack{packCount > 0 ? ` (${packCount})` : ''}</a>
            <p className="faint" style={{ fontSize: 12 }}>CSV, evidence with replay links, report, complaint template. Only numbers you keep go in.</p>
          </>
        )}
      </div>
    </section>
  )
}
