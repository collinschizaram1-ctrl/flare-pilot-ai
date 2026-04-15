import { useState } from 'react'
import { History as HistoryIcon, ExternalLink, Bot, ChevronDown, ChevronUp, Filter, Search, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useTransactionStore } from '../store/useTransactionStore'
import { Transaction } from '../utils/mockData'
import { formatUSD, formatTimestamp, shortenAddress } from '../utils/formatters'
import RiskBadge from '../components/ui/RiskBadge'

const TYPE_COLORS: Record<string, string> = {
  swap:     'bg-flare-blue/10   text-flare-blue',
  stake:    'bg-flare-green/10  text-flare-green',
  unstake:  'bg-flare-green/10  text-flare-green',
  transfer: 'bg-flare-yellow/10 text-flare-yellow',
  lend:     'bg-flare-purple/10 text-flare-purple',
  borrow:   'bg-flare-pink/10   text-flare-pink',
  mint:     'bg-flare-yellow/10 text-flare-yellow',
  burn:     'bg-red-500/10      text-red-400',
}

function TxRow({ tx }: { tx: Transaction }) {
  const [open, setOpen] = useState(false)
  const value = tx.details.amount
    ? (tx.details.token === 'SOL' || tx.details.from === 'SOL' ? (tx.details.amount ?? 0) * 157.4 : (tx.details.amount ?? 0))
    : 0

  return (
    <div className="glass rounded-xl overflow-hidden transition-all duration-200">
      {/* Main row */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-flare-border/20 transition-colors text-left"
      >
        {/* Status */}
        <div className="flex-shrink-0">
          {tx.status === 'confirmed' && <CheckCircle2 className="w-4 h-4 text-flare-green" />}
          {tx.status === 'failed'    && <XCircle      className="w-4 h-4 text-red-400"     />}
          {tx.status === 'pending'   && <Loader2      className="w-4 h-4 text-flare-yellow animate-spin" />}
        </div>

        {/* Type badge */}
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[tx.type] || 'bg-flare-border text-flare-muted'}`}>
          {tx.type}
        </span>

        {/* Protocol */}
        <span className="text-xs text-flare-subtext hidden sm:block flex-shrink-0 w-20 truncate">
          {tx.details.protocol ?? '—'}
        </span>

        {/* Description */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-flare-text truncate">{tx.description}</p>
        </div>

        {/* Value */}
        <span className="text-xs font-semibold text-flare-text flex-shrink-0">
          {value > 0 ? formatUSD(value) : '—'}
        </span>

        {/* Risk */}
        <RiskBadge risk={tx.riskLevel} size="xs" />

        {/* Time */}
        <span className="text-[11px] text-flare-muted hidden md:block flex-shrink-0 w-24 text-right">
          {formatTimestamp(tx.timestamp)}
        </span>

        {/* Chevron */}
        {open
          ? <ChevronUp   className="w-4 h-4 text-flare-muted flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-flare-muted flex-shrink-0" />
        }
      </button>

      {/* Expanded details */}
      {open && (
        <div className="border-t border-flare-border/50 px-4 py-4 space-y-3">
          {/* AI Summary */}
          <div className="bg-flare-purple/5 border border-flare-purple/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Bot className="w-3.5 h-3.5 text-flare-purple" />
              <p className="text-[11px] font-semibold text-flare-purple">AI Analysis</p>
            </div>
            <p className="text-[11px] text-flare-subtext leading-relaxed">{tx.aiSummary}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tx.details.from && (
              <div className="glass rounded-xl p-2.5">
                <p className="text-[10px] text-flare-muted">From</p>
                <p className="text-xs font-medium text-flare-text mt-0.5">{tx.details.from}</p>
              </div>
            )}
            {tx.details.to && (
              <div className="glass rounded-xl p-2.5">
                <p className="text-[10px] text-flare-muted">To</p>
                <p className="text-xs font-medium text-flare-text mt-0.5 truncate">
                  {(tx.details.to).length > 12 ? shortenAddress(tx.details.to, 6) : tx.details.to}
                </p>
              </div>
            )}
            {tx.fee > 0 && (
              <div className="glass rounded-xl p-2.5">
                <p className="text-[10px] text-flare-muted">Network Fee</p>
                <p className="text-xs font-medium text-flare-text mt-0.5">{tx.fee.toFixed(6)} SOL</p>
              </div>
            )}
          </div>

          {/* Signature & links */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-flare-muted mb-0.5">Signature</p>
              <p className="font-mono text-[10px] text-flare-subtext">{shortenAddress(tx.signature, 12)}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-[11px] flex items-center gap-1 py-1"
              >
                <ExternalLink className="w-3 h-3" /> Explorer
              </a>
              <a
                href={`https://solscan.io/tx/${tx.signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-[11px] flex items-center gap-1 py-1"
              >
                <ExternalLink className="w-3 h-3" /> Solscan
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function History() {
  const { history } = useTransactionStore()
  const [search,    setSearch]    = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')

  const filtered = history.filter(tx => {
    const matchType = typeFilter === 'all' || tx.type === typeFilter
    const matchRisk = riskFilter === 'all' || tx.riskLevel === riskFilter
    const matchSearch = !search
      || tx.signature.toLowerCase().includes(search.toLowerCase())
      || tx.description.toLowerCase().includes(search.toLowerCase())
      || (tx.details.protocol ?? '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchRisk && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-flare-text">Transaction History</h1>
          <p className="text-sm text-flare-subtext mt-1">AI-analyzed log of all on-chain activity</p>
        </div>
        <div className="glass rounded-xl px-3 py-2 text-xs text-flare-subtext">
          {filtered.length} transactions
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-flare-muted" />
          <input
            type="text"
            placeholder="Search by hash, protocol, token..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field w-full pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 glass rounded-xl px-3">
            <Filter className="w-3.5 h-3.5 text-flare-muted" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-transparent text-xs text-flare-subtext outline-none py-2">
              <option value="all">All Types</option>
              {['swap','stake','transfer','lend','borrow'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1.5 glass rounded-xl px-3">
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="bg-transparent text-xs text-flare-subtext outline-none py-2">
              <option value="all">All Risks</option>
              {['low','medium','high'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden md:flex items-center gap-3 px-4 py-2 text-[10px] font-semibold text-flare-muted uppercase tracking-wider">
        <span className="w-4" />
        <span className="w-16">Type</span>
        <span className="w-20">Protocol</span>
        <span className="flex-1">Tokens</span>
        <span className="w-20 text-right">Value</span>
        <span className="w-20">Risk</span>
        <span className="w-24 text-right hidden md:block">Time</span>
        <span className="w-4" />
      </div>

      {/* Transactions */}
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map(tx => <TxRow key={tx.signature} tx={tx} />)
        ) : (
          <div className="glass rounded-2xl p-12 flex flex-col items-center gap-3">
            <HistoryIcon className="w-10 h-10 text-flare-muted/30" />
            <p className="text-sm text-flare-muted">No transactions found</p>
            <p className="text-xs text-flare-muted/60">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
