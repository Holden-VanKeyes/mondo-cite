import { NextRequest, NextResponse } from 'next/server'
import { generateBibTeX, generateRIS } from '../../../utils/citationExport'
import { getCitationById } from '../../../utils/getCitationById'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')
  const format = searchParams.get('format')

  if (!id || !format) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  try {
    const citation = await getCitationById(id)
    console.log('CITE', citation)

    if (!citation) {
      return NextResponse.json({ error: 'Citation not found' }, { status: 404 })
    }

    let content = ''
    let filename = ''
    let contentType = ''

    switch (format) {
      case 'bibtex':
        content = generateBibTeX(citation)
        filename = `citation-${id}.bib`
        contentType = 'application/x-bibtex'
        break
      case 'ris':
        content = generateRIS(citation)
        filename = `citation-${id}.ris`
        contentType = 'application/x-research-info-systems'
        break
      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        )
    }

    const response = new NextResponse(content)
    response.headers.set('Content-Type', contentType)
    response.headers.set(
      'Content-Disposition',
      `attachment; filename=${filename}`
    )
    return response
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export citation' },
      { status: 500 }
    )
  }
}
