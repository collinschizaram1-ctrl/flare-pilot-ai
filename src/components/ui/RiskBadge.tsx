type Risk = 'low' | 'medium' | 'high'

const MAP: Record<Risk, string> = {
  low:    'badge-risk-low',
  medium: 'badge-risk-medium',
  high:   'badge-risk-high',
}
const LABEL: Record<Risk, string> = {
  low:    'Low Risk',
  medium: 'Medium Risk',
  high:   'High Risk',
}

export default function RiskBadge({ risk, size = 'sm' }: { risk: Risk; size?: 'sm' | 'xs' }) {
  return (
    <span className={`inline-flex items-center gap-1 ${size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'} rounded-full font-semibold ${MAP[risk]}`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {LABEL[risk]}
    </span>
  )
}
