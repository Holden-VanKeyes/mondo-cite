import type { Citation, Author, Tag } from '@/types'

/**
 * Maps a database citation record to the frontend Citation model
 * @param dbCitation The citation record from the database
 * @param dbAuthors The author records related to this citation (from citation_authors table)
 * @param dbTags The tag records related to this citation (from citations_tags table)
 * @returns A Citation object formatted for frontend use
 */

export function mapDbCitationToModel(
  dbCitation: Citation,
  dbAuthors: Author[] = [],
  dbTags: Tag[] = []
): Citation {
  return {
    id: dbCitation.id,
    title: dbCitation.title,
    journal: dbCitation.journal,
    year: dbCitation.year,
    volume: dbCitation.volume,
    issue: dbCitation.issue,
    pages: dbCitation.pages,
    doi: dbCitation.doi,
    url: dbCitation.url,
    abstract: dbCitation.abstract,
    user_id: dbCitation.user_id,
    created_at: dbCitation.created_at,
    updated_at: dbCitation.updated_at,
    isFavorite: Boolean(dbCitation.isFavorite),
    source: dbCitation.source,
    type: dbCitation.type,

    // Map related data
    authors: dbCitation.authors.map((author) => ({
      firstName: author.firstName,
      lastName: author.lastName,
    })),

    tags: dbTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      user_id: tag.user_id,
    })),
  }
}

/**
 * Maps a frontend Citation model to a format suitable for database insertion/update
 * @param citation The frontend Citation object
 * @returns An object formatted for database operations
 */

export function mapModelToDbCitation(citation: Citation) {
  return {
    id: citation.id,
    title: citation.title,
    journal: citation.journal,
    year: citation.year,
    volume: citation.volume,
    issue: citation.issue,
    pages: citation.pages,
    doi: citation.doi,
    url: citation.url,
    abstract: citation.abstract,
    user_id: citation.user_id,
    isFavorite: citation.isFavorite,
    source: citation.source,
    type: citation.type,
    // Note: created_at and updated_at are typically handled by the database
    // Note: authors and tags are handled separately through junction tables
  }
}
