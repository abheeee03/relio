# Relio

#### Relio is an uptime monitoring platform that keeps an eye on your websites from multiple regions worldwide. Get instant alerts when your site goes down, track response times, and view detailed ping history. To know more read this [blog](https://abhee.dev/blog/relio-montior-websites)

## Demo

https://github.com/user-attachments/assets/f2ba2042-e96a-46a3-8f1a-33db70854660

## Features

-  **Global Monitoring** - Workers from different regions (countries) ping your sites
-  **Real-time Alerts** - Instant notifications via Email, Slack, SMS (comming soon)
-  **Interactive Charts** - Visualize ping history and response times
-  **Live Updates** - See status changes as they happen
-  **Responsive Dashboard** - Monitor from any device

## 🛠️ Tech Stack

#### This Project uses  Turbo Repo with Bun

### Frontend
- **Next.js 15** - App Router
- **TypeScript** 
- **Tailwind CSS** 
- **Shadcn/ui** 

### Backend
- **Bun**
- **Prisma**
- **PostgreSQL** 
- **Redis** 

### Infrastructure
- **Turborepo** - Monorepo build system
- **Docker** - Containerization (for workers)

## 📁 Project Structure

```
relio/
├── apps/
│   ├── frontend/          # Next.js dashboard & landing page
│   │   ├── app/           # App router pages
│   │   │   ├── (main)/    # Protected dashboard routes
│   │   │   │   ├── home/        # Dashboard home
│   │   │   │   ├── [websiteID]/ # Website details page
│   │   │   │   ├── logs/        # Activity logs
│   │   │   │   ├── notifications/
│   │   │   │   └── websites/    # Website management
│   │   │   ├── login/     # Authentication
│   │   │   └── page.tsx   # Landing page
│   │   ├── components/    # UI components
│   │   │   ├── ui/        # Shadcn components
│   │   │   └── ...        # Custom components
│   │   └── lib/           # Utilities & actions
│   │
│   ├── api/               # Hono REST API server
│   ├── worker/            # Ping workers (multi-region)
│   └── pusher/            # Real-time event publisher
│
├── packages/
│   ├── store/             # Prisma schema & database client
│   │   └── prisma/
│   │       └── schema.prisma
│   ├── redis-stream/      # Redis pub/sub utilities
│   ├── eslint-config/     # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
│
├── turbo.json             # Turborepo configuration
└── package.json           # Root dependencies
```

## 🗃️ Database Schema

```prisma
model User {
  id        String     @id @default(uuid())
  username  String
  password  String
  createdAt DateTime   @default(now())
  websites  websites[]
}

model websites {
  id      String  @id @default(uuid())
  url     String
  user_id String
  ticks   ticks[]
  user    User    @relation(fields: [user_id], references: [id])
}

model region {
  id    String  @id @default(uuid())
  name  String
  ticks ticks[]
}

model ticks {
  id          String   @id @default(uuid())
  response_ms String
  status      Status   // Up | Down | Unknown
  region_id   String
  website_id  String
  created_at  DateTime @default(now())
}
```

## 🏃 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 18
- PostgreSQL database
- Redis instance

### Docker Setup for Redis

1. Start Redis container
```bash
docker run -d --name relio-redis -p 6379:6379 redis:latest
```

2. Create Redis Stream and Consumer Group
```bash
# Create the stream with an initial entry (required before creating consumer group)
docker exec relio-redis redis-cli XADD relio:website "*" init init

# Create consumer group for workers
docker exec relio-redis redis-cli XGROUP CREATE relio:website workers 0 MKSTREAM

# (Optional) Verify stream was created
docker exec relio-redis redis-cli XINFO STREAM relio:website
```

> **Note:** The consumer group `workers` is used by the worker instances. Each worker uses a unique consumer ID within this group.

### Installation

1. Clone the repository
```bash
git clone https://github.com/abheeee03/Relio.git
cd Relio
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
```bash
# apps/frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:3001

# apps/api/.env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret
```

4. Generate Prisma client
```bash
cd packages/store
bunx prisma generate
bunx prisma db push
```

5. Start development servers
```bash
# From root directory
bun run dev
```

Or run individually:
```bash
# API server
cd apps/api && bun run dev

# Frontend
cd apps/frontend && bun run dev

# Worker (optional)
cd apps/worker && bun run dev
```

## 🔗 Links

- **More here:** [abhee.dev](https://abhee.dev)
- **Want to know more? shoot a DM here**: [@_AbhayHere](https://x.com/_AbhayHere)
