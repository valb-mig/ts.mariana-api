import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { SupabasePoemRepository }   from '../src/infrastructure/supabase/SupabasePoemRepository.js'
import { SupabaseMemoryRepository } from '../src/infrastructure/supabase/SupabaseMemoryRepository.js'
import { GetPoems, GetFeaturedPoem, CreatePoem, GetMemories } from '../src/application/useCases.js'

function getRepos() {
  const url = process.env.SUPABASE_URL!
  const key = process.env.SUPABASE_KEY!
  const client = createClient(url, key)
  return {
    poem:   new SupabasePoemRepository(client),
    memory: new SupabaseMemoryRepository(client),
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key')

  if (req.method === 'OPTIONS') return res.status(204).end()

  const url  = req.url ?? '/'
  const path = url.split('?')[0]

  try {
    const { poem: poemRepo, memory: memoryRepo } = getRepos()

    if (req.method === 'GET' && path === '/health') {
      return res.json({ status: 'ok', project: 'Mariana API ❤️' })
    }

    if (req.method === 'GET' && path === '/poems/featured') {
      const poem = await new GetFeaturedPoem(poemRepo).execute()
      if (!poem) return res.status(404).json({ message: 'Nenhum poema encontrado.' })
      return res.json(poem)
    }

    if (req.method === 'GET' && path === '/poems') {
      const poems = await new GetPoems(poemRepo).execute()
      return res.json(poems)
    }

    if (req.method === 'POST' && path === '/poems') {
      const apiKey = req.headers['x-api-key']
      if (apiKey !== process.env.API_SECRET_KEY) {
        return res.status(401).json({ message: 'Não autorizado.' })
      }
      try {
        const poem = await new CreatePoem(poemRepo).execute(req.body)
        return res.status(201).json(poem)
      } catch (err: any) {
        const isValidation = err.message.includes('obrigatório') || err.message.includes('deve ser')
        return res.status(isValidation ? 422 : 500).json({ message: err.message })
      }
    }

    if (req.method === 'GET' && path === '/memories') {
      const memories = await new GetMemories(memoryRepo).execute()
      return res.json(memories)
    }

    return res.status(404).json({ message: 'Rota não encontrada.' })

  } catch (err: any) {
    return res.status(500).json({ message: err.message })
  }
}