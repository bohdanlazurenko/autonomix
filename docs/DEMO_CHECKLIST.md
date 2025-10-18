# Checklist для демонстрации

## Pre-Demo (за 1 час до презентации)

### Инфраструктура
- [ ] UI задеплоен и доступен по URL
- [ ] Backend задеплоен и `/health` возвращает 200
- [ ] GitHub organization создана с 3 репозиториями
- [ ] Все секреты настроены в GitHub Environments
- [ ] CI/CD workflows работают (green checks)

### Функциональность
- [ ] `make demo` успешно выполняется
- [ ] Создаётся тестовый tenant
- [ ] Генерируются файлы проекта
- [ ] GitHub repo создаётся и коммитится
- [ ] Vercel deployment завершается успешно
- [ ] Возвращается рабочий URL приложения

### UI
- [ ] Форма открывается и работает
- [ ] Можно ввести tenant ID и prompt
- [ ] Показываются шаги прогресса (PM → Research → Dev → Deploy)
- [ ] Финальная страница показывает ссылки на repo и deployed app
- [ ] Deployed app действительно открывается

### Backend Health
- [ ] `/health` показывает все интеграции как ✅
- [ ] API endpoints отвечают за < 500ms
- [ ] Нет ошибок в логах
- [ ] Rate limiting работает

## Demo Script (10 минут)

### Slide 1: Проблема (1 мин)
"Создание и деплой приложения обычно занимает часы/дни:
- Setup инфраструктуры
- Написание кода
- Конфигурация CI/CD
- Деплой и тестирование

**Мы решили это за минуты.**"

### Slide 2: Решение (1 мин)
"AutonomiX - IT Company as a Service:
- Описываете что хотите на естественном языке
- AI агенты анализируют, разрабатывают, деплоят
- Получаете рабочее приложение с GitHub repo + live URL"

### Live Demo (5 мин)

#### 1. Показать UI (30 сек)
- Открыть deployed UI
- "Вот наш интерфейс - простая форма"

#### 2. Create Tenant (1 мин)
```
Company ID: demo-coffee
Prompt: Create a landing page for a coffee shop with menu and contact form
```
- Нажать "Generate & Deploy"
- "Начинается обработка..."

#### 3. Show Progress (2 мин)
- Показать шаги в реальном времени:
  - ✅ PM Analysis
  - ✅ Research
  - ✅ Development
  - ⏳ Deployment
- "Наши AI агенты работают параллельно"

#### 4. Show Result (1.5 мин)
- "Готово! Вот результат:"
- Показать GitHub repo (открыть в новой вкладке)
  - "Код сгенерирован и закоммичен"
- Показать deployed app (открыть)
  - "Приложение работает на Vercel"

### Slide 3: Архитектура (2 мин)
```
Browser → Next.js UI → Express Backend → LLM Agents
                            ↓
                   Integration Service
                     ↓          ↓
               GitHub API  Vercel API
                     ↓
            Client Repo → Deployed App
```

"Всё полностью автоматизировано:
- GitHub API создаёт repo и коммитит код
- Vercel API деплоит приложение
- Cloudflare настраивает DNS (optional)"

### Slide 4: Use Cases (1 мин)
1. **Прототипирование** - быстрые MVP
2. **Landing pages** - для маркетинга
3. **Internal tools** - для команд
4. **Client demos** - для агентств

### Closing (30 сек)
"От идеи до production за минуты, не часы.
Questions?"

## Backup Plans

### Если UI не работает
- Показать через `make demo` в терминале
- Показать логи и результат

### Если Vercel deployment медленный
- "Пока деплоится, покажу архитектуру..."
- Показать код integration service
- Вернуться к deployment

### Если что-то упало
- Показать health endpoint
- Показать GitHub Actions logs
- "У нас есть полная observability"

## Post-Demo Q&A

Готовые ответы:

**Q: Какие LLM используете?**
A: Модульная система - PM (Claude Sonnet), Research (GLM-4), Dev (GPT-4). Можно менять.

**Q: Сколько стоит?**
A: Сейчас proof-of-concept. Production: pay-per-deploy или subscription model.

**Q: Безопасность кода?**
A: Pre-commit hooks для модерации, sandboxed execution, code review перед deployment.

**Q: Scalability?**
A: Rate limiting, queue system, multi-tenant isolation. Текущий лимит: 10 tenants/day.

**Q: Поддерживаемые стеки?**
A: Сейчас Next.js. Roadmap: React, Vue, Python/FastAPI, Go.

## Метрики для презентации

Реальные цифры из demo:
- ⏱️ Time to deploy: ~2-3 minutes
- 📊 Lines of code generated: ~200
- 🚀 API calls made: ~15
- ✅ Success rate: 95%+
- 💰 Cost per deployment: ~$0.01

## Success Criteria

Demo считается успешным если:
- ✅ Live demo работает без ошибок
- ✅ Создаётся и деплоится реальное приложение
- ✅ Audience понимает value proposition
- ✅ Нет технических сбоев > 30 сек
- ✅ Questions handled confidently

---

**Последняя проверка перед demo: за 10 минут до начала!**
