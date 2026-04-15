import { LucideIcon } from 'lucide-react'
import { formatChange } from '../../utils/formatters'

interface Props {
  title:     string
  value:     string
  change?:   number
  icon:      LucideIcon
  iconColor: string
  gradient?: boolean
  detail?:   string
}

export default function StatCard({ title, value, change, icon: Icon, iconColor, gradient, detail }: Props) {
  return (
    <div className="glass glass-hover rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${change >= 0 ? 'bg-flare-green/10 text-flare-green' : 'bg-red-500/10 text-red-400'}`}>
            {formatChange(change)}
          </span>
        )}
      </div>
      <p className="text-xs text-flare-muted mb-1">{title}</p>
      <p className={`text-xl font-bold ${gradient ? 'gradient-text' : 'text-flare-text'}`}>
        {value}
      </p>
      {detail && <p className="text-[11px] text-flare-subtext mt-1">{detail}</p>}
    </div>
  )
}
