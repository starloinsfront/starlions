FROM node:22-alpine AS base

WORKDIR /app

RUN npm install --global corepack@latest \
  && corepack enable pnpm


FROM base AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


FROM base AS builder

WORKDIR /app

# Значения по умолчанию нужны, потому что текущий Jenkins запускает
# обычный `docker build ... .` без --build-arg.
ARG NEXT_PUBLIC_API_URL=https://gateway.starlionstech.org
ARG API_URL=https://gateway.starlionstech.org

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV API_URL=$API_URL

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules

RUN test -n "$NEXT_PUBLIC_API_URL" || \
  (echo "NEXT_PUBLIC_API_URL is required during build" && exit 1)

RUN pnpm run build:production


FROM node:22-alpine AS runner

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=https://gateway.starlionstech.org
ARG API_URL=https://gateway.starlionstech.org

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV API_URL=$API_URL

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]
