'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { GetTransactionsResponse, TransactionDTO } from '@repo/schemas'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/api'
import { formatCurrencyBRL, formatPanDisplay, formatTimestamp } from '@/lib/formatters'

const ITEMS_PER_PAGE = 10

export function TransactionsTable() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['transactions', page],
    queryFn: () =>
      api<GetTransactionsResponse>(`/transactions?page=${page}&limit=${ITEMS_PER_PAGE}`),
  })

  const transactions: TransactionDTO[] = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  const startItem = total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(page * ITEMS_PER_PAGE, total)

  const isFirstPage = page <= 1
  const isLastPage = page >= totalPages || total === 0

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1))
  }

  return (
    <div className="flex flex-col">
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
            <>
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
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {formatTimestamp(tx.timestamp)}
                        </td>
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
            </>
          )}
        </CardContent>
      </Card>

      {!isLoading && !isError && transactions.length > 0 && (
        <div className="mt-4 flex justify-center">
          <div className="inline-flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground text-center">
              {total > 0 ? (
                <>
                  Mostrando <span className="font-medium tabular-nums">{startItem}</span>
                  {'–'}
                  <span className="font-medium tabular-nums">{endItem}</span> de{' '}
                  <span className="font-medium tabular-nums">{total}</span> transações
                </>
              ) : (
                'Nenhuma transação para exibir'
              )}
            </p>

            <div className="inline-flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousPage}
                disabled={isFirstPage}
                className="cursor-pointer h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Página anterior</span>
              </Button>

              <span className="text-xs text-muted-foreground tabular-nums">
                Página <span className="font-medium">{page}</span> de{' '}
                <span className="font-medium">{totalPages}</span>
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPage}
                disabled={isLastPage}
                className="cursor-pointer h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Próxima página</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
