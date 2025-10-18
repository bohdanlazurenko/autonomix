# AutonomiX - Полная документация по настройке

## Быстрый старт за 10 минут

### 1. Клонирование и установка зависимостей

```bash
cd autonomix
npm install  # Установит зависимости для всех workspaces
```

### 2. Настройка окружения

```bash
cp .env.example .env
```

Заполните `.env` файл:

```bash
# Минимальная конфигурация для начала
GH_PAT=github_pat_xxxxx          # GitHub Personal Access Token
VERCEL_TOKEN=xxxxx               # Vercel API Token
GH_ORG=autonomix                 # Ваша GitHub организация

# Опционально - для LLM интеграции
PM_MODEL_KEY=xxxxx
RESEARCH_MODEL_KEY=xxxxx
DEV_MODEL_KEY=xxxxx

# Опционально - для кастомных доменов
CLOUDFLARE_API_TOKEN=xxxxx
CLOUDFLARE_ZONE_ID=xxxxx
CLOUDFLARE_DOMAIN=my-it-co.app
```

### 3. Получение необходимых токенов

#### GitHub Personal Access Token (GH_PAT)
1. Перейдите: https://github.com/settings/tokens/new
2. Дайте токену имя: `autonomix-deploy`
3. Выберите scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `admin:org` (если создаёте репозитории в организации)
4. Нажмите "Generate token"
5. Скопируйте токен в `.env` как `GH_PAT`

#### Vercel Token
1. Перейдите: https://vercel.com/account/tokens
2. Нажмите "Create Token"
3. Дайте имя: `autonomix-deploy`
4. Выберите scope: Full Account
5. Скопируйте токен в `.env` как `VERCEL_TOKEN`

#### Vercel Organization/Project IDs (для UI деплоя)
```bash
# Узнайте ваши ID
vercel whoami
vercel projects ls
```

### 4. Bootstrap инфраструктуры

```bash
# Создать GitHub репозитории
make bootstrap

# Настроить секреты в GitHub
make secrets
```

### 5. Локальная разработка

```bash
# Терминал 1: Backend
cd backend && npm run dev

# Терминал 2: UI
cd ui && npm run dev
```

Откройте http://localhost:3000 для UI и http://localhost:3001/health для backend.

### 6. Полный демо-цикл

```bash
# Создать тестового клиента, сгенерировать и задеплоить приложение
make demo
```

## Архитектура

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       v
┌─────────────┐      ┌──────────────┐
│  UI (Next)  │─────>│   Backend    │
│  (Vercel)   │      │  (Railway/   │
└─────────────┘      │   Vercel)    │
                     └──────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              v                           v
    ┌──────────────────┐       ┌──────────────────┐
    │  Integration     │       │   LLM Agents     │
    │   Service        │       │   (PM/Research/  │
    │  - GitHub API    │       │    Developer)    │
    │  - Vercel API    │       └──────────────────┘
    │  - Cloudflare    │
    └────────┬─────────┘
             │
             v
    ┌──────────────────┐
    │  Client Repo +   │
    │  Vercel Deploy   │
    └──────────────────┘
```

## Структура проекта

```
autonomix/
├── backend/              # Express API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   │   ├── health.js
│   │   │   ├── tasks.js
│   │   │   └── tenants.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
│
├── ui/                   # Next.js frontend
│   ├── pages/
│   │   ├── index.tsx    # Main UI
│   │   ├── _app.tsx
│   │   └── _document.tsx
│   ├── styles/
│   └── package.json
│
├── integration/          # GitHub/Vercel/Cloudflare APIs
│   ├── src/
│   │   ├── github.ts
│   │   ├── vercel.ts
│   │   ├── cloudflare.ts
│   │   └── integration.ts
│   └── package.json
│
├── scripts/              # CLI утилиты
│   ├── bootstrap-repos.sh
│   ├── create-tenant.js
│   ├── generate-app.js
│   ├── deploy-vercel.js
│   └── setup-secrets.js
│
├── .github/
│   └── workflows/        # CI/CD
│       ├── deploy-ui.yml
│       ├── deploy-backend.yml
│       └── test-integration.yml
│
├── Makefile
├── .env.example
└── README.md
```

## API Reference

### Backend API

#### Health Check
```bash
GET /health
```

#### Create Task
```bash
POST /api/tasks
{
  "tenant": "acme",
  "prompt": "Create a landing page for a coffee shop"
}
```

#### Get Task Status
```bash
GET /api/tasks/:taskId
```

#### Create Tenant
```bash
POST /api/tenants
{
  "id": "acme",
  "name": "Acme Corp"
}
```

#### Deploy Tenant App
```bash
POST /api/tenants/:id/deploy
{
  "files": [
    { "path": "package.json", "content": "..." },
    { "path": "pages/index.js", "content": "..." }
  ]
}
```

## Деплой в production

### Backend → Railway

```bash
cd backend

# Установить Railway CLI
npm i -g @railway/cli

# Логин
railway login

# Создать проект
railway init

# Деплой
railway up
```

### Backend → Vercel (Serverless)

```bash
cd backend
vercel --prod
```

### UI → Vercel

```bash
cd ui

# Link проект
vercel link

# Production deploy
vercel --prod
```

## Troubleshooting

### Problem: GitHub API rate limit
**Solution**: Используйте Personal Access Token вместо anonymous запросов

### Problem: Vercel deployment timeout
**Solution**: 
- Проверьте что GitHub repo существует
- Убедитесь что Vercel подключен к GitHub org
- Увеличьте `maxWaitMs` в `integration/src/integration.ts`

### Problem: Files not committing to GitHub
**Solution**:
- Проверьте права токена (нужен `repo` scope)
- Убедитесь что ветка `autogen` создалась

### Problem: Backend can't reach external APIs
**Solution**: Проверьте переменные окружения:
```bash
curl http://localhost:3001/health
# Должен показать status всех интеграций
```

## Команды Makefile

- `make help` - показать все команды
- `make install` - установить зависимости
- `make bootstrap` - создать GitHub repos
- `make secrets` - настроить GitHub secrets
- `make demo` - полный демо-цикл
- `make dev` - запустить dev серверы
- `make deploy` - задеплоить всё в production
- `make clean` - очистить temporary файлы

## Roadmap для хакатона

### День 1 (8 часов)

**Час 1-2: Setup** (DevOps)
- ✅ Создать структуру проекта
- ✅ Настроить GitHub repos
- ✅ Настроить CI/CD workflows

**Час 3-4: Integration** (DevOps + Backend Dev)
- ✅ GitHub API integration
- ✅ Vercel API integration
- ✅ Cloudflare DNS (optional)

**Час 5-6: Backend** (Backend Dev)
- ✅ Express API setup
- ✅ Task/Tenant endpoints
- ⏳ LLM agent orchestration (mock for now)

**Час 7-8: Frontend** (Frontend Dev)
- ✅ Next.js UI
- ✅ Form submission
- ✅ Progress tracking

**Final: Demo & Polish**
- ✅ End-to-end test
- ✅ Documentation
- 🎉 Presentation

## Полезные ссылки

- [Vercel API Docs](https://vercel.com/docs/rest-api)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [Cloudflare API Docs](https://developers.cloudflare.com/api/)
- [Railway Docs](https://docs.railway.app/)
