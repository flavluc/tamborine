'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  TransactionBrand,
} from '@repo/schemas'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { formatCurrencyBRL, formatPanDisplay } from '@/lib/formatters'

const formSchema = CreateTransactionRequest

type TransactionFormValues = z.infer<typeof formSchema>

const BRANDS: TransactionBrand[] = ['Visa', 'Mastercard', 'Elo']

export function TransactionForm() {
  const queryClient = useQueryClient()

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pan: '',
      amount: 0,
      brand: 'Visa',
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: TransactionFormValues) =>
      api<CreateTransactionResponse>('/transactions', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      form.reset({
        pan: '',
        amount: 0,
        brand: 'Visa',
      })
    },
  })

  const [isPanFocused, setIsPanFocused] = useState(false)

  async function onSubmit(values: TransactionFormValues) {
    await mutateAsync(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova transação</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>PAN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Número do cartão (somente números)"
                      maxLength={19}
                      inputMode="numeric"
                      value={isPanFocused ? (field.value ?? '') : formatPanDisplay(field.value)}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '')
                        field.onChange(digits.slice(0, 19))
                      }}
                      onFocus={(e) => {
                        setIsPanFocused(true)
                      }}
                      onBlur={(e) => {
                        setIsPanFocused(false)
                        field.onBlur()
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="decimal"
                      placeholder="R$ 0,00"
                      value={formatCurrencyBRL(field.value)}
                      onChange={(e) => {
                        const raw = e.target.value
                        const digits = raw.replace(/\D/g, '')
                        const cents = digits === '' ? 0 : Number(digits)
                        const reais = cents / 100
                        field.onChange(reais)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bandeira</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {BRANDS.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2 flex justify-end">
              <Button className="cursor-pointer" type="submit" disabled={isPending}>
                {isPending ? 'Enviando...' : 'Enviar transação'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
