// src/lib/citationFormatter.ts

import { Citation } from '@/types'
import { Author } from '@/types'

export type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee'

/**
 * Formats a citation according to a specific academic style
 */
export function formatCitation(
  citation: Citation,
  style: CitationStyle
): string {
  switch (style) {
    case 'apa':
      return formatAPA(citation)
    case 'mla':
      return formatMLA(citation)
    case 'chicago':
      return formatChicago(citation)
    case 'harvard':
      return formatHarvard(citation)
    case 'ieee':
      return formatIEEE(citation)
    default:
      return formatAPA(citation) // Default to APA
  }
}

/**
 * Formats a citation in APA style (7th edition)
 * Format: Author, A. A., & Author, B. B. (Year). Title of article. Title of Journal, volume(issue),
 * page-range. https://doi.org/xx.xxx/xxxx
 */
function formatAPA(citation: Citation): string {
  // Format authors (Last, F. I., & Last, F. I.)
  const authors = formatAuthorsAPA(citation.authors)

  // Format publication year
  const year = citation.year ? `(${citation.year})` : '(n.d.)'

  // Format title (italicized for books/journals, regular for articles)
  const title = citation.title ? `${citation.title}.` : ''

  // Format publication details based on type
  let publicationDetails = ''
  if (citation.type === 'article') {
    const journal = citation.journal ? `${citation.journal}` : ''
    const volume = citation.volume ? `, ${citation.volume}` : ''
    const issue = citation.issue ? `(${citation.issue})` : ''
    const pages = citation.pages ? `, ${citation.pages}` : ''
    publicationDetails = `${journal}${volume}${issue}${pages}.`
  } else if (citation.type === 'book') {
    const source = citation.source ? `${citation.source}.` : ''
    publicationDetails = source
  }

  // Format URL/DOI
  const doi = citation.doi ? ` https://doi.org/${citation.doi}` : ''
  const url = !doi && citation.url ? ` ${citation.url}` : ''

  // Combine all parts
  return `${authors} ${year}. ${title} ${publicationDetails}${doi}${url}`
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Formats a citation in MLA style (9th edition)
 * Format: Author Last, First. "Title of Article." Title of Journal, vol. #, no. #, Year, pp. #-#.
 */
function formatMLA(citation: Citation): string {
  // Format authors (Last, First, and First Last)
  const authors = formatAuthorsMLA(citation.authors)

  // Format title (in quotes for articles, italicized for books/journals)
  const title = citation.title ? `"${citation.title}."` : ''

  // Format publication details based on type
  let publicationDetails = ''
  if (citation.type === 'article') {
    const journal = citation.journal ? `${citation.journal},` : ''
    const volume = citation.volume ? ` vol. ${citation.volume},` : ''
    const issue = citation.issue ? ` no. ${citation.issue},` : ''
    const year = citation.year ? ` ${citation.year},` : ''
    const pages = citation.pages ? ` pp. ${citation.pages}.` : ''
    publicationDetails = `${journal}${volume}${issue}${year}${pages}`
  } else if (citation.type === 'book') {
    const source = citation.source ? `${citation.source},` : ''
    const year = citation.year ? ` ${citation.year}.` : ''
    publicationDetails = `${source}${year}`
  }

  // Combine all parts
  return `${authors} ${title} ${publicationDetails}`.trim().replace(/\s+/g, ' ')
}

/**
 * Formats a citation in Chicago style (17th edition)
 * Format: Author Last, First. "Title of Article." Title of Journal volume, no. issue (Year): page-range.
 */
function formatChicago(citation: Citation): string {
  // Format authors (Last, First, and First Last)
  const authors = formatAuthorsChicago(citation.authors)

  // Format title (in quotes for articles, italicized for books)
  const title = citation.title ? `"${citation.title}."` : ''

  // Format publication details based on type
  let publicationDetails = ''
  if (citation.type === 'article') {
    const journal = citation.journal ? `${citation.journal} ` : ''
    const volume = citation.volume ? `${citation.volume}, ` : ''
    const issue = citation.issue ? `no. ${citation.issue} ` : ''
    const year = citation.year ? `(${citation.year}): ` : ''
    const pages = citation.pages ? `${citation.pages}.` : ''
    publicationDetails = `${journal}${volume}${issue}${year}${pages}`
  } else if (citation.type === 'book') {
    const source = citation.source ? `${citation.source}, ` : ''
    const year = citation.year ? `${citation.year}.` : ''
    publicationDetails = `${source}${year}`
  }

  // Combine all parts
  return `${authors} ${title} ${publicationDetails}`.trim().replace(/\s+/g, ' ')
}

/**
 * Formats a citation in Harvard style
 * Format: Author Last, F. and Last, F. (Year) 'Title of article', Title of Journal, volume(issue), pp. page-range.
 */
function formatHarvard(citation: Citation): string {
  // Format authors (Last, F. and Last, F.)
  const authors = formatAuthorsHarvard(citation.authors)

  // Format year
  const year = citation.year ? `(${citation.year})` : '(n.d.)'

  // Format title (in quotes for articles, italicized for books)
  const title = citation.title ? `'${citation.title}',` : ''

  // Format publication details based on type
  let publicationDetails = ''
  if (citation.type === 'article') {
    const journal = citation.journal ? `${citation.journal},` : ''
    const volume = citation.volume ? ` ${citation.volume}` : ''
    const issue = citation.issue ? `(${citation.issue}),` : ''
    const pages = citation.pages ? ` pp. ${citation.pages}.` : ''
    publicationDetails = `${journal}${volume}${issue}${pages}`
  } else if (citation.type === 'book') {
    const source = citation.source ? `${citation.source}.` : ''
    publicationDetails = source
  }

  // Combine all parts
  return `${authors} ${year} ${title} ${publicationDetails}`
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Formats a citation in IEEE style
 * Format: [#] A. A. Author and B. B. Author, "Title of article," Title of Journal, vol. #, no. #, pp. #-#, Month Year.
 */
function formatIEEE(citation: Citation): string {
  // Format authors (A. A. Author and B. B. Author)
  const authors = formatAuthorsIEEE(citation.authors)

  // Format title (in quotes)
  const title = citation.title ? `"${citation.title},"` : ''

  // Format publication details based on type
  let publicationDetails = ''
  if (citation.type === 'article') {
    const journal = citation.journal ? `${citation.journal},` : ''
    const volume = citation.volume ? ` vol. ${citation.volume},` : ''
    const issue = citation.issue ? ` no. ${citation.issue},` : ''
    const pages = citation.pages ? ` pp. ${citation.pages},` : ''
    const year = citation.year ? ` ${citation.year}.` : ''
    publicationDetails = `${journal}${volume}${issue}${pages}${year}`
  } else if (citation.type === 'book') {
    const source = citation.source ? `${citation.source},` : ''
    const year = citation.year ? ` ${citation.year}.` : ''
    publicationDetails = `${source}${year}`
  }

  // Combine all parts
  return `${authors}, ${title} ${publicationDetails}`
    .trim()
    .replace(/\s+/g, ' ')
}

// Helper functions for formatting authors in different styles
function formatAuthorsAPA(authors: Author[]): string {
  if (!authors || authors.length === 0) return ''

  if (authors.length === 1) {
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}.`
  } else if (authors.length === 2) {
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}., & ${
      authors[1].lastName
    }, ${authors[1].firstName.charAt(0)}.`
  } else if (authors.length > 2) {
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}., et al.`
  }

  return ''
}

function formatAuthorsMLA(authors: Author[]): string {
  if (!authors || authors.length === 0) return ''

  if (authors.length === 1) {
    return `${authors[0].lastName}, ${authors[0].firstName}.`
  } else if (authors.length === 2) {
    return `${authors[0].lastName}, ${authors[0].firstName}, and ${authors[1].firstName} ${authors[1].lastName}.`
  } else if (authors.length > 2) {
    return `${authors[0].lastName}, ${authors[0].firstName}, et al.`
  }

  return ''
}

function formatAuthorsChicago(authors: Author[]): string {
  if (!authors || authors.length === 0) return ''

  if (authors.length === 1) {
    return `${authors[0].lastName}, ${authors[0].firstName}.`
  } else if (authors.length === 2) {
    return `${authors[0].lastName}, ${authors[0].firstName}, and ${authors[1].firstName} ${authors[1].lastName}.`
  } else if (authors.length > 2) {
    return `${authors[0].lastName}, ${authors[0].firstName}, et al.`
  }

  return ''
}

function formatAuthorsHarvard(authors: Author[]): string {
  if (!authors || authors.length === 0) return ''

  if (authors.length === 1) {
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}.`
  } else if (authors.length === 2) {
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}. and ${
      authors[1].lastName
    }, ${authors[1].firstName.charAt(0)}.`
  } else if (authors.length > 2) {
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}. et al.`
  }

  return ''
}

function formatAuthorsIEEE(authors: Author[]): string {
  if (!authors || authors.length === 0) return ''

  if (authors.length === 1) {
    return `${authors[0].firstName.charAt(0)}. ${authors[0].lastName}`
  } else if (authors.length === 2) {
    return `${authors[0].firstName.charAt(0)}. ${
      authors[0].lastName
    } and ${authors[1].firstName.charAt(0)}. ${authors[1].lastName}`
  } else if (authors.length > 2) {
    return `${authors[0].firstName.charAt(0)}. ${authors[0].lastName} et al.`
  }

  return ''
}

/**
 * Returns a list of available citation styles
 */
export function getAvailableCitationStyles(): {
  id: CitationStyle
  name: string
}[] {
  return [
    { id: 'apa', name: 'APA (7th edition)' },
    { id: 'mla', name: 'MLA (9th edition)' },
    { id: 'chicago', name: 'Chicago (17th edition)' },
    { id: 'harvard', name: 'Harvard' },
    { id: 'ieee', name: 'IEEE' },
  ]
}
