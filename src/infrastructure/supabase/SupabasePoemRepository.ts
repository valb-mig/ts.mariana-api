import type { SupabaseClient } from '@supabase/supabase-js'
import type { Poem, CreatePoemInput } from '../../domain/poem/Poem'
import type { PoemRepository } from '../../domain/poem/PoemRepository'

export class SupabasePoemRepository implements PoemRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(): Promise<Poem[]> {
    const { data, error } = await this.client
      .from('poems')
      .select('id, title, body, type, featured, created_at')
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Supabase error: ${error.message}`)
    return data as Poem[]
  }

  async findFeatured(): Promise<Poem | null> {
    const all = await this.findAll()
    if (all.length === 0) return null

    const featured = all.filter(p => p.featured)
    const pool = featured.length > 0 ? featured : all

    return pool[Math.floor(Math.random() * pool.length)]
  }

  async save(input: CreatePoemInput): Promise<Poem> {
    const { data, error } = await this.client
      .from('poems')
      .insert({
        title:    input.title,
        body:     input.body,
        type:     input.type     ?? 'poem',
        featured: input.featured ?? false,
      })
      .select()
      .single()

    if (error) throw new Error(`Supabase error: ${error.message}`)
    return data as Poem
  }
}