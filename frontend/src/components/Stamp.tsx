export function Stamp({ line1, line2, big, show }: { line1: string; line2: string; big: string; show: boolean }) {
  if (!show) return null
  return (
    <svg className="stamp in" viewBox="0 0 120 120" aria-hidden>
      <defs><path id="arc-top" d="M20 60a40 40 0 0 1 80 0" /><path id="arc-bot" d="M100 60a40 40 0 0 1 -80 0" /></defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="60" cy="60" r="49" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text fontFamily="var(--ff)" fontSize="11" fontWeight="800" letterSpacing="1.5" fill="currentColor"><textPath href="#arc-top" startOffset="50%" textAnchor="middle">{line1}</textPath></text>
      <text fontFamily="var(--ff)" fontSize="11" fontWeight="800" letterSpacing="1.5" fill="currentColor"><textPath href="#arc-bot" startOffset="50%" textAnchor="middle">{line2}</textPath></text>
      <text x="60" y="70" textAnchor="middle" fontFamily="var(--ff)" fontSize="30" fontWeight="800" fill="currentColor">{big}</text>
    </svg>
  )
}
