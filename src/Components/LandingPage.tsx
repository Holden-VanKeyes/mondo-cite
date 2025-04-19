'use client'
import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import SlidingCard from './SlidingCard'
import { signIn, signOut } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'

import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Grid,
  Card,
  List,
  ThemeIcon,
  Divider,
  Box,
} from '@mantine/core'
import {
  Check,
  Search,
  FileExport,
  World,
  BrandGithub,
} from 'tabler-icons-react'
import classes from './LandingPage.module.css'

const citationExamples = [
  {
    name: 'DIN 1505 (Germany)',
    example:
      'MÜLLER, Hans ; SCHMIDT, Julia: Zitationsregeln im internationalen Vergleich: Eine Analyse wissenschaftlicher Konventionen. In: Deutsche Zeitschrift für Bildungsforschung 28 (2023), Nr. 4, S. 187-204',
  },
  {
    name: 'IEEE',
    example:
      'J. D. Smith and R. Johnson, "Advances in citation management systems for digital libraries," in IEEE Transactions on Information Science, vol. 41, no. 3, pp. 287-301, June 2023, doi: 10.1109/TIS.2023.0123456.',
  },
  {
    name: 'ABNT (Brazil)',
    example:
      'SILVA, M. R.; SOUZA, A. C. P. A gestão de referências bibliográficas em pesquisas acadêmicas. Revista Brasileira de Estudos, v. 18, n. 3, p. 45-67, 2023.',
  },
  {
    name: 'APA',
    example:
      'Smith, J. D., & Johnson, A. (2023). The impact of citation management on academic productivity. Journal of Academic Research, 45(2), 123-145. https://doi.org/10.xxxx/xxxxx',
  },
  {
    name: 'GB/T 7714 (China)',
    example:
      '王明, 李红. 参考文献管理软件的比较研究[J]. 情报科学, 2023, 41(3): 112-120.',
  },
]

export default function LandingPage() {
  const { data: session, status } = useSession()
  const [activeCitation, setActiveCitation] = useState(0)
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  //   const router = useRouter()

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCitation((current) => (current + 1) % citationExamples.length)
    }, 20000) // Change example every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Container size="lg" mt="lg">
      {/* Value Proposition */}
      <Container size="md" mb={60}>
        <Title order={2} ta="center" mb="xl">
          Citation Management for Everyone, Everywhere
        </Title>
        <Grid>
          <Grid.Col span={{ sm: 6, md: 3 }}>
            <Stack align="center" gap="sm">
              <ThemeIcon size={60} radius={60} color="#231650">
                <World size={34} />
              </ThemeIcon>
              <Text fw={500} ta="center">
                Global Citation Styles
              </Text>
              <Text size="sm" color="dimmed" ta="center">
                Support for regional styles like ABNT, GOST, GB/T 7714, and more
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ sm: 6, md: 3 }}>
            <Stack align="center" gap="sm">
              <ThemeIcon size={60} radius={60} color="#084A5E">
                <Search size={34} />
              </ThemeIcon>
              <Text fw={500} ta="center">
                Instant DOI Lookup
              </Text>
              <Text size="sm" color="dimmed" ta="center">
                Automatically populate citations with metadata from DOI
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ sm: 6, md: 3 }}>
            <Stack align="center" gap="sm">
              <ThemeIcon size={60} radius={60} color=" #0B6884">
                <FileExport size={34} />
              </ThemeIcon>
              <Text fw={500} ta="center">
                Export Flexibility
              </Text>
              <Text size="sm" color="dimmed" ta="center">
                Export citations in multiple formats ready to use
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ sm: 6, md: 3 }}>
            <Stack align="center" gap="sm">
              <ThemeIcon size={60} radius={60} color=" #177E89">
                <Check size={34} />
              </ThemeIcon>
              <Text fw={500} ta="center">
                Organized Libraries
              </Text>
              <Text size="sm" color="dimmed" ta="center">
                Keep your research organized with tags and collections
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      {/* Hero Section */}
      <div className={classes.hero}>
        <Container size="xl">
          <Grid gutter={50}>
            <Grid.Col span={7}>
              <Title order={1} size="h1" mb="md">
                Simplify Your Academic Citations Globally
              </Title>
              <Text size="lg" mb="xl">
                MondoCite is a citation management tool built for the global
                academic community, with first-class support for international
                and regional citation styles.
              </Text>
              <Group>
                <Button
                  size="lg"
                  radius="md"
                  //   variant="outline"
                  //   color="white"
                  onClick={() => signIn('auth0-signup', { callbackUrl })}
                >
                  Get Started — It&apos;s Free
                </Button>
                {/* <Button variant="outline" color="white" size="lg" radius="md">
                  Learn More
                </Button> */}
              </Group>
            </Grid.Col>
            <Grid.Col span={5}>
              <Box
                style={{ position: 'relative', height: '100%', minHeight: 250 }}
              >
                {/* <div className={classes.heroImagePlaceholder}> */}
                <SlidingCard examples={citationExamples} interval={8000} />
                {/* </div> */}

                {/* {citationExamples.map((style, index) => (
                  <Transition
                    key={index}
                    mounted={activeCitation === index}
                    transition="fade"
                    duration={400}
                    timingFunction="ease"
                  >
                    {(styles) => (
                      <Card
                        withBorder
                        p="md"
                        radius="md"
                        mb="md"
                        style={styles}
                      >
                        <Title order={4} mb="xs">
                          {style.name}
                        </Title>
                        <Text className={classes.styleExample}>
                          {style.example}
                        </Text>
                      </Card>
                    )}
                  </Transition>
                ))} */}
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </div>

      {/* Features Section */}
      <Title order={2} ta="center" mb="xl">
        Powerful Features for Researchers
      </Title>

      <Grid gutter={40} mb={60}>
        <Grid.Col span={6}>
          <Card className={classes.featureCard} p="xl" radius="md" withBorder>
            <Title order={3} mb="md">
              Simple Citation Management
            </Title>
            <Text mb="xl">
              Effortlessly create, organize, and format your citations with our
              intuitive interface. Save time on bibliography management and
              focus on your research.
            </Text>
            <List spacing="md">
              <List.Item
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
              >
                Import citations via DOI or manual entry
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
              >
                Organize with tags and collections
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
              >
                Search across your entire library
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
              >
                Export in multiple formats with one click
              </List.Item>
            </List>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card className={classes.featureCard} p="xl" radius="md" withBorder>
            <Title order={3} mb="md">
              Global Citation Standard Support
            </Title>
            <Text mb="xl">
              MondoCite is built from the ground up with international citation
              standards in mind, supporting researchers working in multiple
              languages and regions.
            </Text>
            <List spacing="md">
              <List.Item
                icon={
                  <ThemeIcon color="indigo" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
              >
                Common styles: APA, MLA, Chicago, Harvard
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="indigo" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
              >
                Brazilian ABNT standards
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="indigo" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
              >
                Chinese GB/T 7714 format
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="indigo" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
              >
                Russian GOST citation style
              </List.Item>
            </List>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Citation Style Examples */}
      {/* <Title order={2} ta="center" mb="xl">
        International Citation Style Examples
      </Title>

      <Grid mb={60}>
        {citationExamples.map((style, index) => (
          <Grid.Col span={6} key={index}>
            <Card withBorder p="md" radius="md" mb="md">
              <Title order={4} mb="xs">
                {style.name}
              </Title>
              <Text className={classes.styleExample}>{style.example}</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid> */}

      {/* Call to Action */}
      <Card withBorder p="xl" radius="lg" mb={60}>
        <Grid>
          <Grid.Col span={8}>
            <Title order={3} mb="sm">
              Ready to streamline your citation workflow?
            </Title>
            <Text size="lg" mb="md">
              Join researchers worldwide who use MondoCite to manage their
              academic references. Creating your account takes less than a
              minute.
            </Text>
          </Grid.Col>
          <Grid.Col
            span={4}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={() => signIn('auth0-signup', { callbackUrl })}
              size="lg"
              radius="md"
              fullWidth
            >
              Create Free Account
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Footer */}
      <Divider mb="xl" />
      <Group justify="apart" mb="xl">
        <Text size="sm">© 2025 MondoCite. All rights reserved.</Text>
        <Group gap="xs">
          <Button
            component="a"
            href="https://github.com"
            variant="subtle"
            size="compact-md"
          >
            <BrandGithub size={20} />
          </Button>
        </Group>
      </Group>
    </Container>
  )
}
