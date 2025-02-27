'use client'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { SessionProvider } from 'next-auth/react'
import { UserProvider } from '@/GlobalHelpers/userContext'
import '@mantine/notifications/styles.css'
import '@mantine/core/styles.css'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <MantineProvider defaultColorScheme="light">
          <Notifications />
          {children}
        </MantineProvider>
      </UserProvider>
    </SessionProvider>
  )
}
