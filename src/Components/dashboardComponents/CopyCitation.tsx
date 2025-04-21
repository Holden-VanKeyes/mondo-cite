'use client'
// src/components/CopyCitationButton.tsx

import { useState } from 'react'
import {
  Button,
  Modal,
  Group,
  Text,
  Paper,
  ActionIcon,
  Stack,
  SegmentedControl,
  ScrollArea,
  Tooltip,
} from '@mantine/core'
import { Clipboard } from 'tabler-icons-react'
import { notifications } from '@mantine/notifications'
import { Citation } from '@/types'

import {
  formatCitation,
  getAvailableCitationStyles,
  type CitationStyle,
} from '../../app/utils/citationFormatter'
import { useDisclosure } from '@mantine/hooks'

interface CopyCitationButtonProps {
  citation: Citation
  variant?: 'menu-item' | 'standalone'
}

export default function CopyCitation({
  citation,
  variant = 'menu-item',
}: CopyCitationButtonProps) {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>('apa')
  const [copied, setCopied] = useState(false)
  const styles = getAvailableCitationStyles()

  // Format the citation using the selected style
  const formattedCitation = formatCitation(citation, selectedStyle)

  // Create segmented control data from citation styles
  const styleOptions = styles.map((style) => ({
    value: style.id,
    label: style.name,
  }))

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedCitation)
      setCopied(true)
      close()
      // Show notification
      notifications.show({
        title: 'Citation copied',
        message: 'Citation has been copied to clipboard',
        color: 'green',
        position: 'top-right',
      })

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)

      // Show error notification
      notifications.show({
        title: 'Copy failed',
        message: 'Failed to copy citation to clipboard',
        color: 'red',
      })
    }
  }

  // Citation styles modal content
  const modalContent = (
    <>
      <Stack gap="md">
        <Text fw={500} size="lg">
          Citation Style
        </Text>
        <ScrollArea type="scroll" scrollbarSize={4}>
          <SegmentedControl
            fullWidth
            data={styleOptions}
            value={selectedStyle}
            onChange={(value) => setSelectedStyle(value as CitationStyle)}
          />
        </ScrollArea>

        <Text fw={500} size="lg" mt="md">
          Preview
        </Text>
        <Paper p="md" withBorder pos="relative">
          <Text>{formattedCitation}</Text>
        </Paper>
      </Stack>
    </>
  )

  // Menu item variant
  if (variant === 'menu-item') {
    return (
      <>
        <Tooltip label="copy">
          <ActionIcon onClick={open} variant="outline">
            <Clipboard size={14} />
          </ActionIcon>
        </Tooltip>

        <Modal
          opened={opened}
          onClose={close}
          title="Copy Formatted Citation"
          size="lg"
          centered
        >
          {modalContent}

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={close}>
              Close
            </Button>
            <Button onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </Group>
        </Modal>
      </>
    )
  }

  // Standalone button variant
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Copy Formatted Citation"
        size="lg"
        centered
      >
        {modalContent}

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={close}>
            Close
          </Button>
          <Button onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
        </Group>
      </Modal>
    </>
  )
}
