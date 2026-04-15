import { useState } from 'react'
import {
  Bot, ArrowDown, ArrowUp, ShieldCheck, ShieldAlert, ShieldX,
  CheckCircle2, AlertTriangle, XCircle, Terminal, Lightbulb, Code2
} from 'lucide-react'
import { SimulationResult } from '../../utils/aiMock'
import { formatUSD } from '../../utils/formatters'
import RiskBadge from './RiskBadge'

interface Props {
  result: SimulationResult
  onConfirm?: () => void
  onCancel?:  () => void
  showActions?: boolean
}

const RISK_ICONS = {
  low:    <ShieldCheck className="w-5 h-5 text-flare-green"  />,
  medium: <ShieldAlert className="w-5 h-5 text-flare-yellow" />,
  high:   <ShieldX     className="w-5 h-5 text-red-400"      />,
}
const RISK_BG = {
  low:    'border-flare-green/30  bg-flare-green/5',
  medium: 'border-flare-yellow/30 bg-flare-yellow/5',
  high:   'border-red-500/30      bg-red-500/5',
}

export default function SimulationCard({ result, onConfirm, onCancel, showActions = true }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* Risk header */}
      <div className={`glass border rounded-2xl p-4 ${RISK_BG[result.riskLevel]}`}>
        <div className="flex items-start gap-3">
          {RISK_ICONS[result.riskLevel]}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-flare-text">Transaction Analysis</span>
              <RiskBadge risk={result.riskLevel} />
              <span className="ml-auto text-[11px] text-flare-muted">
                Confidence: <span className="text-flare-green font-semibold">{result.confidenceScore}%</span>
              </span>
            </div>
            <div className="text-xs text-flare-subtext space-y-0.5">
              {result.riskReasons.map((r, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {result.riskLevel === 'low'
                    ? <CheckCircle2 className="w-3 h-3 text-flare-green flex-shrink-0" />
                    : result.riskLevel === 'medium'
                    ? <AlertTriangle className="w-3 h-3 text-flare-yellow flex-shrink-0" />
                    : <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                  }
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Token changes */}
      {result.tokenChanges.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <p className="text-xs font-semibold text-flare-subtext uppercase tracking-wider mb-3">Token Changes</p>
          <div className="space-y-2">
            {result.tokenChanges.map((tc, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-lg ${tc.direction === 'in' ? 'bg-flare-green/10' : 'bg-red-500/10'}`}>
                    {tc.direction === 'in'
                      ? <ArrowDown className="w-3 h-3 text-flare-green" />
                      : <ArrowUp   className="w-3 h-3 text-red-400"     />
                    }
                  </div>
                  <span className="text-sm font-semibold text-flare-text">
                    {tc.direction === 'in' ? '+' : '−'}{tc.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {tc.token}
                  </span>
                </div>
                <span className={`text-xs font-medium ${tc.direction === 'in' ? 'text-flare-green' : 'text-red-400'}`}>
                  {tc.direction === 'in' ? '+' : '−'}{formatUSD(tc.usdValue)}
                </span>
              </div>
            ))}
          </div>

          {/* Fee */}
          <div className="mt-3 pt-3 border-t border-flare-border/50 flex items-center justify-between">
            <span className="text-xs text-flare-muted">Network Fee</span>
            <span className="text-xs text-flare-subtext">
              {result.estimatedFee.toFixed(6)} SOL ({formatUSD(result.feesUSD)})
            </span>
          </div>
        </div>
      )}

      {/* Programs */}
      <div className="glass rounded-2xl p-4">
        <p className="text-xs font-semibold text-flare-subtext uppercase tracking-wider mb-3 flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5" />
          Programs Invoked
        </p>
        <div className="space-y-2">
          {result.programsUsed.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.verified ? 'bg-flare-green' : 'bg-red-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-flare-text">{p.name}</p>
                <p className="text-[10px] text-flare-muted font-mono truncate">{p.address.slice(0, 20)}...</p>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.verified ? 'bg-flare-green/10 text-flare-green' : 'bg-red-500/10 text-red-400'}`}>
                {p.verified ? 'Verified' : 'Unknown'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Explanation */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-4 h-4 text-flare-purple" />
          <p className="text-xs font-semibold gradient-text">AI Explanation</p>
        </div>
        <p className="text-xs text-flare-subtext leading-relaxed"
           dangerouslySetInnerHTML={{ __html: result.aiExplanation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-flare-text">$1</strong>') }}
        />
      </div>

      {/* Recommendation */}
      <div className="glass rounded-2xl p-4 border border-flare-blue/20 bg-flare-blue/5">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-flare-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-flare-blue mb-1">AI Recommendation</p>
            <p className="text-xs text-flare-subtext leading-relaxed">{result.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Simulation Logs (collapsible) */}
      <div className="glass rounded-2xl overflow-hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-2 px-4 py-3 text-xs text-flare-subtext hover:text-flare-text transition-colors"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-medium">Simulation Logs</span>
          <span className={`ml-auto text-flare-muted transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {open && (
          <div className="px-4 pb-4 font-mono text-[11px] text-flare-green/80 bg-black/30 rounded-b-2xl">
            {result.simulationLogs.map((log, i) => (
              <div key={i} className="py-0.5">{log}</div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (onConfirm || onCancel) && (
        <div className="flex gap-3">
          {onCancel && (
            <button onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
          )}
          {onConfirm && (
            <button onClick={onConfirm} className={`flex-1 font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200 active:scale-95 ${
              result.riskLevel === 'high'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : 'btn-primary'
            }`}>
              {result.riskLevel === 'high' ? 'Proceed with Risk' : 'Confirm Transaction'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
