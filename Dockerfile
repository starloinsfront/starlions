# Устанавливаем зависимости
FROM node:20.11-alpine as dependencies
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install

# Билдим приложение
FROM node:20.11-alpine as builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build:production

# Стейдж запуска (для standalone режима)
FROM node:20.11-alpine as runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Копируем standalone сборку
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Создаем пользователя
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Запускаем сервер Node.js напрямую
CMD ["node", "server.js"]