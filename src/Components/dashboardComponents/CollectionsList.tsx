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
  Modal,
  TextInput,
  Textarea,
  Stack,
  Loader,
  Title,
  Collapse,
  Badge,
  Divider,
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
} from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import CitationCard from './CitationCard'
import type { Citation } from '@/types'

interface Collection {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

// interface Citation {
//   id: string
//   title: string
//   journal?: string
//   year?: number
//   authors?: { firstName: string; lastName: string }[]
//   // Add other citation fields as needed
// }

export function CollectionsList() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null)
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false)
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

  const handleOpenModal = (collection?: Collection) => {
    if (collection) {
      setSelectedCollection(collection)
      setFormData({
        name: collection.name,
        description: collection.description || '',
      })
      setIsEditing(true)
    } else {
      setSelectedCollection(null)
      setFormData({ name: '', description: '' })
      setIsEditing(false)
    }
    openModal()
  }

  const handleCreateOrUpdateCollection = async () => {
    try {
      if (!formData.name.trim()) {
        notifications.show({
          title: 'Error',
          message: 'Collection name is required',
          color: 'red',
        })
        return
      }

      let response
      if (isEditing && selectedCollection) {
        // Update existing collection
        response = await fetch(`/api/collections/${selectedCollection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } else {
        // Create new collection
        response = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save collection')
      }

      // Refresh collections list
      await fetchCollections()
      closeModal()

      notifications.show({
        title: 'Success',
        message: isEditing ? 'Collection updated' : 'Collection created',
        color: 'green',
      })
    } catch (error) {
      console.error('Error saving collection:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to save collection',
        color: 'red',
      })
    }
  }

  const handleDeleteCollection = async (collectionId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this collection? This will not delete the citations inside it.'
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete collection')
      }

      // Refresh collections list
      await fetchCollections()

      notifications.show({
        title: 'Success',
        message: 'Collection deleted',
        color: 'green',
      })
    } catch (error) {
      console.error('Error deleting collection:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete collection',
        color: 'red',
      })
    }
  }

  const toggleCollectionExpand = (collectionId: string) => {
    if (expandedCollectionId === collectionId) {
      setExpandedCollectionId(null)
    } else {
      setExpandedCollectionId(collectionId)
      // Only fetch citations if we haven't already
      if (!collectionCitations[collectionId]) {
        fetchCollectionCitations(collectionId)
      }
    }
  }

  const removeCitationFromCollection = async (
    collectionId: string,
    citationId: string
  ) => {
    try {
      const response = await fetch(
        `/api/collections/${collectionId}/citations?citationId=${citationId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.error || 'Failed to remove citation from collection'
        )
      }

      // Update local state to remove the citation
      setCollectionCitations((prev) => ({
        ...prev,
        [collectionId]: prev[collectionId].filter(
          (citation) => citation.id !== citationId
        ),
      }))

      notifications.show({
        title: 'Success',
        message: 'Citation removed from collection',
        color: 'green',
      })
    } catch (error) {
      console.error('Error removing citation from collection:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to remove citation from collection',
        color: 'red',
      })
    }
  }

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
    <Box p="md">
      <Group justify="apart" mb="lg">
        <Title order={2}>Collections</Title>
        <Button
          leftSection={<FolderPlus size={20} />}
          onClick={() => handleOpenModal()}
        >
          New Collection
        </Button>
      </Group>

      {collections.length === 0 ? (
        <Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
          <Folder size={50} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <Text size="lg" fw={500} mb="xs">
            No collections yet
          </Text>
          <Text c="dimmed" mb="md">
            Create your first collection to organize your citations.
          </Text>
          <Button onClick={() => handleOpenModal()}>Create Collection</Button>
        </Card>
      ) : (
        <Stack gap="md">
          {collections.map((collection) => (
            <Card key={collection.id} withBorder shadow="sm" p="md" radius="md">
              <Card.Section p="md" withBorder>
                <Group gap="apart">
                  <Group>
                    <Folder size={20} />
                    <Text fw={500}>{collection.name}</Text>
                  </Group>
                  <Group gap="xs">
                    <Button
                      variant="subtle"
                      onClick={() => toggleCollectionExpand(collection.id)}
                      rightSection={
                        expandedCollectionId === collection.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      }
                    >
                      {expandedCollectionId === collection.id ? 'Hide' : 'View'}{' '}
                      Citations
                    </Button>
                    <Menu position="bottom-end" shadow="md">
                      <Menu.Target>
                        <ActionIcon>
                          <Dots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<Edit size={16} />}
                          onClick={() => handleOpenModal(collection)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<Trash size={16} />}
                          color="red"
                          onClick={() => handleDeleteCollection(collection.id)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Group>
                {collection.description && (
                  <Text c="dimmed" size="sm" mt="xs">
                    {collection.description}
                  </Text>
                )}
              </Card.Section>

              <Collapse in={expandedCollectionId === collection.id}>
                <Box p="md">
                  {loadingCitations[collection.id] ? (
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '1rem',
                      }}
                    >
                      <Loader size="sm" />
                    </Box>
                  ) : collectionCitations[collection.id]?.length ? (
                    <Stack gap="md">
                      {collectionCitations[collection.id].map((citation) => (
                        <Box key={citation.id}>
                          {citation.title}
                          {/* <CitationCard 
                              citation={citation} 
                              isInCollection 
                              onRemoveFromCollection={() => removeCitationFromCollection(collection.id, citation.id)}
                            /> */}
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Text c="dimmed" ta="center" p="md">
                      No citations in this collection yet.
                    </Text>
                  )}
                </Box>
              </Collapse>
            </Card>
          ))}
        </Stack>
      )}

      {/* Create/Edit Collection Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={isEditing ? 'Edit Collection' : 'Create New Collection'}
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCreateOrUpdateCollection()
          }}
        >
          <Stack gap="md">
            <TextInput
              required
              label="Collection Name"
              placeholder="Enter collection name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Textarea
              label="Description (optional)"
              placeholder="Enter collection description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              minRows={3}
            />
            <Group justify="right" mt="md">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  )
}

export default CollectionsList
