# Explainegy

Markdown-based tutorials and articles webapp, built using Docker, NextJS & Prisma

## Getting Started

1. Create a `.env` file in the root directory and add the following variables:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=explainegy"
```

```bash
docker compose up -d
npm run dev
```
