import type { Poem, CreatePoemInput } from './Poem.js'

export interface PoemRepository {
  findAll(): Promise<Poem[]>
  findFeatured(): Promise<Poem | null>
  save(input: CreatePoemInput): Promise<Poem>
}