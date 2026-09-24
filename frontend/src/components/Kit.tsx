import { Mark } from './Mark'

export function Kit() {
  return (
    <main className="landing" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 className="h2">Component kit</h1>
      <div className="glass" style={{ padding: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}><button className="btn btn-white">Sweep</button><button className="btn btn-white" disabled>Sweep</button><button className="btn btn-ghost">5 cities</button><button className="btn btn-quiet">Close</button><span className="badge badge-fake">Fake</span><span className="badge badge-review">Check</span><span className="badge badge-official">Official</span><span className="badge badge-official_unlisted">Unlisted</span></div>
      <div className="glass" style={{ padding: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}><button className="pill" aria-pressed="true">Mumbai <span className="cnt">2</span></button><button className="pill">Delhi <span className="cnt">2</span></button><button className="pill pending"><span className="breathe">●</span> Bengaluru</button><button className="pill failed">Kolkata: no result</button></div>
      <div className="sheet"><p className="r-text">Call HDFC Bank customer care <Mark verdict="fake" landed>+91 74110 29385</Mark> for instant refund. The official line is <Mark verdict="official">1800 1600 1600</Mark>. The branch can be reached on <Mark verdict="review">033 4040 1188</Mark> and the desk on <Mark verdict="official_unlisted">022 6160 6161</Mark>.</p><p className="r-text">कस्टमर केयर नंबर <Mark verdict="fake">+91 74110 29385</Mark> पर कॉल करें।</p></div>
      <div className="glass" style={{ padding: 16 }}><div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em' }}>Host Grotesk 30 / 700</div><div className="num" style={{ fontSize: 28, fontWeight: 700 }}>+91 74110 29385</div><p className="muted">Body 14 muted. Sheets fill city by city.</p></div>
    </main>
  )
}
