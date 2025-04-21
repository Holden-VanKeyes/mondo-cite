import db from '../../db'
import { mapDbCitationToModel } from './mappers/citationMapper'

export async function getCitationById(id: string) {
  const citation = await db('citations')
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
        ) FILTER (WHERE authors.id IS NOT NULL) as authors
      `)
    )
    .leftJoin(
      'citation_authors',
      'citations.id',
      'citation_authors.citation_id'
    )
    .leftJoin('authors', 'citation_authors.author_id', 'authors.id')
    .where('citations.id', id)
    .groupBy('citations.id')
    .first()
  const formattedCitation = mapDbCitationToModel(citation)
  console.log('BACKEND CITATION', formattedCitation)

  return formattedCitation
}
