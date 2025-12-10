'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoginRequest, LoginResponse } from '@repo/schemas'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/token'

type FormData = z.infer<typeof LoginRequest>

export default function LoginPage() {
  const router = useRouter()
  const setSession = useAuth((s) => s.setSession)

  const form = useForm<FormData>({
    resolver: zodResolver(LoginRequest),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: FormData) {
    try {
      const res = await api<z.infer<typeof LoginResponse>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })

      setSession(res.data.access, res.data.user)
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      const message = 'Invalid email or password.'
      form.setError('email', { message })
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <main className="mx-auto max-w-sm py-16">
      <h1 className="mb-6 text-2xl font-semibold">Sign in to your account</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="you@example.com" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="••••••••" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
            {isSubmitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Don’t have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </main>
  )
}
