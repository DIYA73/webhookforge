#  webhookforge

**Webhook Inspector, Replayer & Analytics Dashboard**

> Capture, inspect, replay, and analyze webhooks in real-time.
> Self-hostable alternative to RequestBin — with a proper analytics dashboard.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Live Demo](https://webhookforge.vercel.app) · [API Docs](https://webhookforge-api.onrender.com/api) · [Report Bug](https://github.com/DIYA73/webhookforge/issues)

---

![WebhookForge Demo](./demo.gif)

---

## ✨ Features

- 🎯 **Unique Endpoints** — generate isolated webhook URLs per project
- ⚡ **Real-time Capture** — see incoming requests live via WebSocket
- 🔁 **Replay Engine** — resend any webhook to any target URL with retry logic (BullMQ)
- 📊 **Analytics Dashboard** — requests over time, success/fail rate, avg response time
- 🏢 **Multi-tenant** — full workspace isolation per team
- 🐳 **Self-hostable** — Docker Compose, deploy anywhere

---

## 🛠️ Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS, Recharts      |
| Backend    | NestJS, TypeScript, WebSockets (Socket.io)          |
| Queue      | Redis + BullMQ (async replay engine)                |
| Database   | PostgreSQL + Prisma ORM                             |
| Auth       | JWT + Refresh Tokens                                |
| DevOps     | Docker, Docker Compose, GitHub Actions CI           |

---

## 🚀 Quick Start

```bash
git clone https://github.com/DIYA73/webhookforge.git
cd webhookforge
cp .env.example .env
docker compose up postgres redis -d
cd apps/api && cp ../../.env .env && npm install
npx prisma migrate dev --name init
cd ../.. && npm install && npm run dev
```

Open http://localhost:3000 🎉

---

## 🔌 API Reference

| Method | Endpoint                    | Description                 |
|--------|-----------------------------|-----------------------------|
| POST   | `/api/auth/register`        | Register + create workspace |
| POST   | `/api/auth/login`           | JWT login                   |
| POST   | `/api/endpoints`            | Create webhook endpoint     |
| ALL    | `/api/hook/:slug`           | Capture incoming webhook    |
| POST   | `/api/replay`               | Replay to target URL        |
| GET    | `/api/analytics/summary`    | Overview stats              |
| WS     | `/`                         | Real-time request stream    |

---

## 📈 Roadmap

- [x] Monorepo setup (NestJS + Next.js + shared types)
- [x] Docker Compose (PostgreSQL + Redis)
- [x] Prisma schema (User, Workspace, Endpoint, Request, ReplayJob)
- [x] Auth module (register, login, JWT)
- [x] Endpoint generation (unique slug URLs)
- [x] Request capture (any HTTP method)
- [x] WebSocket live push
- [x] Replay engine (BullMQ + retry)
- [x] Analytics dashboard (Recharts)
- [ ] Deploy to Vercel + Render

---

## 📄 License

MIT © [DIYA73](https://github.com/DIYA73)

---

Built with ❤️ — SaaS & Microservices Engineer
# 🔨 WebhookForge

**Webhook inspector, replayer & analytics dashboard** — capture incoming webhooks in real-time, replay to any endpoint, visualise traffic. Self-hostable alternative to RequestBin.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

---

## What it does

```
Incoming webhook (any source)
         │
         ▼
   WebhookForge endpoint
         │
         ├─── Stores request (headers, body, timestamps)
         ├─── Streams to dashboard via WebSocket
         └─── Queues for replay (BullMQ)
```

Create a unique endpoint URL, point any service at it (GitHub, Stripe, Twilio — anything), and instantly see every request in your dashboard. Replay any captured request to a different URL, compare responses, and track traffic over time.

## Features

- **Capture** — unique endpoint URLs, stores full request: headers, body, query params, timestamps
- **Real-time stream** — live WebSocket feed; new requests appear in the dashboard instantly
- **Replay** — resend any captured request to any target URL; see the response diff
- **Analytics** — request volume, success/failure rates, latency trends per endpoint
- **Auth** — JWT-protected API; register and manage multiple endpoints per account
- **Self-hosted** — one `docker compose up` and it's running on your server

## Tech stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| API       | NestJS 10, TypeScript               |
| ORM       | Prisma + PostgreSQL                 |
| Queue     | BullMQ + Redis                      |
| Realtime  | WebSocket gateway (Socket.io)       |
| Frontend  | Next.js 14, Tailwind CSS            |
| Infra     | Docker Compose                      |

## Project structure

```
webhookforge/
├── apps/
│   ├── api/
│   │   ├── prisma/schema.prisma
│   │   └── src/
│   │       ├── auth/          # JWT auth (login, register)
│   │       ├── endpoints/     # Endpoint CRUD + unique URL generation
│   │       ├── requests/      # Incoming request storage
│   │       ├── replay/        # Replay processor (BullMQ)
│   │       ├── analytics/     # Traffic stats
│   │       └── gateway/       # WebSocket live feed
│   └── web/                   # Next.js dashboard
└── .env.example
```

## Quick start

### Prerequisites

- Docker + Docker Compose

### 1. Clone and configure

```bash
git clone https://github.com/DIYA73/webhookforge.git
cd webhookforge
cp .env.example .env
```

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/webhookforge
REDIS_URL=redis://redis:6379
JWT_SECRET=change-me
PORT=3001
```

### 2. Start

```bash
docker compose up -d
```

Dashboard: `http://localhost:3000` · API: `http://localhost:3001`

### 3. Create your first endpoint

```bash
# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret"}'

# Login → get token
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret"}' | jq -r .access_token)

# Create endpoint
curl -X POST http://localhost:3001/endpoints \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"my-stripe-hook"}'
# → returns a unique URL like /hooks/abc123
```

### 4. Point your service at it

```bash
# Anything posting to this URL gets captured:
https://your-domain.com/hooks/abc123
```

### 5. Replay

```bash
curl -X POST http://localhost:3001/replay \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"requestId":"req_xyz","targetUrl":"https://staging.example.com/webhook"}'
```

## API reference

```
POST  /auth/register
POST  /auth/login

GET   /endpoints              # list your endpoints
POST  /endpoints              # create endpoint
DELETE /endpoints/:id

GET   /endpoints/:id/requests # captured requests
GET   /requests/:id           # single request detail

POST  /replay                 # replay a request
GET   /replay/:id             # replay result

GET   /analytics/:endpointId  # traffic stats
```

## Contributing

PRs welcome. Open an issue first for major changes.

## License

MIT