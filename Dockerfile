FROM node:20.11-alpine AS base

WORKDIR /app

RUN corepack enable


FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


FROM base AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules

RUN test -n "$NEXT_PUBLIC_API_URL" || \
  (echo "NEXT_PUBLIC_API_URL is required" && exit 1)

RUN pnpm run build:production


FROM node:20.11-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]
