# Base стейдж с общими настройками
FROM node:22.13-alpine as base
RUN npm install -g pnpm@9.15.0

# Устанавливаем зависимости
FROM base as dependencies
WORKDIR /app
COPY package*.json ./
# Добавляем approve-builds для разрешения скриптов сборки
RUN pnpm install && pnpm approve-builds

# Билдим приложение
FROM base as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
# Отключаем телеметрию Next.js во время сборки
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build:production

# Стейдж запуска - используем ту же версию Node.js
FROM node:22.13-alpine as runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Копируем standalone билд
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Создаем пользователя с правильными ID
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Запускаем сервер (путь может отличаться для Next.js standalone)
CMD ["node", "server.js"]
