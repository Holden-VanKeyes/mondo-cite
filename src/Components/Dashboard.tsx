import React, { useState, useEffect, useCallback } from 'react'
import {
  Container,
  Grid,
  Text,
  Title,
  Button,
  Group,
  ActionIcon,
  Tabs,
  SimpleGrid,
  em,
  Center,
  Stack,
  Box,
  TextInput,
  Drawer,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Plus, Search, Filter, GridDots, List } from 'tabler-icons-react'
import EmptyState from './dashboardComponents/EmptyState'
import ListView from './dashboardComponents/ListView'
import CitationCard from './dashboardComponents/CitationCard'
import CitationInputForm from './CitationInputForm'
import type { Citation } from '@/types'
import CollectionsList from './dashboardComponents/CollectionsList'
import CollectionsDashboard from './dashboardComponents/CollectionsDashboard'

// const emptyCitations: Citation[] = []

// const sampleCitations = [
//   {
//     id: 1,
//     title: 'The impact of language diversity in citation practices',
//     authors: [
//       { firstName: 'Maria', lastName: 'García' },
//       { firstName: 'Jing', lastName: 'Li' },
//     ],
//     year: 2023,
//     source: 'Journal of Academic Publishing',
//     doi: '10.1000/xyz123',
//     type: 'journal',
//     createdAt: '2023-04-01',
//     favorite: true,
//   },
//   {
//     id: 2,
//     title: 'Non-English citation styles in academia: A comparative study',
//     authors: [{ firstName: 'Ahmed', lastName: 'Hassan' }],
//     year: 2022,
//     source: 'International Journal of Bibliography',
//     doi: '10.1000/abc456',
//     type: 'journal',
//     createdAt: '2023-03-28',
//     favorite: false,
//   },
//   {
//     id: 3,
//     title: 'Decolonizing academic citation standards',
//     authors: [
//       { firstName: 'Priya', lastName: 'Sharma' },
//       { firstName: 'Luis', lastName: 'Hernandez' },
//     ],
//     year: 2021,
//     source: 'Research Ethics Quarterly',
//     doi: '10.1000/def789',
//     type: 'journal',
//     createdAt: '2023-03-15',
//     favorite: false,
//   },
// ]

export default function Dashboard() {
  const [defaultCitation, setDefaultCitation] = useState({
    id: '',
    doi: '',
    title: '',
    authors: '',
    journal: '',
    year: '',
    volume: '',
    issue: '',
    pages: '',
  })
  const [citations, setCitations] = useState<Citation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [formMode, setFormMode] = useState('add') // 'add' or 'edit'
  const [activeTab, setActiveTab] = useState<string | null>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpened, setDrawerOpened] = useState(false)
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  const fetchCitations = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/citations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch citations')
      }
      const data = await response.json()
      setCitations(data)
    } catch (error) {
      console.error('Error fetching citations:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchCitations()
  }, [fetchCitations])

  // This function will be called after successful save
  const handleDashboardRefresh = () => {
    setDrawerOpened(false)
    fetchCitations() // Refresh the citations list
  }

  // Filter citations based on search query
  const filteredCitations = citations.filter(
    (citation) =>
      citation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citation.authors.some((author) =>
        `${author.firstName} ${author.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
  )
  const handleDrawer = (citation?: Citation, mode?: string) => {
    if (mode) {
      setFormMode(mode)
    }
    console.log('CITe', citation)
    if (citation && mode === 'edit') {
      setDefaultCitation({
        id: citation.id || '',
        doi: citation.doi || '',
        title: citation.title || '',
        authors:
          citation.authors
            .map((author) => `${author.firstName} ${author.lastName}`)
            .join(', ') || '',
        journal: citation.journal || '',
        year: citation.year.toString() || '',
        volume: citation.volume || '',
        issue: citation.issue || '',
        pages: citation.pages || '',
      })
    }
    setDrawerOpened((prev) => !prev)
  }
  console.log('defaultCitation', defaultCitation)
  return (
    <Container size="xl" py="xs">
      {/* Welcome Header */}
      <Grid mb="lg" align="flex-end">
        <Grid.Col span={{ base: 12, sm: 8 }}>
          <Title order={2}>Welcome to Your Library</Title>
          <Text c="dimmed">Manage, organize, and format your citations</Text>
        </Grid.Col>
        {citations.length > 0 && (
          <Grid.Col span={{ base: 0, sm: 4 }}>
            <Group justify="right">
              <Button
                leftSection={<Plus size={16} />}
                variant="filled"
                onClick={() => {
                  setFormMode('add')
                  handleDrawer()
                }}
              >
                New Citation
              </Button>
            </Group>
          </Grid.Col>
        )}
      </Grid>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="all">All Citations</Tabs.Tab>
          <Tabs.Tab value="collections">Collections</Tabs.Tab>
          <Tabs.Tab value="shared" disabled>
            Shared
          </Tabs.Tab>
        </Tabs.List>

        {/* Search and Filter Bar */}
        {citations.length > 0 && (
          <Grid my="md" align="center">
            <Grid.Col span={6}>
              <TextInput
                leftSection={<Search size={18} />}
                placeholder="Search by title, author, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                variant="outline"
                leftSection={<Filter size={18} />}
                color="gray"
              >
                Filter
              </Button>
            </Grid.Col>
            <Grid.Col span={2} visibleFrom="sm">
              <Group justify="right">
                <ActionIcon
                  variant={viewMode === 'grid' ? 'filled' : 'subtle'}
                  onClick={() => setViewMode('grid')}
                >
                  <GridDots size={18} />
                </ActionIcon>
                <ActionIcon
                  variant={viewMode === 'list' ? 'filled' : 'subtle'}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </ActionIcon>
              </Group>
            </Grid.Col>
          </Grid>
        )}

        {/* Citations Content */}
        <Tabs.Panel value="all" pt="xs">
          {isLoading ? (
            <Center style={{ height: '50vh' }}>
              <Text>Loading your citations...</Text>
            </Center>
          ) : citations.length === 0 ? (
            <EmptyState handleDrawer={handleDrawer} />
          ) : (
            <>
              {filteredCitations.length === 0 ? (
                <Center style={{ height: '30vh' }}>
                  <Stack align="center" gap="md">
                    <Text size="xl">No citations found</Text>
                    <Text c="dimmed">Try adjusting your search or filters</Text>
                    <Button variant="subtle" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  </Stack>
                </Center>
              ) : viewMode === 'grid' || isMobile ? (
                <SimpleGrid
                  cols={{ base: 1, sm: 2, lg: 3 }}
                  spacing={{ base: 'md', sm: 'lg' }}
                  verticalSpacing={{ base: 'md', sm: 'lg' }}
                >
                  {filteredCitations.map((citation) => (
                    <CitationCard
                      key={citation.id}
                      {...citation}
                      dashboardRefresh={handleDashboardRefresh}
                      handleDrawer={handleDrawer}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                //TODO - Implement ListView same as CitationCard
                <div>Future List view</div>
                // <ListView dashboardRefresh={handleDashboardRefresh} />
              )}

              {/* Stats Footer */}
              <Box mt="xl">
                <Text size="sm" c="dimmed">
                  Showing {filteredCitations.length} of {citations.length}{' '}
                  citations
                </Text>
              </Box>
            </>
          )}

          <Drawer
            opened={drawerOpened}
            onClose={() => setDrawerOpened(false)}
            title={formMode === 'add' ? 'Add Citation' : 'Edit Citation'}
            padding={isMobile ? 'md' : 'xl'}
            size="xl"
            position="left"
          >
            <CitationInputForm
              dashboardRefresh={handleDashboardRefresh}
              formMode={formMode}
              defaultCitation={defaultCitation}
            />
          </Drawer>
        </Tabs.Panel>
        <Tabs.Panel value="collections" pt="xs">
          {/* <CollectionsList /> */}
          <CollectionsDashboard />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}
