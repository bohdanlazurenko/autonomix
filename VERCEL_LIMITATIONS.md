# ⚠️ Vercel Hobby Plan Limitations

## Проблема з timeout

На **Vercel Hobby (Free) плані** є наступні обмеження:
- **Максимальний timeout:** 10 секунд для serverless functions
- **Memory:** До 1024 MB

Наш процес генерації + деплоймент займає **30-60 секунд**, що перевищує ліміт.

## Рішення

### Варіант 1: Локальний запуск (Рекомендовано для розробки)
```bash
# Backend
cd backend
npm run dev  # Порт 3002

# Frontend
cd ui-simple
python3 -m http.server 30002  # Або будь-який статичний сервер
```

Локальна версія **НЕ має обмежень** по timeout.

### Варіант 2: Upgrade до Vercel Pro
- **Timeout:** До 60 секунд
- **Memory:** До 3008 MB
- **Ціна:** $20/місяць

### Варіант 3: Розділити на етапи (Майбутнє)
1. Створити task → одразу повернути task ID
2. Клієнт poll-ить статус кожні 2 секунди
3. Кожен poll - це новий request (не перевищує 10 сек)

Але це потребує:
- Зберігання стану (Redis/Database)
- Або Vercel Cron Jobs
- Або Background Workers (не підтримується на Hobby)

---

## Поточний статус

✅ **Vercel деплоймент працює** для:
- Health checks
- API endpoints
- Static UI

❌ **НЕ працює** для:
- Повний процес генерації + деплоймент (перевищує 10 сек timeout)

---

## Рекомендація

Для **hackathon/demo** використовуй **локальну версію:**

```bash
# З кореня проекту
cd /home/bohdan/ai_workshop/autonomix

# Запустити backend
cd backend && npm run dev &

# Відкрити UI
xdg-open http://localhost:30002
```

Або перейти на **Vercel Pro** для production deployment.
