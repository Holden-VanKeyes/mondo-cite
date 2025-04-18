export interface Author {
  firstName: string
  lastName: string
  middleName?: string
  affiliation?: string
}

export interface Tag {
  id: string
  name: string
  user_id: string
}

export interface Citation {
  id: string
  title: string
  journal?: string
  year: number
  volume?: string
  issue?: string
  pages?: string
  authors: Author[]
  type: string
  source: string
  doi?: string
  url?: string
  abstract?: string
  tags: Tag[]
  user_id: string
  isFavorite: boolean
  created_at: Date
  updated_at: Date
}

export interface User {
  id: string
  email: string
  name?: string
  institution?: string
  plan: 'free' | 'premium' | 'institutional'
  citationCount: number
  createdAt: Date
  updatedAt: Date
}
