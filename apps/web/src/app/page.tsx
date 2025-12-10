'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[450px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Tamborine</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">A simple Transaction Processing system for Tamborine.</p>

          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              {/* Using asChild props allows shadcn Button to act as a Link */}
              <Link href="/login">Go to Login</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/register">Go to Register</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
