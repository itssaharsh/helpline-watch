import type { Surface, Verdict } from './types'

export const SURFACE_LABEL: Record<Surface, string> = {
  search_organic: 'search result', search_ads: 'search ad', search_local: 'local pack', search_knowledge: 'knowledge panel',
  search_paa: 'People also ask', search_answer: 'answer box', maps: 'Maps listing', ads_transparency: 'Ads Transparency', reverse: 'reverse lookup',
}

export const SIGNAL_LABEL: Record<string, string> = {
  NOT_IN_OFFICIAL_LIST: 'not an official number', LOOKALIKE_OF_OFFICIAL: 'one digit off an official number', MOBILE_AS_HELPLINE: 'a mobile posing as a helpline', UGC_ON_OFFICIAL_DOMAIN: 'a user-made listing on the brand\'s own site', REVERSE_ON_OFFICIAL_DOMAIN: 'the brand\'s own site lists it',
  LISTING_NAMED_AS_HELPLINE: 'listing named like a helpline', THIN_OR_UNCLAIMED_LISTING: 'thin or unclaimed listing', CROSS_BRAND: 'confirmed fake for other brands',
  SEEN_FOR_OTHER_BRANDS: 'seen for other brands', MULTI_CITY: 'planted in three or more cities', AD_FROM_NON_OFFICIAL_DOMAIN: 'inside an ad the brand did not buy',
  SCAM_WORDS_IN_CONTEXT: 'fraud words around it', REVERSE_LOOKUP: 'complaints found on reverse lookup', OFFICIAL_MATCH: 'matches the official list', ON_OFFICIAL_DOMAIN: 'on the brand’s own site',
}

export const VERDICT_TAG: Record<Verdict, string> = { fake: 'Fake', review: 'Check', official: 'Official', official_unlisted: 'Unlisted' }

export function reasonFor(signals: { code: string; weight: number; detail: string }[]): string {
  const strong = [...signals].filter((s) => s.weight > 0).sort((a, b) => b.weight - a.weight)[0]
  const pick = strong ?? signals[0]
  return pick ? (SIGNAL_LABEL[pick.code] ?? pick.detail) : ''
}
