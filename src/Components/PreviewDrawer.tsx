'use client'

import { useState } from 'react'
import {
  Drawer,
  Stack,
  Tabs,
  Text,
  Button,
  Group,
  Paper,
  ScrollArea,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

interface PreviewDrawerProps {
  opened: boolean
  onClose: () => void
  onSave: () => void
  onCancel: () => void
  citation: {
    title: string
    authors: string
    journal: string
    year: string
    // ... other citation fields
  }
}

export function PreviewDrawer({
  opened,
  onClose,
  onSave,
  onCancel,
  citation,
}: PreviewDrawerProps) {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  // Format citation in different styles
  const formatCitation = (style: 'apa' | 'mla') => {
    if (style === 'apa') {
      return `${citation.authors} (${citation.year}). ${citation.title}. ${citation.journal}.`
    }
    return `${citation.authors}. "${citation.title}" ${citation.journal}, ${citation.year}.`
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={isMobile ? '100%' : 'md'}
      title="Citation Preview"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack h="100%">
        <Tabs defaultValue="apa">
          <Tabs.List>
            <Tabs.Tab value="apa">APA</Tabs.Tab>
            <Tabs.Tab value="mla">MLA</Tabs.Tab>
            <Tabs.Tab value="chicago">Chicago</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="apa" pt="md">
            <Paper p="md" withBorder>
              <Text>{formatCitation('apa')}</Text>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="mla" pt="md">
            <Paper p="md" withBorder>
              <Text>{formatCitation('mla')}</Text>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="chicago" pt="md">
            <Paper p="md" withBorder>
              <Text>Chicago format coming soon...</Text>
            </Paper>
          </Tabs.Panel>
        </Tabs>

        {/* Push buttons to bottom */}
        <Group style={{ marginTop: 'auto' }} p="md">
          <Button
            variant="light"
            color="red"
            onClick={onCancel}
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button onClick={onSave} fullWidth={isMobile}>
            Save Citation
          </Button>
        </Group>
      </Stack>
    </Drawer>
  )
}
