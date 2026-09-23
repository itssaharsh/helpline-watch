import { Tag, VerdictChip } from './Chip'
import type { Verdict } from '../lib/types'

const VERDICTS: Verdict[] = ['fake', 'review', 'official', 'official_unlisted']

export function Kit() {
  return (
    <main className="max-w-[1100px] mx-auto p-6 flex flex-col gap-8">
      <h1 className="text-[28px] font-black">Component kit</h1>
      <section className="flex flex-col gap-3"><div className="label">Verdict chips</div><div className="flex gap-2 flex-wrap">{VERDICTS.map((v) => <VerdictChip key={v} display="+91 74110 29385" verdict={v} />)}<VerdictChip display="+91 74110 29385" verdict="fake" landed /><VerdictChip display="pending" verdict="pending" /></div></section>
      <section className="flex flex-col gap-3"><div className="label">Tags</div><div className="flex gap-2 flex-wrap"><Tag>muted</Tag><Tag tone="danger">danger</Tag><Tag tone="warning">warning</Tag><Tag tone="success">success</Tag><Tag tone="accent">accent</Tag></div></section>
      <section className="flex flex-col gap-3"><div className="label">Buttons</div><div className="flex gap-2 flex-wrap items-center"><button className="btn btn-primary">Sweep now</button><button className="btn btn-primary" disabled title="Pick at least one city">Sweep now</button><button className="btn btn-primary" aria-busy="true" disabled><span className="num">Sweeping… 12/22</span></button><button className="btn btn-secondary">Download takedown pack (3)</button><button className="btn btn-ghost">Esc</button></div></section>
      <section className="flex flex-col gap-3"><div className="label">Type scale</div><div className="flex flex-col gap-1"><div className="font-display font-black text-[28px]">Helpline Watch 28 / 800</div><div className="font-display font-bold text-[22px]">Numbers found 22 / 700</div><div className="text-[15px]">Body 15 / 400 — the grid fills city by city as searches return.</div><div className="num text-[13px]">+91 74110 29385 · 1800 1600 1600 · 033 4040 1188</div><div className="label">Label 11 / 600 / +0.1em</div></div></section>
      <section className="flex flex-col gap-3"><div className="label">Grid cell states</div><div className="grid grid-cols-4 gap-3">
        <div className="card p-3"><div className="label mb-2">pending</div><div className="flex flex-col gap-1.5"><span className="sk h-5 w-28 block" /><span className="sk h-5 w-20 block" /></div></div>
        <div className="card p-3"><div className="label mb-2">done</div><div className="flex flex-wrap gap-1.5"><VerdictChip display="1800 1600 1600" verdict="official" /><VerdictChip display="+91 74110 29385" verdict="fake" /></div></div>
        <div className="card p-3"><div className="label mb-2">empty</div><span className="text-ink-muted">—</span></div>
        <div className="card p-3"><div className="label mb-2">failed</div><div className="text-[12px] text-danger border border-dashed rounded-sm px-2 py-1" style={{ borderColor: 'color-mix(in oklch, var(--danger) 45%, transparent)' }}>No recorded result for this query yet (replay mode).</div></div>
      </div></section>
      <section className="flex flex-col gap-3"><div className="label">Logo at 16 / 32 / 128</div><div className="flex items-end gap-6"><img src="/icon.svg" width={16} height={16} alt="" /><img src="/icon.svg" width={32} height={32} alt="" /><img src="/icon.svg" width={128} height={128} alt="" /></div></section>
      <section className="flex flex-col gap-3"><div className="label">Empty states</div><div className="grid grid-cols-3 gap-3 text-[13px]"><div className="card p-4"><div className="font-medium">No sweeps for this brand yet.</div><div className="text-ink-muted">Sweep now to see what a victim in Mumbai sees.</div></div><div className="card p-4"><div className="font-medium">Nothing in the pack yet.</div><div className="text-ink-muted">Open a red finding and keep it in the pack.</div></div><div className="card p-4"><div className="font-medium text-danger">Connection to the sweep stream was lost.</div><div className="text-ink-muted">Sweep again; nothing was filed.</div></div></div></section>
    </main>
  )
}
