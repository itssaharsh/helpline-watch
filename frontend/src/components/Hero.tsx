import { Button, Text } from '@radix-ui/themes'
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
      <div className="globe-wrap">
        <Globe markers={p.markers} sweeping={p.running} />
        <div style={{ position: 'absolute', left: 28, top: 24, maxWidth: 520 }}>
          <div className="display" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>{p.brand ? p.brand.name : 'Pick a brand'}</div>
          <Text as="p" size="2" mt="2" style={{ color: '#A2A69E' }}>
            {p.idle ? 'Nothing swept yet.' : p.running ? `Sweeping ${p.cities.map((c) => c.name).join(', ')}.` : `${p.cities.map((c) => c.name).join(', ')}. ${p.searches} searches${p.live === 0 ? ', none live' : `, ${p.live} live`}${p.when ? `, ${p.when}` : ''}.`}
          </Text>
          {p.brand && <Text as="p" size="1" mt="1" style={{ color: '#A2A69E' }}>Official numbers on file: <span className="num">{p.brand.official_numbers.length ? p.brand.official_numbers.join(', ') : 'none'}</span></Text>}
        </div>
        <div className="hidden lg:flex" style={{ position: 'absolute', left: 28, bottom: 20, gap: 14, flexWrap: 'wrap' }}>
          {p.cities.map((c) => { const m = p.markers.find((x) => x.city.id === c.id); return <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#F1F2EE' }}><span className={m?.active ? 'breathe' : ''} style={{ width: 8, height: 8, borderRadius: 999, background: '#4CC9F0', boxShadow: '0 0 10px #4CC9F0' }} />{c.name}</span> })}
        </div>
      </div>
      <div className="slab">
        {p.idle ? (
          <>
            <div className="display" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.05 }}>Every number a victim would be shown.</div>
            <div className="sub">Press Sweep to search from each city across results, the answer box, People also ask, the local pack, Maps and ads.</div>
          </>
        ) : (
          <>
            <div className="big num" style={{ fontFamily: 'Unbounded' }}>{fake}</div>
            <div className="display" style={{ fontSize: 20, fontWeight: 700, marginTop: -6 }}>fake {fake === 1 ? 'number' : 'numbers'}</div>
            <div className="sub"><span className="num">{review}</span> to check, <span className="num">{official}</span> official{p.synthetic ? '. Demo fixtures, not evidence' : ''}.{p.diff?.previous_id ? ` Since last sweep: ${p.diff.new.length} new, ${p.diff.persisting.length} still planted, ${p.diff.gone.length} gone.` : ''}</div>
            <Button asChild size="3" highContrast style={{ background: '#121400', color: '#CCFF00', width: '100%', marginTop: 'auto', opacity: !p.packUrl || packCount === 0 || p.running ? .45 : 1, pointerEvents: !p.packUrl || packCount === 0 || p.running ? 'none' : undefined }}>
              <a href={p.packUrl ?? '#'} download><DownloadSimple size={18} weight="bold" />Download takedown pack{packCount > 0 ? ` (${packCount})` : ''}</a>
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
