import { Mark } from './Mark'
import { Stamp } from './Stamp'

export function Kit() {
  return (
    <main className="max-w-[980px] mx-auto p-6 flex flex-col gap-8">
      <h1 className="text-[28px]">Component kit</h1>
      <section className="sheet p-6 flex flex-col gap-4">
        <h2 className="text-[17px]">Pen marks on a printout</h2>
        <p className="serp-text">Call HDFC Bank customer care <Mark verdict="fake" landed>+91 74110 29385</Mark> for instant refund. The official toll-free line is <Mark verdict="official">1800 1600 1600</Mark>. The branch can be reached on <Mark verdict="review">033 4040 1188</Mark> and the grievance desk on <Mark verdict="official_unlisted">022 6160 6161</Mark>.</p>
        <p className="serp-text">Devanagari: कस्टमर केयर नंबर <Mark verdict="fake">+91 74110 29385</Mark> पर कॉल करें।</p>
      </section>
      <section className="sheet p-6 flex flex-col gap-3">
        <h2 className="text-[17px]">Buttons</h2>
        <div className="flex flex-wrap gap-2 items-center"><button className="btn btn-ink">Sweep now</button><button className="btn btn-ink" disabled title="Pick at least one city">Sweep now</button><button className="btn btn-ink" aria-busy="true" disabled>Sweeping, 12 of 22</button><button className="btn btn-paper">Mark as official</button><button className="btn btn-quiet">Close</button></div>
      </section>
      <section className="sheet p-6 flex flex-col gap-3">
        <h2 className="text-[17px]">Folder tabs</h2>
        <div className="flex items-end gap-1"><button className="tab" aria-selected="true">Mumbai <span className="tab-count">2</span></button><button className="tab">Delhi <span className="tab-dot pending" /></button><button className="tab">Bengaluru <span className="tab-dot" style={{ background: 'var(--green)' }} /></button><button className="tab tab-failed">Kolkata</button></div>
      </section>
      <section className="sheet p-6 flex flex-col gap-3 relative">
        <h2 className="text-[17px]">Stamp, type, texture</h2>
        <div className="relative h-32"><Stamp show line1="TAKEDOWN PACK" line2="READY TO FILE" big="3" /></div>
        <p className="text-[30px] font-bold tracking-tight">Helpline Watch 30 / 700</p>
        <p className="text-[22px]">Case file 22 / 700</p>
        <p className="text-[15px]">Body 15 / 400. Sheets fill city by city as each search returns.</p>
        <p className="pen text-red text-[18px]">Kalam 18 for pen notes: fake, check this, unclaimed listing</p>
        <p className="serp-title">A result title in link blue</p><p className="serp-url">https://www.hdfcbank.com › contact-us</p><p className="serp-text">Snippet text at 14 / 1.5 in near-ink.</p>
      </section>
      <section className="sheet p-6 flex flex-col gap-3">
        <h2 className="text-[17px]">Empty, loading, failed</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-[14px]">
          <div className="serp-box"><p className="font-semibold">Nothing swept yet.</p><p className="text-ink-muted">Sweep now to see what a victim in Mumbai is shown.</p></div>
          <div className="serp-box flex flex-col gap-2" aria-busy="true"><span className="sk h-4 w-2/3" /><span className="sk h-4 w-1/2" /><span className="sk h-4 w-5/6" /></div>
          <div className="serp-box border-dashed border-red text-red">No recorded result for this query yet (replay mode). Add a SerpApi key to fetch it live.</div>
        </div>
      </section>
      <section className="sheet p-6 flex items-end gap-6"><h2 className="text-[17px] w-full">Mark at 16, 32, 128</h2><img src="/icon.svg" width={16} height={16} alt="" /><img src="/icon.svg" width={32} height={32} alt="" /><img src="/icon.svg" width={128} height={128} alt="" /></section>
    </main>
  )
}
