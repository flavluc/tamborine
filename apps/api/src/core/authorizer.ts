interface AuthorizeInput {
  pan: string
  brand: string
  amount: number
}

interface AuthorizeResult {
  status: 'approved' | 'declined'
  reason?: string
}

export function authorize({ pan, brand, amount }: AuthorizeInput): AuthorizeResult {
  if (!/^\d{16}$/.test(pan)) {
    return {
      status: 'declined',
      reason: 'PAN deve ter 16 dígitos',
    }
  }

  const allowedBrands = ['Visa', 'Mastercard', 'Elo']
  if (!allowedBrands.includes(brand)) {
    return {
      status: 'declined',
      reason: 'Bandeira não aceita',
    }
  }

  if (amount > 1000) {
    return {
      status: 'declined',
      reason: 'Excede limite permitido',
    }
  }

  return {
    status: 'approved',
  }
}
