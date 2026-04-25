import { calcSpent, calcRemaining, calcPercent, budgetStatus, budgetBarColor } from '../utils/calcBudget'

export function useBudget(event) {
  if (!event) return { spent: 0, remaining: 0, percent: 0, status: 'safe', barColor: 'bg-olive' }
  const spent     = calcSpent(event.expenses)
  const remaining = calcRemaining(event.totalBudget, event.expenses)
  const percent   = calcPercent(event.totalBudget, event.expenses)
  const status    = budgetStatus(percent)
  const barColor  = budgetBarColor(percent)
  return { spent, remaining, percent, status, barColor }
}
