import { useState } from 'react'
import { reasonFor } from '../lib/labels'
import type { Advertiser, Brand, City, Diff, Finding, LogLine, NetworkData, Verdict } from '../lib/types'
import { Network } from './Network'
import { Stamp } from './Stamp'

interface Props {
  brand: Brand | null; cities: City[]; findings: Finding[]; advertisers: Advertiser[]; diff: Diff | null; network: NetworkData | null
  sweepAt: string | null; mode: string | null; liveCalls: number; cacheHits: number; running: boolean; done: boolean; synthetic: boolean
  packUrl: string | null; selected: string | null; log: LogLine[]
  onSelect: (n: string) => void; onNetworkNumber: (n: string) => void
}

const count = (f: Finding[], v: Verdict) => f.filter((x) => x.verdict === v).length

function NumberCell({ f }: { f: Finding }) {
  if (f.verdict === 'fake') return <span className="inline-flex items-baseline gap-3 font-semibold text-[16px]"><span className="relative inline-block px-1"><svg className="absolute -inset-x-2 -inset-y-1.5 w-[calc(100%+16px)] h-[calc(100%+12px)]" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden><ellipse cx="50" cy="20" rx="48" ry="17" fill="none" stroke="var(--red)" strokeWidth="2.2" transform="rotate(-2 50 20)" /></svg>{f.display}</span><span className="pen text-red text-[15px] rotate-[-7deg] inline-block">fake</span></span>
  if (f.verdict === 'review') return <span className="inline-flex items-baseline gap-3 font-semibold text-[16px]"><span className="hl">{f.display}</span><span className="pen-muted text-[15px] rotate-[-5deg] inline-block">check</span></span>
  return <span className="font-semibold text-[16px] text-green" style={{ borderBottom: `2px ${f.verdict === 'official_unlisted' ? 'dashed' : 'solid'} var(--green)` }}>{f.display}</span>
}

export function CaseFile(p: Props) {
  const [logOpen, setLogOpen] = useState(false)
  const fake = count(p.findings, 'fake'), review = count(p.findings, 'review'), official = count(p.findings, 'official') + count(p.findings, 'official_unlisted')
  const packCount = p.findings.filter((f) => f.in_pack).length
  const when = p.sweepAt ? new Date(p.sweepAt).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : null
  const cityName = (id: string) => p.cities.find((c) => c.id === id)?.name ?? id
  const third = p.advertisers.filter((a) => !a.is_brand)
  return (
    <aside className="clip relative flex flex-col" aria-label="Case file">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-[22px]">Case file</h2>
        <p className="text-[13px] text-ink-muted mt-1">
          {p.brand ? p.brand.name : 'No brand'}{when ? `, swept ${when}` : ''}{p.mode ? `, ${p.mode === 'live' ? 'live on SerpApi' : 'replayed from recorded searches'}` : ''}.
        </p>
        <p className="mt-4 text-[17px] leading-snug">
          {p.running && p.findings.length === 0 ? 'Sweeping. Numbers appear here as each page comes back.' : p.findings.length === 0 ? 'Nothing swept yet.' : (
            <><span className="font-semibold text-red">{fake} fake</span>, <span className="font-semibold">{review} to check</span>, and <span className="font-semibold text-green">{official} official</span> across {p.cities.length} {p.cities.length === 1 ? 'city' : 'cities'}, from {p.liveCalls + p.cacheHits} searches{p.liveCalls === 0 && p.cacheHits > 0 ? ', none of them live' : ''}.</>
          )}
        </p>
        {p.synthetic && p.done && <p className="pen-muted text-[15px] mt-2 rotate-[-1deg] inline-block">demo fixtures, not evidence</p>}
      </div>

      <section className="px-6 pb-4">
        <h3 className="text-[15px] mb-1">Numbers found</h3>
        {p.findings.length === 0 ? <p className="text-[13px] text-ink-muted py-3 border-t border-line">None yet.</p> : (
          <div>
            {p.findings.map((f) => (
              <button key={f.number_norm} type="button" className="ledger-row" onClick={() => p.onSelect(f.number_norm)} aria-current={p.selected === f.number_norm ? 'true' : undefined}>
                <span className="flex items-baseline justify-between gap-3">
                  <NumberCell f={f} />
                  <span className="text-[12px] text-ink-faint whitespace-nowrap">{f.city_ids.length > 0 ? (f.city_ids.length === 1 ? cityName(f.city_ids[0]) : `${f.city_ids.length} cities`) : ''}{f.in_pack ? ', in pack' : ''}</span>
                </span>
                <span className="text-[13px] text-ink-muted leading-snug">
                  {reasonFor(f.signals)}{f.other_brands.length > 0 ? `; also seen for ${f.other_brands.join(', ')}` : ''}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {p.diff && p.diff.previous_id && (
        <section className="px-6 pb-4">
          <h3 className="text-[15px] mb-1">Since the last sweep</h3>
          <p className="text-[13px] text-ink-muted border-t border-line pt-2">
            {p.diff.new.length === 0 && p.diff.gone.length === 0 ? `Nothing changed: ${p.diff.persisting.length} suspicious number${p.diff.persisting.length === 1 ? '' : 's'} still planted.` : `${p.diff.new.length} new, ${p.diff.persisting.length} still planted, ${p.diff.gone.length} gone since ${p.diff.previous_started_at ? new Date(p.diff.previous_started_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'last time'}.`}
          </p>
        </section>
      )}

      <section className="px-6 pb-4">
        <h3 className="text-[15px] mb-1">Advertising on the brand name</h3>
        <div className="border-t border-line pt-2 text-[13px]">
          {p.advertisers.length === 0 ? <p className="text-ink-muted">{p.running ? 'Checking the Ads Transparency Center.' : 'No advertisers recorded.'}</p> : (
            <ul className="flex flex-col gap-1">
              {p.advertisers.map((a) => (
                <li key={a.advertiser_id ?? a.advertiser} className="flex justify-between gap-3">
                  <span className={a.is_brand ? '' : 'font-semibold'}>{a.advertiser}{!a.is_brand && <span className="pen-muted text-[14px] ml-2">not the brand</span>}</span>
                  <span className="text-ink-faint">{a.creatives} ad{a.creatives === 1 ? '' : 's'}</span>
                </li>
              ))}
            </ul>
          )}
          {third.length > 0 && <p className="text-ink-muted mt-2">From SerpApi’s Google Ads Transparency Center for India.</p>}
        </div>
      </section>

      <section className="px-6 pb-4">
        <h3 className="text-[15px] mb-1">The same numbers across brands</h3>
        <div className="border-t border-line pt-3">
          <Network data={p.network} onNumber={p.onNetworkNumber} height={320} />
        </div>
      </section>

      <section className="px-6 pb-6 mt-auto relative">
        <Stamp show={p.done && packCount > 0} line1="TAKEDOWN PACK" line2="READY TO FILE" big={String(packCount)} />
        <h3 className="text-[15px] mb-1">Takedown pack</h3>
        <div className="border-t border-line pt-3 flex flex-col gap-3">
          <p className="text-[13px] text-ink-muted pr-24">A CSV, the evidence with replay links, a report with the right Google form per surface, and a cybercrime.gov.in complaint template. Only numbers you keep in the pack go in.</p>
          <a className={`btn btn-ink w-full ${!p.packUrl || packCount === 0 || p.running ? 'pointer-events-none opacity-40' : ''}`} href={p.packUrl ?? '#'} download aria-disabled={!p.packUrl || packCount === 0 || p.running}>
            Download takedown pack{packCount > 0 ? ` (${packCount})` : ''}
          </a>
          {packCount === 0 && p.done && <p className="text-[12px] text-ink-faint">Nothing in the pack. Open a circled number and keep it.</p>}
        </div>
      </section>

      <section className="border-t border-line px-6 py-3">
        <button type="button" className="w-full flex items-center justify-between text-[13px] text-ink-muted" onClick={() => setLogOpen((v) => !v)} aria-expanded={logOpen}>
          <span className="min-w-0 text-left"><span className="text-ink font-medium">{p.running ? 'Search log, running' : 'Search log'}</span>{p.log.length ? <span className="block truncate">{p.log[p.log.length - 1].text}</span> : null}</span>
          <span className="shrink-0">{logOpen ? 'Hide' : 'Show'}</span>
        </button>
        {logOpen && (
          <ol className="log mt-2 max-h-[220px] overflow-y-auto" aria-live="polite">
            {p.log.map((l, i) => <li key={i}><span style={{ color: l.kind === 'fail' ? 'var(--red)' : l.kind === 'ok' ? 'var(--green)' : 'var(--ink-faint)' }}>{l.kind === 'ok' ? '✓' : l.kind === 'fail' ? '✗' : l.kind === 'warn' ? '!' : '·'}</span><span className="text-ink-faint">{new Date(l.at).toLocaleTimeString(undefined, { hour12: false })}</span><span className="min-w-0 break-words">{l.text}</span></li>)}
          </ol>
        )}
      </section>
    </aside>
  )
}
