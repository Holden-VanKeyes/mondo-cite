import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
import db from '../../../db'
// import { authOptions } from '@/lib/auth'
console.log('API ROUTE HIT') // Add this

export async function GET() {
  // const session = await getServerSession(authOptions)

  // if (!session) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  const citations = await db('citations')
    .select(
      'citations.*',
      db.raw(`
        json_agg(
          json_build_object(
            'id', authors.id,
            'firstName', authors.first_name,
            'lastName', authors.last_name,
            'middleName', authors.middle_name,
            'affiliation', authors.affiliation
          )
        ) as authors
      `)
    )
    .leftJoin(
      'citation_authors',
      'citations.id',
      'citation_authors.citation_id'
    )
    .leftJoin('authors', 'citation_authors.author_id', 'authors.id')
    // .where('citations.user_id', session.user.id)
    .groupBy('citations.id')
    .orderBy('citations.created_at', 'desc')

  console.log('CITE', citations)

  return NextResponse.json(citations)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (data.doi) {
      const existingCitation = await db('citations')
        .where('doi', data.doi)
        .first()

      if (existingCitation) {
        return NextResponse.json(
          {
            error: 'Citation already exists',
            citation: existingCitation,
            status: 'duplicate',
          },
          { status: 409 } // HTTP 409 Conflict
        )
      }
    }

    // Begin transaction since we'll be inserting to multiple tables
    const trx = await db.transaction()

    try {
      // 1. Insert the citation
      const [citation] = await trx('citations')
        .insert({
          title: data.title,
          journal: data.journal,
          year: data.year,
          volume: data.volume,
          issue: data.issue,
          pages: data.pages,
          doi: data.doi,
          url: data.url,
          abstract: data.abstract,
        })
        .returning('*')

      // 2. Handle authors
      // Split authors string into array and clean up
      const authorNames = data.authors
        .split(',')
        .map((author: string) => author.trim())
        .filter((author: string) => author)

      // Insert authors and create relationships
      for (const authorName of authorNames) {
        const [firstName, ...lastNameParts] = authorName.split(' ')
        const lastName = lastNameParts.join(' ')

        // Insert or find author
        const [author] = await trx('authors')
          .insert({
            first_name: firstName,
            last_name: lastName,
          })
          .onConflict(['first_name', 'last_name'])
          .merge()
          .returning('id')

        // Create citation-author relationship
        await trx('citation_authors').insert({
          citation_id: citation.id,
          author_id: author.id,
        })
      }

      // Commit transaction
      await trx.commit()

      // Fetch the complete citation with authors
      const completeCitation = await db('citations')
        .select(
          'citations.*',
          db.raw(`
            json_agg(
              json_build_object(
                'id', authors.id,
                'firstName', authors.first_name,
                'lastName', authors.last_name,
                'middleName', authors.middle_name,
                'affiliation', authors.affiliation
              )
            ) as authors
          `)
        )
        .leftJoin(
          'citation_authors',
          'citations.id',
          'citation_authors.citation_id'
        )
        .leftJoin('authors', 'citation_authors.author_id', 'authors.id')
        .where('citations.id', citation.id)
        .groupBy('citations.id')
        .first()

      return NextResponse.json(completeCitation)
    } catch (error) {
      // Rollback transaction on error
      await trx.rollback()
      throw error
    }
  } catch (error) {
    console.error('Error creating citation:', error)
    return NextResponse.json(
      { error: 'Failed to create citation' },
      { status: 500 }
    )
  }
}
