# G-PEST — Multi-Tenant Pest Control Management System

Enterprise Field Service Management & ERP SaaS untuk industri pest control.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Lucide Icons + TanStack Query + Zustand
- **Backend**: NestJS 11 (TypeScript) + Socket.io (WebSocket) + Puppeteer (PDF Engine)
- **Database & ORM**: MySQL 8 (Laragon) + Prisma ORM
- **Real-Time Tracking**: Socket.io Gateway (`/tracking`) dengan geofencing detection
- **Architecture**: Decoupled Monorepo (`apps/api` -> `backend/`, `apps/web` -> `frontend/`)

---

## 📁 Struktur Direktori

```
gpest/
├── backend/                   # NestJS Backend API & WebSocket Gateway
│   ├── src/
│   │   ├── prisma/            # Prisma service & global module
│   │   ├── tracking/          # Socket.io live technician tracking & geofencing
│   │   ├── app.module.ts
│   │   └── main.ts            # Port 4000 (Prefix /api/v1)
│   ├── prisma/
│   │   ├── schema.prisma      # Schema 12 entitas multi-tenant MySQL 8
│   │   └── seed.ts            # Seeder demo tenant, user, service catalog, tasks
│   ├── .env                   # DATABASE_URL mysql://root:@localhost:3306/gpest_db
│   └── package.json
│
├── frontend/                  # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   └── components/
│   └── package.json           # Port 3000
│
├── docs/                      # PRD, DESIGN, dan referensi bisnis (dipertahankan)
├── package.json               # Root monorepo dev orchestrator
└── README.md
```

---

## 🛠️ Cara Menjalankan Project

### 1. Prasyarat
Pastikan Laragon sudah menyalakan service **MySQL** pada port `3306`. Buat database bernama `gpest_db` (atau biarkan Prisma membuatkannya saat migrasi).

### 2. Migrasi Database (Prisma)
Masuk ke folder `backend`:
```bash
cd backend
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 3. Menjalankan Server (Frontend + Backend Sekaligus)
Dari root direktori `gpest/`:
```bash
npm run dev
```

* **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
* **WebSocket Gateway**: `ws://localhost:4000` (Namespace `/tracking`)
