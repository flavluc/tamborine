'use client'

import { useQuery } from '@tanstack/react-query'

import { GetTransactionsResponse, TransactionDTO } from '@repo/schemas'

import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/api'
import { formatCurrencyBRL, formatPanDisplay, formatTimestamp } from '@/lib/formatters'

export function TransactionsTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => api<GetTransactionsResponse>('/transactions'),
  })

  const transactions: TransactionDTO[] = data?.data ?? []

  return (
    <Card>
      <CardContent className="pt-4">
        {isLoading && <p className="text-sm text-muted-foreground">Carregando transações…</p>}

        {isError && (
          <p className="text-sm text-destructive">Não foi possível carregar as transações.</p>
        )}

        {!isLoading && !isError && transactions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma transação encontrada. Envie uma nova transação para começar.
          </p>
        )}

        {!isLoading && !isError && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">PAN</th>
                  <th className="py-2 pr-4">Valor</th>
                  <th className="py-2 pr-4">Bandeira</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Motivo</th>
                  <th className="py-2 pr-4">Autorização</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 whitespace-nowrap">{formatTimestamp(tx.timestamp)}</td>
                    <td className="py-2 pr-4">{formatPanDisplay(tx.pan)}</td>
                    <td className="py-2 pr-4">{formatCurrencyBRL(tx.amount)}</td>
                    <td className="py-2 pr-4">{tx.brand}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={[
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          tx.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800',
                        ].join(' ')}
                      >
                        {tx.status === 'approved' ? 'Aprovada' : 'Recusada'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 max-w-xs truncate">{tx.reason ?? '-'}</td>
                    <td className="py-2 pr-4">{tx.authorizationCode ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
