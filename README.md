# 🚀 AutonomiX — "ИТ-компания как сервис"

> **Автоматическое создание и деплой клиентских приложений за минуты, а не дни**

[![Made for Hackathon](https://img.shields.io/badge/Made%20for-Hackathon-orange)](https://github.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🎯 Что это?

AutonomiX — это платформа для автоматического создания и деплоя веб-приложений. Вы описываете что хотите, AI агенты создают код, GitHub и Vercel деплоят приложение.

**От идеи до production за 2-3 минуты!**

### ✨ Возможности

- ✅ **Автоматическая генерация кода** (с помощью LLM агентов)
- ✅ **GitHub интеграция** (создание репозиториев, коммиты)
- ✅ **Vercel автодеплой** (production-ready hosting)
- ✅ **DNS автоматизация** (Cloudflare субдомены)
- ✅ **Real-time прогресс** (отслеживание всех шагов)
- ✅ **CI/CD ready** (GitHub Actions workflows)

## 🚀 Быстрый старт

### 1️⃣ Установка (2 минуты)

```bash
cd autonomix

# Установить зависимости для всех компонентов
npm install
cd backend && npm install && cd ..
cd ui && npm install && cd ..
cd integration && npm install && cd ..
cd scripts && npm install && cd ..
```

### 2️⃣ Настройка (5 минут)

```bash
# Скопировать шаблон переменных окружения
cp .env.example .env

# Открыть .env и заполнить МИНИМУМ:
# - GH_PAT (GitHub Personal Access Token)
# - VERCEL_TOKEN (Vercel API Token)
# - GH_ORG (имя вашей GitHub организации)
```

> 📖 **Как получить токены**: см. [QUICKSTART.md](QUICKSTART.md#шаг-2-получение-токенов-5-мин)

### 3️⃣ Bootstrap (2 минуты)

```bash
# Создать GitHub репозитории
make bootstrap

# Настроить секреты (опционально)
make secrets
```

### 4️⃣ Демо (3 минуты)

```bash
# Полный цикл: создать tenant → сгенерировать → задеплоить
make demo

# Результат:
# ✅ GitHub repo создан: https://github.com/autonomix/demo-acme-app
# ✅ Приложение задеплоено: https://demo-acme-app.vercel.app
```

## 📁 Структура проекта

```
autonomix/
├── backend/           # Express.js API (Node.js)
├── ui/               # Next.js Frontend (React + TypeScript)
├── integration/      # GitHub/Vercel/Cloudflare APIs (TypeScript)
├── scripts/          # CLI утилиты (Node.js)
├── .github/          # CI/CD workflows
└── docs/             # Документация
```

> 📖 **Подробная структура**: см. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

## 🏗️ Архитектура

```
┌─────────┐
│ Browser │
└────┬────┘
     │
     v
┌────────────────┐      ┌──────────────┐
│   UI (Next)    │─────>│   Backend    │
│   (Vercel)     │      │  (Railway/   │
└────────────────┘      │   Vercel)    │
                        └──────┬───────┘
                               │
                 ┌─────────────┴────────────┐
                 │                          │
                 v                          v
      ┌──────────────────┐      ┌──────────────────┐
      │  Integration     │      │   LLM Agents     │
      │   Service        │      │   (PM/Research/  │
      │  - GitHub API    │      │    Developer)    │
      │  - Vercel API    │      └──────────────────┘
      │  - Cloudflare    │
      └────────┬─────────┘
               │
               v
      ┌─────────────────┐
      │  Client Repo +  │
      │  Vercel Deploy  │
      └─────────────────┘
```

## 🛠️ Технологии

### Backend
- **Node.js 18+** + Express.js
- REST API с rate limiting
- Docker support

### Frontend
- **Next.js 14** + React 18
- **TypeScript** + Tailwind CSS
- Real-time updates

### Integration
- **TypeScript** модули
- GitHub API (Octokit)
- Vercel API
- Cloudflare DNS API

### DevOps
- **GitHub Actions** (CI/CD)
- **Vercel** (hosting)
- **Railway** (backend)
- **Cloudflare** (DNS)

## 📚 Документация

| Файл | Описание |
|------|----------|
| [QUICKSTART.md](QUICKSTART.md) | Быстрый старт за 10-15 минут |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Подробная структура проекта |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Что реализовано |
| [docs/SETUP.md](docs/SETUP.md) | Полная документация по setup |
| [docs/DEMO_CHECKLIST.md](docs/DEMO_CHECKLIST.md) | Чеклист для демонстрации |

## 🎮 Команды

```bash
make help          # Показать все команды
make install       # Установить зависимости
make bootstrap     # Создать GitHub repos
make secrets       # Настроить GitHub secrets
make demo          # Полный demo цикл
make dev           # Запустить dev серверы (backend + ui)
make deploy        # Деплой в production
make clean         # Очистить временные файлы
```

## 🔧 Локальная разработка

```bash
# Терминал 1 - Backend
cd backend
npm run dev
# Backend: http://localhost:3002

# Терминал 2 - UI
cd ui
npm run dev
# UI: http://localhost:3000
```

## 🚢 Production Deploy

### Backend → Railway
```bash
npm i -g @railway/cli
railway login
cd backend
railway up
```

### UI → Vercel
```bash
cd ui
vercel --prod
```

> 📖 **Подробнее**: см. [docs/SETUP.md](docs/SETUP.md#деплой-в-production)

## 📊 Статистика

- **44+ файлов** в проекте
- **~5000 строк кода**
- **8 API endpoints**
- **5 TypeScript модулей**
- **3 CI/CD workflows**

## 🤝 Команда (для хакатона)

| Роль | Ответственность | Время |
|------|----------------|-------|
| **DevOps** | Инфраструктура, CI/CD, интеграции | 8ч |
| **Backend** | API, оркестратор, LLM агенты | 8ч |
| **Frontend** | Next.js UI, UX | 8ч |

## 🎯 Roadmap

### ✅ MVP (День 1 - ГОТОВО)
- [x] GitHub/Vercel/Cloudflare интеграции
- [x] Backend API (tasks, tenants, deploy)
- [x] UI с формой и прогрессом
- [x] CLI скрипты
- [x] CI/CD workflows
- [x] Документация

### ⏳ Production (День 2+)
- [ ] Реальная интеграция с LLM агентами
- [ ] Database (PostgreSQL)
- [ ] Authentication
- [ ] Мониторинг (Sentry, DataDog)
- [ ] Тесты (unit, integration, e2e)
- [ ] Code moderation hooks
- [ ] Billing система

## 💡 Use Cases

1. **🚀 Прототипирование** - быстрые MVP за минуты
2. **📱 Landing pages** - для маркетинговых кампаний
3. **🛠️ Internal tools** - для команд и компаний
4. **🎨 Client demos** - для агентств и фрилансеров

## 🐛 Troubleshooting

### GitHub API rate limit
→ Используйте `GH_PAT` в .env

### Vercel deployment timeout
→ Проверьте подключение GitHub ↔ Vercel

### Permission denied на скриптах
→ Выполните `chmod +x scripts/*.sh`

> 📖 **Больше решений**: см. [QUICKSTART.md](QUICKSTART.md#troubleshooting)

## 📄 License

MIT License - см. [LICENSE](LICENSE) файл

## 🙏 Acknowledgments

Создано для хакатона с использованием:
- [Vercel](https://vercel.com) - hosting
- [Railway](https://railway.app) - backend hosting
- [Cloudflare](https://cloudflare.com) - DNS
- [GitHub](https://github.com) - version control

---

**Готовы начать? Запустите `make demo` и создайте первое приложение! 🎉**
