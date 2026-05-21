# 🔨 webhookforge

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

## ✨ Features

- 🎯 **Unique Endpoints** — generate isolated webhook URLs per project
- ⚡ **Real-time Capture** — see incoming requests live via WebSocket
- 🔁 **Replay Engine** — resend any webhook to any target URL with retry logic (BullMQ)
- 📊 **Analytics Dashboard** — requests over time, success/fail rate, avg response time, top sources
- 🏢 **Multi-tenant** — full workspace isolation per team
- 🐳 **Self-hostable** — Docker Compose, deploy anywhere

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    webhookforge                      │
├──────────────────────┬──────────────────────────────┤
│  apps/web (Next.js)  │      apps/api (NestJS)        │
│                      │                              │
│  ┌────────────────┐  │  ┌──────────┐ ┌───────────┐  │
│  │  Dashboard     │  │  │ REST API │ │ WebSocket │  │
│  │  Endpoints     │◄─┼─►│          │ │  Gateway  │  │
│  │  Request View  │  │  └────┬─────┘ └─────┬─────┘  │
│  │  Replay Panel  │  │       │             │        │
│  │  Analytics     │  │  ┌────▼─────────────▼──────┐ │
│  └────────────────┘  │  │  endpoints · requests   │ │
│                      │  │  replay · analytics      │ │
│                      │  │  auth · workspaces       │ │
│                      │  └────┬──────────┬──────────┘ │
├──────────────────────┤       │          │            │
│   Infrastructure     │  ┌────▼──┐  ┌───▼──────┐     │
│                      │  │  PG   │  │  Redis   │     │
│  packages/shared     │  │  DB   │  │  BullMQ  │     │
│  (types + utils)     │  └───────┘  └──────────┘     │
└──────────────────────┴─────────────────────────────-─┘
```

---

## 🛠️ Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| Backend    | NestJS, TypeScript, WebSockets (Socket.io)              |
| Queue      | Redis + BullMQ (async replay engine)                    |
| Database   | PostgreSQL + Prisma ORM                                 |
| Auth       | JWT + Refresh Tokens                                    |
| DevOps     | Docker, Docker Compose, GitHub Actions CI               |
| Deployment | Vercel (web) · Render (api) · Upstash (redis)           |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### 1. Clone & configure

```bash
git clone https://github.com/DIYA73/webhookforge.git
cd webhookforge
cp .env.example .env
```

### 2. Start infrastructure

```bash
docker compose up postgres redis -d
```

### 3. Run database migration

```bash
cd apps/api
cp ../../.env .env
npm install
npx prisma migrate dev --name init
cd ../..
```

### 4. Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000 🎉  
API docs at http://localhost:3001/api

---

## 📁 Project Structure

```
webhookforge/
├── apps/
│   ├── api/                        # NestJS backend
│   │   ├── prisma/schema.prisma    # Database schema
│   │   └── src/
│   │       ├── auth/               # JWT authentication
│   │       ├── endpoints/          # Webhook URL generation
│   │       ├── requests/           # Capture & store webhooks
│   │       ├── replay/             # BullMQ replay engine
│   │       ├── analytics/          # Aggregated stats
│   │       ├── gateway/            # WebSocket live push
│   │       └── workspaces/         # Multi-tenant isolation
│   └── web/                        # Next.js 14 frontend
│       └── src/
│           ├── app/(auth)/         # Login & register
│           ├── app/(dashboard)/    # Dashboard, endpoints, requests
│           ├── components/         # Request detail, replay panel, charts
│           └── lib/                # API client, WebSocket client
├── packages/shared/                # Shared TypeScript types
├── docker-compose.yml
├── .env.example
└── .github/workflows/ci.yml
```

---

## 🔌 API Reference

| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| POST   | `/api/auth/register`       | Register + create workspace    |
| POST   | `/api/auth/login`          | JWT login                      |
| GET    | `/api/endpoints`           | List workspace endpoints       |
| POST   | `/api/endpoints`           | Create new webhook endpoint    |
| DELETE | `/api/endpoints/:id`       | Delete endpoint                |
| GET    | `/api/requests/:endpointId`| List captured requests         |
| GET    | `/api/requests/:id`        | Get request detail             |
| POST   | `/api/replay`              | Replay request to target URL   |
| GET    | `/api/analytics/summary`   | Overview stats                 |
| GET    | `/api/analytics/timeline`  | Requests over time             |
| WS     | `/gateway`                 | Real-time request stream       |

---

## ⚙️ Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/webhookforge

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-super-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=development
WEB_URL=http://localhost:3000
WEBHOOK_BASE_URL=http://localhost:3001/hook
```

---

## 📈 Roadmap

- [x] Monorepo setup (NestJS + Next.js + shared types)
- [x] Docker Compose (PostgreSQL + Redis)
- [x] Prisma schema (User, Workspace, Endpoint, Request, ReplayJob)
- [ ] Auth module (register, login, JWT refresh)
- [ ] Endpoint generation (unique slug URLs)
- [ ] Request capture (any HTTP method)
- [ ] WebSocket live push
- [ ] Replay engine (BullMQ + retry)
- [ ] Analytics dashboard (Recharts)
- [ ] Deploy to Vercel + Render

---

## 📄 License

MIT © [DIYA73](https://github.com/DIYA73)

---

Built with ❤️ — SaaS & Microservices Engineer
