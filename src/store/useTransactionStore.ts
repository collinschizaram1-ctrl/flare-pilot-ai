// ─────────────────────────────────────────────────────────────
// Transaction store — simulation drafts, history, builder state
// ─────────────────────────────────────────────────────────────
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, MOCK_TRANSACTIONS } from '../utils/mockData'
import { SimulationResult } from '../utils/aiMock'

export type TxBuilderType = 'swap' | 'stake' | 'transfer' | 'lend' | 'borrow'

export interface TxDraft {
  type:       TxBuilderType
  fromToken:  string
  toToken:    string
  amount:     string
  recipient:  string
  protocol:   string
  slippage:   string
  collateral: string
}

const DEFAULT_DRAFT: TxDraft = {
  type:       'swap',
  fromToken:  'SOL',
  toToken:    'USDC',
  amount:     '',
  recipient:  '',
  protocol:   'Marinade',
  slippage:   '0.5',
  collateral: '',
}

interface TransactionState {
  // History
  history: Transaction[]
  addToHistory: (tx: Transaction) => void

  // Builder
  draft:          TxDraft
  updateDraft:    (partial: Partial<TxDraft>) => void
  resetDraft:     () => void

  // Simulation
  simulation:        SimulationResult | null
  simulationLoading: boolean
  setSimulation:     (r: SimulationResult | null) => void
  setSimLoading:     (v: boolean) => void
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      history: MOCK_TRANSACTIONS,
      addToHistory: (tx) => set((s) => ({ history: [tx, ...s.history] })),

      draft:       DEFAULT_DRAFT,
      updateDraft: (partial) => set((s) => ({ draft: { ...s.draft, ...partial } })),
      resetDraft:  () => set({ draft: DEFAULT_DRAFT }),

      simulation:        null,
      simulationLoading: false,
      setSimulation:     (simulation)        => set({ simulation }),
      setSimLoading:     (simulationLoading) => set({ simulationLoading }),
    }),
    {
      name:    'flarepilot-transactions',
      partialize: (s) => ({ history: s.history, draft: s.draft }),
    }
  )
)
