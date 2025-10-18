# 🚀 Quick Start Guide - AutonomiX

> **⏱️ Время на setup: 10-15 минут**

## Шаг 1: Установка зависимостей (2 мин)

```bash
cd autonomix

# Установить зависимости для всех компонентов
npm install
cd backend && npm install && cd ..
cd ui && npm install && cd ..
cd integration && npm install && cd ..
cd scripts && npm install && cd ..
```

## Шаг 2: Получение токенов (5 мин)

### GitHub Personal Access Token

1. Открыть: https://github.com/settings/tokens/new
2. Token name: `autonomix-hackathon`
3. Выбрать scopes:
   - ✅ `repo` (полный доступ к репозиториям)
   - ✅ `workflow` (обновление GitHub Actions)
4. Создать токен и скопировать

### Vercel Token

1. Открыть: https://vercel.com/account/tokens
2. "Create Token"
3. Name: `autonomix-hackathon`
4. Scope: Full Account
5. Создать и скопировать

## Шаг 3: Настройка .env (2 мин)

```bash
cp .env.example .env
```

Открыть `.env` и заполнить МИНИМУМ:

```bash
GH_PAT=ghp_xxxxxxxxxxxxxxxxxx          # Ваш GitHub token
VERCEL_TOKEN=xxxxxxxxxxxxxxxxxxxxx     # Ваш Vercel token
GH_ORG=autonomix                       # Имя организации/username
```

> Остальные поля опциональны для быстрого старта

## Шаг 4: Bootstrap (2 мин)

```bash
# Создать GitHub репозитории
make bootstrap
```

Это создаст 3 репозитория:
- `autonomix/ui`
- `autonomix/backend`
- `autonomix/integration`

## Шаг 5: Тестовый запуск (2 мин)

### Вариант A: Полный demo (автоматически)

```bash
make demo
```

Это создаст тестового клиента `demo-acme`, сгенерирует приложение и задеплоит его.

### Вариант B: Локальная разработка

Терминал 1 - Backend:
```bash
cd backend
npm run dev
# Backend запустится на http://localhost:3001
```

Терминал 2 - UI:
```bash
cd ui
npm run dev
# UI запустится на http://localhost:3000
```

Откройте http://localhost:3000 и попробуйте создать приложение!

## Шаг 6: Deploy в production (опционально)

### Backend → Railway

```bash
# Установить Railway CLI
npm i -g @railway/cli

# Логин
railway login

# Deploy
cd backend
railway init
railway up
```

Или используйте GitHub Actions (уже настроены в `.github/workflows/`)

### UI → Vercel

```bash
cd ui

# Link к Vercel проекту
vercel link

# Production deploy
vercel --prod
```

## Troubleshooting

### ❌ "GitHub API rate limit"
→ Убедитесь что используете `GH_PAT` в .env

### ❌ "Vercel deployment timeout"
→ Проверьте что:
1. GitHub repo создан
2. Vercel подключен к GitHub
3. Проверьте логи: `vercel logs`

### ❌ "Permission denied" на скриптах
→ Выполните:
```bash
chmod +x scripts/*.sh
```

### ❌ Backend не стартует
→ Проверьте health:
```bash
curl http://localhost:3001/health
```

## Следующие шаги

1. ✅ **Локальная разработка работает** → Переходите к интеграции LLM агентов
2. ✅ **Demo проходит** → Настраивайте production deployment
3. ✅ **Production готов** → Добавляйте наблюдаемость и мониторинг

## Полезные команды

```bash
make help          # Показать все команды
make install       # Установить зависимости
make bootstrap     # Создать GitHub repos
make secrets       # Настроить GitHub secrets
make demo          # Полный demo цикл
make dev           # Запустить dev серверы
make clean         # Очистить временные файлы
```

## Документация

- 📚 [Полная документация по setup](docs/SETUP.md)
- ✅ [Checklist для демонстрации](docs/DEMO_CHECKLIST.md)
- 🏗️ [Архитектура и API](docs/SETUP.md#api-reference)

## Контакты команды

- **DevOps**: setup инфраструктуры, CI/CD, интеграции
- **Backend**: API, оркестратор, LLM агенты
- **Frontend**: Next.js UI, UX

---

**Готовы? Запускайте `make demo` и вперёд! 🚀**
