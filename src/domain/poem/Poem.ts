export type PoemType = 'poem' | 'quote' | 'letter'

export interface Poem {
  id: number
  title: string
  body: string
  type: PoemType
  featured: boolean
  created_at: string
}

export interface CreatePoemInput {
  title: string
  body: string
  type?: PoemType
  featured?: boolean
}
