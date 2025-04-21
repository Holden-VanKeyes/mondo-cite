// components/collections/CollectionsList.tsx
import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Text,
  Group,
  Button,
  Menu,
  ActionIcon,
  Accordion,
  TextInput,
  Textarea,
  Stack,
  Loader,
  Title,
  Collapse,
  Badge,
  UnstyledButton,
  SimpleGrid,
  Anchor,
  Flex,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  Dots,
  Edit,
  Trash,
  FolderPlus,
  Folder,
  ChevronDown,
  ChevronUp,
  ReportMedical,
  Flower,
  Rocket,
  ArrowAutofitUp,
  ArrowUp,
  ArrowDown,
} from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import CitationCard from './CitationCard'
import type { Citation } from '@/types'
import css from './CollectionsDashboard.module.css'

interface Collection {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

const mockdata = [
  { title: 'Credit cards', icon: Dots, color: 'violet' },
  { title: 'Banks nearby', icon: Edit, color: 'indigo' },
  { title: 'Transfers', icon: FolderPlus, color: 'blue' },
  { title: 'Refunds', icon: Folder, color: 'green' },
  { title: 'Receipts', icon: ChevronDown, color: 'teal' },
  { title: 'Taxes', icon: ChevronUp, color: 'cyan' },
  { title: 'Reports', icon: ReportMedical, color: 'pink' },
  { title: 'Payments', icon: Flower, color: 'red' },
  { title: 'Cashback', icon: Rocket, color: 'orange' },
]

export default function CollectionsList() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null)
  //   const [modalOpened, { open: openModal, close: closeModal }] =
  //     useDisclosure(false)
  const [opened, { toggle }] = useDisclosure(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [expandedCollectionId, setExpandedCollectionId] = useState<
    string | null
  >(null)
  const [collectionCitations, setCollectionCitations] = useState<{
    [key: string]: Citation[]
  }>({})
  const [loadingCitations, setLoadingCitations] = useState<{
    [key: string]: boolean
  }>({})
  const router = useRouter()

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/collections')
      const data = await response.json()

      if (data.collections) {
        setCollections(data.collections)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to load collections',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCollectionCitations = async (collectionId: string) => {
    try {
      setLoadingCitations((prev) => ({ ...prev, [collectionId]: true }))
      console.log('DATA', collectionId)
      const response = await fetch(`/api/collections/${collectionId}`)
      const data = await response.json()
      if (data.citations) {
        setCollectionCitations((prev) => ({
          ...prev,
          [collectionId]: data.citations,
        }))
      }
    } catch (error) {
      console.error(
        `Error fetching citations for collection ${collectionId}:`,
        error
      )
      notifications.show({
        title: 'Error',
        message: 'Failed to load citations for this collection',
        color: 'red',
      })
    } finally {
      setLoadingCitations((prev) => ({ ...prev, [collectionId]: false }))
    }
  }

  const items = mockdata.map((item, indx) => (
    <Accordion.Item key={indx} value={item.title}>
      <Accordion.Control>{item.title}</Accordion.Control>
      <Accordion.Panel>{item.color}</Accordion.Panel>
    </Accordion.Item>
  ))

  if (loading) {
    return (
      <Box
        style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
      >
        <Loader size="lg" />
      </Box>
    )
  }

  return (
    <Box>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 'md', sm: 'lg' }}
        verticalSpacing={{ base: 'md', sm: 'lg' }}
      >
        <Card withBorder radius="md" className={css.card}>
          <Group justify="space-between" py="xs">
            <Flex gap="xs" direction="column">
              <Text className={css.title}>{collections[0].name}</Text>
              <Text size="xs" c="dimmed">
                {collections[0].description}
              </Text>
            </Flex>
            <ActionIcon
              onClick={() => {
                toggle()
                if (!opened) {
                  fetchCollectionCitations(collections[0].id)
                }
              }}
              variant="outline"
            >
              {opened ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </ActionIcon>
          </Group>

          <Collapse in={opened}>
            <Card.Section withBorder inheritPadding mt="xs">
              <Accordion defaultValue="Apples" classNames={css}>
                {items}
              </Accordion>
            </Card.Section>
          </Collapse>
        </Card>
      </SimpleGrid>
    </Box>
  )
}
