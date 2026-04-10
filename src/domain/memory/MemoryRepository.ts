import type { Memory } from './Memory'

export interface MemoryRepository {
  findAll(): Promise<Memory[]>
}