# 💾 Швидкий старт завтра

## Що робити коли відкриваєш проект знову:

### 1. Відкрити VS Code
```bash
code ~/ai_workshop/autonomix
```

### 2. Запустити сервіси (виберіть один варіант):

**Варіант А: Автоматично**
```bash
./start-local.sh
```

**Варіант Б: Вручну**
```bash
# Terminal 1
cd backend && node src/server.js

# Terminal 2  
cd public && npx http-server -p 30002 --cors
```

### 3. Відкрити браузер
```
http://localhost:30002
```

### 4. Тестувати!

**Все! Готово працювати! 🚀**

---

## Якщо щось не працює:

1. Перевірте `.env` файл (GH_PAT, VERCEL_TOKEN, ZAI_API_KEY)
2. Зупиніть старі процеси: `pkill -f "node.*backend" && pkill -f "http.server"`
3. Запустіть знову

---

**Детальні інструкції:** `SESSION_RECOVERY.md`
