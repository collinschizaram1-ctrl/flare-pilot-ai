// ─────────────────────────────────────────────────────────────
// Mock data — realistic Solana wallet / DeFi data for demo
// ─────────────────────────────────────────────────────────────

export interface TokenBalance {
  mint:     string
  symbol:   string
  name:     string
  balance:  number
  decimals: number
  usdValue: number
  price:    number
  change24h: number
  logoUrl:  string
  color:    string
}

export interface Transaction {
  signature: string
  type:      'swap' | 'transfer' | 'stake' | 'unstake' | 'mint' | 'burn' | 'lend' | 'borrow'
  status:    'confirmed' | 'failed' | 'pending'
  timestamp: number
  fee:       number  // in SOL
  description: string
  details: {
    from?:     string
    to?:       string
    amount?:   number
    token?:    string
    toToken?:  string
    toAmount?: number
    protocol?: string
  }
  aiSummary: string
  riskLevel: 'low' | 'medium' | 'high'
}

export interface SmartAction {
  id:          string
  title:       string
  description: string
  apy:         number
  risk:        'low' | 'medium' | 'high'
  protocol:    string
  token:       string
  tvl:         string
  category:    'stake' | 'lend' | 'swap' | 'rebalance' | 'farm'
  urgency:     'normal' | 'hot' | 'new'
  badge?:      string
}

export interface Notification {
  id:      string
  type:    'price' | 'yield' | 'risk' | 'system' | 'transaction'
  title:   string
  message: string
  read:    boolean
  time:    number
}

// ── Token Balances ──────────────────────────────────────────
export const MOCK_TOKENS: TokenBalance[] = [
  {
    mint:      'So11111111111111111111111111111111111111112',
    symbol:    'SOL',
    name:      'Solana',
    balance:   14.82,
    decimals:  9,
    usdValue:  2334.58,
    price:     157.53,
    change24h: 3.24,
    logoUrl:   'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    color:     '#9945FF',
  },
  {
    mint:      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol:    'USDC',
    name:      'USD Coin',
    balance:   1842.50,
    decimals:  6,
    usdValue:  1842.50,
    price:     1.00,
    change24h: 0.01,
    logoUrl:   'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    color:     '#2775CA',
  },
  {
    mint:      'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    symbol:    'JUP',
    name:      'Jupiter',
    balance:   3200,
    decimals:  6,
    usdValue:  512.00,
    price:     0.16,
    change24h: -1.87,
    logoUrl:   'https://static.jup.ag/jup/icon.png',
    color:     '#C7F284',
  },
  {
    mint:      'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    symbol:    'BONK',
    name:      'Bonk',
    balance:   4200000,
    decimals:  5,
    usdValue:  235.20,
    price:     0.0000560,
    change24h: 12.44,
    logoUrl:   'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
    color:     '#F5A623',
  },
  {
    mint:      'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    symbol:    'mSOL',
    name:      'Marinade staked SOL',
    balance:   3.21,
    decimals:  9,
    usdValue:  520.14,
    price:     162.04,
    change24h: 3.38,
    logoUrl:   'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
    color:     '#AB3BD2',
  },
  {
    mint:      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    symbol:    'USDT',
    name:      'Tether USD',
    balance:   450.00,
    decimals:  6,
    usdValue:  450.00,
    price:     1.00,
    change24h: -0.02,
    logoUrl:   'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
    color:     '#26A17B',
  },
]

// ── Transaction History ──────────────────────────────────────
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    signature:   '4xK8mP2nQvR7sT3uY5wZ1aB6cD9eF0gH2iJ4kL6mN8pQ',
    type:        'swap',
    status:      'confirmed',
    timestamp:   Date.now() - 1000 * 60 * 12,
    fee:         0.000005,
    description: 'Swap 2.0 SOL → 314.72 USDC via Jupiter',
    details:     { from: 'SOL', to: 'USDC', amount: 2.0, toAmount: 314.72, protocol: 'Jupiter' },
    aiSummary:   'You swapped 2 SOL for 314.72 USDC using Jupiter aggregator at a rate of $157.36/SOL. Slippage was within 0.3%. Optimal route.',
    riskLevel:   'low',
  },
  {
    signature:   '7jL4nM1pQwS8tU2vX3yA5bC8dE1fG3hI5jK7lM9nO2q',
    type:        'stake',
    status:      'confirmed',
    timestamp:   Date.now() - 1000 * 60 * 60 * 3,
    fee:         0.000005,
    description: 'Stake 5 SOL on Marinade Finance',
    details:     { amount: 5, token: 'SOL', protocol: 'Marinade' },
    aiSummary:   'You liquid-staked 5 SOL via Marinade Finance, receiving 3.09 mSOL. Current staking APY is 7.2%. Your funds remain liquid and usable as collateral.',
    riskLevel:   'low',
  },
  {
    signature:   '2aB5cD8eF1gH4iJ7kL0mN3oP6qR9sT2uV5wX8yZ1aB4',
    type:        'lend',
    status:      'confirmed',
    timestamp:   Date.now() - 1000 * 60 * 60 * 8,
    fee:         0.000005,
    description: 'Supply 500 USDC to Kamino Finance',
    details:     { amount: 500, token: 'USDC', protocol: 'Kamino' },
    aiSummary:   'You supplied 500 USDC to Kamino Finance lending pool, earning 4.8% APY. The pool has $12.4M TVL with low utilization at 62%.',
    riskLevel:   'low',
  },
  {
    signature:   '9cD2eF5gH8iJ1kL4mN7oP0qR3sT6uV9wX2yZ5aB8cD1',
    type:        'swap',
    status:      'confirmed',
    timestamp:   Date.now() - 1000 * 60 * 60 * 24,
    fee:         0.000005,
    description: 'Swap 100,000 BONK → 4.22 USDC via Orca',
    details:     { from: 'BONK', to: 'USDC', amount: 100000, toAmount: 4.22, protocol: 'Orca' },
    aiSummary:   'You swapped 100,000 BONK tokens for 4.22 USDC on Orca Whirlpool. High slippage detected (1.2%) — consider splitting future large BONK trades.',
    riskLevel:   'medium',
  },
  {
    signature:   '6eF9gH2iJ5kL8mN1oP4qR7sT0uV3wX6yZ9aB2cD5eF8',
    type:        'transfer',
    status:      'confirmed',
    timestamp:   Date.now() - 1000 * 60 * 60 * 36,
    fee:         0.000005,
    description: 'Send 0.5 SOL to 8xJk...3pQr',
    details:     { from: 'wallet', to: '8xJkM3pQrS5tU7vW9xY1zA3bC5dE7fG', amount: 0.5, token: 'SOL' },
    aiSummary:   'Standard SOL transfer to a known wallet. Destination address has interacted with major DeFi protocols — looks legitimate.',
    riskLevel:   'low',
  },
  {
    signature:   '3gH6iJ9kL2mN5oP8qR1sT4uV7wX0yZ3aB6cD9eF2gH5',
    type:        'swap',
    status:      'failed',
    timestamp:   Date.now() - 1000 * 60 * 60 * 48,
    fee:         0.000005,
    description: 'Failed: Swap 1.0 SOL → JUP',
    details:     { from: 'SOL', to: 'JUP', amount: 1.0, protocol: 'Jupiter' },
    aiSummary:   'Transaction failed due to slippage exceeding your 0.5% tolerance. SOL price moved 0.8% during execution window. Retry with 1% slippage.',
    riskLevel:   'medium',
  },
  {
    signature:   '1iJ4kL7mN0oP3qR6sT9uV2wX5yZ8aB1cD4eF7gH0iJ3',
    type:        'mint',
    status:      'confirmed',
    timestamp:   Date.now() - 1000 * 60 * 60 * 72,
    fee:         0.0024,
    description: 'Mint NFT: Solana Monke #4821',
    details:     { protocol: 'Magic Eden', amount: 1 },
    aiSummary:   'You minted NFT "Solana Monke #4821" for 1.5 SOL on Magic Eden. The collection has 10k items and 2.1 SOL floor price — currently 40% above mint price.',
    riskLevel:   'low',
  },
  {
    signature:   '8kL1mN4oP7qR0sT3uV6wX9yZ2aB5cD8eF1gH4iJ7kL0',
    type:        'borrow',
    status:      'confirmed',
    timestamp:   Date.now() - 1000 * 60 * 60 * 96,
    fee:         0.000005,
    description: 'Borrow 200 USDC against 2 SOL collateral on MarginFi',
    details:     { amount: 200, token: 'USDC', protocol: 'MarginFi' },
    aiSummary:   'You borrowed 200 USDC at 7.2% APR using 2 SOL as collateral (LTV: 63%). Current health factor: 1.42. Monitor SOL price — liquidation at $89.40/SOL.',
    riskLevel:   'high',
  },
]

// ── Smart Action Suggestions ─────────────────────────────────
export const MOCK_SMART_ACTIONS: SmartAction[] = [
  {
    id:          'stake-sol-marinade',
    title:       'Liquid Stake 5 SOL',
    description: 'Stake idle SOL on Marinade and earn 7.2% APY while keeping liquidity',
    apy:         7.2,
    risk:        'low',
    protocol:    'Marinade Finance',
    token:       'SOL',
    tvl:         '$892M',
    category:    'stake',
    urgency:     'hot',
    badge:       'Best APY',
  },
  {
    id:          'lend-usdc-kamino',
    title:       'Lend 1,000 USDC',
    description: 'Supply USDC to Kamino Finance for passive income',
    apy:         4.8,
    risk:        'low',
    protocol:    'Kamino Finance',
    token:       'USDC',
    tvl:         '$124M',
    category:    'lend',
    urgency:     'normal',
  },
  {
    id:          'farm-sol-usdc-orca',
    title:       'Provide SOL/USDC Liquidity',
    description: 'Add liquidity to Orca Whirlpool SOL/USDC concentrated pool',
    apy:         24.6,
    risk:        'medium',
    protocol:    'Orca',
    token:       'SOL + USDC',
    tvl:         '$48M',
    category:    'farm',
    urgency:     'hot',
    badge:       'High Yield',
  },
  {
    id:          'rebalance-portfolio',
    title:       'Rebalance Portfolio',
    description: 'Your BONK allocation is 4.2% — AI suggests trimming to 2% given volatility',
    apy:         0,
    risk:        'low',
    protocol:    'Jupiter',
    token:       'BONK → USDC',
    tvl:         '',
    category:    'rebalance',
    urgency:     'normal',
  },
  {
    id:          'lend-sol-marginfi',
    title:       'Supply SOL to MarginFi',
    description: 'Earn lending yield on SOL while keeping it as usable collateral',
    apy:         3.4,
    risk:        'low',
    protocol:    'MarginFi',
    token:       'SOL',
    tvl:         '$310M',
    category:    'lend',
    urgency:     'new',
    badge:       'New Pool',
  },
  {
    id:          'stake-sol-jito',
    title:       'Stake SOL via Jito',
    description: 'Earn MEV-boosted staking rewards with jitoSOL',
    apy:         8.1,
    risk:        'low',
    protocol:    'Jito',
    token:       'SOL',
    tvl:         '$1.4B',
    category:    'stake',
    urgency:     'hot',
    badge:       'MEV Boost',
  },
]

// ── Portfolio Allocation (for pie chart) ────────────────────
export const PORTFOLIO_ALLOCATION = [
  { name: 'SOL',   value: 40.8, color: '#9945FF', usd: 2334.58 },
  { name: 'USDC',  value: 32.2, color: '#2775CA', usd: 1842.50 },
  { name: 'mSOL',  value: 9.1,  color: '#AB3BD2', usd: 520.14  },
  { name: 'JUP',   value: 8.9,  color: '#C7F284', usd: 512.00  },
  { name: 'BONK',  value: 4.1,  color: '#F5A623', usd: 235.20  },
  { name: 'USDT',  value: 4.9,  color: '#26A17B', usd: 450.00  },
]

// ── Notifications ────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Omit<Notification, 'id'>[] = [
  {
    type:    'price',
    title:   'SOL Price Alert',
    message: 'SOL is up 3.2% in the last hour — your portfolio gained $74.30',
    read:    false,
    time:    Date.now() - 1000 * 60 * 5,
  },
  {
    type:    'yield',
    title:   'Better Yield Available',
    message: 'Jito staking APY jumped to 8.1% — higher than your current Marinade position (7.2%)',
    read:    false,
    time:    Date.now() - 1000 * 60 * 22,
  },
  {
    type:    'risk',
    title:   'Health Factor Warning',
    message: 'Your MarginFi borrow health factor dropped to 1.42. Consider adding collateral.',
    read:    false,
    time:    Date.now() - 1000 * 60 * 45,
  },
  {
    type:    'system',
    title:   'FlarePilot AI Ready',
    message: 'AI co-pilot initialized. Your portfolio health score: 82/100.',
    read:    true,
    time:    Date.now() - 1000 * 60 * 60 * 2,
  },
]

// ── Portfolio performance (7d sparkline data) ────────────────
export const PORTFOLIO_HISTORY_7D = [
  { day: 'Mon', value: 5120 },
  { day: 'Tue', value: 5340 },
  { day: 'Wed', value: 5180 },
  { day: 'Thu', value: 5620 },
  { day: 'Fri', value: 5490 },
  { day: 'Sat', value: 5780 },
  { day: 'Sun', value: 5894 },
]

export const TOTAL_PORTFOLIO_USD = MOCK_TOKENS.reduce((s, t) => s + t.usdValue, 0)

// ── Demo wallet address (shown when not connected) ───────────
export const DEMO_WALLET = 'FLR3...8xPq'
export const DEMO_WALLET_FULL = 'FLR3nT7mK4pQvR8sU2wX5yZ1aB9cD6eF0gH3iJ7kL8xPq'
