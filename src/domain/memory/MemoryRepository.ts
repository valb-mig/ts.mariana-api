import type { Memory } from './Memory.js'

export interface MemoryRepository {
  findAll(): Promise<Memory[]>
}
