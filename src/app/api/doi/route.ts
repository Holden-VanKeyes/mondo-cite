// src/app/api/doi/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { doi } = await request.json()

    // CrossRef API URL
    const url = `https://api.crossref.org/works/${doi}`
    const response = await fetch(url, {
      headers: {
        // Add your email for better support from CrossRef
        'User-Agent': 'MondoCite (mailto:your-email@example.com)',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch DOI data')
    }

    const data = await response.json()
    const work = data.message

    // Transform the CrossRef data into our citation format
    const citation = {
      title: work.title[0],
      authors:
        work.author?.map((author: any) => ({
          firstName: author.given,
          lastName: author.family,
          affiliation: author.affiliation?.[0]?.name,
        })) || [],
      journal: work['container-title']?.[0],
      year: work.published?.['date-parts']?.[0]?.[0],
      volume: work.volume,
      issue: work.issue,
      pages: work.page,
      doi: work.DOI,
      url: work.URL,
      abstract: work.abstract,
    }

    return NextResponse.json(citation)
  } catch (error) {
    console.error('DOI lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch citation data' },
      { status: 500 }
    )
  }
}
