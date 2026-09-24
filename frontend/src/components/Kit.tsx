import { Button, Flex, Text } from '@radix-ui/themes'
import { Mark } from './Mark'

export function Kit() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="display" style={{ fontSize: 28, fontWeight: 700 }}>Component kit</div>
      <div className="panel"><div className="panel-head"><span className="swatch" style={{ background: '#CCFF00' }} /><Text weight="bold">Buttons, one hue per function</Text></div><Flex gap="3" p="4" wrap="wrap" align="center"><Button color="lime" size="3">Sweep</Button><Button color="lime" size="3" loading>Sweep</Button><Button color="cyan" variant="soft">5 cities</Button><Button color="violet" variant="soft">Across brands</Button><Button color="gray" variant="soft">Mark as official</Button><span className="badge badge-fake">Fake</span><span className="badge badge-review">Check</span><span className="badge badge-official">Official</span><span className="badge badge-official_unlisted">Unlisted</span></Flex></div>
      <div className="panel"><div className="panel-head"><span className="swatch" style={{ background: '#4CC9F0' }} /><Text weight="bold">Pills</Text></div><Flex gap="2" p="4" wrap="wrap"><button className="pill" aria-pressed="true">Mumbai <span className="cnt">2</span></button><button className="pill">Delhi <span className="cnt">2</span></button><button className="pill pending"><span className="breathe">●</span> Bengaluru</button><button className="pill failed">Kolkata: no result</button></Flex></div>
      <div className="sheet"><p className="r-text">Call HDFC Bank customer care <Mark verdict="fake" landed>+91 74110 29385</Mark> for instant refund. The official line is <Mark verdict="official">1800 1600 1600</Mark>. The branch can be reached on <Mark verdict="review">033 4040 1188</Mark> and the desk on <Mark verdict="official_unlisted">022 6160 6161</Mark>.</p><p className="r-text">कस्टमर केयर नंबर <Mark verdict="fake">+91 74110 29385</Mark> पर कॉल करें।</p></div>
      <div className="slab" style={{ borderRadius: 12 }}><div className="big num">3</div><div className="display" style={{ fontSize: 20, fontWeight: 700 }}>fake numbers</div><div className="sub">1 to check, 2 official.</div></div>
      <div className="panel"><div className="panel-head"><span className="swatch" style={{ background: '#FF6166' }} /><Text weight="bold">Type</Text></div><div style={{ padding: 16 }}><div className="display" style={{ fontSize: 30, fontWeight: 700 }}>Unbounded 30 / 700</div><div className="num c-fake" style={{ fontSize: 28 }}>+91 74110 29385</div><Text as="p" size="2">Hanken Grotesk body 14. Sheets fill city by city.</Text><Text as="p" size="1" style={{ color: '#A2A69E' }}>Size 1 muted for meta.</Text></div></div>
    </main>
  )
}
