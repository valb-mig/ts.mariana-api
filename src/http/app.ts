import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'
import { SupabasePoemRepository }   from '../infrastructure/supabase/SupabasePoemRepository.js'
import { SupabaseMemoryRepository } from '../infrastructure/supabase/SupabaseMemoryRepository.js'
import { GetPoems, GetFeaturedPoem, CreatePoem, GetMemories } from '../application/useCases.js'

// ── Bootstrap ────────────────────────────────────────────────
function buildApp() {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_KEY!
  const secretKey   = process.env.API_SECRET_KEY!

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL e SUPABASE_KEY são obrigatórias.')
  }

  const supabase  = createClient(supabaseUrl, supabaseKey)
  const poemRepo  = new SupabasePoemRepository(supabase)
  const memRepo   = new SupabaseMemoryRepository(supabase)

  const getPoems      = new GetPoems(poemRepo)
  const getFeatured   = new GetFeaturedPoem(poemRepo)
  const createPoem    = new CreatePoem(poemRepo)
  const getMemories   = new GetMemories(memRepo)

  // ── Middleware de autenticação ───────────────────────────────
  const authMiddleware = async (c: any, next: any) => {
    const key = c.req.header('x-api-key')
    if (!secretKey || key !== secretKey) {
      return c.json({ message: 'Não autorizado. Informe o header X-Api-Key.' }, 401)
    }
    await next()
  }

  // ── App ──────────────────────────────────────────────────────
  const app = new Hono()

  app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-Api-Key'],
  }))

  // Rotas públicas
  app.get('/health', c => c.json({ status: 'ok', project: 'Mariana API ❤️' }))

  app.get('/poems', async c => {
    const poems = await getPoems.execute()
    return c.json(poems)
  })

  app.get('/poems/featured', async c => {
    const poem = await getFeatured.execute()
    if (!poem) return c.json({ message: 'Nenhum poema encontrado.' }, 404)
    return c.json(poem)
  })

  app.get('/memories', async c => {
    const memories = await getMemories.execute()
    return c.json(memories)
  })

  // Rota protegida
  app.post('/poems', authMiddleware, async c => {
    try {
      const body = await c.req.json()
      const poem = await createPoem.execute(body)
      return c.json(poem, 201)
    } catch (err: any) {
      const isValidation = err.message.includes('obrigatório') || err.message.includes('deve ser')
      return c.json({ message: err.message }, isValidation ? 422 : 500)
    }
  })

  return app
}

export const app = buildApp()
