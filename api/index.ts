import { handle } from 'hono/vercel'
import { app } from '../src/http/app.js'

export const config = { runtime: 'nodejs' }

export default handle(app)
