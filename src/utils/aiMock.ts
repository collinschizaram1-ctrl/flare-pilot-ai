// ─────────────────────────────────────────────────────────────
// AI Mock Engine
// Structured to be swapped with OpenAI / Anthropic later.
// All responses are deterministic-looking but randomized on init.
// ─────────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'medium' | 'high'

export interface SimulationResult {
  estimatedFee:   number   // SOL
  feesUSD:        number
  tokenChanges:   TokenChange[]
  riskLevel:      RiskLevel
  riskReasons:    string[]
  aiExplanation:  string
  programsUsed:   ProgramInfo[]
  recommendation: string
  confidenceScore: number  // 0–100
  simulationLogs: string[]
}

export interface TokenChange {
  token:     string
  direction: 'in' | 'out'
  amount:    number
  usdValue:  number
}

export interface ProgramInfo {
  address:     string
  name:        string
  verified:    boolean
  description: string
}

export interface PortfolioInsight {
  healthScore:    number
  healthLabel:    'Excellent' | 'Good' | 'Fair' | 'Poor'
  strengths:      string[]
  weaknesses:     string[]
  topSuggestion:  string
  diversification: number  // 0–100
}

// ── Simulate a transaction (mock) ───────────────────────────
export async function simulateTransaction(
  type: string,
  params: Record<string, unknown>
): Promise<SimulationResult> {
  // Simulate async AI + RPC delay
  await delay(900 + Math.random() * 600)

  const txType = type.toLowerCase()

  if (txType.includes('swap')) {
    return buildSwapSimulation(params)
  } else if (txType.includes('stake')) {
    return buildStakeSimulation(params)
  } else if (txType.includes('transfer') || txType.includes('send')) {
    return buildTransferSimulation(params)
  } else if (txType.includes('lend') || txType.includes('supply')) {
    return buildLendSimulation(params)
  } else if (txType.includes('borrow')) {
    return buildBorrowSimulation(params)
  } else {
    return buildGenericSimulation(params)
  }
}

function buildSwapSimulation(params: Record<string, unknown>): SimulationResult {
  const amount     = (params.amount as number) || 1
  const fromToken  = (params.fromToken as string) || 'SOL'
  const toToken    = (params.toToken  as string) || 'USDC'
  const slippage   = ((params.slippage as number) || 0.5)
  const outAmount  = fromToken === 'SOL' ? amount * 157.4 : amount * 0.00634
  const isHighSlip = slippage > 1 || amount > 10

  return {
    estimatedFee:    0.000025,
    feesUSD:         0.004,
    tokenChanges: [
      { token: fromToken, direction: 'out', amount,     usdValue: fromToken === 'SOL' ? amount * 157.4 : amount },
      { token: toToken,   direction: 'in',  amount: outAmount, usdValue: toToken === 'USDC' ? outAmount : outAmount * 157.4 },
    ],
    riskLevel:       isHighSlip ? 'medium' : 'low',
    riskReasons:     isHighSlip
      ? [`Slippage tolerance (${slippage}%) is above recommended 0.5%`, 'Large swap may impact price']
      : [`Slippage within safe range (${slippage}%)`, 'Routed through verified Jupiter aggregator'],
    aiExplanation:   `You are swapping **${amount} ${fromToken}** for approximately **${outAmount.toFixed(2)} ${toToken}** via Jupiter aggregator. The best route uses ${fromToken === 'SOL' ? 'Orca Whirlpool SOL/USDC → direct' : 'Raydium CLMM pool'}. Estimated price impact: ${(amount * 0.01).toFixed(2)}%.`,
    programsUsed: [
      { address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', name: 'Jupiter Aggregator v6', verified: true, description: 'DEX aggregator routing swaps across all Solana AMMs' },
      { address: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',  name: 'Orca Whirlpools',      verified: true, description: 'Concentrated liquidity AMM' },
    ],
    recommendation:  amount > 5
      ? `Consider splitting this swap into 2–3 smaller transactions to minimize price impact and reduce slippage.`
      : `This is a routine swap. Gas fees are minimal. Proceed when ready.`,
    confidenceScore: 94,
    simulationLogs: [
      'Program JUP6Lk... invoked',
      `  Swap ${amount} ${fromToken} → ${outAmount.toFixed(4)} ${toToken}`,
      '  Route: SOL → USDC (Orca Whirlpool, 1 hop)',
      `  Price impact: ${(amount * 0.01).toFixed(3)}%`,
      '  Platform fee: 0.01%',
      'Program JUP6Lk... success',
    ],
  }
}

function buildStakeSimulation(params: Record<string, unknown>): SimulationResult {
  const amount   = (params.amount as number) || 1
  const protocol = (params.protocol as string) || 'Marinade'
  const apy      = protocol === 'Jito' ? 8.1 : 7.2
  const msolRate = 0.978

  return {
    estimatedFee:    0.000005,
    feesUSD:         0.001,
    tokenChanges: [
      { token: 'SOL',  direction: 'out', amount,             usdValue: amount * 157.4 },
      { token: 'mSOL', direction: 'in',  amount: amount * msolRate, usdValue: amount * msolRate * 162.0 },
    ],
    riskLevel:       'low',
    riskReasons:     ['Audited liquid staking protocol', 'mSOL can be unstaked anytime', 'Validator set is diversified'],
    aiExplanation:   `You are liquid-staking **${amount} SOL** via ${protocol} Finance. You will receive **${(amount * msolRate).toFixed(3)} mSOL** which accrues staking rewards at **${apy}% APY**. Your stake remains fully liquid and can be used as collateral in lending protocols.`,
    programsUsed: [
      { address: 'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD', name: `${protocol} Staking`, verified: true, description: 'Liquid staking program' },
    ],
    recommendation:  `Staking ${amount} SOL at ${apy}% APY will earn you ~${(amount * 157.4 * apy / 100 / 365).toFixed(4)} USD/day. This is one of the safest yield strategies on Solana.`,
    confidenceScore: 98,
    simulationLogs: [
      `Program MarBmsSg... invoked`,
      `  Deposit ${amount} SOL`,
      `  Mint ${(amount * msolRate).toFixed(6)} mSOL`,
      `  Current mSOL/SOL rate: ${msolRate}`,
      `Program MarBmsSg... success`,
    ],
  }
}

function buildTransferSimulation(params: Record<string, unknown>): SimulationResult {
  const amount    = (params.amount as number) || 0.1
  const token     = (params.token as string) || 'SOL'
  const recipient = (params.recipient as string) || 'unknown'
  const isNewAddr = !recipient.includes('...')

  return {
    estimatedFee:    0.000005,
    feesUSD:         0.001,
    tokenChanges: [
      { token, direction: 'out', amount, usdValue: token === 'SOL' ? amount * 157.4 : amount },
    ],
    riskLevel:       isNewAddr ? 'medium' : 'low',
    riskReasons:     isNewAddr
      ? ['Sending to unrecognized address — verify before proceeding', 'First transaction to this address']
      : ['Known recipient address', 'Previous transactions with this wallet'],
    aiExplanation:   `You are sending **${amount} ${token}** to ${recipient.slice(0, 8)}...${recipient.slice(-4)}. This is a standard System Program transfer. Ensure the recipient address is correct — Solana transfers are irreversible.`,
    programsUsed: [
      { address: '11111111111111111111111111111111', name: 'System Program', verified: true, description: 'Core Solana system program for SOL transfers' },
    ],
    recommendation:  isNewAddr
      ? 'Always double-check the recipient address. Consider sending a small test amount first.'
      : 'Routine transfer to a known address. Safe to proceed.',
    confidenceScore: 99,
    simulationLogs: [
      'Program 1111... (System) invoked',
      `  Transfer ${amount} SOL to ${recipient.slice(0, 8)}...`,
      'Program 1111... success',
    ],
  }
}

function buildLendSimulation(params: Record<string, unknown>): SimulationResult {
  const amount   = (params.amount as number) || 100
  const token    = (params.token as string) || 'USDC'
  const protocol = (params.protocol as string) || 'Kamino'
  const apy      = 4.8

  return {
    estimatedFee:    0.000005,
    feesUSD:         0.001,
    tokenChanges: [
      { token,      direction: 'out', amount,       usdValue: amount },
      { token: `k${token}`, direction: 'in', amount, usdValue: amount },
    ],
    riskLevel:       'low',
    riskReasons:     ['Audited lending protocol', 'Over-collateralized positions only', 'Insurance fund active'],
    aiExplanation:   `You are supplying **${amount} ${token}** to ${protocol} Finance lending pool. You'll receive **${amount} k${token}** (receipt token) earning **${apy}% APY**. Current pool utilization: 62%. Your funds are protected by over-collateralization requirements.`,
    programsUsed: [
      { address: 'KLend2g3cP87fffoy8q1mQqGKjrL1AyGDdFM9CyL2Hg', name: `${protocol} Lending`, verified: true, description: 'Money market lending protocol' },
    ],
    recommendation:  `Supplying at ${apy}% APY is a solid passive income strategy. Rates may fluctuate based on pool utilization. Monitor quarterly.`,
    confidenceScore: 96,
    simulationLogs: [
      `Program KLend2g... invoked`,
      `  Supply ${amount} ${token}`,
      `  Mint ${amount} k${token} shares`,
      `  Current utilization: 62%`,
      `  Supply APY: ${apy}%`,
      `Program KLend2g... success`,
    ],
  }
}

function buildBorrowSimulation(params: Record<string, unknown>): SimulationResult {
  const amount     = (params.amount as number) || 100
  const token      = (params.token as string) || 'USDC'
  const collateral = (params.collateral as number) || 2
  const ltv        = (amount / (collateral * 157.4)) * 100
  const healthFactor = (collateral * 157.4 * 0.85) / amount
  const isRisky    = ltv > 70 || healthFactor < 1.5

  return {
    estimatedFee:    0.000005,
    feesUSD:         0.001,
    tokenChanges: [
      { token, direction: 'in', amount, usdValue: amount },
    ],
    riskLevel:       isRisky ? 'high' : 'medium',
    riskReasons:     [
      `LTV ratio: ${ltv.toFixed(1)}% (${ltv > 70 ? 'HIGH — near liquidation threshold' : 'within safe range'})`,
      `Health factor: ${healthFactor.toFixed(2)} (minimum safe: 1.5)`,
      isRisky ? 'SOL price drop of 15% would trigger liquidation' : 'SOL would need to drop 35% to trigger liquidation',
    ],
    aiExplanation:   `You are borrowing **${amount} ${token}** against **${collateral} SOL collateral** on MarginFi. Your health factor is **${healthFactor.toFixed(2)}** — ${isRisky ? '⚠️ this is below the safe threshold of 1.5.' : 'this is within safe range.'} Liquidation would occur at SOL price of $${((amount / (collateral * 0.85))).toFixed(2)}.`,
    programsUsed: [
      { address: 'MFv2hWf31Z9kbCa1snEPdcgp7rjYnFqjhqJpHzSmAbD', name: 'MarginFi v2', verified: true, description: 'Permissioned margin trading and lending' },
    ],
    recommendation:  isRisky
      ? 'High risk. Consider adding more collateral or borrowing less. A 15% SOL price drop will liquidate your position.'
      : 'Moderate risk. Keep monitoring your health factor. Set a price alert at $120/SOL.',
    confidenceScore: 91,
    simulationLogs: [
      `Program MFv2hW... invoked`,
      `  Collateral: ${collateral} SOL ($${(collateral * 157.4).toFixed(2)})`,
      `  Borrow: ${amount} ${token}`,
      `  LTV: ${ltv.toFixed(2)}%`,
      `  Health factor: ${healthFactor.toFixed(4)}`,
      `  Borrow APR: 7.2%`,
      `Program MFv2hW... success`,
    ],
  }
}

function buildGenericSimulation(_params: Record<string, unknown>): SimulationResult {
  return {
    estimatedFee:    0.000015,
    feesUSD:         0.002,
    tokenChanges: [],
    riskLevel:       'medium',
    riskReasons:     ['Custom transaction — manual review recommended', 'Program interaction could not be fully decoded'],
    aiExplanation:   'This transaction interacts with one or more Solana programs. The AI could not fully decode all instructions. Review the program addresses carefully before signing.',
    programsUsed: [
      { address: 'unknown', name: 'Unknown Program', verified: false, description: 'Unrecognized program — verify before proceeding' },
    ],
    recommendation:  'Proceed with caution. Verify all program addresses on Solscan before signing.',
    confidenceScore: 60,
    simulationLogs: [
      'Unknown program invoked',
      '  Instructions: 3',
      '  Cannot decode all instruction data',
    ],
  }
}

// ── Portfolio health analysis ────────────────────────────────
export async function analyzePortfolio(totalUSD: number, allocation: Array<{ name: string; value: number }>): Promise<PortfolioInsight> {
  await delay(600)

  const solPct   = allocation.find(a => a.name === 'SOL')?.value  || 0
  const stablePct = (allocation.find(a => a.name === 'USDC')?.value || 0) + (allocation.find(a => a.name === 'USDT')?.value || 0)
  const memePct  = allocation.find(a => a.name === 'BONK')?.value || 0

  let score = 75
  if (stablePct >= 20 && stablePct <= 40) score += 10
  if (solPct >= 30 && solPct <= 50)       score += 8
  if (memePct < 5)                        score += 5
  if (totalUSD > 5000)                    score += 2

  const label: PortfolioInsight['healthLabel'] =
    score >= 90 ? 'Excellent' :
    score >= 75 ? 'Good' :
    score >= 60 ? 'Fair' : 'Poor'

  return {
    healthScore:     Math.min(score, 100),
    healthLabel:     label,
    strengths: [
      'Well-balanced SOL/stable ratio',
      'Liquid staking exposure via mSOL',
      'Active yield generation positions',
    ],
    weaknesses: [
      'BONK allocation adds volatility risk',
      'Open borrow position needs monitoring',
      'No diversification into Solana ecosystem tokens',
    ],
    topSuggestion:   'Stake 3 more SOL via Jito for MEV-boosted 8.1% APY — estimated $44.20/month additional income.',
    diversification: 72,
  }
}

// ── Transaction history intelligence ────────────────────────
export async function analyzeHistory(): Promise<{ patterns: string[]; insight: string }> {
  await delay(500)
  return {
    patterns: [
      'You swap SOL → USDC during weekend price pumps (3 occurrences in 30d)',
      'Frequent BONK trades suggest speculative behavior — avg. loss 2.1% per trade',
      'High DeFi activity: 8 protocol interactions in 7 days',
      'You prefer Jupiter for swaps (100% of swap volume)',
      'Staking and lending positions are long-term and healthy',
    ],
    insight: 'Your DeFi usage is sophisticated. You are an active liquidity provider and yield optimizer. Consider automating rebalancing to reduce manual swap frequency and fee overhead.',
  }
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
