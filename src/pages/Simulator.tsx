import { useState } from 'react'
import { FlaskConical, ChevronDown, Sparkles } from 'lucide-react'
import { useTransactionStore, TxBuilderType } from '../store/useTransactionStore'
import { simulateTransaction } from '../utils/aiMock'
import SimulationCard from '../components/ui/SimulationCard'
import Spinner from '../components/ui/Spinner'
const TOKENS_LIST = ['SOL', 'USDC', 'USDT', 'JUP', 'BONK', 'mSOL', 'RAY', 'ORCA']

const TX_TYPES: { value: TxBuilderType; label: string }[] = [
  { value: 'swap',     label: 'Token Swap'      },
  { value: 'stake',    label: 'Liquid Stake'    },
  { value: 'transfer', label: 'Transfer / Send' },
  { value: 'lend',     label: 'Lend / Supply'   },
  { value: 'borrow',   label: 'Borrow'          },
]

const PROTOCOLS: Record<TxBuilderType, string[]> = {
  swap:     ['Jupiter', 'Orca', 'Raydium'],
  stake:    ['Marinade', 'Jito', 'Lido'],
  transfer: [],
  lend:     ['Kamino', 'MarginFi', 'Solend'],
  borrow:   ['MarginFi', 'Kamino', 'Solend'],
}

export default function Simulator() {
  const { draft, updateDraft, simulation, simulationLoading, setSimulation, setSimLoading } = useTransactionStore()
  const [error, setError] = useState('')

  const runSimulation = async () => {
    setError('')
    if (!draft.amount || Number(draft.amount) <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    setSimLoading(true)
    setSimulation(null)
    try {
      const result = await simulateTransaction(draft.type, {
        amount:     Number(draft.amount),
        fromToken:  draft.fromToken,
        toToken:    draft.toToken,
        token:      draft.fromToken,
        recipient:  draft.recipient || 'DkZ...m4R2',
        protocol:   draft.protocol,
        slippage:   Number(draft.slippage),
        collateral: Number(draft.collateral),
      })
      setSimulation(result)
    } catch (e) {
      setError('Simulation failed. Please try again.')
    } finally {
      setSimLoading(false)
    }
  }

  const protocols = PROTOCOLS[draft.type]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-flare-text">Transaction Simulator</h1>
        <p className="text-sm text-flare-subtext mt-1">Preview any transaction with AI risk analysis before signing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration panel */}
        <div className="space-y-4">
          {/* TX Type selector */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold text-flare-subtext uppercase tracking-wider mb-3">Transaction Type</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TX_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => { updateDraft({ type: t.value }); setSimulation(null) }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    draft.type === t.value
                      ? 'bg-flare-purple text-white shadow-glow-purple'
                      : 'glass text-flare-subtext hover:text-flare-text'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <p className="text-xs font-semibold text-flare-subtext uppercase tracking-wider">Parameters</p>

            {/* Amount */}
            <div>
              <label className="block text-xs text-flare-muted mb-1.5">Amount</label>
              <input
                type="number"
                placeholder="0.00"
                value={draft.amount}
                onChange={e => { updateDraft({ amount: e.target.value }); setSimulation(null) }}
                className="input-field w-full"
              />
            </div>

            {/* From/to tokens for swap */}
            {draft.type === 'swap' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-flare-muted mb-1.5">From</label>
                  <div className="relative">
                    <select
                      value={draft.fromToken}
                      onChange={e => updateDraft({ fromToken: e.target.value })}
                      className="input-field w-full appearance-none pr-8"
                    >
                      {TOKENS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-flare-muted pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-flare-muted mb-1.5">To</label>
                  <div className="relative">
                    <select
                      value={draft.toToken}
                      onChange={e => updateDraft({ toToken: e.target.value })}
                      className="input-field w-full appearance-none pr-8"
                    >
                      {TOKENS_LIST.filter(t => t !== draft.fromToken).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-flare-muted pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Slippage for swap */}
            {draft.type === 'swap' && (
              <div>
                <label className="block text-xs text-flare-muted mb-1.5">Slippage Tolerance (%)</label>
                <div className="flex gap-2">
                  {['0.1', '0.5', '1.0'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateDraft({ slippage: s })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        draft.slippage === s ? 'bg-flare-purple text-white' : 'glass text-flare-subtext hover:text-flare-text'
                      }`}
                    >
                      {s}%
                    </button>
                  ))}
                  <input
                    type="number"
                    placeholder="Custom"
                    value={!['0.1','0.5','1.0'].includes(draft.slippage) ? draft.slippage : ''}
                    onChange={e => updateDraft({ slippage: e.target.value })}
                    className="input-field flex-1 py-1.5 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Token for stake/lend/borrow */}
            {(draft.type === 'lend' || draft.type === 'borrow') && (
              <div>
                <label className="block text-xs text-flare-muted mb-1.5">Token</label>
                <div className="relative">
                  <select
                    value={draft.fromToken}
                    onChange={e => updateDraft({ fromToken: e.target.value })}
                    className="input-field w-full appearance-none pr-8"
                  >
                    {TOKENS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-flare-muted pointer-events-none" />
                </div>
              </div>
            )}

            {/* Collateral for borrow */}
            {draft.type === 'borrow' && (
              <div>
                <label className="block text-xs text-flare-muted mb-1.5">Collateral (SOL)</label>
                <input
                  type="number"
                  placeholder="Amount of SOL to lock"
                  value={draft.collateral}
                  onChange={e => updateDraft({ collateral: e.target.value })}
                  className="input-field w-full"
                />
              </div>
            )}

            {/* Recipient for transfer */}
            {draft.type === 'transfer' && (
              <div>
                <label className="block text-xs text-flare-muted mb-1.5">Recipient Address</label>
                <input
                  type="text"
                  placeholder="Solana wallet address..."
                  value={draft.recipient}
                  onChange={e => updateDraft({ recipient: e.target.value })}
                  className="input-field w-full font-mono text-xs"
                />
              </div>
            )}

            {/* Protocol */}
            {protocols.length > 0 && (
              <div>
                <label className="block text-xs text-flare-muted mb-1.5">Protocol</label>
                <div className="flex gap-2 flex-wrap">
                  {protocols.map(p => (
                    <button
                      key={p}
                      onClick={() => updateDraft({ protocol: p })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        draft.protocol === p ? 'bg-flare-purple text-white' : 'glass text-flare-subtext hover:text-flare-text'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              onClick={runSimulation}
              disabled={simulationLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {simulationLoading ? (
                <><Spinner size="sm" /> Analyzing Transaction...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Simulate with AI</>
              )}
            </button>
          </div>
        </div>

        {/* Results panel */}
        <div>
          {simulationLoading ? (
            <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-4 h-64">
              <div className="relative">
                <Spinner size="lg" />
                <FlaskConical className="absolute inset-0 m-auto w-4 h-4 text-flare-purple" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-flare-text">Simulating Transaction</p>
                <p className="text-xs text-flare-muted mt-1">AI is analyzing risk, programs, and token flows...</p>
              </div>
            </div>
          ) : simulation ? (
            <SimulationCard
              result={simulation}
              showActions={false}
            />
          ) : (
            <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-4 h-64 border-2 border-dashed border-flare-border/50">
              <div className="p-3 bg-flare-purple/10 rounded-2xl">
                <FlaskConical className="w-8 h-8 text-flare-purple/60" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-flare-text">No Simulation Yet</p>
                <p className="text-xs text-flare-muted mt-1">Configure parameters and click "Simulate with AI"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
