import { NextResponse } from 'next/server'
import { auth } from '../../../auth'
import db from '../../../db'
import { mapDbCitationToModel } from '../../utils/mappers/citationMapper'

export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
    .where('citations.user_id', session.user.id)
    .groupBy('citations.id')
    .orderBy('citations.created_at', 'desc')
  const mappedCitations = citations.map((citation) =>
    mapDbCitationToModel(citation, citation.authors || [])
  )

  return NextResponse.json(mappedCitations)
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await request.json()
    const citationId = data.id

    // Fetch the current citation
    const currentCitation = await db('citations')
      .where('id', citationId)
      .first()

    // Start a transaction to handle potential author updates
    await db.transaction(async (trx) => {
      let updateData = {}

      // Check if this is a favorite toggle or a general update
      if (
        data.hasOwnProperty('toggleFavorite') &&
        data.toggleFavorite === true
      ) {
        // This is a favorite toggle operation
        updateData = {
          isFavorite: !currentCitation.isFavorite,
          updated_at: new Date(),
        }

        // Update the citation only
        await trx('citations').where('id', citationId).update(updateData)
      } else {
        // This is a general update operation
        // Extract citation fields (excluding authors which need special handling)
        const {
          title,
          journal,
          year,
          volume,
          issue,
          pages,
          doi,
          url,
          publisher,
          abstract,
          authors,
        } = data.data

        updateData = {
          ...(title !== undefined && { title }),
          ...(journal !== undefined && { journal }),
          ...(year !== undefined && { year }),
          ...(volume !== undefined && { volume }),
          ...(issue !== undefined && { issue }),
          ...(pages !== undefined && { pages }),
          ...(doi !== undefined && { doi }),
          ...(url !== undefined && { url }),
          ...(publisher !== undefined && { publisher }),
          ...(abstract !== undefined && { abstract }),
          updated_at: new Date(),
        }

        // Update the citation
        await trx('citations').where('id', citationId).update(updateData)

        // Handle authors if they were provided
        if (authors && Array.isArray(authors)) {
          // Remove existing author relationships
          await trx('citation_authors')
            .where('citation_id', citationId)
            .delete()

          // Create new author entries or use existing ones
          for (const authorName of authors) {
            // Check if author already exists
            const { first_name, last_name } = authorName

            let authorRecord = await trx('authors')
              .where({
                first_name: first_name,
                last_name: last_name,
              })
              .first()

            // If not, create the author
            if (!authorRecord) {
              ;[authorRecord] = await trx('authors')
                .insert({
                  first_name: first_name,
                  last_name: last_name,
                })
                .returning('*')
            }

            // Create the relationship
            await trx('citation_authors').insert({
              citation_id: citationId,
              author_id: authorRecord.id,
              // You might want to add an order field here if author order matters
            })
          }
        }
      }
    })

    // Fetch the updated citation with its authors to return
    const updatedCitation = await db('citations')
      .where('id', citationId)
      .first()

    // Fetch authors separately and attach them
    const authors = await db('authors')
      .join('citation_authors', 'authors.id', 'citation_authors.author_id')
      .where('citation_authors.citation_id', citationId)
      .select('authors.first_name', 'authors.last_name')
      .orderBy('authors.id') // Assuming you have an order field or ID to maintain order

    updatedCitation.authors = authors.map((author) => ({
      first_name: author.first_name,
      last_name: author.last_name,
    }))

    return Response.json({
      success: true,
      message: data.hasOwnProperty('toggleFavorite')
        ? `Citation ${
            updatedCitation.isFavorite ? 'added to' : 'removed from'
          } favorites`
        : 'Citation updated successfully',
      citation: updatedCitation,
    })
  } catch (error) {
    console.error('Error updating citation:', error)
    return NextResponse.json(
      { error: 'Failed to update citation' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await request.json()
    const userId = session.user.id
    console.log('USER', userId)

    if (data.doi) {
      const existingCitation = await db('citations')
        .where({ doi: data.doi, user_id: userId })
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
          user_id: userId,
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
        let authorExists = await trx('authors')
          .where({
            first_name: firstName,
            last_name: lastName,
          })
          .first()

        if (!authorExists) {
          const [newAuthor] = await trx('authors')
            .insert({
              first_name: firstName,
              last_name: lastName,
            })
            // .onConflict(['first_name', 'last_name'])
            // .merge()
            .returning('id')
          authorExists = newAuthor
        }
        const authorId = authorExists.id

        // Create citation-author relationship
        await trx('citation_authors').insert({
          citation_id: citation.id,
          author_id: authorId,
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
export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await request.json()

    // Delete the citation and its relationships
    await db.transaction(async (trx) => {
      await trx('citation_authors').where('citation_id', id).del()
      await trx('citations').where('id', id).del()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting citation:', error)
    return NextResponse.json(
      { error: 'Failed to delete citation' },
      { status: 500 }
    )
  }
}
