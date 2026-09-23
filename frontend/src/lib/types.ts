export type Verdict = 'official' | 'official_unlisted' | 'fake' | 'review'
export type Surface = 'search_organic' | 'search_ads' | 'search_local' | 'search_knowledge' | 'search_paa' | 'search_answer' | 'maps' | 'ads_transparency' | 'reverse'

export interface Brand { id: string; name: string; category: string; regulated: boolean; official_domains: string[]; official_numbers: string[]; aliases: string[] }
export interface City { id: string; name: string; state: string; location: string; ll: string; default: boolean }
export interface Provenance { engine: string; query: string; city_id: string | null; hl: string; search_id: string | null; json_endpoint: string | null; raw_html_file: string | null; archive_link: string | null; fixture_id: string | null; fixture_kind: string | null }
export interface Listing { title: string | null; place_id: string | null; data_id: string | null; address: string | null; rating: number | null; reviews: number | null; listing_type: string | null; unclaimed: boolean | null; website: string | null }
export interface Observation { number_raw: string; number_norm: string; kind: string; surface: Surface; city_id: string | null; source_title: string | null; source_link: string | null; source_domain: string | null; context: string; listing: Listing | null; advertiser: string | null; provenance: Provenance }
export interface Signal { code: string; weight: number; detail: string }
export interface ReverseHit { title: string; link: string; domain: string; snippet: string; scam_words: string[] }
export interface Finding { number_norm: string; display: string; kind: string; verdict: Verdict; score: number; signals: Signal[]; observations: Observation[]; surfaces: Surface[]; city_ids: string[]; other_brands: string[]; reverse_hits: ReverseHit[]; reverse_checked: boolean; in_pack: boolean }
export interface Advertiser { advertiser: string; advertiser_id: string | null; creatives: number; is_brand: boolean; first_shown: number | null; last_shown: number | null; details_link: string | null }
export interface Coverage { city_id: string; planned: number; completed: number; failed: number }
export interface Sweep { id: string; brand_id: string; brand_name: string; started_at: string; finished_at: string | null; mode: string; city_ids: string[]; queries: string[]; calls_made: number; calls_planned: number; live_calls: number; cache_hits: number; fixture_kinds: Record<string, number>; coverage: Coverage[]; findings: Finding[]; advertisers: Advertiser[]; errors: string[] }
export interface Diff { previous_id: string | null; previous_started_at?: string; new: string[]; persisting: string[]; gone: string[] }
export interface Health { version: string; mode: string; configured_mode: string; has_key: boolean; max_calls: number; credits_left: number | null; plan: string | null; fixtures: Record<string, number> }
export interface PlannedCall { id: string; group: string; city_id: string | null; label: string }
export interface CallState { id: string; status: 'pending' | 'done' | 'failed'; fixture_kind?: string; numbers?: string[]; ms?: number; error?: string; label: string; group: string; city_id: string | null }
export interface LogLine { at: number; kind: 'info' | 'ok' | 'fail' | 'warn'; text: string }
export interface SweepSummary { id: string; brand_id: string; brand_name: string; started_at: string; finished_at: string | null; mode: string; counts: Record<Verdict, number>; calls_made: number; fixture_kinds: Record<string, number>; city_ids: string[] }
export interface NetworkData { nodes: { id: string; type: 'brand' | 'number'; label: string; verdict?: string; score?: number; brands?: number }[]; edges: { source: string; target: string; surfaces: string[]; cities: string[] }[] }
