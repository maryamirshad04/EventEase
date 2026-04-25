export function formatCurrency(amount) {
  if (amount == null) return 'PKR 0'
  return 'PKR ' + Number(amount).toLocaleString('en-PK')
}

export function formatCurrencyShort(amount) {
  if (amount == null) return 'PKR 0'
  if (amount >= 1000000) return `PKR ${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000)    return `PKR ${(amount / 1000).toFixed(0)}K`
  return `PKR ${amount}`
}
