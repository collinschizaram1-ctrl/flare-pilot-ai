import { useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

// Layout
import AppLayout from './components/layout/AppLayout'

// Pages
import DashboardPage   from './pages/Dashboard'
import SimulatorPage   from './pages/Simulator'
import BuilderPage     from './pages/Builder'
import HistoryPage     from './pages/History'
import SuggestionsPage from './pages/Suggestions'

// Store init
import { useNotificationStore } from './store/useNotificationStore'
import { useEffect } from 'react'
import { MOCK_NOTIFICATIONS } from './utils/mockData'

function AppInner() {
  const { addNotification, notifications } = useNotificationStore()

  // Seed mock notifications once
  useEffect(() => {
    if (notifications.length === 0) {
      MOCK_NOTIFICATIONS.forEach((n, i) => {
        setTimeout(() => addNotification(n), i * 300)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"   element={<DashboardPage />} />
          <Route path="simulator"   element={<SimulatorPage />} />
          <Route path="builder"     element={<BuilderPage />} />
          <Route path="history"     element={<HistoryPage />} />
          <Route path="suggestions" element={<SuggestionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  // Use devnet for demo; swap to mainnet-beta for production
  const endpoint = useMemo(() => clusterApiUrl('devnet'), [])

  // Wallet adapters — Solflare first as it's the primary integration
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* WalletProvider: autoConnect=false so user consciously connects */}
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <AppInner />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
