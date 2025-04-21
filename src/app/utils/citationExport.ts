// lib/citation-export.ts
import type { Citation } from '@/types'

export function generateBibTeX(citation: Citation): string {
  const citeKey = generateCiteKey(citation)

  // Handle different citation types (article, book, etc.)
  let entryType = 'article' // default
  if (citation.type === 'book') entryType = 'book'
  // Add more type mappings as needed

  let bibtex = `@${entryType}{${citeKey},\n`

  // Add authors
  if (citation.authors && citation.authors.length > 0) {
    console.log('AUTH', citation.authors)
    const authorString = citation.authors
      .map((author) => `${author.lastName}, ${author.firstName}`)
      .join(' and ')
    bibtex += `  author = {${authorString}},\n`
  }

  // Add title
  bibtex += `  title = {${citation.title}},\n`

  // Add other fields based on citation type
  if (citation.journal) bibtex += `  journal = {${citation.journal}},\n`
  if (citation.year) bibtex += `  year = {${citation.year}},\n`
  if (citation.volume) bibtex += `  volume = {${citation.volume}},\n`
  if (citation.issue) bibtex += `  number = {${citation.issue}},\n`
  if (citation.pages) bibtex += `  pages = {${citation.pages}},\n`
  if (citation.doi) bibtex += `  doi = {${citation.doi}},\n`
  if (citation.url) bibtex += `  url = {${citation.url}},\n`

  bibtex += '}'
  return bibtex
}

export function generateRIS(citation: Citation): string {
  // RIS format has different type codes
  let typeCode = 'JOUR' // Default for journal article
  if (citation.type === 'book') typeCode = 'BOOK'
  // Add more mappings as needed

  let ris = `TY  - ${typeCode}\n`

  // Add title
  ris += `TI  - ${citation.title}\n`

  // Add authors
  if (citation.authors && citation.authors.length > 0) {
    citation.authors.forEach((author) => {
      ris += `AU  - ${author.lastName}, ${author.firstName}\n`
    })
  }

  // Add other fields
  if (citation.year) ris += `PY  - ${citation.year}\n`
  if (citation.journal) ris += `JO  - ${citation.journal}\n`
  if (citation.volume) ris += `VL  - ${citation.volume}\n`
  if (citation.issue) ris += `IS  - ${citation.issue}\n`
  if (citation.pages) ris += `SP  - ${citation.pages.split('-')[0]}\n`
  if (citation.pages && citation.pages.includes('-')) {
    ris += `EP  - ${citation.pages.split('-')[1]}\n`
  }
  if (citation.doi) ris += `DO  - ${citation.doi}\n`
  if (citation.url) ris += `UR  - ${citation.url}\n`

  // End record
  ris += 'ER  - \n'

  return ris
}

// Helper function to generate cite keys
function generateCiteKey(citation: Citation): string {
  const firstAuthor =
    citation.authors && citation.authors.length > 0
      ? citation.authors[0].lastName.toLowerCase()
      : 'anonymous'

  const year = citation.year || 'nd'

  // Use the first word of the title for the key
  const titleWord = citation.title
    .split(' ')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

  return `${firstAuthor}${year}${titleWord}`
}

// Client-side export functions
export function generateJSON(citation: Citation): string {
  return JSON.stringify(citation, null, 2)
}

export function generateCSV(citation: Citation): string {
  // CSV header
  const header = 'Title,Authors,Year,Journal,Volume,Issue,Pages,DOI,URL\n'

  // Format authors
  const authors = citation.authors
    ? citation.authors.map((a) => `${a.lastName}, ${a.firstName}`).join('; ')
    : ''

  // Create CSV row
  const row = [
    escapeCsvField(citation.title),
    escapeCsvField(authors),
    citation.year || '',
    escapeCsvField(citation.journal || ''),
    citation.volume || '',
    citation.issue || '',
    citation.pages || '',
    citation.doi || '',
    citation.url || '',
  ].join(',')

  return header + row
}

// Helper for CSV formatting
function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    // Escape double quotes with double quotes and wrap in quotes
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}
