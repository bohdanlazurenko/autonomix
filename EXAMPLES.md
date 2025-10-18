# 📖 Примеры использования AutonomiX

## Пример 1: Создание простого лендинга

### Через UI

1. Открыть http://localhost:3000 (или deployed UI)
2. Заполнить форму:
   ```
   Company ID: coffee-shop-landing
   Prompt: Create a landing page for a coffee shop with:
   - Hero section with background image
   - Menu section with popular drinks
   - Contact form
   - Opening hours
   ```
3. Нажать "Generate & Deploy"
4. Дождаться завершения (2-3 минуты)
5. Получить:
   - GitHub repo: `https://github.com/autonomix/coffee-shop-landing-app`
   - Live URL: `https://coffee-shop-landing-app.vercel.app`

### Через API

```bash
# 1. Создать tenant
curl -X POST http://localhost:3002/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "id": "coffee-shop-landing",
    "name": "Coffee Shop Landing"
  }'

# 2. Создать задачу
curl -X POST http://localhost:3002/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "coffee-shop-landing",
    "prompt": "Create a landing page for a coffee shop"
  }'

# Ответ:
{
  "taskId": "abc-123-def",
  "status": "pending"
}

# 3. Проверить статус
curl http://localhost:3002/api/tasks/abc-123-def

# 4. После completion - задеплоить
curl -X POST http://localhost:3002/api/tenants/coffee-shop-landing/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "files": [...]
  }'
```

### Через CLI

```bash
# Полный автоматический цикл
node scripts/create-tenant.js "coffee-shop-landing"
node scripts/generate-app.js "coffee-shop-landing"
node scripts/deploy-vercel.js "coffee-shop-landing"

# Или одной командой через Makefile
TENANT_ID=coffee-shop-landing make demo
```

---

## Пример 2: Portfolio сайт для дизайнера

### Промпт
```
Create a portfolio website for a graphic designer with:
- Home page with hero section
- Gallery page with project thumbnails (grid layout)
- About page with bio and skills
- Contact page with form
- Dark mode support
- Responsive design
```

### Команда
```bash
# Через CLI
node scripts/create-tenant.js "designer-portfolio"

# Через UI - заполнить форму с промптом выше
```

### Результат
- ✅ Next.js приложение с 4 страницами
- ✅ Tailwind CSS для стилизации
- ✅ Dark mode toggle
- ✅ Responsive grid для галереи
- ✅ Форма контактов
- ✅ Задеплоено на Vercel

---

## Пример 3: SaaS лендинг с pricing

### Промпт
```
Create a SaaS landing page for a project management tool with:
- Hero section with CTA button
- Features section (3 columns)
- Pricing table (Starter, Pro, Enterprise)
- Testimonials section
- FAQ accordion
- Footer with links
```

### Команда
```bash
make demo TENANT_ID=saas-landing PROMPT="Create a SaaS landing page..."
```

### Результат
```
✅ Repository: https://github.com/autonomix/saas-landing-app
✅ Deployment: https://saas-landing-app.vercel.app
```

---

## Пример 4: Интеграция через JavaScript SDK (будущее)

```javascript
import { AutonomiX } from '@autonomix/sdk';

const client = new AutonomiX({
  apiKey: process.env.AUTONOMIX_API_KEY,
  baseUrl: 'https://api.autonomix.app',
});

// Создать и задеплоить приложение
async function deployApp() {
  const deployment = await client.deployments.create({
    tenant: 'my-client-app',
    prompt: 'Create a todo app with authentication',
    options: {
      framework: 'nextjs',
      styling: 'tailwind',
      database: 'postgres',
    },
  });

  console.log('Deployment URL:', deployment.url);
  console.log('Repository:', deployment.repoUrl);
}

deployApp();
```

---

## Пример 5: Batch deployment (несколько клиентов)

```bash
#!/bin/bash

# Deploy для нескольких клиентов одновременно
clients=("client-a" "client-b" "client-c")

for client in "${clients[@]}"; do
  echo "Deploying for $client..."
  
  node scripts/create-tenant.js "$client" &
  sleep 1
done

wait

echo "✅ All clients deployed!"
```

---

## Пример 6: Custom domain setup

```javascript
// После деплоя - настроить кастомный домен
const deployment = await client.tenants.get('my-app');

await client.domains.add({
  tenant: 'my-app',
  domain: 'app.mycompany.com',
  verifyOwnership: true,
});

// AutonomiX автоматически:
// 1. Создаст TXT запись для верификации
// 2. Проверит владение доменом
// 3. Настроит CNAME на Vercel
// 4. Выпустит SSL сертификат
```

---

## Пример 7: Мониторинг deployments

```bash
# Проверить health backend
curl http://localhost:3002/health

# Список всех deployments
curl http://localhost:3002/api/tenants

# Детали конкретного tenant
curl http://localhost:3002/api/tenants/my-app

# Ответ:
{
  "id": "my-app",
  "name": "My App",
  "status": "active",
  "lastDeployment": {
    "repoUrl": "https://github.com/autonomix/my-app",
    "deployUrl": "https://my-app.vercel.app",
    "deployedAt": "2024-01-15T10:30:00Z"
  },
  "quotas": {
    "maxDeploys": 5,
    "usedDeploys": 1
  }
}
```

---

## Пример 8: Local development с hot reload

```bash
# Terminal 1: Backend с watch mode
cd backend
npm run dev

# Terminal 2: UI с hot reload
cd ui
npm run dev

# Terminal 3: Тестирование
curl -X POST http://localhost:3002/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"tenant": "test", "prompt": "test app"}'
```

---

## Пример 9: CI/CD интеграция

### GitHub Actions workflow для клиентского проекта

```yaml
name: Deploy to AutonomiX

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to AutonomiX
        env:
          AUTONOMIX_API_KEY: ${{ secrets.AUTONOMIX_API_KEY }}
        run: |
          curl -X POST https://api.autonomix.app/api/tenants/${{ github.repository }}/deploy \
            -H "Authorization: Bearer $AUTONOMIX_API_KEY" \
            -H "Content-Type: application/json" \
            -d @deployment.json
```

---

## Пример 10: Error handling и retry

```javascript
const { deployForTenant, withRetry } = require('@autonomix/integration');

async function deployWithRetry() {
  try {
    const result = await withRetry(
      async () => {
        return await deployForTenant({
          tenant: 'my-app',
          files: [...],
          ghPat: process.env.GH_PAT,
          vercelToken: process.env.VERCEL_TOKEN,
        });
      },
      3, // max retries
      2000 // base delay ms
    );

    console.log('✅ Success:', result);
  } catch (error) {
    console.error('❌ All retries failed:', error.message);
    
    // Fallback: отправить в очередь для manual review
    await queue.add('manual-deploy', {
      tenant: 'my-app',
      error: error.message,
    });
  }
}
```

---

## Пример 11: Тестирование перед деплоем

```bash
# Сгенерировать приложение
node scripts/generate-app.js "test-app"

# Проверить сгенерированные файлы
cd tmp/test-app-files

# Установить зависимости и собрать
npm install
npm run build

# Если build успешен - деплоим
if [ $? -eq 0 ]; then
  node ../../scripts/deploy-vercel.js "test-app"
else
  echo "❌ Build failed, deployment cancelled"
fi
```

---

## Пример 12: Multi-environment setup

```bash
# Development
BACKEND_URL=http://localhost:3002 npm run dev

# Staging
BACKEND_URL=https://staging.autonomix.app npm run build
vercel --prod

# Production
BACKEND_URL=https://api.autonomix.app npm run build
vercel --prod --alias autonomix.app
```

---

## Шаблоны промптов

### Лендинг для ресторана
```
Create a restaurant landing page with:
- Hero with food photos
- Menu sections (Appetizers, Mains, Desserts)
- Reservation form with date/time picker
- Location map
- Opening hours
```

### E-commerce продукта
```
Create a product landing page with:
- Product hero with image gallery
- Features list with icons
- Pricing section
- Customer testimonials
- FAQ
- Buy now CTA
```

### Personal blog
```
Create a personal blog with:
- Home page with recent posts
- Blog post listing with pagination
- Individual post pages with markdown support
- About page
- Contact form
```

---

## Полезные ссылки

- [API Reference](docs/SETUP.md#api-reference)
- [Troubleshooting](QUICKSTART.md#troubleshooting)
- [Architecture](PROJECT_STRUCTURE.md#поток-данных)

---

**Больше примеров? Открывайте issue или создавайте PR!** 🚀
