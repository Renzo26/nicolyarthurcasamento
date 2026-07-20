# Arthur & Nicoly | Nosso Casamento

Site do convite de casamento de Arthur e Nicoly.

## Como rodar localmente

```sh
npm install
npm run dev
```

O site ficará disponível em `http://localhost:8080`.

## Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase

## Deploy (VPS + EasyPanel + Docker Compose)

O site é estático: React compilado pelo Vite e servido por Nginx. Não há
backend próprio — a confirmação de presença fala direto com o Supabase.

### Variáveis de ambiente

As `VITE_*` são embutidas no bundle em **tempo de build**, não em runtime.
No EasyPanel, cadastre-as em *Environment* antes de buildar:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

O `docker-compose.yml` as repassa como `build args`. Se faltar alguma, o
build falha de propósito — sem elas o site sobe, mas a confirmação de
presença quebraria silenciosamente no navegador.

### Passos no EasyPanel

1. Criar serviço do tipo **Docker Compose** apontando para este repositório.
2. Cadastrar as três variáveis acima em *Environment*.
3. Expor o domínio para o serviço `frontend` na **porta 80**.
4. Deploy. A cada novo push, refazer o build (as variáveis são compiladas).

A rede externa `easypanel` já é referenciada no compose.

### Rodando local

```sh
npm install
npm run dev      # desenvolvimento em http://localhost:8080
npm run build    # gera dist/
npm run preview  # serve o build de produção
```
