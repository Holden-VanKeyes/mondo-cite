'use client'

import { useState, useEffect } from 'react'
import { Paper, Text, Title, Stack, Group, Badge } from '@mantine/core'
import { Citation } from '@/types'

export default function CitationList() {
  const [citations, setCitations] = useState<Citation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCitations() {
      try {
        const response = await fetch('/api/citations')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setCitations(data)
      } catch (error) {
        console.error('Error fetching citations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCitations()
  }, [])

  if (loading) return <Text>Loading...</Text>

  return (
    <Stack gap="md">
      {citations.map((citation) => (
        <Paper key={citation.id} p="md" withBorder>
          <Title order={4}>{citation.title}</Title>
          <Group gap="xs" mt="xs">
            <Text size="sm" c="dimmed">
              {citation.authors
                .map((a) => `${a.lastName}, ${a.firstName}`)
                .join('; ')}
            </Text>
          </Group>
          {citation.journal && (
            <Text size="sm" mt="xs" c="dimmed">
              {citation.journal} ({citation.year})
            </Text>
          )}
          {citation.doi && (
            <Badge variant="light" color="blue" mt="xs">
              DOI: {citation.doi}
            </Badge>
          )}
        </Paper>
      ))}
    </Stack>
  )
}
