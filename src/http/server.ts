import 'dotenv/config'
import { serve } from '@hono/node-server'
import { app } from './app.js'

const port = Number(process.env.PORT) || 8000

serve({ fetch: app.fetch, port }, () => {
  console.log(`🌹 Mariana API rodando em http://localhost:${port}`)
})
