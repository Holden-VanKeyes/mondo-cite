// app/api/collections/route.ts
import { NextRequest } from 'next/server'
import { getSession } from 'next-auth/react'
import { auth } from '../../../auth'

import db from '../../../db'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const collections = await db('collections')
      .where({ user_id: session.user.id })
      .orderBy('created_at', 'desc')

    return Response.json({ collections })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return Response.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  //   const session = await getSession()
  const session = await auth()
  console.log('Session In Back', session)

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, description } = await request.json()

    if (!name) {
      return Response.json(
        { error: 'Collection name is required' },
        { status: 400 }
      )
    }

    const [collection] = await db('collections')
      .insert({
        name,
        description: description || '',
        user_id: session.user.id,
      })
      .returning('*')

    return Response.json({ collection })
  } catch (error) {
    console.error('Error creating collection:', error)
    return Response.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}
