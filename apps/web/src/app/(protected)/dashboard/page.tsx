'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MOCK_PROJECTS = [
  { id: '1', title: 'Personal Board', createdAt: '2025-01-10' },
  { id: '2', title: 'Work Tasks', createdAt: '2025-03-02' },
  { id: '3', title: 'Side Projects', createdAt: '2025-05-12' },
]

export default function DashboardPage() {
  const [projects] = useState(MOCK_PROJECTS)
  const router = useRouter()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Your Projects</h2>
        <Button className="cursor-pointer" onClick={() => alert('Open create project dialog')}>
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">You don’t have any projects yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer transition hover:shadow-md"
              onClick={() => router.push(`/dashboard/board/${project.id}`)}
            >
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Created at: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
