#Устанавливаем зависимости
FROM node:20.11-alpine as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

#Билдим приложение
#Кэширование зависимостей — если файлы в проекте изменились,
#но package.json остался неизменным, то стейдж с установкой зависимостей повторно не выполняется, что экономит время.
FROM node:20.11-alpine as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build:production

#Стейдж запуска
FROM node:20.11-alpine as runner
USER node
WORKDIR /app
ENV NODE_ENV production
# Next.js updates the fetch/ISR cache at runtime. Keep the production files
# owned by the same non-root user that runs the application.
COPY --chown=node:node --from=builder /app/ ./
EXPOSE 3000
CMD ["npm", "start"]
