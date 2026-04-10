import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { SupabasePoemRepository }   from '../src/infrastructure/supabase/SupabasePoemRepository.js'
import { SupabaseMemoryRepository } from '../src/infrastructure/supabase/SupabaseMemoryRepository.js'
import { GetPoems, GetFeaturedPoem, CreatePoem, GetMemories } from '../src/application/useCases.js'

function getRepos() {
  const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
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

  const path = (req.url ?? '/').split('?')[0]

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
      return res.json(await new GetPoems(poemRepo).execute())
    }

    if (req.method === 'POST' && path === '/poems') {
      if (req.headers['x-api-key'] !== process.env.API_SECRET_KEY) {
        return res.status(401).json({ message: 'Não autorizado.' })
      }
      try {
        return res.status(201).json(await new CreatePoem(poemRepo).execute(req.body))
      } catch (err: any) {
        const status = err.message.includes('obrigatório') || err.message.includes('deve ser') ? 422 : 500
        return res.status(status).json({ message: err.message })
      }
    }

    if (req.method === 'GET' && path === '/memories') {
      return res.json(await new GetMemories(memoryRepo).execute())
    }

    return res.status(404).json({ message: 'Rota não encontrada.' })

  } catch (err: any) {
    return res.status(500).json({ message: err.message })
  }
}