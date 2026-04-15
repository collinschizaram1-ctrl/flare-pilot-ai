import { useEffect, useRef } from 'react'
import { Bell, BellRing, X, TrendingUp, Zap, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'
import { useNotificationStore } from '../../store/useNotificationStore'
import { formatTimestamp } from '../../utils/formatters'
import { Notification } from '../../utils/mockData'

const TYPE_ICON: Record<Notification['type'], React.ReactNode> = {
  price:       <TrendingUp   className="w-4 h-4 text-flare-green"   />,
  yield:       <Zap          className="w-4 h-4 text-flare-yellow"  />,
  risk:        <AlertTriangle className="w-4 h-4 text-red-400"      />,
  system:      <Info         className="w-4 h-4 text-flare-blue"    />,
  transaction: <CheckCircle2  className="w-4 h-4 text-flare-purple" />,
}

const TYPE_BG: Record<Notification['type'], string> = {
  price:       'bg-flare-green/10',
  yield:       'bg-flare-yellow/10',
  risk:        'bg-red-500/10',
  system:      'bg-flare-blue/10',
  transaction: 'bg-flare-purple/10',
}

interface Props { onClose: () => void }

export default function NotificationPanel({ onClose }: Props) {
  const { notifications, markRead, markAllRead, removeNotification } = useNotificationStore()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 w-80 glass rounded-2xl shadow-xl border border-flare-border z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-flare-border">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-flare-purple" />
          <span className="text-sm font-semibold text-flare-text">Notifications</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-[11px] text-flare-purple hover:text-flare-purple/80 transition-colors"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="text-flare-muted hover:text-flare-text">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-flare-muted text-sm">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No notifications
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 border-b border-flare-border/50 cursor-pointer transition-all hover:bg-flare-border/20 ${!n.read ? 'bg-flare-surface' : ''}`}
              onClick={() => markRead(n.id)}
            >
              <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${TYPE_BG[n.type]}`}>
                {TYPE_ICON[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs font-semibold truncate ${!n.read ? 'text-flare-text' : 'text-flare-subtext'}`}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-flare-purple flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-flare-muted mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-flare-muted/60 mt-1">{formatTimestamp(n.time)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeNotification(n.id) }}
                className="text-flare-muted/50 hover:text-flare-muted flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
