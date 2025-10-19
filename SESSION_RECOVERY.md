# 🔄 Session Recovery Checklist

Використовуйте цей чеклист коли відкриваєте проект після перерви.

## ✅ Перед початком роботи

### 1. Перевірте environment
```bash
cd ~/ai_workshop/autonomix
cat .env | grep -E "GH_PAT|VERCEL_TOKEN|ZAI_API_KEY"
```
- [ ] GH_PAT встановлено
- [ ] VERCEL_TOKEN встановлено
- [ ] ZAI_API_KEY встановлено

### 2. Оновіть код з GitHub
```bash
git pull origin master
```
- [ ] Код оновлено

### 3. Встановіть залежності (якщо щось оновилось)
```bash
npm install
cd backend && npm install
cd ../integration && npm install
```
- [ ] Залежності встановлено

### 4. Запустіть локальні сервіси

**Швидкий старт:**
```bash
./start-local.sh
```

**Або ручний запуск:**

Terminal 1 - Backend:
```bash
cd ~/ai_workshop/autonomix/backend
node src/server.js
```
- [ ] Backend запущено на :3002

Terminal 2 - UI:
```bash
cd ~/ai_workshop/autonomix/public
npx http-server -p 30002 --cors
```
- [ ] UI запущено на :30002

### 5. Перевірте що все працює
```bash
curl http://localhost:3002/health
```
- [ ] Backend відповідає
- [ ] Відкрито http://localhost:30002 в браузері

### 6. Швидкий smoke test

Створіть простий проект через UI:
- Назва: `test-recovery`
- Опис: `Simple test page`

Очікуваний результат (~13-14 секунд):
- [ ] PM Analysis completed
- [ ] Research completed
- [ ] Development completed (LLM generated)
- [ ] Deployment completed
- [ ] GitHub URL показано
- [ ] Vercel URL показано

---

## 🚨 Troubleshooting

### Backend не стартує
```bash
# Перевірте чи порт зайнятий
lsof -i :3002
# Якщо зайнятий, вбийте процес
kill <PID>
```

### UI не завантажується
```bash
# Перевірте чи порт зайнятий
lsof -i :30002
# Якщо зайнятий, вбийте процес
kill <PID>
```

### LLM не генерує код
Перевірте ZAI_API_KEY:
```bash
curl -s http://localhost:3002/health | python3 -m json.tool | grep zai
```

### Deployment не працює
Перевірте токени:
```bash
curl -s http://localhost:3002/health | python3 -m json.tool | grep -E "github|vercel"
```

---

## 📍 Останній робочий стан

**Дата:** 2025-10-19 02:30
**Commit:** ee658ec (Complete: Full orchestrator flow working)
**Branch:** master

**Протестовано:**
- ✅ Локальний повний флоу працює
- ✅ LLM генерація: ~6 секунд
- ✅ Deployment: ~7 секунд
- ✅ Загальний час: ~13-14 секунд

**Приклад успішного task:**
- ID: 5bb55f7a-2601-4626-b168-30bf2d3b36df
- GitHub: https://github.com/bohdanlazurenko/final-test-app
- Vercel: https://final-test-knmgq14eq-bohdans-projects-1e20badc.vercel.app

---

## 🎯 Готово до роботи!

Після виконання цього чекліста ви зможете:
1. Створювати нові проекти через UI
2. Генерувати код з Z.AI LLM
3. Автоматично деплоїти на GitHub + Vercel
4. Продовжувати розробку з того ж місця

**Happy coding! 🚀**
