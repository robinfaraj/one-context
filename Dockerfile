# ---- Stage 1: Prune ----
FROM node:20-alpine AS pruner
RUN corepack enable && corepack prepare pnpm@9.3.0 --activate
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
RUN pnpm dlx turbo prune --scope=@onecontext/web --docker

# ---- Stage 2: Install & Build ----
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.3.0 --activate
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV HUSKY=0

# Install dependencies first (better layer caching)
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY --from=pruner /app/out/full/ .

# NEXT_PUBLIC_* vars must be present at build time
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
ARG NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=$NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
ENV NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID=$NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID

# Dummy values for build-time page rendering (overridden at runtime)
ENV BETTER_AUTH_SECRET=build-placeholder-secret-that-is-long-enough
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV STRIPE_SECRET_KEY=sk_test_build_placeholder

# Generate Prisma client and build
RUN pnpm turbo run generate
RUN pnpm turbo run build --filter=@onecontext/web

# ---- Stage 3: Run ----
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
