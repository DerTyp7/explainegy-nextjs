# Explainegy

Markdown-based tutorials and articles webapp, built using Docker, NextJS & Prisma

## Getting Started

1. Register a new OAuth app on GitHub: <https://github.com/settings/applications/new>

   1. Set the "Homepage URL" to `http://localhost:3000`
   2. Set "Authorization callback" URL to `http://localhost:3000/api/auth/callback`

2. Create a `.env` file in the root directory and add the following variables:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=explainegy"
AUTH_GH_CLIENT_ID="abc"
AUTH_GH_CLIENT_SECRET="abcdef"
AUTH_DEBUG_GH_ADMIN_ID="123" # The GitHub user ID of the admin user
```

> Note: `AUTH_DEBUG_GH_ADMIN_ID` can be optaind here: <https://api.github.com/users/your-username>

3. Run the following commands:

```bash
docker compose up -d
npm run dev
```

4. Login as admin using your GitHub account: <http://localhost:3000/api/auth/signin>
5. Use the webapp: <http://localhost:3000/>
