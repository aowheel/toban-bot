# Toban Bot

Discord notification bot for [Toban](https://github.com/hackdays-io/toban) workspaces, built with Cloudflare Workers and Hono.

## Supported Platforms

- **Discord**: Slash commands and rich embed notifications. Available commands:
  - `/workspace add <id>` - Subscribe the current channel to workspace notifications
  - `/workspace list` - List subscribed workspaces
  - `/workspace remove <id>` - Unsubscribe the current channel from a workspace

## Features

- Real-time notifications for role transfers and thanks token transfers
- Discord slash commands for workspace subscription management
- ENS name resolution via [NameStone](https://namestone.com/) API
- Hat metadata and images from [Hats Protocol](https://hatsprotocol.xyz/)

## Tech Stack

- [Hono](https://hono.dev/) - Web framework
- [Cloudflare Workers](https://workers.cloudflare.com/) - Runtime
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - Database
- [Drizzle ORM](https://orm.drizzle.team/) - ORM
- TypeScript

## Prerequisites

- Node.js 18+
- pnpm

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create `.dev.vars` file:
```bash
cp .dev.vars.example .dev.vars
```

## Development

1. Run database migrations:
```bash
pnpm d1-migrate:local
```

2. Start the development server:
```bash
pnpm dev
```

3. If anything changes in `wrangler.jsonc` or `.dev.vars`, regenerate types:
```bash
pnpm cf-typegen
```

4. If `src/db/schema.ts` changes, regenerate Drizzle SQL:
```bash
pnpm drizzle-generate
```

## Deployment

1. Run database migrations for production:
```bash
pnpm d1-migrate:remote
```

2. Add secrets to Cloudflare:
```bash
pnpm cf-secret [file]
```

3. Deploy to Cloudflare:
```bash
pnpm deploy
```
