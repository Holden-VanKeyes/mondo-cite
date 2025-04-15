import React from 'react'
import { Card, Text, Group, ActionIcon, Badge, Menu, Box } from '@mantine/core'
import {
  Bookmark,
  ChevronDown,
  Clipboard,
  Download,
  Edit,
  FolderPlus,
  Share,
  Trash,
} from 'tabler-icons-react'
import css from './CitationCard.module.css'

interface Author {
  firstName: string
  lastName: string
}

interface Citation {
  id: number
  title: string
  authors: Author[]
  year: number
  source: string
  doi: string
  type: string
  createdAt: string
  favorite: boolean
}

export default function CitationCard(citation: Citation) {
  return (
    <Card
      key={citation.id}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={css.citationCard}
    >
      <Group justify="space-between">
        <ActionIcon color={citation.favorite ? 'yellow' : 'gray'}>
          <Bookmark size={18} />
        </ActionIcon>
        <Badge>{citation.type}</Badge>
      </Group>
      <Text fz="lg" fw={500} mt="md">
        {citation.title}
      </Text>

      <Text size="sm" c="dimmed">
        {citation.authors
          .map((a) => `${a.lastName}, ${a.firstName.charAt(0)}.`)
          .join(', ')}{' '}
        ({citation.year})
      </Text>

      <Text size="sm" mt="xs" mb="lg">
        {citation.source}
      </Text>
      {/* TODO - Make different color badges for different citation types */}

      <Box py="sm" px="xs" className={css.cardFooter}>
        <Group justify="space-between" mt="xs">
          <Text size="xs" c="dimmed">
            Added: {new Date(citation.createdAt).toLocaleDateString()}
          </Text>
          <Group>
            <ActionIcon>
              <Edit size={16} />
            </ActionIcon>
            <ActionIcon>
              <Share size={16} />
            </ActionIcon>
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <ActionIcon>
                  <ChevronDown size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<Clipboard size={14} />}>
                  Copy formatted citation
                </Menu.Item>
                <Menu.Item leftSection={<Download size={14} />}>
                  Download
                </Menu.Item>
                <Menu.Item leftSection={<FolderPlus size={14} />}>
                  Add to collection
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" leftSection={<Trash size={14} />}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Box>
    </Card>
  )
}
