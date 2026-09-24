import { useEffect, useState } from 'react'
import { ArrowRight, GithubLogo } from '@phosphor-icons/react'
import { api } from '../lib/api'
import type { City, SerpSnapshot, Sweep } from '../lib/types'
import { Globe } from './Globe'
import { Page } from './Pages'

const SIGNALS: [string, string][] = [
  ['Lookalike', 'one digit or one swap away from an official number'],
  ['Mobile as helpline', 'a 10-digit mobile presented as a regulated brand’s helpline; TRAI requires 1600-series numbers'],
  ['Listing named as a helpline', 'a Maps listing titled like “X Customer Care Number”'],
  ['Thin or unclaimed listing', 'unclaimed, or under five reviews'],
  ['Cross-brand', 'the same number already confirmed fake for another brand'],
  ['Multi-city', 'planted in three or more cities'],
  ['Ad from a non-official domain', 'inside a search ad the brand did not buy'],
  ['Reverse lookup', 'pages about the number mention fraud or sit on complaint sites'],
]

export function Landing() {
  const [cities, setCities] = useState<City[]>([])
  const [sweep, setSweep] = useState<Sweep | null>(null)
  useEffect(() => {
    api.cities().then((c) => setCities(c.cities.filter((x) => c.default.includes(x.id)))).catch(() => undefined)
    api.brands().then(async (b) => { const list = await api.sweeps(b[0]?.id ?? 'hdfc-bank'); if (list[0]) setSweep((await api.sweep(list[0].id)).sweep) }).catch(() => undefined)
  }, [])
  const markers = cities.map((c) => ({ city: c, size: 0.05, active: false }))
  const preview: SerpSnapshot | undefined = sweep?.snapshots.find((s) => s.engine === 'google' && s.hl !== 'hi' && s.city_id === (sweep.city_ids[0] ?? 'mumbai'))
  const verdictOf = (norm: string) => sweep?.findings.find((f) => f.number_norm === norm)?.verdict
  const fake = sweep?.findings.filter((f) => f.verdict === 'fake').length ?? 0
  return (
    <div className="landing">
      <nav className="nav">
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#F4F7FA', fontWeight: 700, fontSize: 16 }}><img src="/icon.svg" width={26} height={26} alt="" />Helpline Watch</a>
        <div style={{ flex: 1 }} />
        <div className="nav-links"><a href="#how">How it works</a><a href="#proof">Proof</a><a href="#serpapi">SerpApi</a></div>
        <a className="btn btn-white" href="/app" style={{ height: 36 }}>Open the console</a>
      </nav>

      <section className="hero-l">
        <div>
          <p className="muted" style={{ fontSize: 14, marginBottom: 14 }}>For fraud and brand-protection teams in India</p>
          <h1 className="h1">Find the fake helpline numbers before your customers call them.</h1>
          <p className="lead" style={{ marginTop: 20 }}>Helpline Watch sweeps Google Search, Maps and ads from every Indian city you choose, marks every number that is not the brand’s, and hands you the takedown pack.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <a className="btn btn-white btn-lg" href="/app?demo=1">Watch a sweep <ArrowRight size={16} weight="bold" /></a>
            <a className="btn btn-ghost btn-lg" href="/app">Open the console</a>
          </div>
          <div className="stats">
            <div className="stat"><b>₹2,100 crore</b><span>lost to fake customer-care numbers by March 2026</span></div>
            <div className="stat"><b>1.73 lakh</b><span>complaints logged under this modus operandi</span></div>
            <div className="stat"><b>{sweep ? fake : 3}</b><span>fakes found in the latest sweep on this machine</span></div>
          </div>
        </div>
        <div className="globe-hero glass" style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(154,213,245,.14), transparent 70%)' }}>
          <Globe markers={markers} sweeping={false} centered />
        </div>
      </section>

      <section className="section" id="see">
        <h2 className="h2">What a victim in {cities[0]?.name ?? 'Mumbai'} is shown</h2>
        <p className="lead" style={{ marginBottom: 24 }}>Every page comes back from SerpApi as JSON and is redrawn as the results page the victim saw, with each number marked in place.</p>
        {preview ? <Page snapshot={preview} city={cities[0] ?? null} verdictOf={verdictOf} landed={new Set()} onNumber={() => { window.location.href = '/app' }} /> : <div className="glass" style={{ padding: 24 }}><span className="muted">Run <code>make seed</code> to see a swept page here.</span></div>}
      </section>

      <section className="section" id="how">
        <div className="steps">
          <div><h2 className="h2">How a sweep works</h2><p className="muted">One brand, the cities you pick, about 22 searches.</p></div>
          <div>
            {[
              ['Plan the queries', 'Google Autocomplete gives the phrases victims type, in English and Hindi.'],
              ['Sweep every surface per city', 'Search results, the answer box, People also ask, the local pack, Maps listings, search ads and the Ads Transparency Center, each searched from the city itself.'],
              ['Score with named signals', 'Every number is normalised and scored deterministically; fake needs a score of three or more, anything between goes to a review queue.'],
              ['File the pack', 'CSV, evidence with replay links, a report with the right Google form per surface, and a cybercrime.gov.in complaint template. A person keeps or removes every number.'],
            ].map(([t, d], i) => <div className="step" key={t}><span className="muted num">{i + 1}</span><div><b>{t}</b><p className="muted" style={{ marginTop: 4 }}>{d}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="steps">
          <div><h2 className="h2">The signals</h2><p className="muted">No language model in the verdict path. Each point has a name and a reason.</p></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px 32px' }}>
            {SIGNALS.map(([t, d]) => <div key={t} style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,.07)' }}><b>{t}</b><p className="muted" style={{ marginTop: 2, fontSize: 14 }}>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section" id="proof">
        <div className="steps">
          <div><h2 className="h2">Proof you can run</h2><p className="muted"><code>make verify</code> replays the recorded sweeps with no API key.</p></div>
          <pre className="proof mono">{`PASS  shared planted number is FAKE  · score=12
PASS  shared number linked across brands  · other_brands=['IndiGo', 'Zomato']
PASS  one-digit lookalike is FAKE without complaint evidence
PASS  official number republished by a third party stays OFFICIAL
PASS  unlisted number on the brand's own domain is OFFICIAL_UNLISTED
PASS  unknown landline in a news story stays REVIEW
PASS  number inside an impersonating ad is FAKE
PASS  takedown pack has csv, evidence, report and complaint template
PASS  takedown pack contains only confirmed fakes  · rows=3 fakes=3
PASS  partial coverage is reported, not hidden  · kolkata 2/3
PASS  no live SerpApi calls were needed
RESULT: PASS`}</pre>
        </div>
      </section>

      <section className="section" id="serpapi">
        <div className="steps">
          <div><h2 className="h2">Built on SerpApi</h2><p className="muted">Each feature does a job nothing else could do this weekend.</p></div>
          <div>
            {[
              ['Google Search API with location, google.co.in and hl=hi', 'the page a victim in each city sees, including Hindi queries'],
              ['Google Maps API', 'the listings that carry most planted numbers, with phone, reviews and unclaimed flags'],
              ['Google Ads Transparency Center API', 'who is bidding on the brand name in India'],
              ['Google Autocomplete API', 'the query variants victims actually type'],
              ['Search Archive', 'a replayable evidence link for every sighting, valid 31 days'],
              ['The number as the query', 'complaint pages and other brands a number poses as'],
            ].map(([t, d]) => <div key={t} style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,.07)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}><b style={{ fontSize: 14 }}>{t}</b><span className="muted" style={{ fontSize: 14 }}>{d}</span></div>)}
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>Helpline Watch. Built for the SerpApi India Hackathon 2026.</span>
        <a href="https://github.com/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><GithubLogo size={16} />Source on GitHub</a>
        <a href="/_kit">Component kit</a>
        <span>MIT licence. No model runs inside the product.</span>
      </footer>
    </div>
  )
}
