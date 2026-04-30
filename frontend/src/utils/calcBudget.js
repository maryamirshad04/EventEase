export function calcSpent(expenses = []) {
  return expenses
    .filter(e => e?.type === 'vendor') 
    .reduce((sum, e) => sum + Number(e.amount || 0), 0)
}

export function calcRemaining(totalBudget, expenses = []) {
  return Number(totalBudget || 0) - calcSpent(expenses)
}

export function calcPercent(totalBudget, expenses = []) {
  if (!totalBudget) return 0
  return Math.round((calcSpent(expenses) / totalBudget) * 100)
}

export function budgetStatus(percent) {
  if (percent >= 100) return 'over'
  if (percent >= 90)  return 'critical'
  if (percent >= 60)  return 'warning'
  return 'safe'
}

export function budgetBarColor(percent) {
  if (percent >= 100) return 'bg-burgundy'
  if (percent >= 90)  return 'bg-caramel'
  if (percent >= 60)  return 'bg-sandGold'
  return 'bg-olive'
}
