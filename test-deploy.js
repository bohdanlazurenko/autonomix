// Тест реального деплоя
import { deployForTenant } from '@autonomix/integration';
import * as dotenv from 'dotenv';

dotenv.config();

const testDeploy = async () => {
  console.log('=== ТЕСТ РЕАЛЬНОГО ДЕПЛОЯ ===\n');
  
  const config = {
    tenant: 'test-' + Date.now(),
    files: [
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'autonomix-test',
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
      fontFamily: 'system-ui',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>
          🚀 AutonomiX Test
        </h1>
        <p style={{ fontSize: '1.5rem' }}>
          Создано автоматически! Время: ${new Date().toISOString()}
        </p>
      </div>
    </div>
  );
}`
      },
      {
        path: 'README.md',
        content: '# AutonomiX Test Deploy\n\nТестовый проект для проверки деплоя.'
      },
      {
        path: '.gitignore',
        content: 'node_modules\n.next\nout\n.env*.local'
      }
    ],
    ghOrg: process.env.GH_ORG || 'bohdanlazurenko',
    ghPat: process.env.GH_PAT,
    vercelToken: process.env.VERCEL_TOKEN,
    vercelOrgId: process.env.VERCEL_ORG_ID,
  };
  
  console.log('Конфигурация:');
  console.log(`  GitHub Org: ${config.ghOrg}`);
  console.log(`  GitHub Token: ${config.ghPat ? config.ghPat.substring(0, 10) + '...' : 'НЕ НАЙДЕН'}`);
  console.log(`  Vercel Token: ${config.vercelToken ? config.vercelToken.substring(0, 10) + '...' : 'НЕ НАЙДЕН'}`);
  console.log(`  Файлов: ${config.files.length}`);
  console.log('');
  
  if (!config.ghPat || !config.vercelToken) {
    console.error('❌ Токены не найдены!');
    process.exit(1);
  }
  
  try {
    console.log('🚀 Запускаем деплой...\n');
    const result = await deployForTenant(config);
    
    console.log('\n✅ ДЕПЛОЙ УСПЕШЕН!\n');
    console.log('Результат:');
    console.log(`  GitHub: ${result.githubUrl}`);
    console.log(`  Vercel: ${result.deploymentUrl}`);
    console.log(`  Статус: ${result.status}`);
    
  } catch (error) {
    console.error('\n❌ ОШИБКА ДЕПЛОЯ:\n');
    console.error(error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
};

testDeploy();
