FROM node:20-alpine AS BASE
WORKDIR /app
COPY package.json package-lock.json ./
RUN apk add --no-cache git \
    && npm ci --frozen-lockfile --legacy-peer-deps \
    && npm cache clean --force

FROM node:20-alpine AS BUILD
WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache curl \ 
  && curl -sf https://gobinaries.com/tj/node-prune | sh -s -- -b /usr/local/bin \
  && apk del curl
RUN apk add --no-cache git curl \
    && npm run build \
    # && rm -rf node_modules \ 
    # && npm ci --production --frozen-lockfile --ignore-scripts --prefer-offline --legacy-peer-deps \ 
    # Follow https://github.com/ductnn/Dockerfile/blob/master/nodejs/node/16/alpine/Dockerfile
    && cd .next/standalone \
    && node-prune


FROM node:20-alpine AS PRODUCTION
WORKDIR /app

ENV NODE_ENV=production
WORKDIR /app

# COPY --from=BUILD /app/package.json ./
# COPY --from=BUILD /app/node_modules ./node_modules
# COPY --from=BUILD /app/.next ./.next
# COPY --from=BUILD /app/public ./public

COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./

# Set mode "standalone" in file "next.config.js"
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]