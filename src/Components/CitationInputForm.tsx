'use client'

import { useState } from 'react'
import {
  TextInput,
  Button,
  Group,
  Stack,
  Tabs,
  Paper,
  Center,
  useMantineTheme,
  Textarea,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { PreviewDrawer } from './PreviewDrawer'
import { useMediaQuery } from '@mantine/hooks'
import { Author } from '@/types'

interface DefaultCitationProps {
  id: string
  doi: string
  title: string
  authors: string
  journal: string
  year: string
  volume: string
  issue: string
  pages: string
}

export default function CitationInputForm({
  dashboardRefresh,
  formMode,
  defaultCitation,
}: {
  dashboardRefresh: () => void
  formMode: string
  defaultCitation: DefaultCitationProps
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const form = useForm({
    initialValues: {
      ...defaultCitation,
    },
    validate: {
      doi: (value) =>
        /^10\.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i.test(value) || value === ''
          ? null
          : 'Invalid DOI format',
      year: (value) =>
        value && !/^\d{4}$/.test(value) ? 'Enter a valid year' : null,
    },
  })

  const handleDoiSubmit = async (values: typeof form.values) => {
    setIsLoading(true)
    try {
      // Here we'll add the DOI lookup logic later
      console.log('Looking up DOI:', values.doi)
      // For now, just log the DOI
      const response = await fetch('/api/doi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doi: values.doi }),
      })

      if (!response.ok) throw new Error('Failed to fetch citation')

      const citation = await response.json()

      // Update all form fields with the fetched data
      form.setValues({
        ...form.values,
        title: citation.title,
        authors: citation.authors
          .map((a: Author) => `${a.firstName} ${a.lastName}`)
          .join(', '),
        journal: citation.journal,
        year: citation.year?.toString(),
        volume: citation.volume,
        issue: citation.issue,
        pages: citation.pages,
      })
      setPreviewOpen(true)
    } catch (error) {
      console.error('Error looking up DOI:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSubmit = async (values: typeof form.values) => {
    try {
      let response
      if (formMode === 'edit') {
        // PATCH request for editing
        response = await fetch(`/api/citations/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: values.id, data: values }),
        })
      } else {
        // POST request for adding new citation
        response = await fetch('/api/citations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })
      }

      // const data = await response.json()
      if (response.status === 409) {
        notifications.show({
          title: 'Citation Already Exists',
          message: 'This paper is already in your library.',
          color: 'orange',
        })
      } else if (!response.ok) {
        throw new Error('Failed to save citation')
      } else {
        notifications.show({
          title: 'Success',
          message: 'Citation saved to your library',
          color: 'green',
        })
        dashboardRefresh()
        form.reset()
      }

      // Clear form after successful submission
    } catch (error) {
      console.error('Error saving citation:', error)
    }
  }

  const handleSave = () => {
    // Save citation to database

    handleManualSubmit(form.values)
    setPreviewOpen(false)
  }

  const handleCancel = () => {
    // Clear form or keep changes based on preference
    setPreviewOpen(false)
  }

  return (
    <>
      <Paper withBorder={!isMobile} p={{ base: 'md', sm: 'xl' }} mt="lg">
        <Tabs defaultValue={formMode === 'add' ? 'doi' : 'manual'}>
          <Tabs.List>
            {formMode === 'add' && <Tabs.Tab value="doi">Add by DOI</Tabs.Tab>}
            <Tabs.Tab value="manual">
              {formMode === 'add' ? 'Manual Entry' : 'Edit Citation'}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="doi" pt="xs">
            <form onSubmit={form.onSubmit(handleDoiSubmit)}>
              <Stack>
                <TextInput
                  required
                  label="DOI"
                  placeholder="10.1000/example.123"
                  {...form.getInputProps('doi')}
                />
              </Stack>
              <Center mt="xl">
                <Button type="submit" variant="outline" loading={isLoading}>
                  Look up DOI
                </Button>
              </Center>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="manual" pt="xs">
            <form onSubmit={form.onSubmit(handleManualSubmit)}>
              <Stack>
                <TextInput
                  required
                  label="Title"
                  placeholder="Paper title"
                  {...form.getInputProps('title')}
                />
                <Textarea
                  required
                  label="Authors"
                  placeholder="Author names (separated by commas)"
                  {...form.getInputProps('authors')}
                />
                <Group grow>
                  <TextInput
                    label="Journal"
                    placeholder="Journal name"
                    {...form.getInputProps('journal')}
                  />
                  <TextInput
                    label="Year"
                    placeholder="YYYY"
                    {...form.getInputProps('year')}
                  />
                </Group>
                <Group grow>
                  <TextInput
                    label="Volume"
                    placeholder="Volume number"
                    {...form.getInputProps('volume')}
                  />
                  <TextInput
                    label="Issue"
                    placeholder="Issue number"
                    {...form.getInputProps('issue')}
                  />
                  <TextInput
                    label="Pages"
                    placeholder="e.g., 123-145"
                    {...form.getInputProps('pages')}
                  />
                </Group>
              </Stack>
              <Center mt="xl">
                <Button variant="outline" type="submit">
                  {formMode === 'edit' ? 'Update Citation' : 'Add Citation'}
                </Button>
              </Center>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Paper>
      <PreviewDrawer
        opened={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onSave={handleSave}
        onCancel={handleCancel}
        citation={form.values}
      />
    </>
  )
}
