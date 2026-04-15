import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Bell, ChevronRight } from 'lucide-react'
import { useNotificationStore } from '../../store/useNotificationStore'
import NotificationPanel from '../ui/NotificationPanel'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':   { title: 'Dashboard',   subtitle: 'Portfolio overview & AI insights' },
  '/simulator':   { title: 'TX Simulator', subtitle: 'Simulate transactions before signing' },
  '/builder':     { title: 'TX Builder',   subtitle: 'Construct & broadcast transactions' },
  '/history':     { title: 'TX History',   subtitle: 'AI-analyzed transaction log' },
  '/suggestions': { title: 'AI Insights',  subtitle: 'Smart actions & DeFi opportunities' },
}

export default function Topbar() {
  const location  = useLocation()
  const unread    = useNotificationStore(s => s.unreadCount)()
  const [showNotif, setShowNotif] = useState(false)

  const page = PAGE_TITLES[location.pathname] || { title: 'FlarePilot', subtitle: '' }

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-flare-border bg-flare-surface/80 backdrop-blur-xl z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-flare-muted">FlarePilot</span>
        <ChevronRight className="w-3 h-3 text-flare-muted" />
        <span className="text-flare-text font-semibold">{page.title}</span>
        <span className="hidden md:block text-flare-muted">·</span>
        <span className="hidden md:block text-flare-subtext text-xs">{page.subtitle}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(v => !v)}
            className="relative w-9 h-9 glass rounded-xl flex items-center justify-center hover:border-flare-purple/40 transition-all duration-200"
          >
            <Bell className="w-4 h-4 text-flare-subtext" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-flare-pink rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotif && (
            <NotificationPanel onClose={() => setShowNotif(false)} />
          )}
        </div>

        {/* Wallet button */}
        <WalletMultiButton />
      </div>
    </header>
  )
}
