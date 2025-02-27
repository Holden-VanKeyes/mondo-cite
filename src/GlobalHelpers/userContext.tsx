// userContext.js
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface User {
  id?: string
  name?: string | null | undefined
  email?: string
  image?: string | null | undefined
  // Add other user properties you need
}
interface UserContextProps {
  user: User | null
  loading: boolean
  status?: string
}

const UserContextObject = createContext<UserContextProps>({
  user: null,
  loading: false,
  status: undefined,
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log('TRUE')
      setUser(session.user)
      setLoading(false)
    } else if (status === 'unauthenticated') {
      setUser(null)
      setLoading(false)
    }
  }, [session, status])

  return (
    <UserContextObject value={{ user, loading, status }}>
      {children}
    </UserContextObject>
  )
}

export function useUser() {
  return useContext(UserContextObject)
}
