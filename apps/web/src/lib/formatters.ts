export const formatCurrencyBRL = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return ''
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatPanDisplay = (pan: string | undefined) => {
  if (!pan) return ''
  const digits = pan.replace(/\D/g, '')
  if (digits.length <= 4) return digits

  const masked = digits.slice(0, -4).replace(/./g, '•')
  const last4 = digits.slice(-4)

  return `${masked}${last4}`.replace(/(.{4})/g, '$1 ').trim()
}

export const formatTimestamp = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleString('pt-BR')
}
