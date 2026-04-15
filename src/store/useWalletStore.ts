// ─────────────────────────────────────────────────────────────
// Wallet store — portfolio data, balances, health score
// Connected wallet state comes from @solana/wallet-adapter-react
// This store holds enriched/derived data layered on top.
// ─────────────────────────────────────────────────────────────
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TokenBalance, MOCK_TOKENS, PORTFOLIO_ALLOCATION, TOTAL_PORTFOLIO_USD } from '../utils/mockData'
import { PortfolioInsight } from '../utils/aiMock'

interface WalletState {
  // Portfolio data (mock for demo, real via RPC when connected)
  tokens:         TokenBalance[]
  totalUSD:       number
  allocation:     typeof PORTFOLIO_ALLOCATION

  // AI insights
  portfolioInsight: PortfolioInsight | null
  insightLoading:   boolean

  // Actions
  setTokens:          (tokens: TokenBalance[]) => void
  setTotalUSD:        (v: number) => void
  setPortfolioInsight:(insight: PortfolioInsight) => void
  setInsightLoading:  (v: boolean) => void
  refreshPortfolio:   () => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      tokens:           MOCK_TOKENS,
      totalUSD:         TOTAL_PORTFOLIO_USD,
      allocation:       PORTFOLIO_ALLOCATION,
      portfolioInsight: null,
      insightLoading:   false,

      setTokens:          (tokens)  => set({ tokens, totalUSD: tokens.reduce((s, t) => s + t.usdValue, 0) }),
      setTotalUSD:        (totalUSD) => set({ totalUSD }),
      setPortfolioInsight:(portfolioInsight) => set({ portfolioInsight }),
      setInsightLoading:  (insightLoading)   => set({ insightLoading }),
      refreshPortfolio:   () => set({ tokens: MOCK_TOKENS, totalUSD: TOTAL_PORTFOLIO_USD }),
    }),
    {
      name:    'flarepilot-wallet',
      partialize: (s) => ({ tokens: s.tokens, totalUSD: s.totalUSD }),
    }
  )
)
