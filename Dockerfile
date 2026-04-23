# Base стейдж с общими настройками
FROM node:20.11-alpine as base
RUN npm install -g pnpm

# Устанавливаем зависимости
FROM base as dependencies
WORKDIR /app
COPY package*.json ./
RUN pnpm install

# Билдим приложение
FROM base as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build:production

# Стейдж запуска
FROM node:20.11-alpine as runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Копируем standalone билд
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Создаем пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Запускаем (фактический путь зависит от структуры standalone)
CMD ["node", "server.js"]
