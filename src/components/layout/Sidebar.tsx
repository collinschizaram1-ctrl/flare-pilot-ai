import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FlaskConical,
  Wrench,
  History,
  Lightbulb,
  Zap,
} from 'lucide-react'
import { useNotificationStore } from '../../store/useNotificationStore'

const NAV_ITEMS = [
  { path: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/simulator',   label: 'Simulator',    icon: FlaskConical    },
  { path: '/builder',     label: 'TX Builder',   icon: Wrench          },
  { path: '/history',     label: 'TX History',   icon: History         },
  { path: '/suggestions', label: 'AI Insights',  icon: Lightbulb       },
]

export default function Sidebar() {
  const unread = useNotificationStore(s => s.unreadCount)()

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-flare-surface border-r border-flare-border">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-flare-border">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-flare-purple to-flare-green flex items-center justify-center shadow-glow-purple">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-flare-pink rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-flare-text leading-none">FlarePilot</p>
          <p className="text-[10px] text-flare-subtext mt-0.5">AI Co-Pilot · Solana</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[10px] font-semibold text-flare-muted uppercase tracking-widest px-3 py-2">
          Navigation
        </p>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'nav-active text-flare-text'
                  : 'text-flare-subtext hover:text-flare-text hover:bg-flare-border/30'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-flare-purple' : 'text-flare-muted group-hover:text-flare-subtext'}`} />
                <span>{label}</span>
                {path === '/suggestions' && (
                  <span className="ml-auto text-[10px] bg-flare-purple/20 text-flare-purple px-1.5 py-0.5 rounded-full font-semibold">
                    6
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom status bar */}
      <div className="p-4 border-t border-flare-border">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flare-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-flare-green"></span>
            </span>
            <span className="text-[11px] text-flare-subtext">Devnet Connected</span>
          </div>
          <p className="text-[10px] text-flare-muted">Block slot: 285,441,823</p>
          <p className="text-[10px] text-flare-muted">TPS: 3,421 · Ping: 42ms</p>
        </div>
      </div>
    </aside>
  )
}
