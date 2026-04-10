import type { SupabaseClient } from '@supabase/supabase-js'
import type { Memory } from '../../domain/memory/Memory.js'
import type { MemoryRepository } from '../../domain/memory/MemoryRepository.js'

export class SupabaseMemoryRepository implements MemoryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(): Promise<Memory[]> {
    const { data, error } = await this.client
      .from('memories')
      .select('id, title, description, image_base64, date, created_at')
      .order('date', { ascending: false })

    if (error) throw new Error(`Supabase error: ${error.message}`)
    return data as Memory[]
  }
}
