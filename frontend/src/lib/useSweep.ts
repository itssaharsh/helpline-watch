import { useCallback, useReducer, useRef } from 'react'
import { api, openSweepStream } from './api'
import type { Advertiser, CallState, Diff, Finding, LogLine, PlannedCall, Sweep } from './types'

export interface SweepState {
  status: 'idle' | 'running' | 'done' | 'error'
  sweepId: string | null
  brandId: string | null
  cityIds: string[]
  mode: string | null
  calls: Record<string, CallState>
  queries: string[]
  suggestions: string[]
  findings: Finding[]
  advertisers: Advertiser[]
  sweep: Sweep | null
  diff: Diff | null
  log: LogLine[]
  landed: string[]
  liveCalls: number
  cacheHits: number
  error: string | null
  reverseInFlight: string | null
}

export const EMPTY: SweepState = {
  status: 'idle', sweepId: null, brandId: null, cityIds: [], mode: null, calls: {}, queries: [], suggestions: [], findings: [],
  advertisers: [], sweep: null, diff: null, log: [], landed: [], liveCalls: 0, cacheHits: 0, error: null, reverseInFlight: null,
}

type Action =
  | { type: 'reset'; brandId: string; cityIds: string[] }
  | { type: 'started'; payload: any }
  | { type: 'plan'; payload: any }
  | { type: 'call_done'; payload: any }
  | { type: 'call_failed'; payload: any }
  | { type: 'findings'; payload: any }
  | { type: 'advertisers'; payload: any }
  | { type: 'reverse_started'; payload: any }
  | { type: 'reverse_done'; payload: any }
  | { type: 'done'; payload: any }
  | { type: 'error'; payload: any }
  | { type: 'loaded'; sweep: Sweep; diff: Diff }
  | { type: 'finding_patched'; finding: Finding }
  | { type: 'clear_landed' }

const log = (kind: LogLine['kind'], text: string): LogLine => ({ at: Date.now(), kind, text })
const keepLog = (lines: LogLine[], line: LogLine) => [...lines.slice(-79), line]

function callsFromSweep(sweep: Sweep): Record<string, CallState> {
  const calls: Record<string, CallState> = {}
  sweep.city_ids.forEach((cityId, i) => {
    sweep.queries.forEach((q, qi) => { calls[`search:${cityId}:${qi}`] = { id: `search:${cityId}:${qi}`, status: 'done', label: q, group: 'search', city_id: cityId } })
    calls[`maps:${cityId}`] = { id: `maps:${cityId}`, status: 'done', label: 'Maps', group: 'maps', city_id: cityId }
    if (i === 0) calls[`hindi:${cityId}`] = { id: `hindi:${cityId}`, status: 'done', label: 'Hindi', group: 'hindi', city_id: cityId }
  })
  calls.ads = { id: 'ads', status: 'done', label: 'Ads Transparency', group: 'ads', city_id: null }
  // Errors are stored as "<call id>: <message>", so the exact cell that failed can be marked.
  for (const line of sweep.errors) {
    const sep = line.indexOf(': ')
    if (sep < 0) continue
    const id = line.slice(0, sep)
    if (calls[id]) calls[id] = { ...calls[id], status: 'failed', error: line.slice(sep + 2) }
  }
  return calls
}

function reducer(state: SweepState, action: Action): SweepState {
  switch (action.type) {
    case 'reset':
      return { ...EMPTY, status: 'running', brandId: action.brandId, cityIds: action.cityIds, log: [log('info', `Sweep requested for ${action.brandId} across ${action.cityIds.length} cities`)] }
    case 'started':
      return { ...state, sweepId: action.payload.sweep_id, mode: action.payload.mode, log: keepLog(state.log, log('info', `Sweep ${action.payload.sweep_id} started in ${action.payload.mode} mode`)) }
    case 'plan': {
      const calls: Record<string, CallState> = {}
      for (const c of action.payload.calls as PlannedCall[]) calls[c.id] = { ...c, status: 'pending' }
      const text = `Plan: ${action.payload.total} calls (cap ${action.payload.max_calls}) · queries: ${action.payload.queries.join(' · ')}`
      return { ...state, calls, queries: action.payload.queries, suggestions: action.payload.suggestions, log: keepLog(state.log, log('info', text)) }
    }
    case 'call_done': {
      const p = action.payload
      const prev = state.calls[p.id]
      const call: CallState = { ...(prev ?? { id: p.id, label: p.id, group: 'search', city_id: null }), status: 'done', fixture_kind: p.fixture_kind, numbers: p.numbers, ms: p.ms }
      const source = p.from_cache ? `cache · ${p.fixture_kind}` : `live · ${p.ms} ms`
      return { ...state, calls: { ...state.calls, [p.id]: call }, liveCalls: p.live_calls, cacheHits: p.cache_hits,
        log: keepLog(state.log, log('ok', `${call.label} — ${p.observations} number${p.observations === 1 ? '' : 's'} (${source})`)) }
    }
    case 'call_failed': {
      const p = action.payload
      const prev = state.calls[p.id]
      const call: CallState = { ...(prev ?? { id: p.id, label: p.id, group: 'reverse', city_id: null }), status: 'failed', error: p.error }
      return { ...state, calls: { ...state.calls, [p.id]: call }, reverseInFlight: null, log: keepLog(state.log, log('fail', `${call.label} — ${p.error}`)) }
    }
    case 'findings': {
      const incoming = action.payload.findings as Finding[]
      const known = new Set(state.findings.map((f) => f.number_norm))
      const landed = incoming.filter((f) => !known.has(f.number_norm)).map((f) => f.number_norm)
      return { ...state, findings: incoming, landed: landed.length ? landed : state.landed }
    }
    case 'advertisers':
      return { ...state, advertisers: action.payload.advertisers, log: keepLog(state.log, log('info', `Ads Transparency — ${action.payload.advertisers.length} advertisers bidding on the brand`)) }
    case 'reverse_started':
      return { ...state, reverseInFlight: action.payload.number, log: keepLog(state.log, log('info', action.payload.label)) }
    case 'reverse_done': {
      const f = action.payload.finding as Finding
      const findings = state.findings.map((x) => (x.number_norm === f.number_norm ? f : x))
      return { ...state, findings, reverseInFlight: null, log: keepLog(state.log, log(action.payload.flagged ? 'warn' : 'ok', `Reverse lookup ${f.display} — ${action.payload.hits} pages, ${action.payload.flagged} mention fraud → ${f.verdict}`)) }
    }
    case 'done': {
      const sweep = action.payload.sweep as Sweep
      const d = action.payload.diff as Diff
      const summary = `Done: ${action.payload.counts.fake} fake · ${action.payload.counts.review} review · ${action.payload.counts.official + action.payload.counts.official_unlisted} official · ${action.payload.live_calls} live calls, ${action.payload.cache_hits} cache hits`
      return { ...state, status: 'done', sweep, diff: d, findings: sweep.findings, advertisers: sweep.advertisers, liveCalls: action.payload.live_calls, cacheHits: action.payload.cache_hits, log: keepLog(state.log, log('ok', summary)) }
    }
    case 'error':
      return { ...state, status: 'error', error: action.payload.message, log: keepLog(state.log, log('fail', action.payload.message)) }
    case 'loaded': {
      if (state.status === 'running') return state // a late "load latest" must never overwrite a live sweep
      const s = action.sweep
      return { ...EMPTY, status: 'done', sweepId: s.id, brandId: s.brand_id, cityIds: s.city_ids, mode: s.mode, calls: callsFromSweep(s), queries: s.queries,
        findings: s.findings, advertisers: s.advertisers, sweep: s, diff: action.diff, liveCalls: s.live_calls ?? 0, cacheHits: s.cache_hits ?? s.calls_made,
        log: [log('info', `Loaded sweep ${s.id} from ${new Date(s.started_at).toLocaleString()}`)] }
    }
    case 'finding_patched': {
      const findings = state.findings.map((x) => (x.number_norm === action.finding.number_norm ? action.finding : x))
      return { ...state, findings, sweep: state.sweep ? { ...state.sweep, findings } : state.sweep }
    }
    case 'clear_landed':
      return state.landed.length ? { ...state, landed: [] } : state
  }
}

export function useSweep() {
  const [state, dispatch] = useReducer(reducer, EMPTY)
  const closeRef = useRef<(() => void) | null>(null)

  const start = useCallback((brandId: string, cityIds: string[], reverse: number) => {
    closeRef.current?.()
    dispatch({ type: 'reset', brandId, cityIds })
    const forward = (type: Action['type']) => (payload: any) => dispatch({ type, payload } as Action)
    closeRef.current = openSweepStream(brandId, cityIds, reverse, {
      started: forward('started'), plan: forward('plan'), call_done: forward('call_done'), call_failed: forward('call_failed'),
      findings: forward('findings'), advertisers: forward('advertisers'), reverse_started: forward('reverse_started'),
      reverse_done: forward('reverse_done'), done: forward('done'), error: forward('error'),
    })
  }, [])

  const load = useCallback(async (sweepId: string) => {
    const { sweep, diff } = await api.sweep(sweepId)
    dispatch({ type: 'loaded', sweep, diff })
  }, [])

  const patch = useCallback(async (number: string, body: { in_pack?: boolean; mark_official?: boolean }) => {
    if (!state.sweepId) return null
    const out = await api.patchFinding(state.sweepId, number, body)
    if (body.mark_official) {
      const { sweep, diff } = await api.sweep(state.sweepId)
      dispatch({ type: 'loaded', sweep, diff })
    } else {
      dispatch({ type: 'finding_patched', finding: out.finding })
    }
    return out
  }, [state.sweepId])

  const clearLanded = useCallback(() => dispatch({ type: 'clear_landed' }), [])
  return { state, start, load, patch, clearLanded }
}
