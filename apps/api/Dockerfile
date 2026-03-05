FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN npm install
RUN npm run build --workspace @vistora/shared
RUN npm run build --workspace @vistora/api

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/server.js"]
