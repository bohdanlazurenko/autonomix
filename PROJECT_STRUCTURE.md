# 📁 Структура Проекта AutonomiX

```
autonomix/
│
├── 📄 README.md                      # Основная документация
├── 📄 QUICKSTART.md                  # Быстрый старт (10-15 мин)
├── 📄 IMPLEMENTATION_SUMMARY.md      # Что реализовано
├── 📄 package.json                   # Root workspace config
├── 📄 Makefile                       # Автоматизация команд
├── 📄 .env.example                   # Шаблон переменных окружения
├── 📄 .gitignore                     # Git ignore rules
│
├── 📂 .github/
│   └── workflows/                    # CI/CD конфигурации
│       ├── deploy-ui.yml            # Vercel deploy для UI
│       ├── deploy-backend.yml       # Railway/Vercel deploy для backend
│       └── test-integration.yml     # Тесты интеграций
│
├── 📂 docs/                          # Документация
│   ├── SETUP.md                     # Полная документация по setup
│   └── DEMO_CHECKLIST.md            # Чеклист для демонстрации
│
├── 📂 backend/                       # Express.js API Server
│   ├── package.json                 # Backend dependencies
│   ├── Dockerfile                   # Docker контейнер
│   ├── .gitignore                   # Backend specific ignores
│   └── src/
│       ├── server.js                # Основной сервер
│       └── routes/
│           ├── health.js            # Health check endpoint
│           ├── tasks.js             # Tasks API (PM → Research → Dev → Deploy)
│           └── tenants.js           # Tenants management + deploy
│
├── 📂 ui/                            # Next.js Frontend
│   ├── package.json                 # UI dependencies
│   ├── next.config.js               # Next.js конфигурация
│   ├── tsconfig.json                # TypeScript конфигурация
│   ├── tailwind.config.js           # Tailwind CSS конфигурация
│   ├── postcss.config.js            # PostCSS конфигурация
│   ├── .gitignore                   # UI specific ignores
│   ├── pages/
│   │   ├── _app.tsx                 # App wrapper
│   │   ├── _document.tsx            # Document wrapper
│   │   └── index.tsx                # Main page с формой и прогрессом
│   └── styles/
│       └── globals.css              # Global styles
│
├── 📂 integration/                   # GitHub/Vercel/Cloudflare APIs
│   ├── package.json                 # Integration dependencies
│   ├── tsconfig.json                # TypeScript конфигурация
│   └── src/
│       ├── index.ts                 # Экспорты всех модулей
│       ├── github.ts                # GitHub API (ensureRepo, upsertFiles)
│       ├── vercel.ts                # Vercel API (deploy, wait, getURL)
│       ├── cloudflare.ts            # Cloudflare DNS API
│       └── integration.ts           # Orchestrator (deployForTenant)
│
└── 📂 scripts/                       # CLI Utilities
    ├── package.json                 # Scripts dependencies
    ├── bootstrap-repos.sh           # Создание GitHub repos
    ├── create-tenant.js             # Создание tenant
    ├── generate-app.js              # Генерация приложения
    ├── deploy-vercel.js             # Деплой на Vercel
    ├── setup-secrets.js             # Настройка GitHub secrets
    └── make-executable.sh           # Make scripts executable
```

## 🎯 Основные компоненты

### 1. Backend (Express.js + Node.js)
**Локация**: `backend/`  
**Порт**: 3001  
**Файлов**: 6

#### Endpoints:
- `GET /health` - проверка здоровья сервиса
- `POST /api/tasks` - создание задачи на генерацию
- `GET /api/tasks/:id` - статус задачи
- `POST /api/tenants` - создание tenant
- `POST /api/tenants/:id/deploy` - деплой приложения tenant

#### Ключевые возможности:
- ✅ REST API с Express
- ✅ CORS + Helmet security
- ✅ Rate limiting (100 req/15min)
- ✅ In-memory storage (для хакатона)
- ✅ Async task processing
- ✅ Docker support

---

### 2. UI (Next.js + React + TypeScript + Tailwind)
**Локация**: `ui/`  
**Порт**: 3000  
**Файлов**: 10

#### Страницы:
- `pages/index.tsx` - главная страница с формой создания приложения

#### Ключевые возможности:
- ✅ Форма с валидацией tenant ID
- ✅ Real-time progress tracking (polling каждые 2 сек)
- ✅ Визуализация шагов (PM → Research → Dev → Deploy)
- ✅ Success/Error screens
- ✅ Responsive design (Tailwind CSS)
- ✅ TypeScript typed

---

### 3. Integration (TypeScript Modules)
**Локация**: `integration/`  
**Файлов**: 5 TypeScript модулей

#### Модули:
- **github.ts**: работа с GitHub API
  - `ensureRepo()` - создать/проверить репозиторий
  - `upsertFiles()` - коммит файлов через Git Trees API
  - `createDeployHook()` - webhook setup

- **vercel.ts**: работа с Vercel API
  - `ensureVercelProject()` - создать проект
  - `triggerDeploy()` - запуск деплоя
  - `waitForDeployment()` - ожидание результата
  - `getLatestDeployment()` - получение URL

- **cloudflare.ts**: DNS автоматизация
  - `createDnsRecord()` - создание DNS записи
  - `setupTenantSubdomain()` - настройка subdomain
  - `createVerificationRecord()` - TXT record

- **integration.ts**: оркестратор
  - `deployForTenant()` - полный цикл деплоя
  - `withRetry()` - retry с exponential backoff

#### Ключевые возможности:
- ✅ Полная типизация TypeScript
- ✅ Error handling
- ✅ Retry механизм
- ✅ Подробное логирование

---

### 4. Scripts (CLI Tools)
**Локация**: `scripts/`  
**Файлов**: 6 скриптов

#### Скрипты:
- **bootstrap-repos.sh**: создание GitHub репозиториев
- **create-tenant.js**: создание tenant metadata
- **generate-app.js**: генерация Next.js приложения
- **deploy-vercel.js**: полный цикл деплоя
- **setup-secrets.js**: настройка GitHub secrets

#### Ключевые возможности:
- ✅ Commander.js для CLI
- ✅ Chalk для colored output
- ✅ Ora для spinners
- ✅ Interactive prompts

---

### 5. CI/CD (GitHub Actions)
**Локация**: `.github/workflows/`  
**Файлов**: 3 workflow файла

#### Workflows:
- **deploy-ui.yml**: автодеплой UI на Vercel при push в main
- **deploy-backend.yml**: деплой backend на Railway/Vercel
- **test-integration.yml**: тесты интеграционных модулей

#### Ключевые возможности:
- ✅ Автоматический деплой при push
- ✅ Тестирование перед деплоем
- ✅ Secrets management
- ✅ Multi-job pipelines

---

## 📊 Статистика файлов

| Компонент | Файлов | Язык | Строк кода* |
|-----------|--------|------|-------------|
| Backend | 6 | JavaScript | ~600 |
| UI | 10 | TypeScript/TSX | ~400 |
| Integration | 5 | TypeScript | ~800 |
| Scripts | 6 | JavaScript/Bash | ~600 |
| CI/CD | 3 | YAML | ~150 |
| Docs | 4 | Markdown | ~2000 |
| Config | 10+ | JSON/JS/TS | ~300 |
| **ВСЕГО** | **44+** | - | **~4850** |

*Примерное количество, включая комментарии

---

## 🔄 Поток данных

```
┌──────────┐
│ Browser  │
└────┬─────┘
     │
     v
┌─────────────────┐
│  UI (Next.js)   │
│  localhost:3000 │
└────┬────────────┘
     │ HTTP POST /api/tasks
     v
┌─────────────────────┐
│ Backend (Express)   │
│  localhost:3001     │
└────┬────────────────┘
     │
     ├─> LLM Agents (PM → Research → Dev)
     │   [Будет реализовано]
     │
     v
┌─────────────────────┐
│ Integration Service │
└────┬────────────────┘
     │
     ├─> GitHub API ────────> Create Repo + Commit Files
     │
     ├─> Vercel API ────────> Create Project + Deploy
     │
     └─> Cloudflare API ───> Setup DNS (optional)
          │
          v
     ┌───────────────┐
     │ Client App    │
     │ (Deployed)    │
     └───────────────┘
```

---

## 🚀 Команды быстрого запуска

```bash
# Установка
make install

# Bootstrap
make bootstrap

# Локальная разработка
make dev

# Полный demo
make demo

# Деплой в production
make deploy

# Очистка
make clean

# Справка
make help
```

---

## 📚 Документация

- **README.md** - основная информация о проекте
- **QUICKSTART.md** - быстрый старт за 10-15 минут
- **IMPLEMENTATION_SUMMARY.md** - что реализовано и статистика
- **docs/SETUP.md** - полная документация по setup и API
- **docs/DEMO_CHECKLIST.md** - чеклист для демонстрации на хакатоне

---

## 🎯 Следующие шаги

1. **Заполнить .env** с токенами GitHub и Vercel
2. **Запустить `make bootstrap`** для создания repos
3. **Запустить `make demo`** для тестового деплоя
4. **Интегрировать LLM агентов** для генерации кода
5. **Задеплоить в production** на Vercel/Railway

---

**Проект готов к использованию! 🎉**
