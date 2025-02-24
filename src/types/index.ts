export interface Citation {
  id: string
  title: string
  authors: Author[]
  journal?: string
  year: number
  doi?: string
  url?: string
  abstract?: string
  tags: string[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Author {
  firstName: string
  lastName: string
  middleName?: string
  affiliation?: string
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
