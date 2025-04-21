import { NextRequest, NextResponse } from 'next/server'
import { getSession } from 'next-auth/react'
import { auth } from '../../../../auth'

import db from '../../../../db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const collectionCitations = await db('citations')
      .join(
        'citation_collections',
        'citations.id',
        'citation_collections.citation_id'
      )
      .leftJoin(
        'citation_authors',
        'citations.id',
        'citation_authors.citation_id'
      )
      .leftJoin('authors', 'citation_authors.author_id', 'authors.id')
      .where('citation_collections.collection_id', id)
      .select('citations.*')
      .select(
        db.raw(
          "json_agg(json_build_object('firstName', authors.first_name, 'lastName', authors.last_name)) as authors"
        )
      )
      .groupBy('citations.id')
    console.log('Session In Back', collectionCitations)
    return NextResponse.json({ collectionCitations })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return Response.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}
