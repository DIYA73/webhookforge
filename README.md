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
