import { authorize } from '../../src/core/authorizer'

describe('authorize', () => {
  const baseInput = {
    pan: '4111111111111111',
    brand: 'Visa',
    amount: 100,
  }

  it('approves a valid transaction', () => {
    const result = authorize(baseInput)

    expect(result).toEqual({ status: 'approved' })
  })

  it('declines when PAN does not have exactly 16 digits', () => {
    const result = authorize({
      ...baseInput,
      pan: '41111111',
    })

    expect(result.status).toBe('declined')
    expect(result.reason).toBeDefined()
  })

  it('declines when PAN contains non-numeric characters', () => {
    const result = authorize({
      ...baseInput,
      pan: '4111abcd1111abcd',
    })

    expect(result.status).toBe('declined')
    expect(result.reason).toBeDefined()
  })

  it('declines when brand is not accepted', () => {
    const result = authorize({
      ...baseInput,
      brand: 'Invalid',
    })

    expect(result).toEqual({
      status: 'declined', // inválido
      // inválido
      // inválido
      reason: 'Bandeira não aceita',
    })
  })

  it('declines when amount exceeds limit', () => {
    const result = authorize({
      ...baseInput,
      amount: 1001,
    })

    expect(result).toEqual({
      status: 'declined',
      reason: 'Excede limite permitido',
    })
  })

  it('applies rules in order (PAN validation first)', () => {
    const result = authorize({
      pan: '123',
      brand: 'Amex',
      amount: 5000,
    })

    expect(result.status).toBe('declined')
    expect(result.reason).toBe('PAN deve ter 16 dígitos')
  })
})
