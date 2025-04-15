import React from 'react'
import {
  Paper,
  Text,
  Stack,
  Group,
  Badge,
  ActionIcon,
  Menu,
  Grid,
} from '@mantine/core'
import {
  Edit,
  Share,
  Bookmark,
  ChevronDown,
  Clipboard,
  Download,
  FolderPlus,
  Trash,
} from 'tabler-icons-react'

const filteredCitations = [
  {
    id: 1,
    title: 'The impact of language diversity in citation practices',
    authors: [
      { firstName: 'Maria', lastName: 'García' },
      { firstName: 'Jing', lastName: 'Li' },
    ],
    year: 2023,
    source: 'Journal of Academic Publishing',
    doi: '10.1000/xyz123',
    type: 'journal',
    createdAt: '2023-04-01',
    favorite: true,
  },
  {
    id: 2,
    title: 'Non-English citation styles in academia: A comparative study',
    authors: [{ firstName: 'Ahmed', lastName: 'Hassan' }],
    year: 2022,
    source: 'International Journal of Bibliography',
    doi: '10.1000/abc456',
    type: 'journal',
    createdAt: '2023-03-28',
    favorite: false,
  },
  {
    id: 3,
    title: 'Decolonizing academic citation standards',
    authors: [
      { firstName: 'Priya', lastName: 'Sharma' },
      { firstName: 'Luis', lastName: 'Hernandez' },
    ],
    year: 2021,
    source: 'Research Ethics Quarterly',
    doi: '10.1000/def789',
    type: 'journal',
    createdAt: '2023-03-15',
    favorite: false,
  },
]

export default function ListView() {
  return (
    <Stack gap="xs">
      {filteredCitations.map((citation) => (
        <Paper key={citation.id} p="md" withBorder>
          <Grid>
            <Grid.Col span={9}>
              <Group gap="lg">
                <Text fw={500}>{citation.title}</Text>
                <Badge color="blue">{citation.type}</Badge>
              </Group>
              <Stack gap="sm">
                <Text size="sm" c="dimmed">
                  {citation.authors
                    .map((a) => `${a.lastName}, ${a.firstName.charAt(0)}.`)
                    .join(', ')}{' '}
                  ({citation.year})
                </Text>
                <Text size="sm">{citation.source}</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={3}>
              <Stack align="flex-end" gap="lg">
                <Group>
                  <Text size="xs" c="dimmed">
                    Added: {new Date(citation.createdAt).toLocaleDateString()}
                  </Text>

                  <ActionIcon color={citation.favorite ? 'yellow' : 'gray'}>
                    <Bookmark size={18} />
                  </ActionIcon>
                </Group>
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
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      ))}
    </Stack>
  )
}
