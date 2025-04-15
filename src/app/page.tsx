'use client'
import { useState, useEffect, useRef } from 'react'
import CitationList from '../Components/CitationList'
import CitationInputForm from '@/Components/CitationInputForm'
import { Header } from '@/Components/Header'
import LandingPage from '@/Components/LandingPage'
import { useSession } from 'next-auth/react'
import Dashboard from '@/Components/Dashboard'
import { LoadingOverlay } from '@mantine/core'
import { usePathname } from 'next/navigation'
import path from 'path'

export default function Home() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const initialLoadRef = useRef(true)
  const pathname = usePathname()
  console.log('PATH', pathname)

  useEffect(() => {
    // Only show loading on initial page load when checking auth
    // Skip loading state for subsequent auth state changes (like logout)
    if (status !== 'loading') {
      if (initialLoadRef.current) {
        const timer = setTimeout(() => {
          setIsLoading(false)
          initialLoadRef.current = false
        }, 800)

        return () => clearTimeout(timer)
      } else {
        // Immediately update for subsequent auth changes
        setIsLoading(false)
      }
    }
  }, [status])

  if ((status === 'loading' || isLoading) && initialLoadRef.current) {
    return (
      <>
        <Header />
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'xl', blur: 2 }}
          loaderProps={{ type: 'bars' }}
        />
      </>
    )
  }

  return (
    <>
      {/* <Header /> */}
      {session ? <Dashboard /> : <LandingPage />}
    </>
  )
}
