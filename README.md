# Toban Bot

Discord notification bot for [Toban](https://github.com/hackdays-io/toban) workspaces, built with Cloudflare Workers and Hono.

## Supported Platforms

- **Discord**: Slash commands and rich embed notifications

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
- Cloudflare account
- Discord Bot Token and Application ID
- API Keys: NameStone, Pinata Gateway, Goldsky Webhook Secret

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create `.dev.vars` file:
```bash
DISCORD_BOT_TOKEN=
DISCORD_APPLICATION_ID=
DISCORD_PUBLIC_KEY=
GOLDSKY_WEBHOOK_SECRET=
NAMESTONE_API_KEY=
PINATA_GATEWAY_TOKEN=
HATS_GRAPHQL_ENDPOINT=
TOBAN_GRAPHQL_ENDPOINT=
```

3. Run database migrations:
```bash
pnpm d1-migrate:local  # or d1-migrate:remote for production
```

4. Register Discord slash commands:
```bash
pnpm discord-create
```

## Development

```bash
pnpm dev
```

## Deployment

```bash
pnpm deploy
```

## Discord Commands

- `/workspace add <id>` - Subscribe to workspace notifications
- `/workspace list` - List subscribed workspaces
- `/workspace remove <id>` - Unsubscribe from workspace

## API Endpoints

- `POST /api/webhooks/goldsky` - Goldsky blockchain events
- `POST /api/webhooks/discord` - Discord interactions

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm deploy` | Deploy to Cloudflare Workers |
| `pnpm discord-create` | Register Discord commands |
| `pnpm discord-delete` | Delete Discord commands |
| `pnpm discord-list` | List Discord commands |
| `pnpm drizzle-generate` | Generate database migrations |
| `pnpm d1-migrate:local` | Apply migrations locally |
| `pnpm d1-migrate:remote` | Apply migrations to production |
| `pnpm biome-check` | Run linter and formatter |