// ─────────────────────────────────────────────────────────────
// Shared formatting utilities
// ─────────────────────────────────────────────────────────────

export function formatUSD(value: number, compact = false): string {
  if (compact && value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (compact && value >= 1_000)     return `$${(value / 1_000).toFixed(1)}K`
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: value < 0.01 ? 6 : value < 1 ? 4 : 2,
    maximumFractionDigits: value < 0.01 ? 6 : value < 1 ? 4 : 2,
  }).format(value)
}

export function formatToken(amount: number, symbol: string): string {
  if (amount === 0) return `0 ${symbol}`
  if (symbol === 'BONK' || amount > 100_000) {
    return `${new Intl.NumberFormat('en-US').format(Math.round(amount))} ${symbol}`
  }
  if (amount < 0.001) return `${amount.toExponential(3)} ${symbol}`
  const decimals = amount < 1 ? 4 : amount < 100 ? 3 : 2
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(amount)} ${symbol}`
}

export function formatSOL(lamports: number): string {
  return `${(lamports / 1e9).toFixed(6)} SOL`
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000)      return 'just now'
  if (diff < 3_600_000)   return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000)  return `${Math.floor(diff / 3_600_000)}h ago`
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatAPY(apy: number): string {
  return `${apy.toFixed(1)}%`
}

export function formatChange(pct: number): string {
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(2)}%`
}

export function changeColor(pct: number): string {
  return pct >= 0 ? 'text-flare-green' : 'text-red-400'
}
