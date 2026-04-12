# LuxeCart Studio — Frontend

> **LuxeCart Studio** is the customer-facing and operator-facing web frontend for a cloud-native eCommerce platform. Built with **Next.js 16** and **React 19**, it communicates with a suite of Go microservices behind an **Envoy Gateway** and is deployed as a static build served by Nginx inside a Kubernetes cluster.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Deployment](#deployment)

---

## System Architecture

The diagram below shows the full platform architecture. This repository contains the **Frontend** service (top-right of the Kubernetes cluster box).

![System Diagram](./System%20Diagram.png)

| Layer | Component | Notes |
|---|---|---|
| Clients | Customer Browser / Admin or Operator | Connect via HTTPS |
| Ingress | Public Load Balancer / Kubernetes Ingress | TLS termination |
| Gateway | Envoy Gateway (Gateway API) | Routes traffic by path prefix |
| Frontend | **This repo** — Next.js + Nginx | Static build served from Nginx |
| Auth service | `auth-service` Go + Gin + sqlc | `/auth/*` |
| Catalog service | `catalog-service` Go + Gin + sqlc | `/catalog/*` |
| Voucher service | `voucher-service` Go + Gin + sqlc | `/voucher/*` |
| Order service | `order-history-service` Go + Gin + sqlc | `/orders/*` |
| Payment service | `payment-service` Go + Gin + sqlc | `/pay/*` |
| Message broker | RabbitMQ — topic exchange `ecom.events` | Outside K8s |
| Databases | MySQL/Postgres + Redis (per service) | Outside K8s |
| Payment provider | Stripe or PayPal | External |
| Observability | Prometheus + Grafana + Logs/Traces | Optional |
| CDN | CDN | Optional |

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | React framework (App Router) |
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first CSS |
| [ESLint](https://eslint.org) | 9 | Code linting |

---

## Features

- **Authentication** — Register, login, and logout flows backed by JWT access tokens and HTTP-only refresh cookies.
- **Session persistence** — On page reload, the app silently exchanges the refresh cookie for a new access token via `/auth/refresh`.
- **Product catalog** — Lists products (name, SKU, price, quantity) fetched from the catalog microservice.
- **Dashboard** — Displays store stats (total catalog items, low-stock count, in-stock count) and a product grid.
- **Protected routes** — Unauthenticated users are prompted to log in before accessing dashboard content.
- **Responsive layout** — Styled with Tailwind CSS, ready for mobile and desktop viewports.

---

## Project Structure

```
frontend-nextjs/
├── public/                     # Static assets served as-is
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout — wraps children in AuthProvider
│   │   ├── page.tsx            # Home page — catalog preview + auth status
│   │   ├── login/
│   │   │   └── page.tsx        # Login form
│   │   ├── register/
│   │   │   └── page.tsx        # Registration form
│   │   └── dashboard/
│   │       └── page.tsx        # Authenticated dashboard — stats + product grid
│   ├── components/
│   │   └── AuthProvider.tsx    # React context — exposes auth state & actions
│   └── lib/
│       ├── api.ts              # Base HTTP helpers (getJSON / postJSON)
│       ├── authClient.ts       # Auth API calls (login, register, refresh, me, logout)
│       ├── authStore.ts        # Token persistence in localStorage
│       ├── authedApi.ts        # Authenticated wrappers for authedGet / authedPost
│       └── catalogClient.ts   # Catalog API calls (listProducts)
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS / Tailwind configuration
├── eslint.config.mjs           # ESLint configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## Environment Variables

Create a `.env.local` file in the project root (never commit it):

```env
# Base URL of the backend API gateway (Envoy / Ingress)
# Defaults to http://localhost:8080 when not set
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE` | No | `http://localhost:8080` | Backend gateway base URL exposed to the browser |

---

## Getting Started

### Prerequisites

- **Node.js** 20 or later
- **npm** (bundled with Node.js) — or yarn / pnpm / bun

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads as you edit source files.

> **Tip:** Make sure the backend services are running and `NEXT_PUBLIC_API_BASE` points to the gateway before logging in or browsing the catalog.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start the Next.js development server with hot reload |
| `build` | `npm run build` | Create an optimised production build |
| `start` | `npm run start` | Serve the production build locally |
| `lint` | `npm run lint` | Run ESLint across the project |

---

## API Integration

All HTTP requests are routed through the **Envoy Gateway** using path-based routing. The base URL is configured via `NEXT_PUBLIC_API_BASE`.

### Authentication endpoints (`/auth/*`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Create a new account — returns `access_token` |
| `POST` | `/auth/login` | Authenticate — returns `access_token` + sets refresh cookie |
| `POST` | `/auth/refresh` | Exchange refresh cookie for a new `access_token` |
| `GET` | `/auth/me` | Fetch the authenticated user profile |
| `POST` | `/auth/logout` | Invalidate the session |

### Catalog endpoints (`/api/catalog/*`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/catalog/products?limit=&offset=` | Paginated list of products |

### Token strategy

1. On login/register the `access_token` (JWT) is stored in memory (React state).
2. The refresh token is stored as an **HTTP-only cookie** by the auth service — the browser sends it automatically.
3. On every page load, `AuthProvider` calls `/auth/refresh` to restore the session transparently.
4. All authenticated API calls attach `Authorization: Bearer <access_token>` in the request header.

---

## Deployment

### Production build (local)

```bash
npm run build
npm run start
```

### Docker + Nginx (recommended for Kubernetes)

The production deployment packages the Next.js static export into an **Nginx** container and runs inside the Kubernetes cluster, as shown in the system diagram.

1. **Build** the Next.js app:
   ```bash
   npm run build
   ```
2. **Copy** the `out/` (or `.next/`) directory into an Nginx image.
3. **Deploy** the image to your Kubernetes cluster. The Ingress controller routes browser traffic to this service.

### Environment variable injection at runtime

Because `NEXT_PUBLIC_*` variables are inlined at build time, rebuild the image whenever the gateway URL changes, or use a runtime configuration pattern (e.g. a config endpoint or a server-side environment injection script).

---

## Related Repositories

| Service | Language | Route prefix |
|---|---|---|
| `auth-service` | Go + Gin + sqlc | `/auth/*` |
| `catalog-service` | Go + Gin + sqlc | `/catalog/*` |
| `voucher-service` | Go + Gin + sqlc | `/voucher/*` |
| `order-history-service` | Go + Gin + sqlc | `/orders/*` |
| `payment-service` | Go + Gin + sqlc | `/pay/*` |
