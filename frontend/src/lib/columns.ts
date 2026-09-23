import type { Surface } from './types'

export const COLUMNS = [
  { id: 'search', title: 'Search', hint: 'organic · knowledge panel · answer box' },
  { id: 'paa', title: 'People also ask', hint: 'question snippets' },
  { id: 'maps', title: 'Maps & local pack', hint: 'business listings' },
  { id: 'ads', title: 'Ads', hint: 'search ads · Ads Transparency' },
] as const
export type ColumnId = (typeof COLUMNS)[number]['id']

export function columnFor(surface: Surface): ColumnId {
  switch (surface) {
    case 'search_paa': return 'paa'
    case 'maps': case 'search_local': return 'maps'
    case 'search_ads': case 'ads_transparency': return 'ads'
    default: return 'search'
  }
}

export function groupToColumn(group: string): ColumnId | null {
  if (group === 'search' || group === 'hindi') return 'search'
  if (group === 'maps') return 'maps'
  if (group === 'ads') return 'ads'
  return null
}

export const SURFACE_LABEL: Record<Surface, string> = {
  search_organic: 'Search result', search_ads: 'Search ad', search_local: 'Local pack', search_knowledge: 'Knowledge panel',
  search_paa: 'People also ask', search_answer: 'Answer box', maps: 'Maps listing', ads_transparency: 'Ads Transparency', reverse: 'Reverse lookup',
}

export const SIGNAL_LABEL: Record<string, string> = {
  NOT_IN_OFFICIAL_LIST: 'Not an official number', LOOKALIKE_OF_OFFICIAL: 'One digit off an official number', MOBILE_AS_HELPLINE: 'Mobile posing as helpline',
  LISTING_NAMED_AS_HELPLINE: 'Listing named as a helpline', THIN_OR_UNCLAIMED_LISTING: 'Thin or unclaimed listing', CROSS_BRAND: 'Same number, other brands',
  SEEN_FOR_OTHER_BRANDS: 'Seen for other brands (unconfirmed)', MULTI_CITY: 'Planted in 3+ cities', AD_FROM_NON_OFFICIAL_DOMAIN: 'Inside a non-official ad', SCAM_WORDS_IN_CONTEXT: 'Fraud words around it',
  REVERSE_LOOKUP: 'Complaints found on reverse lookup', OFFICIAL_MATCH: 'Official number', ON_OFFICIAL_DOMAIN: 'On the brand’s own site',
}

export const VERDICT_LABEL: Record<string, string> = { fake: 'Fake', review: 'Needs review', official: 'Official', official_unlisted: 'Official (unlisted)' }
