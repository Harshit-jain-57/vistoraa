FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN npm install

FROM node:22-alpine AS builder

WORKDIR /app
COPY --from=deps /app /app
RUN npm run build --workspace @vistora/shared
RUN npm run build --workspace @vistora/web

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["npm", "run", "start"]
