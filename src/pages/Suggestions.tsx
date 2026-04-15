import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Lightbulb, TrendingUp, Zap, BarChart3,
  ArrowRight, RefreshCw, Star, Leaf
} from 'lucide-react'
import { useTransactionStore, TxBuilderType } from '../store/useTransactionStore'
import { MOCK_SMART_ACTIONS, SmartAction } from '../utils/mockData'
import { formatAPY } from '../utils/formatters'
import RiskBadge from '../components/ui/RiskBadge'

type Category = 'all' | 'stake' | 'lend' | 'swap' | 'rebalance' | 'farm'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all:       <Lightbulb className="w-4 h-4" />,
  stake:     <TrendingUp className="w-4 h-4" />,
  lend:      <Leaf       className="w-4 h-4" />,
  swap:      <Zap        className="w-4 h-4" />,
  rebalance: <BarChart3  className="w-4 h-4" />,
  farm:      <Star       className="w-4 h-4" />,
}

const URGENCY_STYLE: Record<string, string> = {
  hot:    'bg-flare-pink/20   text-flare-pink   border-flare-pink/30',
  new:    'bg-flare-blue/20   text-flare-blue   border-flare-blue/30',
  normal: 'bg-flare-border/50 text-flare-muted  border-flare-border',
}

// Map SmartAction.category to TxBuilderType for the builder
const CATEGORY_TO_TX: Record<string, TxBuilderType> = {
  stake:     'stake',
  lend:      'lend',
  swap:      'swap',
  rebalance: 'swap',
  farm:      'stake',
}

function ActionCard({ action, onUse }: { action: SmartAction; onUse: (a: SmartAction) => void }) {
  const urgencyStyle = URGENCY_STYLE[action.urgency] ?? URGENCY_STYLE.normal
  const urgencyLabel = action.urgency === 'hot' ? '🔥 Hot' : action.urgency === 'new' ? '✨ New' : '· Standard'

  return (
    <div className="glass glass-hover rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${urgencyStyle}`}>
              {urgencyLabel}
            </span>
            {action.badge && (
              <span className="text-[10px] font-semibold bg-flare-yellow/20 text-flare-yellow px-2 py-0.5 rounded-full">
                {action.badge}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-flare-text">{action.title}</h3>
          <p className="text-[11px] text-flare-muted mt-0.5">{action.protocol} · {action.token}</p>
        </div>
        {action.apy > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-flare-muted">APY</p>
            <p className="text-lg font-bold text-flare-green">{formatAPY(action.apy)}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-flare-subtext leading-relaxed flex-1">{action.description}</p>

      {/* TVL metric */}
      {action.tvl && (
        <div className="glass rounded-xl p-2.5">
          <p className="text-[10px] text-flare-muted">Total Value Locked</p>
          <p className="text-xs font-semibold text-flare-text mt-0.5">{action.tvl}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <RiskBadge risk={action.risk} size="xs" />
        <button
          onClick={() => onUse(action)}
          className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3"
        >
          <Zap className="w-3 h-3" /> Build TX
        </button>
      </div>
    </div>
  )
}

export default function Suggestions() {
  const navigate    = useNavigate()
  const { updateDraft } = useTransactionStore()
  const [category, setCategory] = useState<Category>('all')

  const categories: { value: Category; label: string }[] = [
    { value: 'all',       label: 'All' },
    { value: 'stake',     label: 'Stake' },
    { value: 'lend',      label: 'Lend' },
    { value: 'swap',      label: 'Swap' },
    { value: 'rebalance', label: 'Rebalance' },
    { value: 'farm',      label: 'Farm' },
  ]

  const filtered = category === 'all'
    ? MOCK_SMART_ACTIONS
    : MOCK_SMART_ACTIONS.filter(a => a.category === category)

  const handleUse = (action: SmartAction) => {
    const txType = CATEGORY_TO_TX[action.category] ?? 'swap'
    updateDraft({
      type:     txType,
      protocol: action.protocol.split(' ')[0], // "Marinade Finance" → "Marinade"
      fromToken: action.token.includes('+') ? action.token.split('+')[0].trim() : action.token,
    })
    navigate('/builder')
  }

  const topAPY = [...MOCK_SMART_ACTIONS].sort((a, b) => b.apy - a.apy)[0]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-flare-text">AI Insights & Actions</h1>
          <p className="text-sm text-flare-subtext mt-1">Smart DeFi opportunities tailored to your portfolio</p>
        </div>
        <button className="glass glass-hover rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-flare-subtext">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Featured banner */}
      {topAPY && (
        <div className="glass rounded-2xl p-5 border border-flare-green/30 bg-flare-green/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-flare-green/20 rounded-2xl flex-shrink-0">
            <Star className="w-6 h-6 text-flare-green" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-flare-green tracking-wider">Featured Opportunity</span>
            <p className="text-sm font-bold text-flare-text">{topAPY.title}</p>
            <p className="text-xs text-flare-muted mt-0.5">{topAPY.description}</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-2xl font-black text-flare-green">{formatAPY(topAPY.apy)}</p>
              <p className="text-[10px] text-flare-muted">Est. APY</p>
            </div>
            <button
              onClick={() => handleUse(topAPY)}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              category === cat.value
                ? 'bg-flare-purple text-white shadow-glow-purple'
                : 'glass text-flare-subtext hover:text-flare-text'
            }`}
          >
            {CATEGORY_ICONS[cat.value]} {cat.label}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-flare-muted">{filtered.length} opportunities</span>
      </div>

      {/* Action grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(action => (
          <ActionCard key={action.id} action={action} onUse={handleUse} />
        ))}
      </div>
    </div>
  )
}
