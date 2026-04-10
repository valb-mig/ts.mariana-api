import type { PoemRepository } from '../domain/poem/PoemRepository.js'
import type { MemoryRepository } from '../domain/memory/MemoryRepository.js'
import type { CreatePoemInput, PoemType } from '../domain/poem/Poem.js'

const VALID_TYPES: PoemType[] = ['poem', 'quote', 'letter']

export class GetPoems {
  constructor(private readonly repo: PoemRepository) {}
  execute() { return this.repo.findAll() }
}

export class GetFeaturedPoem {
  constructor(private readonly repo: PoemRepository) {}
  execute() { return this.repo.findFeatured() }
}

export class CreatePoem {
  constructor(private readonly repo: PoemRepository) {}

  async execute(input: unknown) {
    const data = input as Record<string, unknown>

    if (!data.title || typeof data.title !== 'string')
      throw new Error('O campo "title" é obrigatório.')

    if (!data.body || typeof data.body !== 'string')
      throw new Error('O campo "body" é obrigatório.')

    if (data.type && !VALID_TYPES.includes(data.type as PoemType))
      throw new Error(`"type" deve ser: ${VALID_TYPES.join(', ')}.`)

    return this.repo.save({
      title:    data.title.trim(),
      body:     data.body.trim(),
      type:     (data.type as PoemType) ?? 'poem',
      featured: Boolean(data.featured ?? false),
    } satisfies CreatePoemInput)
  }
}

export class GetMemories {
  constructor(private readonly repo: MemoryRepository) {}
  execute() { return this.repo.findAll() }
}