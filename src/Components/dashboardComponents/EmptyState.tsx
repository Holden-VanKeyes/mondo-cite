import React from 'react'
import {
  Center,
  Paper,
  Stack,
  Title,
  Text,
  Button,
  Divider,
  Flex,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Plus } from 'tabler-icons-react'
import NextImage from 'next/image'
interface EmptyStateProps {
  handleDrawer: () => void
}

export default function EmptyState({ handleDrawer }: EmptyStateProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return (
    <Center>
      <Paper
        p={{ base: 'xs', sm: 'xl' }}
        mt={{ base: 0, sm: 'xl' }}
        radius="md"
        // withBorder={!isMobile}
        style={{ maxWidth: 1000 }}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          align="center"
        >
          <NextImage
            src="/bookshelf5.jpeg"
            alt="Empty library illustration"
            placeholder="empty"
            width={450}
            height={450}
            sizes="(max-width: 768px) 100vw, 450px"
            style={{
              width: '100%',
              maxWidth: '450px',
              height: 'auto',
            }}
          />
          <Stack align="center" gap="lg">
            <Title order={2} ta="center">
              Your citation library is empty
            </Title>
            <Text ta="center" c="dimmed">
              Start building your collection by adding your first academic
              citation
            </Text>
            <Button
              leftSection={<Plus size={16} />}
              variant="filled"
              color="blue"
              size="md"
              onClick={handleDrawer}
            >
              Add Your First Citation
            </Button>

            <Divider label="or" labelPosition="center" my="md" w="100%" />

            <Button variant="light">Take a quick tour</Button>
          </Stack>
        </Flex>
      </Paper>
    </Center>
  )
}
