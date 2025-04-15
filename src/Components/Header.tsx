// Unorganized

// Icon: <FileQuestion />
// Description: "Citations not assigned to any project"

// Drafts/In Progress

// Icon: <FileEdit />
// Description: "Incomplete or draft citations"

'use client'
import {
  Book2,
  ChevronDown,
  Clock,
  Filter,
  Folders,
  Star,
  Users,
} from 'tabler-icons-react'
import {
  Anchor,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  ScrollArea,
  SimpleGrid,
  Avatar,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
//   import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './Header.module.css'
import { signIn, signOut } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@/GlobalHelpers/userContext'

import Link from 'next/link'

const libraryDropdown = [
  {
    icon: Book2,
    title: 'All Citations',
    description: 'View your complete citation library',
  },
  {
    icon: Clock,
    title: 'Recent',
    description: 'Citations added or modified in the last 30 days',
  },
  {
    icon: Folders,
    title: 'Projects/Collections',
    description: 'Organize citations by research project',
  },
  {
    icon: Star,
    title: 'Favorites',
    description: 'Your starred citations',
  },
  {
    icon: Filter,
    title: 'By Type',
    description: 'Filter by journal articles, books, conferences..',
  },
  {
    icon: Users,
    title: 'Shared With Me',
    description: 'Citations shared by collaborators',
  },
]

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false)
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false)
  const theme = useMantineTheme()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { user } = useUser()
  console.log('USER HERE', user)

  useEffect(() => {
    closeDrawer()
  }, [pathname])

  const checkDrawer = (href: string) => {
    if (pathname === href) {
      closeDrawer()
    }
  }

  const links = libraryDropdown.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ))

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* <MantineLogo size={30} /> */}

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Add
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Library
                    </Box>
                    <ChevronDown size={16} color={theme.colors.blue[6]} />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href="#" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      {/* <Text size="xs" c="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text> */}
                    </div>
                    {!user ? (
                      <Group>
                        <Button
                          variant="default"
                          onClick={() => signIn('auth0-login', { callbackUrl })}
                        >
                          Log in
                        </Button>
                        <Button
                          variant="default"
                          onClick={() =>
                            signIn('auth0-signup', { callbackUrl })
                          }
                        >
                          Sign up
                        </Button>
                      </Group>
                    ) : (
                      <Button
                        variant="default"
                        onClick={() =>
                          signOut({ callbackUrl: 'http://localhost:3000' })
                        }
                      >
                        Sign out
                      </Button>
                    )}
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <Link href="/settings" className={classes.link}>
              Settings
            </Link>
            {/* <a href="#" className={classes.link}>
              Academy
            </a> */}
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
          <Group>
            <Avatar color="blue" name={user?.name || ''} />
          </Group>
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

          <Link
            href="/"
            className={classes.link}
            onClick={() => checkDrawer('/')}
            style={{ paddingBottom: 5 }}
          >
            Add Citation
          </Link>

          <Link
            href="/settings"
            className={classes.link}
            onClick={() => checkDrawer('/settings')}
            style={{ paddingBottom: 5 }}
          >
            Settings
          </Link>

          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <ChevronDown size={16} color={theme.colors.blue[6]} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button onClick={() => signIn('auth0-login', { callbackUrl })}>
              Log in
            </Button>
            <Button onClick={() => signOut({ callbackUrl: '/' })}>
              Log Out
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  )
}
