// Деплой ИИ-студии AutonomiX
import { deployForTenant } from '@autonomix/integration';
import * as dotenv from 'dotenv';

dotenv.config();

const deployAIStudio = async () => {
  console.log('🤖 ДЕПЛОЙ ИИ-СТУДИИ AUTONOMIX\n');
  
  const config = {
    tenant: 'autonomix-ai-studio',
    files: [
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'autonomix-ai-studio',
          version: '1.0.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start'
          },
          dependencies: {
            next: '14.0.4',
            react: '^18.2.0',
            'react-dom': '^18.2.0'
          }
        }, null, 2)
      },
      {
        path: 'pages/index.js',
        content: `export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '20px', fontWeight: '800', letterSpacing: '-2px' }}>
            🤖 AutonomiX
          </h1>
          <p style={{ fontSize: '1.8rem', marginBottom: '10px', fontWeight: '300' }}>
            IT Company as a Service
          </p>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 40px' }}>
            Автоматическое создание и развертывание веб-приложений с помощью ИИ
          </p>
          <button style={{
            background: 'white',
            color: '#667eea',
            padding: '18px 48px',
            fontSize: '1.2rem',
            border: 'none',
            borderRadius: '50px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s'
          }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
             onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Создать приложение →
          </button>
        </header>

        {/* Features */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px', fontWeight: '700' }}>
            Как это работает?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {[
              { icon: '📝', title: 'Опишите идею', desc: 'Расскажите что хотите создать - на русском или английском языке' },
              { icon: '🧠', title: 'ИИ анализирует', desc: 'PM, Research и Dev агенты создают архитектуру и генерируют код' },
              { icon: '🚀', title: 'Автодеплой', desc: 'Готовое приложение на GitHub + Vercel за минуты, не часы' },
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '40px 30px',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'transform 0.3s'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '600' }}>
                  {feature.title}
                </h3>
                <p style={{ opacity: 0.95, lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px', fontWeight: '700' }}>
            Технологии
          </h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
              {['Next.js', 'React', 'Node.js', 'GitHub API', 'Vercel', 'TypeScript', 'Express', 'Octokit'].map(tech => (
                <div key={tech} style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: 'white',
          color: '#333',
          padding: '60px 40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#667eea', fontWeight: '700' }}>
            Готовы создать своё приложение?
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#666', maxWidth: '600px', margin: '0 auto 30px' }}>
            Просто опишите идею и получите работающий прототип за минуты
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '16px 40px',
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Начать →
            </button>
            <button style={{
              background: 'transparent',
              color: '#667eea',
              padding: '16px 40px',
              fontSize: '1.1rem',
              border: '2px solid #667eea',
              borderRadius: '50px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              GitHub →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: '80px', opacity: 0.8 }}>
          <p style={{ marginBottom: '10px' }}>
            © ${new Date().getFullYear()} AutonomiX. Создано с помощью ИИ
          </p>
          <p>
            Хакатон проект - демонстрация возможностей автоматизации разработки
          </p>
        </footer>

      </div>
    </div>
  );
}`
      },
      {
        path: 'next.config.js',
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`
      },
      {
        path: '.gitignore',
        content: 'node_modules\n.next\nout\n.env*.local\n.DS_Store'
      },
      {
        path: 'README.md',
        content: `# 🤖 AutonomiX - ИИ Студия

**IT Company as a Service** - автоматическое создание и развертывание веб-приложений.

## 🌟 Возможности

- 📝 Описываете идею на естественном языке
- 🧠 ИИ-агенты (PM, Research, Dev) создают архитектуру
- 💻 Автоматическая генерация кода (Next.js, React)
- 🚀 Деплой на GitHub + Vercel за минуты

## 🛠 Технологии

- **Frontend**: Next.js 14, React 18
- **Backend**: Node.js, Express
- **ИИ**: GPT-4/Claude для генерации кода
- **Инфраструктура**: GitHub API, Vercel, Cloudflare

## 📦 Запуск

\`\`\`bash
npm install
npm run dev
\`\`\`

Откройте [http://localhost:3000](http://localhost:3000)

## 🎯 Создано

Этот сайт создан и задеплоен автоматически системой AutonomiX.

---

**Проект для хакатона** | Демонстрация автоматизации разработки с ИИ
`
      }
    ],
    ghOrg: process.env.GH_ORG || 'bohdanlazurenko',
    ghPat: process.env.GH_PAT,
    vercelToken: process.env.VERCEL_TOKEN,
    vercelOrgId: process.env.VERCEL_ORG_ID,
  };
  
  console.log('📦 Деплоим ИИ-студию...\n');
  
  try {
    const result = await deployForTenant(config);
    
    console.log('\n🎉 ИИ-СТУДИЯ ЗАДЕПЛОЕНА!\n');
    console.log('═══════════════════════════════════════');
    console.log(`📦 GitHub: ${result.repoUrl}`);
    console.log(`🌐 Vercel: ${result.deployUrl}`);
    console.log('═══════════════════════════════════════\n');
    console.log('✨ Откройте ссылку в браузере!');
    
  } catch (error) {
    console.error('\n❌ ОШИБКА:\n');
    console.error(error.message);
    process.exit(1);
  }
};

deployAIStudio();
