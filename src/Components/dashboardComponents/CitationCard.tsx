import React, { useState } from 'react'
import {
  Card,
  Text,
  Group,
  ActionIcon,
  Badge,
  Menu,
  Box,
  Spoiler,
} from '@mantine/core'
import {
  Bookmark,
  HandStop,
  Download,
  Edit,
  FolderPlus,
  Share,
  Trash,
} from 'tabler-icons-react'
import css from './CitationCard.module.css'
import { notifications } from '@mantine/notifications'
import CopyCitation from './CopyCitation'
import type { Citation } from '@/types'

export default function CitationCard(
  props: Citation & {
    dashboardRefresh: () => void
    handleDrawer: (citation: Citation, edit?: string) => void
  }
) {
  const { dashboardRefresh, handleDrawer, ...citation } = props

  const [localFavorite, setLocalFavorite] = useState(citation.isFavorite)
  const favoriteToggle = () => {
    setLocalFavorite((prev) => !prev)
    try {
      fetch(`/api/citations`, {
        method: 'PATCH',
        body: JSON.stringify({ id: citation.id, toggleFavorite: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.log(error)
      setLocalFavorite((prev) => !prev)

      notifications.show({
        title: 'Error',
        message: "Couldn't update favorite status.",
        color: 'red',
      })
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/citations`, {
        method: 'DELETE',
        body: JSON.stringify({ id: citation.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete citation')
      }

      notifications.show({
        title: 'Success',
        message: 'Citation deleted successfully',
        color: 'green',
      })
      dashboardRefresh()
    } catch (error) {
      console.error('Error deleting citation:', error)
      notifications.show({
        title: 'Error',
        message: "Couldn't delete citation.",
        color: 'red',
      })
    }
  }

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
        <ActionIcon color={localFavorite ? 'yellow' : 'gray'}>
          <Bookmark size={18} onClick={favoriteToggle} />
        </ActionIcon>
        {/* TODO - Make different color badges for different citation types */}
        {citation.type ? <Badge>{citation.type}</Badge> : null}
      </Group>
      <Text fz="lg" fw={500} mt="md">
        {citation.title}
      </Text>
      <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
        <Text size="sm" c="dimmed">
          {citation.authors
            .map((a) => `${a.lastName}, ${a.firstName.charAt(0)}.`)
            .join(', ')}
        </Text>
      </Spoiler>
      <Text size="sm" c="dimmed">
        ({citation.year})
      </Text>

      <Text size="sm" mt="xs" mb="lg">
        {citation.source}
      </Text>

      <Box py="sm" px="xs" className={css.cardFooter}>
        <Group justify="space-between" mt="xs">
          <Text size="xs" c="dimmed">
            Added: {new Date(citation.created_at).toLocaleDateString()}
          </Text>
          {new Date(citation.updated_at).toDateString() !==
            new Date(citation.created_at).toDateString() && (
            <Text size="xs" c="dimmed">
              Updated: {new Date(citation.updated_at).toLocaleDateString()}
            </Text>
          )}
          <Group>
            <ActionIcon
              variant="outline"
              onClick={() => {
                handleDrawer(citation, 'edit')
              }}
            >
              <Edit size={16} />
            </ActionIcon>

            <ActionIcon variant="outline">
              <Share size={16} />
            </ActionIcon>

            <CopyCitation citation={citation} variant={'menu-item'} />

            <ActionIcon variant="outline">
              <Download size={14} />
            </ActionIcon>

            <ActionIcon variant="outline">
              <FolderPlus size={14} />
            </ActionIcon>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="outline" color="red">
                  <Trash size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  leftSection={<HandStop size={14} />}
                  onClick={handleDelete}
                >
                  Confirm delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Box>
    </Card>
  )
}
