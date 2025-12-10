'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterRequest, RegisterResponse } from '@repo/schemas'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/token'

type FormData = z.infer<typeof RegisterRequest>

export default function RegisterPage() {
  const router = useRouter()
  const setSession = useAuth((s) => s.setSession)

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterRequest),
    defaultValues: { email: '', password: '', name: '' },
  })

  async function onSubmit(values: FormData) {
    try {
      const res = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify(values),
      })

      const parsed = RegisterResponse.parse(res)
      setSession(parsed.data.access, parsed.data.user)

      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      const message = 'Registration failed, please try again.'
      form.setError('email', { message })
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <main className="mx-auto max-w-sm py-16">
      <h1 className="mb-6 text-2xl font-semibold">Create your account</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input type="text" placeholder="Your name" autoComplete="name" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
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
            {isSubmitting ? 'Creating...' : 'Create account'}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </main>
  )
}
