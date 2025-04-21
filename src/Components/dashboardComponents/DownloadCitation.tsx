// components/citation/DownloadCitation.tsx
import React, { useState } from 'react'
import { Menu, Button, Text, Group, ActionIcon, Tooltip } from '@mantine/core'
import {
  Download,
  File,
  BracketsContain,
  FileCode,
  Table,
} from 'tabler-icons-react'
import { Citation } from '@/types'
import { generateJSON, generateCSV } from '../../app/utils/citationExport'

interface DownloadCitationProps {
  citation: Citation
}

export function DownloadCitation({ citation }: DownloadCitationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleServerDownload = async (format: 'bibtex' | 'ris') => {
    setIsLoading(true)
    try {
      // Create a hidden link to trigger the download
      const link = document.createElement('a')
      link.href = `/api/citations/export?id=${citation.id}&format=${format}`
      link.download = `citation-${citation.id}.${
        format === 'bibtex' ? 'bib' : 'ris'
      }`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClientDownload = (format: 'json' | 'csv') => {
    setIsLoading(true)
    try {
      let content = ''
      let contentType = ''
      let filename = ''

      if (format === 'json') {
        content = generateJSON(citation)
        contentType = 'application/json'
        filename = `citation-${citation.id}.json`
      } else if (format === 'csv') {
        content = generateCSV(citation)
        contentType = 'text/csv'
        filename = `citation-${citation.id}.csv`
      }

      // Create a blob and trigger download
      const blob = new Blob([content], { type: contentType })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Menu position="top-end" shadow="md">
      <Menu.Target>
        <Tooltip label="download">
          <ActionIcon variant="outline">
            <Download size={14} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Academic Formats</Menu.Label>
        <Menu.Item
          leftSection={<File size={16} />}
          onClick={() => handleServerDownload('bibtex')}
        >
          BibTeX
        </Menu.Item>
        <Menu.Item
          leftSection={<FileCode size={16} />}
          onClick={() => handleServerDownload('ris')}
        >
          RIS (EndNote, Mendeley)
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Data Formats</Menu.Label>
        <Menu.Item
          leftSection={<Table size={16} />}
          onClick={() => handleClientDownload('csv')}
        >
          CSV
        </Menu.Item>
        <Menu.Item
          leftSection={<BracketsContain size={16} />}
          onClick={() => handleClientDownload('json')}
        >
          JSON
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
