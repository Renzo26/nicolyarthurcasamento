# syntax=docker/dockerfile:1

# ---------- Build ----------
FROM node:22-alpine AS build

WORKDIR /app

# Instala dependências primeiro para aproveitar o cache de camadas
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# O Vite injeta as VITE_* no bundle em tempo de BUILD — por isso vêm como
# build-args, e não como variáveis de runtime do contêiner.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

# Falha o build cedo se faltar credencial: sem elas o site sobe, mas a
# confirmação de presença quebra silenciosamente no navegador.
RUN test -n "$VITE_SUPABASE_URL" || (echo "ERRO: build-arg VITE_SUPABASE_URL nao informado" && exit 1) && \
    test -n "$VITE_SUPABASE_PUBLISHABLE_KEY" || (echo "ERRO: build-arg VITE_SUPABASE_PUBLISHABLE_KEY nao informado" && exit 1)

RUN npm run build

# ---------- Runtime ----------
FROM nginx:1.27-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
