import { useEffect } from 'react'
import {
  Wallet, TrendingUp, Coins, ShieldCheck, Bot, ArrowRight,
  Activity, Layers, Zap
} from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts'
import { useWalletStore }     from '../store/useWalletStore'
import { useNotificationStore } from '../store/useNotificationStore'
import { analyzePortfolio }   from '../utils/aiMock'
import { formatUSD, formatToken, formatChange, changeColor, formatAPY } from '../utils/formatters'
import { PORTFOLIO_HISTORY_7D, MOCK_SMART_ACTIONS, MOCK_NOTIFICATIONS } from '../utils/mockData'
import StatCard  from '../components/ui/StatCard'
import RiskBadge from '../components/ui/RiskBadge'
import Spinner   from '../components/ui/Spinner'
import { Link }  from 'react-router-dom'

export default function Dashboard() {
  const { tokens, totalUSD, allocation, portfolioInsight, insightLoading, setPortfolioInsight, setInsightLoading } = useWalletStore()
  const { notifications, addNotification } = useNotificationStore()

  // Seed notifications on first load
  useEffect(() => {
    if (notifications.length === 0) {
      MOCK_NOTIFICATIONS.forEach(n => addNotification(n))
    }
  }, [])

  // Load AI portfolio insight
  useEffect(() => {
    if (!portfolioInsight) {
      setInsightLoading(true)
      analyzePortfolio(totalUSD, allocation).then(insight => {
        setPortfolioInsight(insight)
        setInsightLoading(false)
      })
    }
  }, [])

  const change24h = tokens.reduce((s, t) => s + (t.usdValue * t.change24h / 100), 0)
  const changePct = (change24h / (totalUSD - change24h)) * 100

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-flare-text">Portfolio Overview</h1>
          <p className="text-sm text-flare-subtext mt-1">AI-powered Solana wallet intelligence</p>
        </div>
        <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-flare-green animate-pulse" />
          <span className="text-xs text-flare-subtext">Demo Mode</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Portfolio"
          value={formatUSD(totalUSD)}
          change={changePct}
          icon={Wallet}
          iconColor="bg-flare-purple/20 text-flare-purple"
          gradient
        />
        <StatCard
          title="24h P&L"
          value={`${change24h >= 0 ? '+' : ''}${formatUSD(Math.abs(change24h))}`}
          change={changePct}
          icon={TrendingUp}
          iconColor="bg-flare-green/20 text-flare-green"
        />
        <StatCard
          title="Tokens Held"
          value={String(tokens.length)}
          icon={Coins}
          iconColor="bg-flare-yellow/20 text-flare-yellow"
          detail="Across 6 protocols"
        />
        <StatCard
          title="AI Health Score"
          value={insightLoading ? '—' : `${portfolioInsight?.healthScore ?? 0}/100`}
          icon={ShieldCheck}
          iconColor="bg-flare-blue/20 text-flare-blue"
          detail={portfolioInsight?.healthLabel}
        />
      </div>

      {/* Portfolio chart + AI insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-flare-text">Portfolio Value (7d)</p>
              <p className="text-xs text-flare-muted mt-0.5">Historical performance</p>
            </div>
            <span className={`text-sm font-bold ${changeColor(changePct)}`}>
              {formatChange(changePct)} this week
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={PORTFOLIO_HISTORY_7D}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7B61FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7B61FF" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#5A5A7A', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5A5A7A', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} width={50} />
              <Tooltip
                contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A4A', borderRadius: 12, color: '#E0E0FF', fontSize: 12 }}
                formatter={(v: number) => [formatUSD(v), 'Portfolio']}
              />
              <Area type="monotone" dataKey="value" stroke="#7B61FF" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Portfolio Insight */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-flare-purple/20 rounded-lg">
              <Bot className="w-4 h-4 text-flare-purple" />
            </div>
            <p className="text-sm font-semibold text-flare-text">AI Analysis</p>
          </div>

          {insightLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <Spinner size="lg" />
              <p className="text-xs text-flare-muted">Analyzing portfolio...</p>
            </div>
          ) : portfolioInsight ? (
            <div className="space-y-3">
              {/* Score ring */}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#2A2A4A" strokeWidth="5" />
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#7B61FF" strokeWidth="5"
                      strokeDasharray={`${(portfolioInsight.healthScore / 100) * 138.2} 138.2`}
                      strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-flare-text">
                    {portfolioInsight.healthScore}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-flare-text">{portfolioInsight.healthLabel}</p>
                  <p className="text-[11px] text-flare-muted">Diversification: {portfolioInsight.diversification}%</p>
                </div>
              </div>

              {/* Top suggestion */}
              <div className="bg-flare-purple/10 border border-flare-purple/20 rounded-xl p-3">
                <p className="text-[11px] text-flare-purple font-semibold mb-1">Top Suggestion</p>
                <p className="text-[11px] text-flare-subtext leading-relaxed">{portfolioInsight.topSuggestion}</p>
              </div>

              {/* Strengths */}
              <div>
                <p className="text-[10px] text-flare-muted uppercase tracking-wider mb-1.5">Strengths</p>
                {portfolioInsight.strengths.slice(0, 2).map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-flare-green flex-shrink-0" />
                    <p className="text-[11px] text-flare-subtext">{s}</p>
                  </div>
                ))}
              </div>

              {/* Weaknesses */}
              <div>
                <p className="text-[10px] text-flare-muted uppercase tracking-wider mb-1.5">Watch Out</p>
                {portfolioInsight.weaknesses.slice(0, 2).map((w, i) => (
                  <div key={i} className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-flare-yellow flex-shrink-0" />
                    <p className="text-[11px] text-flare-subtext">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Token allocation + balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Allocation pie */}
        <div className="glass rounded-2xl p-5">
          <p className="text-sm font-semibold text-flare-text mb-4">Allocation</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={allocation} cx="50%" cy="50%" innerRadius={45} outerRadius={68}
                dataKey="value" paddingAngle={2}>
                {allocation.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A4A', borderRadius: 12, color: '#E0E0FF', fontSize: 12 }}
                formatter={(v: number) => [`${v.toFixed(1)}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {allocation.map((a, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                <span className="text-[11px] text-flare-subtext truncate">{a.name}</span>
                <span className="text-[11px] text-flare-muted ml-auto">{a.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Token list */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-flare-text">Token Balances</p>
            <div className="flex items-center gap-1 text-xs text-flare-muted">
              <Activity className="w-3.5 h-3.5" />
              Live prices
            </div>
          </div>
          <div className="space-y-3">
            {tokens.map((tok) => (
              <div key={tok.mint} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden"
                  style={{ background: tok.color + '22', border: `1px solid ${tok.color}44` }}>
                  <img src={tok.logoUrl} alt={tok.symbol} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-flare-text">{tok.symbol}</p>
                  <p className="text-[11px] text-flare-muted truncate">{formatToken(tok.balance, tok.symbol)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-flare-text">{formatUSD(tok.usdValue)}</p>
                  <p className={`text-[11px] font-medium ${changeColor(tok.change24h)}`}>
                    {formatChange(tok.change24h)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick action cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-flare-text">Recommended Actions</p>
          <Link to="/suggestions" className="text-xs text-flare-purple hover:text-flare-purple/80 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MOCK_SMART_ACTIONS.slice(0, 3).map(action => (
            <Link key={action.id} to="/suggestions" className="glass glass-hover rounded-2xl p-4 block group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-flare-purple/20 rounded-lg">
                    <Layers className="w-3.5 h-3.5 text-flare-purple" />
                  </div>
                  <span className="text-xs font-semibold text-flare-text">{action.protocol}</span>
                </div>
                {action.urgency === 'hot' && (
                  <span className="flex items-center gap-1 text-[10px] bg-flare-pink/20 text-flare-pink px-1.5 py-0.5 rounded-full font-semibold">
                    <Zap className="w-2.5 h-2.5" /> Hot
                  </span>
                )}
              </div>
              <p className="text-xs text-flare-text font-medium mb-1">{action.title}</p>
              <p className="text-[11px] text-flare-muted mb-2 line-clamp-2">{action.description}</p>
              <div className="flex items-center justify-between">
                {action.apy > 0 && (
                  <span className="text-sm font-bold text-flare-green">{formatAPY(action.apy)}</span>
                )}
                <RiskBadge risk={action.risk} size="xs" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
