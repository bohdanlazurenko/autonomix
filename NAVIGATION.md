# 🗺️ Навигация по проекту AutonomiX

## 🚀 Быстрый старт

**Если хотите сразу начать:**
```bash
cat QUICKSTART.md
```

**Для визуальной демонстрации:**
```bash
./demo-presentation.sh
```

---

## 📚 Документация (что и где читать)

### 1. Для первого знакомства (5-10 мин)
- **README.md** - обзор проекта, что это и зачем
- **DEMO_VISUALIZATION.md** - визуальная демонстрация с диаграммами

### 2. Для настройки и запуска (10-15 мин)
- **QUICKSTART.md** - пошаговый гайд для старта
- **docs/SETUP.md** - полная техническая документация

### 3. Для разработчиков (20-30 мин)
- **PROJECT_STRUCTURE.md** - полная структура проекта
- **IMPLEMENTATION_SUMMARY.md** - что реализовано, статистика
- **EXAMPLES.md** - 12 практических примеров использования

### 4. Для хакатона/демонстрации (15 мин)
- **docs/DEMO_CHECKLIST.md** - чеклист готовности к демо
- **DEVOPS_COMPLETE.md** - что готово, что осталось

---

## 🎯 Сценарии использования

### Сценарий 1: "Хочу понять что это"
```bash
# 1. Прочитать обзор
cat README.md

# 2. Посмотреть визуализацию
cat DEMO_VISUALIZATION.md

# 3. Запустить демо
./demo-presentation.sh
```

### Сценарий 2: "Хочу запустить локально"
```bash
# 1. Прочитать quickstart
cat QUICKSTART.md

# 2. Настроить .env
cp .env.example .env
nano .env

# 3. Установить зависимости
make install

# 4. Запустить
make dev
```

### Сценарий 3: "Готовлюсь к хакатону"
```bash
# 1. Проверить что готово
cat DEVOPS_COMPLETE.md

# 2. Прочитать чеклист
cat docs/DEMO_CHECKLIST.md

# 3. Проверить примеры
cat EXAMPLES.md

# 4. Тестовый прогон
make demo
```

### Сценарий 4: "Хочу понять архитектуру"
```bash
# 1. Структура проекта
cat PROJECT_STRUCTURE.md

# 2. Детали реализации
cat IMPLEMENTATION_SUMMARY.md

# 3. Полная документация
cat docs/SETUP.md

# 4. Посмотреть код
cat backend/src/server.js
cat integration/src/integration.ts
```

---

## 📁 Карта файлов

```
📄 README.md                     - Главная страница
📄 QUICKSTART.md                 - Быстрый старт (10-15 мин)
📄 NAVIGATION.md                 - Этот файл (навигация)
📄 DEMO_VISUALIZATION.md         - Визуальная демонстрация
📄 PROJECT_STRUCTURE.md          - Структура проекта
📄 IMPLEMENTATION_SUMMARY.md     - Что реализовано
📄 EXAMPLES.md                   - 12 примеров использования
📄 DEVOPS_COMPLETE.md            - DevOps чеклист

📂 docs/
   📄 SETUP.md                   - Полная тех. документация
   📄 DEMO_CHECKLIST.md          - Готовность к демо

🔧 Makefile                      - 22 команды автоматизации
🔧 .env.example                  - Шаблон переменных

📂 backend/                      - Express.js API
📂 ui/                           - Next.js Frontend
📂 integration/                  - TypeScript APIs
📂 scripts/                      - CLI Tools
📂 .github/workflows/            - CI/CD
```

---

## 🛠️ Полезные команды

### Просмотр документации
```bash
# Все документы
ls -lh *.md docs/*.md

# Быстрый просмотр
cat README.md | less

# Поиск по документации
grep -r "GitHub API" *.md docs/*.md
```

### Навигация по коду
```bash
# Backend endpoints
cat backend/src/routes/*.js

# Frontend pages
cat ui/pages/*.tsx

# Integration APIs
cat integration/src/*.ts

# CLI scripts
ls -lh scripts/
```

### Статистика
```bash
# Количество файлов
find . -type f | grep -v node_modules | wc -l

# Строки кода
find . -name "*.js" -o -name "*.ts" | grep -v node_modules | xargs wc -l

# Размер проекта
du -sh . --exclude=node_modules
```

---

## 🎓 Обучающий путь

### Уровень 1: Новичок (1 час)
1. README.md - понять концепцию
2. DEMO_VISUALIZATION.md - увидеть как работает
3. ./demo-presentation.sh - запустить демо
4. QUICKSTART.md - попробовать локально

### Уровень 2: Разработчик (2-3 часа)
1. PROJECT_STRUCTURE.md - изучить структуру
2. backend/src/ - понять backend
3. ui/pages/ - понять frontend
4. integration/src/ - понять интеграции
5. EXAMPLES.md - практические примеры

### Уровень 3: DevOps (4-6 часов)
1. docs/SETUP.md - полная документация
2. .github/workflows/ - изучить CI/CD
3. Makefile - автоматизация
4. scripts/ - CLI инструменты
5. Настройка production deployment

---

## 🎯 Для разных ролей

### Backend Developer
**Читать:**
- backend/src/server.js
- backend/src/routes/*.js
- integration/src/integration.ts

**Задачи:**
- Интегрировать LLM агентов
- Добавить validation
- Настроить database

### Frontend Developer
**Читать:**
- ui/pages/index.tsx
- ui/styles/globals.css
- EXAMPLES.md (UI примеры)

**Задачи:**
- Улучшить UX
- Добавить features
- Mobile optimization

### DevOps Engineer
**Читать:**
- .github/workflows/*.yml
- integration/src/*.ts
- docs/SETUP.md
- Makefile

**Задачи:**
- Production deployment
- Мониторинг
- Secrets management

---

## 📞 Быстрая помощь

### Ошибка: "npm install fails"
→ Проверить интернет, попробовать другое зеркало

### Ошибка: "GitHub API rate limit"
→ Использовать GH_PAT в .env

### Ошибка: "Vercel deployment timeout"
→ Проверить GitHub ↔ Vercel подключение

### Вопрос: "Где посмотреть примеры?"
→ cat EXAMPLES.md

### Вопрос: "Как запустить?"
→ cat QUICKSTART.md

### Вопрос: "Как работает деплой?"
→ cat DEMO_VISUALIZATION.md (диаграммы)

---

## 🎉 Успехов!

**Проект полностью готов к использованию!**

Начните с: `cat QUICKSTART.md` или `./demo-presentation.sh`
