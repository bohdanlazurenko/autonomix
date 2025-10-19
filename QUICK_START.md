# 🚀 AutonomiX - Quick Start Guide

## Швидкий старт після відкриття проекту

### 1️⃣ Перевірка environment variables
```bash
cd ~/ai_workshop/autonomix
cat .env
```

Повинні бути встановлені:
```
GH_PAT=your_github_token
GH_ORG=bohdanlazurenko
VERCEL_TOKEN=your_vercel_token
ZAI_API_KEY=your_zai_key
```

### 2️⃣ Запуск локального development

**Варіант 1: Автоматичний скрипт**
```bash
./start-local.sh
```

**Варіант 2: Ручний запуск**
```bash
# Backend (Terminal 1)
cd ~/ai_workshop/autonomix/backend
node src/server.js

# UI (Terminal 2)
cd ~/ai_workshop/autonomix/public
npx http-server -p 30002 --cors
```

### 3️⃣ Відкрити в браузері
```
http://localhost:30002
```

### 4️⃣ Тестування повного флоу

1. Заповнити форму:
   - **Название проекта:** test-project
   - **Описание:** Create a landing page

2. Натиснути "Создать приложение"

3. Спостерігати прогрес (~13-14 секунд):
   - ✅ PM Analysis (100ms)
   - ✅ Research (100ms)
   - ✅ Development - Z.AI LLM генерує код (~6s)
   - ✅ Deployment - GitHub + Vercel (~7s)

4. Отримати результат:
   - GitHub repository URL
   - Vercel deployment URL

---

## 🔧 Архітектура

### Backend (Node.js 22 + Express)
- **Порт:** 3002
- **Головний файл:** `backend/src/server.js`
- **Routes:** `backend/src/routes/tasks.js`
- **Orchestrator:** Автоматичний флоу в `processTask()`

### Frontend (Static HTML)
- **Порт:** 30002
- **Файл:** `public/index.html`
- **API polling:** Перевіряє статус кожні 2 секунди

### Integration (TypeScript)
- **Папка:** `integration/src/`
- **GitHub API:** `github.ts` (Octokit)
- **Vercel API:** `vercel.ts` (REST API)
- **LLM:** Z.AI GLM-4.6 в `backend/src/llm/zai-client.js`

---

## 📊 Поточний стан проекту

### ✅ Що працює (перевірено)
- [x] Backend API на localhost:3002
- [x] UI на localhost:30002
- [x] Z.AI LLM генерація коду
- [x] Автоматичне створення GitHub репозиторію
- [x] Автоматичний Vercel deployment
- [x] Повний orchestrator flow (~13-14s)

### 🎯 Останній успішний тест
- **Task ID:** 5bb55f7a-2601-4626-b168-30bf2d3b36df
- **Час виконання:** 13.6 секунд
- **GitHub:** https://github.com/bohdanlazurenko/final-test-app
- **Vercel:** https://final-test-knmgq14eq-bohdans-projects-1e20badc.vercel.app
- **Дата:** 2025-10-19 02:14

### ⚠️ Відомі обмеження
- **Vercel Production timeout:** 10 секунд (Hobby plan)
- **Повний флоу:** ~13-14 секунд
- **Рекомендація:** Використовувати локально для повного функціоналу

---

## 🔄 Git Workflow

### Поточна гілка
```bash
git branch  # master
```

### Останній commit
```bash
git log -1 --oneline
# ee658ec Complete: Full orchestrator flow working
```

### Commit + Push
```bash
git add -A
git commit -m "Your message"
git push origin master
```

### Deploy на Vercel
```bash
npx vercel --prod --yes
```

---

## 🛑 Зупинка сервісів

```bash
# Зупинити все
pkill -f "node.*backend" && pkill -f "http.server"

# Або окремо
kill <PID>
```

---

## 📝 Корисні команди

### Перевірка здоров'я backend
```bash
curl http://localhost:3002/health | python3 -m json.tool
```

### Список tasks
```bash
curl http://localhost:3002/api/tasks | python3 -m json.tool
```

### Створити task через API
```bash
curl -X POST http://localhost:3002/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"tenant":"test","prompt":"Create a landing page"}'
```

### Перевірити task статус
```bash
curl http://localhost:3002/api/tasks/<TASK_ID> | python3 -m json.tool
```

---

## 📚 Документація

- **README.md** - Загальна інформація
- **LOCAL_SUCCESS.md** - Результати локального тестування
- **IMPLEMENTATION_SUMMARY.md** - Технічна архітектура

---

## 🎯 Наступні кроки (якщо потрібно)

1. [ ] Додати Vercel KV для state storage (щоб працювало на production)
2. [ ] Додати webhook для async processing на Vercel
3. [ ] Додати queue (Bull/BullMQ) для довгих tasks
4. [ ] UI improvements (progress bar, error handling)
5. [ ] Додати authentication
6. [ ] Додати tenant management UI

---

**Проект готовий до роботи! 🚀**
