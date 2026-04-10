# Mariana API ❤️ — TypeScript + Hono + Vercel

## Stack
- **Hono** — framework leve e moderno, funciona no Vercel serverless
- **Supabase JS** — client oficial, sem precisar de HTTP manual
- **TypeScript** — tipagem completa

## Endpoints

| Método | Rota             | Auth         | Descrição                     |
|--------|------------------|--------------|-------------------------------|
| GET    | /health          | —            | Health check                  |
| GET    | /poems           | —            | Lista todos os poemas         |
| GET    | /poems/featured  | —            | Poema em destaque (aleatório) |
| GET    | /memories        | —            | Lista todas as memórias       |
| POST   | /poems           | X-Api-Key    | Cria um novo poema            |

## Setup local

```bash
cp .env.example .env
# Preencha as variáveis

npm install
npm run dev
```

## Deploy no Vercel

1. Suba o projeto no GitHub
2. Conecte no Vercel (New Project → Import)
3. Configure as variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `API_SECRET_KEY`
4. Deploy automático ✅

## Criar um poema

```bash
curl -X POST https://sua-api.vercel.app/poems \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: sua_chave" \
  -d '{
    "title": "Pra você",
    "body": "Conteúdo do poema...",
    "type": "poem",
    "featured": true
  }'
```

## Estrutura

```
mariana-api-ts/
├── api/
│   └── index.ts              ← entry point Vercel
├── src/
│   ├── domain/
│   │   ├── poem/             ← tipos e interface do repositório
│   │   └── memory/
│   ├── infrastructure/
│   │   └── supabase/         ← implementações com @supabase/supabase-js
│   ├── application/
│   │   └── useCases.ts       ← GetPoems, GetFeaturedPoem, CreatePoem, GetMemories
│   └── http/
│       ├── app.ts            ← Hono app com rotas e middlewares
│       └── server.ts         ← servidor local (dev)
├── vercel.json
└── package.json
```
