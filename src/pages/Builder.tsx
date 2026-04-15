import { useState } from 'react'
import { Wrench, CheckCircle2, AlertCircle, Zap, Copy, ExternalLink, RotateCcw } from 'lucide-react'
import { useTransactionStore, TxBuilderType } from '../store/useTransactionStore'
import { simulateTransaction } from '../utils/aiMock'
import { useNotificationStore } from '../store/useNotificationStore'
import { formatUSD, shortenAddress } from '../utils/formatters'
import SimulationCard from '../components/ui/SimulationCard'
import Spinner from '../components/ui/Spinner'
import { Transaction } from '../utils/mockData'

const TOKENS_LIST = ['SOL', 'USDC', 'USDT', 'JUP', 'BONK', 'mSOL', 'RAY', 'ORCA']

type Step = 'configure' | 'simulate' | 'confirm' | 'success'

function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
            i < current  ? 'bg-flare-green text-white' :
            i === current ? 'bg-flare-purple text-white shadow-glow-purple' :
            'bg-flare-border text-flare-muted'
          }`}>
            {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>
          <span className={`text-xs ${i === current ? 'text-flare-text font-semibold' : 'text-flare-muted'}`}>
            {label}
          </span>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px w-6 ${i < current ? 'bg-flare-green' : 'bg-flare-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Builder() {
  const { draft, updateDraft, resetDraft, simulation, setSimulation, setSimLoading, simulationLoading, addToHistory } = useTransactionStore()
  const { addNotification } = useNotificationStore()
  const [step, setStep]     = useState<Step>('configure')
  const [txHash, setTxHash] = useState('')
  const [error, setError]   = useState('')
  const [copied, setCopied] = useState(false)

  const TX_TYPES: { value: TxBuilderType; label: string; icon: string }[] = [
    { value: 'swap',     label: 'Swap Tokens',    icon: '⇄'  },
    { value: 'stake',    label: 'Stake SOL',      icon: '↑'  },
    { value: 'transfer', label: 'Send Tokens',    icon: '→'  },
    { value: 'lend',     label: 'Lend Assets',    icon: '＋' },
    { value: 'borrow',   label: 'Borrow Assets',  icon: '↓'  },
  ]

  const STEPS = ['Configure', 'Simulate', 'Review & Sign', 'Complete']

  const handleSimulate = async () => {
    setError('')
    if (!draft.amount || Number(draft.amount) <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    setSimLoading(true)
    setSimulation(null)
    setStep('simulate')
    try {
      const result = await simulateTransaction(draft.type, {
        amount:    Number(draft.amount),
        fromToken: draft.fromToken,
        toToken:   draft.toToken,
        token:     draft.fromToken,
        recipient: draft.recipient || 'DkZ5xmT9q2P8aBnReVNJ4MuCfLz7WY3Km4R2',
        protocol:  draft.protocol,
        slippage:  Number(draft.slippage),
        collateral: Number(draft.collateral),
      })
      setSimulation(result)
      setStep('confirm')
    } catch {
      setError('Simulation failed.')
      setStep('configure')
    } finally {
      setSimLoading(false)
    }
  }

  const handleBroadcast = () => {
    // Mock broadcast — generate a fake hash
    const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    setTxHash(hash)
    setStep('success')

    // Add to history using the correct Transaction shape
    const amt = Number(draft.amount)
    const newTx: Transaction = {
      signature:   hash,
      type:        draft.type as Transaction['type'],
      status:      'confirmed',
      timestamp:   Date.now(),
      fee:         0.000005,
      description: draft.type === 'swap'
        ? `Swap ${amt} ${draft.fromToken} → ${draft.toToken} via ${draft.protocol || 'Jupiter'}`
        : `${draft.type.charAt(0).toUpperCase() + draft.type.slice(1)} ${amt} ${draft.fromToken} via ${draft.protocol || 'Solana'}`,
      details: {
        from:     draft.fromToken,
        to:       draft.type === 'swap' ? draft.toToken : draft.recipient || undefined,
        amount:   amt,
        token:    draft.fromToken,
        toToken:  draft.toToken || undefined,
        protocol: draft.protocol || undefined,
      },
      aiSummary:   simulation?.aiExplanation?.replace(/\*\*(.*?)\*\*/g, '$1').slice(0, 180) ?? 'Transaction completed.',
      riskLevel:   simulation?.riskLevel ?? 'low',
    }
    addToHistory(newTx)

    addNotification({
      type:    'transaction',
      title:   'Transaction Broadcast',
      message: `Your ${draft.type} transaction was signed and broadcast to devnet.`,
      time:    Date.now(),
      read:    false,
    })
  }

  const handleReset = () => {
    resetDraft()
    setSimulation(null)
    setStep('configure')
    setTxHash('')
    setError('')
  }

  const copyHash = () => {
    navigator.clipboard.writeText(txHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stepIndex = { configure: 0, simulate: 1, confirm: 2, success: 3 }[step]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-flare-text">Transaction Builder</h1>
        <p className="text-sm text-flare-subtext mt-1">Build, simulate, and sign Solana transactions with AI guidance</p>
      </div>

      <StepIndicator steps={STEPS} current={stepIndex} />

      {/* Configure */}
      {step === 'configure' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Type */}
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold text-flare-subtext uppercase tracking-wider mb-3">Transaction Type</p>
              <div className="grid grid-cols-2 gap-2">
                {TX_TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => updateDraft({ type: t.value })}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                      draft.type === t.value
                        ? 'bg-flare-purple text-white shadow-glow-purple'
                        : 'glass text-flare-subtext hover:text-flare-text'
                    }`}
                  >
                    <span className="text-base leading-none">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <p className="text-xs font-semibold text-flare-subtext uppercase tracking-wider">Details</p>

              <div>
                <label className="block text-xs text-flare-muted mb-1.5">Amount</label>
                <input type="number" placeholder="0.00" value={draft.amount}
                  onChange={e => updateDraft({ amount: e.target.value })}
                  className="input-field w-full" />
              </div>

              {draft.type === 'swap' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-flare-muted mb-1.5">From</label>
                    <select value={draft.fromToken} onChange={e => updateDraft({ fromToken: e.target.value })} className="input-field w-full">
                      {TOKENS_LIST.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-flare-muted mb-1.5">To</label>
                    <select value={draft.toToken} onChange={e => updateDraft({ toToken: e.target.value })} className="input-field w-full">
                      {TOKENS_LIST.filter(t => t !== draft.fromToken).map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {draft.type === 'transfer' && (
                <div>
                  <label className="block text-xs text-flare-muted mb-1.5">Recipient Address</label>
                  <input type="text" placeholder="Solana wallet address" value={draft.recipient}
                    onChange={e => updateDraft({ recipient: e.target.value })}
                    className="input-field w-full font-mono text-xs" />
                </div>
              )}

              {draft.type === 'stake' && (
                <div>
                  <label className="block text-xs text-flare-muted mb-1.5">Staking Protocol</label>
                  <select value={draft.protocol} onChange={e => updateDraft({ protocol: e.target.value })} className="input-field w-full">
                    {['Marinade', 'Jito', 'Lido'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              )}

              {(draft.type === 'lend' || draft.type === 'borrow') && (
                <>
                  <div>
                    <label className="block text-xs text-flare-muted mb-1.5">Token</label>
                    <select value={draft.fromToken} onChange={e => updateDraft({ fromToken: e.target.value })} className="input-field w-full">
                      {TOKENS_LIST.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-flare-muted mb-1.5">Protocol</label>
                    <select value={draft.protocol} onChange={e => updateDraft({ protocol: e.target.value })} className="input-field w-full">
                      {['Kamino', 'MarginFi', 'Solend'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                </div>
              )}

              <button onClick={handleSimulate} className="btn-primary w-full flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Simulate & Analyze
              </button>
            </div>
          </div>

          {/* Help panel */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-4 h-4 text-flare-purple" />
              <p className="text-sm font-semibold text-flare-text">How It Works</p>
            </div>
            <ol className="space-y-4">
              {[
                { title: 'Configure', desc: 'Choose your transaction type and fill in the parameters.' },
                { title: 'AI Simulation', desc: 'Our AI analyzes the transaction for risk, token flows, and program safety.' },
                { title: 'Review & Sign', desc: 'Inspect the full simulation report before signing.' },
                { title: 'Broadcast', desc: 'Transaction is broadcast to Solana devnet. Fully traceable on-chain.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-flare-purple/20 text-flare-purple text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-flare-text">{item.title}</p>
                    <p className="text-[11px] text-flare-muted mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Simulating */}
      {step === 'simulate' && (
        <div className="glass rounded-2xl p-12 flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <Spinner size="lg" className="w-16 h-16" />
            <Wrench className="absolute inset-0 m-auto w-6 h-6 text-flare-purple" />
          </div>
          <p className="text-sm font-semibold text-flare-text">Simulating Transaction</p>
          <p className="text-xs text-flare-muted">AI is inspecting programs, token flows, and risk factors...</p>
        </div>
      )}

      {/* Review */}
      {step === 'confirm' && simulation && (
        <div className="max-w-2xl">
          <SimulationCard
            result={simulation}
            onConfirm={handleBroadcast}
            onCancel={handleReset}
          />
        </div>
      )}

      {/* Success */}
      {step === 'success' && (
        <div className="max-w-lg mx-auto glass rounded-2xl p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-flare-green/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-flare-green" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-flare-text">Transaction Broadcast!</h2>
            <p className="text-xs text-flare-muted mt-1">Your transaction was successfully sent to Solana devnet.</p>
          </div>

          <div className="bg-flare-border/30 rounded-xl p-3">
            <p className="text-[10px] text-flare-muted uppercase tracking-wider mb-1.5">Transaction Signature</p>
            <p className="font-mono text-[10px] text-flare-subtext break-all">{txHash}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={copyHash} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-xs">
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied!' : 'Copy Hash'}
            </button>
            <a
              href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex-1 flex items-center justify-center gap-2 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Explorer
            </a>
          </div>

          <button onClick={handleReset} className="btn-primary w-full flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> New Transaction
          </button>
        </div>
      )}
    </div>
  )
}
