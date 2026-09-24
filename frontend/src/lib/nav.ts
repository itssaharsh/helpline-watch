/** Client-side navigation for the two routes, so the console can open without a page reload. */
export function navigate(to: string) {
  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event('hw:navigate'))
}
export function onInternalClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href') ?? ''
  if (!href.startsWith('/') || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  navigate(href)
}
